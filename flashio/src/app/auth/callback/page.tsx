"use client";

import { supabase } from "@/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.replace("/");
      }
    };

    checkSession();
  }, [router]);

  return <div>Signing You In...</div>;
}
