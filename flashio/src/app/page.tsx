"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";
import { GameSelector } from "@/components/sections/game-selector";
import { User } from "@supabase/supabase-js";
import RankBadge from "@/components/sections/rank-badge";
import BrandedText from "@/components/ui/branded-text";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  // let xp = 0;
  const [xp, setXp] = useState<number>(0);

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
    <div className="h-[100dvh] flex flex-col pt-0">
      <div className="flex justify-between items-center mt-4 mb-4 mx-4">
        <BrandedText className="text-4xl" color="text-pink-500">
          Flashio
        </BrandedText>
        <div className="rounded-sm bg-accent p-1 size-10 aspect-square flex items-center justify-center">
          {user?.email?.charAt(0).toUpperCase()}
        </div>
      </div>
      <div className="px-8">
        <RankBadge xp={xp} />
      </div>

      {/* <div>
        <input
          type="range"
          name="xp-slider"
          id="xp-slider"
          max={10001}
          step={100}
          value={xp}
          onChange={(e) => setXp(Number(e.target.value))}
        />
      </div> */}

      <div className="mt-8 flex flex-col flex-1">
        <div className="text-2xl font-semibold mb-4 px-4">Earn Points</div>

        <GameSelector xp={xp} />
      </div>
    </div>
  );
}
