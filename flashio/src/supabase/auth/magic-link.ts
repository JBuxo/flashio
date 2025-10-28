import { supabaseClient } from "../client";

export async function loginWithEmail(emailAddress: string) {
  const { error } = await supabaseClient.auth.signInWithOtp({
    email: emailAddress,
  });

  if (error) {
    throw new Error(error.message);
  }
}
