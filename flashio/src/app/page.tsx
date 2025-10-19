"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";
import { ExperienceChart } from "@/components/sections/experience-chart";
import { GameSelector } from "@/components/sections/game-selector";
import { User } from "@supabase/supabase-js";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const passPoints = 0;

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
    <div className="min-h-screen flex flex-col p-4 pt-0">
      <div className="flex justify-between items-center mt-4 mb-4 ">
        <div className="font-mansalva">Flashio</div>
        <div className="rounded-sm bg-accent p-1 size-10 aspect-square flex items-center justify-center">
          {user?.email?.charAt(0).toUpperCase()}
        </div>
      </div>

      <ExperienceChart />
      <div className="mt-8 flex flex-col flex-1">
        <div className="text-2xl font-semibold mb-2">Earn Points</div>
        <GameSelector passPoints={passPoints} />
      </div>
    </div>
  );
}
