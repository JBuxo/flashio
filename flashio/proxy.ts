import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// This is the function Next.js expects
export async function proxy(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });

  // Only skip the public auth route
  if (req.nextUrl.pathname === "/auth/auth/get-authed/page") {
    return NextResponse.next();
  }

  const token = req.cookies.get("sb-access-token")?.value;

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/auth/get-authed/page";
    return NextResponse.redirect(url);
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/auth/get-authed/page";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Apply proxy to all routes except the public one
export const config = {
  matcher: ["/((?!auth/auth/get-authed/page).*)"],
};
