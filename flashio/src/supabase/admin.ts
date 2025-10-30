// lib/supabase/admin.ts
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only
);

export async function deleteCurrentUser(userId: string) {
  // Delete the user row from db (cascades to sessions + flashcards)
  const { error: dbError } = await supabaseAdmin
    .from("users")
    .delete()
    .eq("id", userId);

  if (dbError)
    throw new Error(`Failed to delete user data: ${dbError.message}`);

  // Delete the user from Supabase Auth
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
    userId
  );
  if (authError)
    throw new Error(`Failed to delete auth user: ${authError.message}`);

  return { success: true };
}
