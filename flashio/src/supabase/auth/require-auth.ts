import { supabaseClient } from "@/supabase/client";
import { User } from "@supabase/supabase-js";

export async function requireAuth(): Promise<User> {
  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser();

  if (error || !user) {
    throw new Error("User not authenticated");
  }

  return user;
}
