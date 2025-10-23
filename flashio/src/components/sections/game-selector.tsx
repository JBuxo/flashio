import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import GameCard, { GameCardProps, levelOrder } from "./game-card";
import { getUserLevel } from "@/lib/utils";

// Blue → Teal → Violet → Gold → White-Gold → Iridescent for backgrounds
const gameCards: GameCardProps[] = [
  {
    title: "Basic Pack",
    description: "Easy Quiz",
    reward: 10,
    cost: 0,
    backgroundColor: "hsl(150, 52%, 51%)", // greenish - friendly beginner vibe
    level: "spark",
  },
  {
    title: "Apprentice Pack",
    description: "Medium Quiz",
    reward: 25,
    cost: 10,
    backgroundColor: "hsl(23, 95%, 52%)", // orange - growth
    level: "seeker",
  },
  {
    title: "Advanced Pack",
    description: "Hard Quiz",
    reward: 50,
    cost: 25,
    backgroundColor: "hsl(2, 80%, 47%)", // red - challenge
    level: "scholar",
  },
  {
    title: "Elite Pack",
    description: "Expert Quiz",
    reward: 75,
    cost: 40,
    backgroundColor: "hsl(263, 70%, 55%)", // deep purple - mastery
    level: "thinker",
  },
  {
    title: "Mythic Pack",
    description: "Master Quiz",
    reward: 120,
    cost: 60,
    backgroundColor: "hsl(45, 100%, 50%)", // gold - prestige
    level: "mastermind",
  },
  {
    title: "Legendary Pack",
    description: "Ultimate Challenge",
    reward: 200,
    cost: 100,
    backgroundColor: "hsl(210, 100%, 85%)", // soft white-blue glow - legendary
    level: "sage",
  },
  // Optional review card
  // {
  //   title: "Review Pack",
  //   description: "Refresh your memory with past cards",
  //   reward: 5,
  //   cost: 0,
  //   backgroundColor: "hsl(208, 100%, 51%)", // blue - review
  //   level: "spark",
  // },
];

export function GameSelector({ xp }: { xp: number }) {
  const userLevel = getUserLevel(xp);

  return (
    <Carousel>
      <CarouselContent className="mr-2 pl-2">
        {gameCards.map((gameCard, index) => {
          const isLocked =
            levelOrder.indexOf(userLevel) < levelOrder.indexOf(gameCard.level);
          return (
            <CarouselItem key={index} className="basis-[75%]">
              <GameCard
                title={gameCard.title}
                cost={0}
                description={gameCard.description}
                reward={gameCard.reward}
                backgroundColor={gameCard.backgroundColor}
                level={gameCard.level}
                isLocked={isLocked}
                userLevel={userLevel}
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}
