"use client";

import { create } from "zustand";
import { supabaseClient } from "@/supabase/client";
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

  const backoff = (attempt: number) => Math.min(1000 * 2 ** attempt, 16000);

  const stopChannel = () => {
    console.log("Stopping realtime channel");
    userChannelRef.unsubscribed = true;
    if (userChannelRef.retryTimer)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      clearTimeout(userChannelRef.retryTimer as any);
    if (userChannelRef.channel)
      supabaseClient.removeChannel(userChannelRef.channel).catch(console.warn);
    userChannelRef.channel = null;
    userChannelRef.retryCount = 0;
  };

  const subscribeToUser = async (userId: string) => {
    if (!userId) return;
    // Already subscribed guard
    if (
      get()._channelUserId === userId &&
      userChannelRef.channel &&
      !userChannelRef.unsubscribed
    ) {
      console.log("Already subscribed to this user", userId);
      return;
    }

    stopChannel();
    userChannelRef.unsubscribed = false;

    const trySubscribe = async () => {
      if (userChannelRef.unsubscribed) return;

      let accessToken: string | undefined;
      try {
        const { data } = await supabaseClient.auth.getSession();
        accessToken = data.session?.access_token ?? undefined;
      } catch (e) {
        console.warn("Failed to get session for subscription:", e);
      }

      if (!accessToken) {
        if (userChannelRef.retryCount < 5) {
          const delay = backoff(userChannelRef.retryCount++);
          console.log(`Retrying subscription in ${delay}ms`);
          userChannelRef.retryTimer = setTimeout(trySubscribe, delay);
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
              console.log("Realtime payload:", payload);
              const newData = payload.new as {
                xp?: number;
                clever_shards?: number;
              };
              set((s) => ({
                userXp: newData.xp ?? s.userXp,
                userCleverShards: newData.clever_shards ?? s.userCleverShards,
              }));
            }
          )
          .subscribe((status) => {
            console.log("Channel status:", status);
            if (status === "SUBSCRIBED") {
              userChannelRef.channel = channel;
              set({ _channelUserId: userId });
            } else if (status === "CHANNEL_ERROR" || status === "CLOSED") {
              if (!userChannelRef.unsubscribed) {
                const delay = backoff(userChannelRef.retryCount++);
                console.log(`Retrying channel after ${status} in ${delay}ms`);
                userChannelRef.retryTimer = setTimeout(trySubscribe, delay);
              }
            }
          });
      } catch (err) {
        console.error("subscribeToUser error:", err);
      }
    };

    await trySubscribe();
    return () => stopChannel();
  };

  const safeSetAuthUser = (nextUser: User | null) => {
    const prev = get().authUser;
    if ((prev?.id ?? null) === (nextUser?.id ?? null)) {
      console.log("User unchanged, skipping state update");
      if (!get().initialized) set({ initialized: true, loading: false });
      return false;
    }

    if (!nextUser) {
      console.log("Clearing authUser (logout)");
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

    console.log("Updating authUser:", nextUser);
    set({ authUser: nextUser, userId: nextUser.id, initialized: true });
    return true;
  };

  const startRealtimeFor = async (uid: string) => {
    if (
      get()._channelUserId === uid &&
      userChannelRef.channel &&
      !userChannelRef.unsubscribed
    )
      return;
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
      if (get().authListenerAttached)
        return get().cleanupAuthListener ?? (() => {});

      set({ authListenerAttached: true });
      let cleanupCalled = false;

      (async () => {
        try {
          const { data } = await supabaseClient.auth.getUser();
          const currentUser = data.user ?? null;
          safeSetAuthUser(currentUser);

          if (currentUser) {
            await get().fetchUserData();
            await startRealtimeFor(currentUser.id);
          } else {
            stopChannel();
          }
        } catch (err) {
          console.error("initAuthListener getUser failed:", err);
          set({ initialized: true, loading: false });
        }
      })();

      const { data: listener } = supabaseClient.auth.onAuthStateChange(
        async (_event, session) => {
          const currentUser = session?.user ?? null;
          const prevUser = get().authUser;

          if (prevUser?.id === currentUser?.id) {
            console.log("Ignoring TOKEN_REFRESHED, user unchanged");
            return;
          }

          safeSetAuthUser(currentUser);

          if (currentUser) {
            await get().fetchUserData();
            await startRealtimeFor(currentUser.id);
          } else {
            stopChannel();
          }
        }
      );

      const cleanup = () => {
        if (cleanupCalled) return;
        cleanupCalled = true;
        listener?.subscription?.unsubscribe();
        stopChannel();
        set({
          authListenerAttached: false,
          cleanupAuthListener: undefined,
          _channelUserId: undefined,
        });
      };

      set({ cleanupAuthListener: cleanup });
      return cleanup;
    },

    fetchUserData: async () => {
      const requestId = ++fetchRequestId;
      set({ loading: true });
      const { userId } = get();
      if (!userId) return;

      try {
        const { data, error } = await supabaseClient
          .from("users")
          .select("id, xp, clever_shards")
          .eq("id", userId)
          .maybeSingle();

        if (requestId !== fetchRequestId) return;

        if (error) console.error("fetchUserData error:", error);
        else if (data)
          set({
            userId: data.id,
            userXp: data.xp ?? 0,
            userCleverShards: data.clever_shards ?? 0,
          });
      } catch (err) {
        console.error("Unexpected fetchUserData error:", err);
      } finally {
        set({ loading: false });
      }
    },

    addXp: async (amount) => {
      const { userId } = get();
      if (!userId) return;
      const { error } = await supabaseClient.rpc("add_xp", {
        uid: userId,
        amt: amount,
      });
      if (error) console.error("addXp error:", error);
    },

    addCleverShards: async (amount) => {
      const { userId } = get();
      if (!userId) return;
      const { error } = await supabaseClient.rpc("add_clever_shards", {
        uid: userId,
        amt: amount,
      });
      if (error) console.error("addCleverShards error:", error);
    },
  };
});
