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

  initAuthListener: () => () => void;
  fetchUserData: () => Promise<void>;
  addXp: (amount: number) => Promise<void>;
  addCleverShards: (amount: number) => Promise<void>;
};

export const useUserStore = create<UserStore>((set, get) => ({
  authUser: null,
  userId: "",
  userXp: 0,
  userCleverShards: 0,
  loading: false,

  initAuthListener: () => {
    let userChannel: ReturnType<typeof supabaseClient.channel> | null = null;
    let retryCount = 0;

    const subscribeToUser = async (userId: string) => {
      if (!userId) return console.warn("subscribeToUser called with no userId");
      if (userChannel) return console.log("Already subscribed, skipping");

      // Ensure we have a valid session / JWT
      const { data: sessionData } = await supabaseClient.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        console.warn("No JWT token, cannot subscribe yet");
        return;
      }

      userChannel = supabaseClient
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
            const newData = payload.new as {
              xp: number;
              clever_shards: number;
            };
            set({
              userXp: newData.xp,
              userCleverShards: newData.clever_shards,
            });
          }
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            console.log("Subscribed ");
            retryCount = 0; // reset retry count
          } else if (status === "CHANNEL_ERROR") {
            console.error("subscribe error");
            userChannel = null;
            // Retry once after 2s
            if (retryCount < 1) {
              retryCount++;
              console.log("retrying in 2s...");
              setTimeout(() => subscribeToUser(userId), 2000);
            }
          } else if (status === "CLOSED") {
            console.log("channel closed");
            userChannel = null;
          }
        });
    };

    // Initial auth check
    supabaseClient.auth.getUser().then(async ({ data }) => {
      const currentUser = data.user;

      if (currentUser) {
        set({ authUser: currentUser, userId: currentUser.id });
        await get().fetchUserData();
        await subscribeToUser(currentUser.id);
      }
    });

    // Listen for login/logout
    const { data: listener } = supabaseClient.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;

        set({ authUser: currentUser, userId: currentUser?.id ?? "" });

        // Unsubscribe old channel
        if (userChannel) {
          userChannel.unsubscribe();
          userChannel = null;
        }

        if (currentUser) {
          await get().fetchUserData();
          await subscribeToUser(currentUser.id);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
      userChannel?.unsubscribe();
    };
  },

  fetchUserData: async () => {
    const { userId } = get();

    set({ loading: true }); // start loading

    if (!userId) {
      set({ loading: false });
      return;
    }

    const { data, error } = await supabaseClient
      .from("users")
      .select("id, xp, clever_shards")
      .eq("id", userId)
      .single();

    if (error) console.error("Error fetching user data:", error);
    else if (data)
      set({
        userId: data.id,
        userXp: data.xp,
        userCleverShards: data.clever_shards,
      });

    set({ loading: false });
  },

  addXp: async (amount: number) => {
    const { userId } = get();
    if (!userId) return;

    const { error } = await supabaseClient.rpc("add_xp", {
      uid: userId,
      amt: amount,
    });

    if (error) console.error("Error adding XP:", error);
  },

  addCleverShards: async (amount: number) => {
    const { userId } = get();
    if (!userId) return;

    const { error } = await supabaseClient.rpc("add_clever_shards", {
      uid: userId,
      amt: amount,
    });

    if (error) console.error("Error adding XP:", error);
  },
}));
