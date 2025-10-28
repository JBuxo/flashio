// app/proxy.ts

import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  runtime: "edge",
};

// adapter for cookies
const cookieMethods = (cookies: NextRequest["cookies"]) => ({
  getAll: () => {
    const arr: { name: string; value: string }[] = [];
    for (const cookie of cookies.getAll()) {
      arr.push({ name: cookie.name, value: cookie.value });
    }
    return arr;
  },
  setAll: (_cookies: { name: string; value: string }[]) => {
    throw new Error("setAll not implemented");
  },
});

export async function proxy(req: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: cookieMethods(req.cookies),
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/auth/get-authed", req.url));
  }

  console.log("Authenticated ");

  return NextResponse.next();
}
