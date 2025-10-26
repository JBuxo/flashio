// stores/user-store.ts
import { supabase } from "@/supabase/client";
import { create } from "zustand";
import { User } from "@supabase/supabase-js";

export type UserStore = {
  authUser: User | null;
  userId: string;
  userXp: number;
  userCleverShards: number;
  loading: boolean;

  initAuthListener: () => () => void; //this looked weird but the authlisteren returns a cleanup so
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
    //check auth
    supabase.auth.getUser().then(({ data }) => {
      const currentUser = data.user;
      if (currentUser) {
        set({ authUser: currentUser, userId: currentUser.id });
        get().fetchUserData();
      }
    });

    // listen to auth change
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        set({ authUser: currentUser, userId: currentUser?.id ?? "" });
        if (currentUser) await get().fetchUserData();
      }
    );

    return () => listener.subscription.unsubscribe();
  },

  fetchUserData: async () => {
    const { userId } = get();
    if (!userId) return;

    set({ loading: true });

    const { data, error } = await supabase
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
    await supabase.rpc("add_xp", { amt: amount });
    get().fetchUserData();
  },

  addCleverShards: async (amount: number) => {
    await supabase.rpc("add_clever_shards", { amt: amount });
    get().fetchUserData();
  },
}));
