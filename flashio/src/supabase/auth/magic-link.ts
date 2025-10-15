import { supabase } from "../client";

export async function loginWithEmail(emailAddress: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email: emailAddress,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
}
