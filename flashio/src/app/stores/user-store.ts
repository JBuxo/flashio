"use client";

import { supabaseClient } from "@/supabase/client";
import { create } from "zustand";
import type { User } from "@supabase/supabase-js";

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

  authListenerAttached?: boolean;
  cleanupAuthListener?: () => void;
  _channelUserId?: string;
};

type ChannelRef = {
  channel: ReturnType<typeof supabaseClient.channel> | null;
  retryCount: number;
  retryTimer?: number | NodeJS.Timeout | null;
  unsubscribed: boolean;
};

export const useUserStore = create<UserStore>((set, get) => {
  let fetchRequestId = 0;

  const userChannelRef: ChannelRef = {
    channel: null,
    retryCount: 0,
    retryTimer: null,
    unsubscribed: true,
  };

  const backoff = (attempt: number) => {
    const base = 1000;
    const max = 16000;
    const delay = Math.min(base * 2 ** attempt, max);
    console.log(`Backoff delay for attempt ${attempt}: ${delay}ms`);
    return delay;
  };

  const stopChannel = () => {
    console.log("Stopping realtime channel...");
    userChannelRef.unsubscribed = true;

    if (userChannelRef.retryTimer) {
      console.log("Clearing retry timer");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      clearTimeout(userChannelRef.retryTimer as any);
      userChannelRef.retryTimer = null;
    }

    if (userChannelRef.channel) {
      const ch = userChannelRef.channel;
      userChannelRef.channel = null;
      try {
        supabaseClient.removeChannel(ch).catch((e) => {
          console.warn("Error removing channel:", e);
        });
        console.log("Channel removed successfully");
      } catch (e) {
        console.warn("Error while removing channel:", e);
      }
    }

    userChannelRef.retryCount = 0;
    console.log("Channel stopped, retryCount reset");
  };

  const clearChannelSoft = () => {
    console.log("Soft clearing channel...");
    if (userChannelRef.retryTimer) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      clearTimeout(userChannelRef.retryTimer as any);
      userChannelRef.retryTimer = null;
      console.log("Cleared soft retry timer");
    }

    if (userChannelRef.channel) {
      const ch = userChannelRef.channel;
      userChannelRef.channel = null;
      try {
        supabaseClient.removeChannel(ch).catch((e) => {
          console.warn("Error removing channel during soft clear:", e);
        });
        console.log("Soft channel removed successfully");
      } catch (e) {
        console.warn("Error during soft clear of channel:", e);
      }
    }
  };

  const subscribeToUser = async (userId: string) => {
    console.log("subscribeToUser called with userId:", userId);

    if (!userId) {
      console.warn("Empty userId, aborting subscription");
      return;
    }

    const subUserId = get()._channelUserId;
    if (
      subUserId === userId &&
      userChannelRef.channel &&
      !userChannelRef.unsubscribed
    ) {
      console.log("Already subscribed to this user:", userId);
      return;
    }

    stopChannel();
    userChannelRef.unsubscribed = false;

    const trySubscribe = async () => {
      if (userChannelRef.unsubscribed) {
        console.log("Aborting subscription because unsubscribed flag is true");
        return;
      }

      let accessToken: string | undefined;
      try {
        const { data: sessionData } = await supabaseClient.auth.getSession();
        accessToken = sessionData.session?.access_token ?? undefined;
        console.log("Fetched access token:", accessToken);
      } catch (e) {
        console.warn("Failed to get session for subscription:", e);
      }

      if (!accessToken) {
        console.log("No access token found");
        if (userChannelRef.retryCount < 5) {
          const delay = backoff(userChannelRef.retryCount++);
          console.log(`Retrying subscription in ${delay}ms`);
          userChannelRef.retryTimer = setTimeout(trySubscribe, delay);
        } else {
          console.error("Max subscribe attempts reached (no token)");
        }
        return;
      }

      try {
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
              console.log("Realtime payload received:", payload);
              try {
                const newData = payload.new as {
                  xp?: number;
                  clever_shards?: number;
                };
                set((s) => ({
                  userXp:
                    typeof newData.xp === "number" ? newData.xp : s.userXp,
                  userCleverShards:
                    typeof newData.clever_shards === "number"
                      ? newData.clever_shards
                      : s.userCleverShards,
                }));
                console.log("Updated state from realtime payload:", get());
              } catch (err) {
                console.error("Error processing realtime payload:", err);
              }
            }
          )
          .subscribe((status) => {
            console.log("Channel status:", status);
            if (status === "SUBSCRIBED") {
              console.log("Realtime channel SUBSCRIBED for user", userId);
              userChannelRef.channel = channel;
              userChannelRef.retryCount = 0;
              set({ _channelUserId: userId });
            } else if (status === "CHANNEL_ERROR") {
              console.error("Realtime CHANNEL_ERROR for user", userId);
              if (userChannelRef.unsubscribed) return;
              clearChannelSoft();
              if (userChannelRef.retryCount < 3) {
                const delay = backoff(userChannelRef.retryCount++);
                console.log(
                  `Retrying channel subscription in ${delay}ms (attempt ${userChannelRef.retryCount})`
                );
                userChannelRef.retryTimer = setTimeout(trySubscribe, delay);
              } else {
                console.error("Max channel retry attempts reached.");
              }
            } else if (status === "CLOSED") {
              console.log("Realtime channel CLOSED for user", userId);
              if (!userChannelRef.unsubscribed) {
                clearChannelSoft();
                if (userChannelRef.retryCount < 3) {
                  const delay = backoff(userChannelRef.retryCount++);
                  console.log(
                    `Retrying channel after unexpected close in ${delay}ms`
                  );
                  userChannelRef.retryTimer = setTimeout(trySubscribe, delay);
                }
              }
            }
          });

        userChannelRef.channel = channel;
        console.log("Channel created successfully:", channel);
      } catch (err) {
        console.error("subscribeToUser unexpected error:", err);
        clearChannelSoft();
      }
    };

    await trySubscribe();
    return () => stopChannel();
  };

  const safeSetAuthUser = (nextUser: User | null) => {
    console.log("safeSetAuthUser called with:", nextUser);
    const prev = get().authUser;
    const same = (prev?.id ?? null) === (nextUser?.id ?? null);
    if (same) {
      console.log("User unchanged");
      if (!get().initialized) set({ initialized: true, loading: false });
      return false;
    }

    if (!nextUser) {
      console.log("Clearing user state (logged out)");
      set({
        authUser: null,
        userId: "",
        userXp: 0,
        userCleverShards: 0,
        loading: false,
        initialized: true,
      });
      return true;
    }

    set({ authUser: nextUser, userId: nextUser.id, initialized: true });
    console.log("User state updated:", get());
    return true;
  };

  const startRealtimeFor = async (uid: string) => {
    console.log("startRealtimeFor called with userId:", uid);
    if (
      get()._channelUserId === uid &&
      userChannelRef.channel &&
      !userChannelRef.unsubscribed
    ) {
      console.log("Already running realtime for this user");
      return;
    }
    await subscribeToUser(uid);
  };

  return {
    authUser: null,
    userId: "",
    userXp: 0,
    userCleverShards: 0,
    loading: false,
    initialized: false,

    initAuthListener: () => {
      console.log("initAuthListener called");
      if (get().authListenerAttached) {
        console.log(
          "Auth listener already attached, returning existing cleanup"
        );
        return get().cleanupAuthListener ?? (() => {});
      }
      set({ authListenerAttached: true });

      let cleanupCalled = false;
      let delayPromise: Promise<void> | null = null;

      (async () => {
        try {
          const { data } = await supabaseClient.auth.getUser();
          const currentUser = (data.user as User | null) ?? null;
          console.log("Initial user fetched:", currentUser);
          const changed = safeSetAuthUser(currentUser);

          if (currentUser) {
            get()
              .fetchUserData()
              .catch((e) => console.error("Initial fetchUserData error:", e));
            delayPromise = new Promise((resolve) => setTimeout(resolve, 1000));
            await delayPromise;
            if (!cleanupCalled) await startRealtimeFor(currentUser.id);
          } else {
            stopChannel();
            set({ _channelUserId: undefined });
          }
        } catch (err) {
          console.error("initAuthListener initial getUser failed:", err);
          set({ initialized: true, loading: false });
        }
      })();

      const { data: listener } = supabaseClient.auth.onAuthStateChange(
        async (_event, session) => {
          console.log("onAuthStateChange triggered:", _event, session?.user);
          try {
            if (delayPromise) {
              await delayPromise;
              delayPromise = null;
            }

            const currentUser = (session?.user as User | null) ?? null;
            const prevUser = get().authUser;
            const changed = safeSetAuthUser(currentUser);

            if (!currentUser) {
              console.log("Logged out detected");
              stopChannel();
              set({ _channelUserId: undefined });
              return;
            }

            if (changed || prevUser?.id !== currentUser.id) {
              get()
                .fetchUserData()
                .catch((e) =>
                  console.error("fetchUserData after auth change error:", e)
                );
              await new Promise<void>((r) => setTimeout(r, 1000));
              if (!cleanupCalled) await startRealtimeFor(currentUser.id);
            }
          } catch (e) {
            console.error("onAuthStateChange handler error:", e);
            set({ loading: false, initialized: true });
          }
        }
      );

      const cleanup = () => {
        console.log("cleanup function called");
        if (cleanupCalled) return;
        cleanupCalled = true;
        try {
          listener?.subscription?.unsubscribe();
        } catch (e) {
          console.warn("Error unsubscribing auth listener:", e);
        } finally {
          stopChannel();
          set({
            authListenerAttached: false,
            cleanupAuthListener: undefined,
            _channelUserId: undefined,
          });
        }
      };

      set({ cleanupAuthListener: cleanup });
      return cleanup;
    },

    fetchUserData: async () => {
      console.log("fetchUserData called");
      const requestId = ++fetchRequestId;
      const { userId } = get();
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
        console.log("fetchUserData response:", { data, error });

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
          console.log("User state updated from fetchUserData:", get());
        } else {
          console.warn("No user record returned for id:", userId);
        }
      } catch (err) {
        console.error("Unexpected fetchUserData error:", err);
      } finally {
        set({ loading: false });
      }
    },

    addXp: async (amount: number) => {
      console.log("addXp called with amount:", amount);
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
      else console.log("XP added successfully");
    },

    addCleverShards: async (amount: number) => {
      console.log("addCleverShards called with amount:", amount);
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
      else console.log("Clever shards added successfully");
    },
  };
});
