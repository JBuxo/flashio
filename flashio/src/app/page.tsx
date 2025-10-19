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
      <div className="flex-1 flex flex-col mt-8">
        <div className="text-2xl font-semibold">Earn Points</div>
        <Carousel className="mt-4 flex-1 flex flex-col">
          <CarouselContent className="h-full">
            <CarouselItem className="h-full">
              <GameCard
                title={"Easy"}
                description={"Play an easy game"}
                reward={100}
                backgroundColors={[]}
                isLocked={false}
              />
            </CarouselItem>

            {/* <CarouselItem>Easy (100 PassPoints)</CarouselItem> */}
            {/* <CarouselItem>Normal (200 PassPoints)</CarouselItem>
            <CarouselItem>Hard (300 PassPoints)</CarouselItem>
            <CarouselItem>Review (50 PassPoints)</CarouselItem> */}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
