"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";
import { GameSelector } from "@/components/sections/game-selector";
import { User } from "@supabase/supabase-js";
import RankBadge from "@/components/sections/rank-badge";
import BrandedText from "@/components/ui/branded-text";
import Image from "next/image";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  // let xp = 0;
  const [xp, setXp] = useState<number>(3000);

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
        <BrandedText className="text-4xl " color="text-pink-500">
          Flashio
        </BrandedText>

        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Image
              src={`/images/clever-shard.png`}
              alt=""
              height={32}
              width={32}
            />
            <div className="ml-1 font-semibold">1234</div>
          </div>

          <div className="rounded-sm bg-accent p-1 size-10 aspect-square flex items-center justify-center">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
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

      <div className=" flex flex-col flex-1">
        <div className="px-4 mb-2">
          <BrandedText
            className="text-4xl tracking-wider"
            color="text-pink-500"
          >
            Earn Points
          </BrandedText>
        </div>

        <GameSelector xp={xp} />
      </div>
    </div>
  );
}
