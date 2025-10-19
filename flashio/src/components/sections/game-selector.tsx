import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import GameCard from "./game-card";

export function GameSelector() {
  return (
    <Carousel>
      <CarouselContent className="h-full">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="h-full">
            <div className="p-1 h-[50vh]">
              <GameCard
                title=""
                description=""
                reward={0}
                backgroundColors={""}
                isLocked={false}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
