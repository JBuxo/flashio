"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";
import { ExperienceChart } from "@/components/sections/experience-chart";
import Link from "next/link";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const isOffiline = false;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <div className="px-4 py-8">
      <ExperienceChart />
      <div className="text-3xl font-semibold">Lets Get Busy!</div>
      {isOffiline && (
        <Link href={"/play?review"}>
          <div>Review</div>
        </Link>
      )}
      <Link href={"/play?classic"}>
        <div>Classic Game</div>
      </Link>

      <Link href={"/play?speedround"}>
        <div>Speedround</div>
      </Link>

      <Link href={"/play?review"}>
        <div>Review</div>
      </Link>
    </div>
  );
}
