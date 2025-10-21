import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import GameCard, { GameCardProps, levelOrder } from "./game-card";
import { getUserLevel } from "@/lib/utils";

const gameCards: GameCardProps[] = [
  {
    title: "Easy",
    description: "Easy Quiz",
    reward: 10,
    cost: 0,
    backgroundColor: "hsl(150, 52%, 51%)",
    level: "beginner",
  },
  {
    title: "Medium",
    description: "Medium Quiz",
    reward: 50,
    cost: 10,
    backgroundColor: "hsl(23, 95%, 52%)",
    level: "intermediate",
  },
  {
    title: "Hard",
    description: "Hard Quiz",
    reward: 100,
    cost: 20,
    backgroundColor: "hsl(2, 80%, 47%)",
    level: "pro",
  },
  {
    title: "Review",
    description: "Review Quiz",
    reward: 5,
    cost: 0,
    backgroundColor: "hsl(208, 100%, 51%)",
    level: "beginner",
  },
];

export function GameSelector({ xp }: { xp: number }) {
  const userLevel = getUserLevel(xp);

  return (
    <Carousel className="h-full ">
      <CarouselContent className="h-full ">
        {gameCards.map((gameCard, index) => {
          const isLocked =
            levelOrder.indexOf(userLevel) < levelOrder.indexOf(gameCard.level);
          return (
            <CarouselItem
              key={index}
              className="h-full pl-4 basis-[85%] md:basis-[45%] lg:basis-1/4"
            >
              <div className="p-1 h-full">
                <GameCard
                  title={gameCard.title}
                  cost={0}
                  description={gameCard.description}
                  reward={gameCard.reward}
                  backgroundColor={gameCard.backgroundColor} // make sure this is a hsl like "hsl(150, 52%, 51%)"
                  level={gameCard.level}
                  isLocked={isLocked}
                  userLevel={userLevel}
                />
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}
