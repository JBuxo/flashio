import { supabase } from "../client";

export async function loginWithEmail(emailAddress: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email: emailAddress,
  });

  if (error) {
    throw new Error(error.message);
  }
}
