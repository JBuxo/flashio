"use client";

import { supabaseClient } from "@/supabase/client";
import { create } from "zustand";
import type { User } from "@supabase/supabase-js";

export type UserStore = {
  // public state
  authUser: User | null;
  userId: string;
  userXp: number;
  userCleverShards: number;
  loading: boolean;
  initialized: boolean;

  // public actions
  initAuthListener: () => () => void;
  fetchUserData: () => Promise<void>;
  addXp: (amount: number) => Promise<void>;
  addCleverShards: (amount: number) => Promise<void>;

  // internal guard/cleanup (not used by UI directly)
  authListenerAttached?: boolean;
  cleanupAuthListener?: () => void;
  _channelUserId?: string; // which user the realtime channel is for
};

// ---- Internal channel ref & helpers ----

type ChannelRef = {
  channel: ReturnType<typeof supabaseClient.channel> | null;
  retryCount: number;
  retryTimer?: number | NodeJS.Timeout | null;
  unsubscribed: boolean; // true when we intentionally stopped
};

export const useUserStore = create<UserStore>((set, get) => {
  let fetchRequestId = 0; // anti-stale fetches

  const userChannelRef: ChannelRef = {
    channel: null,
    retryCount: 0,
    retryTimer: null,
    unsubscribed: true,
  };

  const backoff = (attempt: number) => {
    const base = 1000; // 1s
    const max = 16000; // 16s cap
    return Math.min(base * 2 ** attempt, max);
  };

  // Hard stop: used when switching users or cleanup
  const stopChannel = () => {
    // mark as intentionally stopped first
    userChannelRef.unsubscribed = true;

    if (userChannelRef.retryTimer) {
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
      } catch (e) {
        console.warn("Error while removing channel:", e);
      }
    }

    userChannelRef.retryCount = 0;
  };

  // Soft clear without changing unsubscribed flag (avoid races)
  const clearChannelSoft = () => {
    if (userChannelRef.retryTimer) {
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
      } catch (e) {
        console.warn("Error while soft-clearing channel:", e);
      }
    }
  };

  const subscribeToUser = async (userId: string) => {
    if (!userId) {
      console.warn("subscribeToUser called with empty userId");
      return;
    }

    // If already subscribed for this user and channel is active, do nothing.
    const subUserId = get()._channelUserId;
    if (
      subUserId === userId &&
      userChannelRef.channel &&
      !userChannelRef.unsubscribed
    ) {
      console.log("Already subscribed for user", userId);
      return;
    }

    // Switch: stop whatever we had
    stopChannel();
    // From here, we intend to subscribe again
    userChannelRef.unsubscribed = false;

    const trySubscribe = async () => {
      if (userChannelRef.unsubscribed) return; // a stop happened during backoff

      // Refresh token presence
      let accessToken: string | undefined;
      try {
        const { data: sessionData } = await supabaseClient.auth.getSession();
        accessToken = sessionData.session?.access_token ?? undefined;
      } catch (e) {
        console.warn("Failed to get session for subscription:", e);
      }

      if (!accessToken) {
        if (userChannelRef.retryCount < 5) {
          const delay = backoff(userChannelRef.retryCount++);
          console.log(`Retrying subscribe (no token) in ${delay}ms`);
          userChannelRef.retryTimer = setTimeout(trySubscribe, delay);
        } else {
          console.error("Max subscribe attempts reached (no token)");
        }
        return;
      }

      // Create channel (do NOT call stop/clear here to avoid flip-flopping flags)
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
              set({ _channelUserId: userId });
            } else if (status === "CHANNEL_ERROR") {
              console.error("Realtime CHANNEL_ERROR for user", userId);
              if (userChannelRef.unsubscribed) return; // ignore after stop
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
                // unexpected close -> retry
                clearChannelSoft();
                if (userChannelRef.retryCount < 3) {
                  const delay = backoff(userChannelRef.retryCount++);
                  userChannelRef.retryTimer = setTimeout(trySubscribe, delay);
                }
              }
            } else {
              console.debug("Realtime channel status:", status);
            }
          });

        // Keep reference for immediate guards
        userChannelRef.channel = channel;
      } catch (err) {
        console.error("subscribeToUser unexpected error:", err);
        clearChannelSoft();
      }
    };

    await trySubscribe();
    return () => stopChannel();
  };

  // Idempotent auth state setter
  const safeSetAuthUser = (nextUser: User | null) => {
    const prev = get().authUser;
    const same = (prev?.id ?? null) === (nextUser?.id ?? null);
    if (same) {
      if (!get().initialized) set({ initialized: true, loading: false });
      return false; // no change
    }

    if (!nextUser) {
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
    return true;
  };

  const startRealtimeFor = async (uid: string) => {
    // If already for uid, do nothing
    if (
      get()._channelUserId === uid &&
      userChannelRef.channel &&
      !userChannelRef.unsubscribed
    ) {
      return;
    }
    await subscribeToUser(uid);
  };

  return {
    // ----- PUBLIC STATE -----
    authUser: null,
    userId: "",
    userXp: 0,
    userCleverShards: 0,
    loading: false,
    initialized: false,

    // ----- ACTIONS -----
    initAuthListener: () => {
      // guard against multiple attachments
      if (get().authListenerAttached) {
        return get().cleanupAuthListener ?? (() => {});
      }
      set({ authListenerAttached: true });

      let cleanupCalled = false;
      let delayPromise: Promise<void> | null = null;

      // 1) Pick up existing session once
      (async () => {
        try {
          const { data } = await supabaseClient.auth.getUser();
          const currentUser = (data.user as User | null) ?? null;
          const changed = safeSetAuthUser(currentUser);

          if (currentUser) {
            // async fetch (ignore failures)
            get()
              .fetchUserData()
              .catch((e) => {
                console.error("Initial fetchUserData error:", e);
                set({ loading: false });
              });

            // debounce realtime to let auth settle
            delayPromise = new Promise<void>((resolve) =>
              setTimeout(resolve, 1000)
            );
            await delayPromise;
            if (!cleanupCalled) await startRealtimeFor(currentUser.id);
          } else {
            // ensure nothing lingering
            stopChannel();
            set({ _channelUserId: undefined });
          }
        } catch (err) {
          console.error("initAuthListener initial getUser failed:", err);
          set({ initialized: true, loading: false });
        }
      })();

      // 2) Auth change listener (react only to actual user-id changes)
      const { data: listener } = supabaseClient.auth.onAuthStateChange(
        async (_event, session) => {
          try {
            if (delayPromise) {
              await delayPromise; // avoid racing with initial branch
              delayPromise = null;
            }

            const currentUser = (session?.user as User | null) ?? null;
            const prevUser = get().authUser;
            const changed = safeSetAuthUser(currentUser);

            if (!currentUser) {
              // logged out
              stopChannel();
              set({ _channelUserId: undefined });
              return;
            }

            // Only do work on change of identity
            if (changed || prevUser?.id !== currentUser.id) {
              get()
                .fetchUserData()
                .catch((e) => {
                  console.error("fetchUserData after auth change error:", e);
                  set({ loading: false });
                });

              // debounce again on transitions
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
      const requestId = ++fetchRequestId;
      const { userId, loading } = get();
      if (loading) {
        // allow overlapping callers but don't gate on this flag
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
