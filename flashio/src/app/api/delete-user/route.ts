import { deleteCurrentUser } from "@/supabase/admin";
import { requireAuth } from "@/supabase/auth/require-auth";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const user = await requireAuth(); //protect route NOTE: will throw error if no auth
    await deleteCurrentUser(user.id);

    return NextResponse.json({ message: "User account and all data deleted" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
