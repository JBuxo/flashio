"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ExperienceChart } from "@/components/sections/experience-chart";
import GameCard from "@/components/sections/game-card";
import { GameSelector } from "@/components/sections/game-selector";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const isOffline = false;

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
      <div className="mt-4 mb-4 font-mansalva">Flashio</div>
      <ExperienceChart />
      <div className="mt-8 flex flex-col flex-1">
        <div className="text-2xl font-semibold">Earn Points</div>
        <GameSelector />
      </div>
    </div>
  );
}
