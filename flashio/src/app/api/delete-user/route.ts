// app/api/user/delete/route.ts
import { deleteCurrentUser } from "@/supabase/admin";
import { supabaseClient } from "@/supabase/client";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    // Get currently logged-in user session
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Delete the user and cascade all related data
    await deleteCurrentUser(user.id);

    return NextResponse.json({ message: "User account and all data deleted" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
