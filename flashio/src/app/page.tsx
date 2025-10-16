"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";
import { ExperienceChart } from "@/components/sections/experience-chart";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
    <div className="min-h-screen flex flex-col p-8 pt-0">
      <div className="mt-8 mb-4 font-mansalva">Flashio</div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-24 bg-primary rounded-xl p-4 text-primary-foreground flex flex-col justify-center">
          <div>Total XP:</div>
          <div className="text-2xl font-semibold">12345909</div>
        </div>
        <div className="h-24 bg-secondary rounded-xl p-4 text-secondary-foreground flex flex-col justify-center">
          <div>XP To Next Level:</div>
          <div className="text-2xl font-semibold">12345909</div>
        </div>
      </div>
      <div className="h-full flex-1 mt-4">
        <div className="text-2xl font-semibold font-mansalva">Get Learning</div>
        <Carousel>
          <CarouselContent>
            <CarouselItem>Normal</CarouselItem>
            <CarouselItem>Speedround</CarouselItem>
            <CarouselItem>...</CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
