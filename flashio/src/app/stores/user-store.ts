"use client";

import { supabaseClient } from "@/supabase/client";
import { create } from "zustand";
import { User } from "@supabase/supabase-js";

export type UserStore = {
  authUser: User | null;
  userId: string;
  userXp: number;
  userCleverShards: number;
  loading: boolean;
  initialized: boolean;

  initAuthListener: () => () => void;
  fetchUserData: () => Promise<void>;
  addXp: (amount: number) => Promise<void>;
  addCleverShards: (amount: number) => Promise<void>;
};

type ChannelRef = {
  channel: ReturnType<typeof supabaseClient.channel> | null;
  retryCount: number;
  retryTimer?: number | NodeJS.Timeout | null;
  unsubscribed: boolean;
};

export const useUserStore = create<UserStore>((set, get) => {
  // avoid race condition on fetches
  let fetchRequestId = 0;

  // no more than one channel at a time
  const userChannelRef: ChannelRef = {
    channel: null,
    retryCount: 0,
    retryTimer: null,
    unsubscribed: false,
  };

  const clearChannel = () => {
    if (userChannelRef.unsubscribed) return; // guard
    userChannelRef.unsubscribed = true;

    try {
      if (userChannelRef.channel) {
        try {
          userChannelRef.channel.unsubscribe();
        } catch (e) {
          console.warn("Error while unsubscribing channel:", e);
        }
      }
    } finally {
      if (userChannelRef.retryTimer) {
        clearTimeout(userChannelRef.retryTimer);
      }
      userChannelRef.channel = null;
      userChannelRef.retryCount = 0;
      userChannelRef.retryTimer = null;
    }
  };

  const subscribeToUser = async (userId: string) => {
    if (!userId) {
      console.warn("subscribeToUser called with empty userId");
      return;
    }

    // skip if already in channel
    if (userChannelRef.channel && !userChannelRef.unsubscribed) {
      console.log("Already have active channel; skipping subscribe");
      return;
    }

    userChannelRef.unsubscribed = false;

    // avoid flooding logs for repeat failures
    const backoff = (attempt: number) => {
      const base = 1000; // 1s
      const max = 16000; // cap to 16s
      return Math.min(base * 2 ** attempt, max);
    };

    const trySubscribe = async () => {
      if (userChannelRef.unsubscribed) return; // bail if unsubscribed during backoff

      // check session
      let accessToken: string | undefined;
      try {
        const { data: sessionData } = await supabaseClient.auth.getSession();
        accessToken = sessionData.session?.access_token ?? undefined;
      } catch (e) {
        console.warn("Failed to get session for subscription:", e);
      }

      if (!accessToken) {
        console.warn("No access token; will not subscribe now");
        // retry, but limit retries
        if (userChannelRef.retryCount < 5) {
          const delay = backoff(userChannelRef.retryCount);
          userChannelRef.retryCount++;
          userChannelRef.retryTimer = setTimeout(trySubscribe, delay);
        } else {
          console.error("Max subscribe attempts reached (no token).");
        }
        return;
      }

      // create channel
      try {
        // clean previous channels
        clearChannel();

        const channel = supabaseClient
          .channel(`user-changes-${userId}`)
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "users",
              filter: `id=eq.${userId}`,
            },
            (payload) => {
              try {
                const newData = payload.new as {
                  xp?: number;
                  clever_shards?: number;
                };
                // update present fields
                set((s) => ({
                  userXp:
                    typeof newData.xp === "number" ? newData.xp : s.userXp,
                  userCleverShards:
                    typeof newData.clever_shards === "number"
                      ? newData.clever_shards
                      : s.userCleverShards,
                }));
              } catch (err) {
                console.error("Error processing realtime payload:", err);
              }
            }
          )
          .subscribe((status) => {
            if (status === "SUBSCRIBED") {
              console.log("Realtime channel SUBSCRIBED for user", userId);
              userChannelRef.channel = channel;
              userChannelRef.retryCount = 0;
            } else if (status === "CHANNEL_ERROR") {
              console.error("Realtime CHANNEL_ERROR for user", userId);
              // cleanup and retry
              clearChannel();
              if (userChannelRef.retryCount < 5) {
                const delay = backoff(userChannelRef.retryCount);
                userChannelRef.retryCount++;
                userChannelRef.retryTimer = setTimeout(trySubscribe, delay);
              } else {
                console.error("Max channel retry attempts reached.");
              }
            } else if (status === "CLOSED") {
              console.log("Realtime channel CLOSED for user", userId);
              // clear ref
              clearChannel();
            } else {
              // other statuses
              console.debug("Realtime channel status:", status);
            }
          });

        // keep a reference for immediate returns
        userChannelRef.channel = channel;
      } catch (err) {
        console.error("subscribeToUser unexpected error:", err);
        clearChannel();
      }
    };

    // start first try immediately
    await trySubscribe();

    // return stable unsubscribe function
    return () => clearChannel();
  };

  return {
    authUser: null,
    userId: "",
    userXp: 0,
    userCleverShards: 0,
    loading: false,
    initialized: false,

    initAuthListener: () => {
      let cleanupCalled = false;
      // try picking up existing sess
      (async () => {
        try {
          const { data } = await supabaseClient.auth.getUser();
          const currentUser = data.user ?? null;
          if (currentUser) {
            set({
              authUser: currentUser,
              userId: currentUser.id,
              initialized: true,
            });
            // fetch user data
            get()
              .fetchUserData()
              .catch((e) => {
                console.error("Initial fetchUserData error:", e);
                // ensure loading flag cleaned just in case
                set({ loading: false });
              });
            // start realtime subscribe
            subscribeToUser(currentUser.id).catch((e) => {
              console.warn("Initial subscribe error:", e);
            });
          } else {
            // avoid stucking in loading
            set({
              authUser: null,
              userId: "",
              loading: false,
              initialized: true,
            });
          }
        } catch (err) {
          console.error("initAuthListener initial getUser failed:", err);
          // avoid sticking
          set({ initialized: true });
        }
      })();

      // register auth state listener
      const { data: listener } = supabaseClient.auth.onAuthStateChange(
        async (_event, session) => {
          try {
            const currentUser = session?.user ?? null;
            // Unsubscribe existing channel
            clearChannel();

            if (!currentUser) {
              // logged out
              set({
                authUser: null,
                userId: "",
                userXp: 0,
                userCleverShards: 0,
                loading: false,
                initialized: true,
              });
              return;
            }

            // logged in
            set({
              authUser: currentUser,
              userId: currentUser.id,
              initialized: true,
            });
            // fetch fresh data
            get()
              .fetchUserData()
              .catch((e) => {
                console.error("fetchUserData after auth change error:", e);
                set({ loading: false });
              });
            // subscribe to realtime updates
            subscribeToUser(currentUser.id).catch((e) => {
              console.warn("subscribeToUser after auth change error:", e);
            });
          } catch (e) {
            console.error("onAuthStateChange handler error:", e);
            // avoid sticking
            set({ loading: false, initialized: true });
          }
        }
      );

      const cleanup = () => {
        if (cleanupCalled) return;
        cleanupCalled = true;

        try {
          if (listener?.subscription) {
            try {
              listener.subscription.unsubscribe();
            } catch (e) {
              console.warn("Error unsubscribing auth listener:", e);
            }
          }
        } catch (e) {
          console.warn("Error during auth listener cleanup:", e);
        } finally {
          clearChannel();
        }
      };

      return cleanup;
    },

    fetchUserData: async () => {
      const requestId = ++fetchRequestId;
      // stop if already loading
      const { userId, loading } = get();
      if (loading) {
        // allow concurrent callers
        return;
      }

      set({ loading: true });
      try {
        if (!userId) {
          console.warn("fetchUserData called without userId");
          return;
        }

        const { data, error } = await supabaseClient
          .from("users")
          .select("id, xp, clever_shards")
          .eq("id", userId)
          .maybeSingle();

        // ignore stale responses
        if (requestId !== fetchRequestId) {
          console.warn("Stale fetchUserData response ignored");
          return;
        }

        if (error) {
          console.error("fetchUserData error:", error);
          return;
        }

        if (data) {
          set({
            userId: data.id,
            userXp: data.xp ?? 0,
            userCleverShards: data.clever_shards ?? 0,
          });
        } else {
          console.warn("No user record returned for id:", userId);
        }
      } catch (err) {
        console.error("Unexpected fetchUserData error:", err);
      } finally {
        // ALWAYS clear loading regardless of anything
        set({ loading: false });
      }
    },

    addXp: async (amount: number) => {
      const { userId } = get();
      if (!userId) {
        console.warn("addXp called without userId");
        return;
      }

      const { error } = await supabaseClient.rpc("add_xp", {
        uid: userId,
        amt: amount,
      });

      if (error) console.error("Error adding XP:", error);
    },

    addCleverShards: async (amount: number) => {
      const { userId } = get();
      if (!userId) {
        console.warn("addCleverShards called without userId");
        return;
      }

      const { error } = await supabaseClient.rpc("add_clever_shards", {
        uid: userId,
        amt: amount,
      });

      if (error) console.error("Error adding clever shards:", error);
    },
  };
});
