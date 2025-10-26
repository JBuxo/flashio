import { supabase } from "../client";

export async function addXpToUser(amount: number) {
  const { error } = await supabase.rpc("add_xp", { amt: amount });

  if (error) throw new Error(error.message, {});
}

export async function addCleverShardsToUser(amount: number) {
  const { error } = await supabase.rpc("add_clever_shards", { amt: amount });

  if (error) throw new Error(error.message, {});
}
