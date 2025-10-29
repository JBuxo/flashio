import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { GamePackProps, levelOrder } from "./game-pack";
import { getUserLevel } from "@/lib/utils";
import GamePack from "./game-pack";

// Blue → Teal → Violet → Gold → White-Gold → Iridescent for backgrounds
const gameCards: GamePackProps[] = [
  {
    title: "Review Pack",
    pack_type: "review",
    description: "Quick refresher to solidify your knowledge",
    reward_clevershard: 5,
    reward_xp: 0,
    cost: 0,
    backgroundColor: "hsl(208, 100%, 51%)",
    level: "spark",
  },
  {
    title: "Basic Pack",
    pack_type: "basic",
    description: "Start your journey with simple questions",
    reward_clevershard: 10,
    reward_xp: 100,
    cost: 0,
    backgroundColor: "hsl(150, 52%, 51%)",
    level: "spark",
  },
  {
    title: "Apprentice Pack",
    pack_type: "apprentice",
    description: "A bit more challenging, test your skills",
    reward_clevershard: 25,
    reward_xp: 200,
    cost: 12,
    backgroundColor: "hsl(23, 95%, 52%)",
    level: "seeker",
  },
  {
    title: "Advanced Pack",
    pack_type: "advanced",
    description: "Complex questions for deeper understanding",
    reward_clevershard: 50,
    reward_xp: 300,
    cost: 25,
    backgroundColor: "hsl(2, 80%, 47%)",
    level: "scholar",
  },
  {
    title: "Elite Pack",
    pack_type: "elite",
    description: "Expert-level questions to master the topic",
    reward_clevershard: 125,
    reward_xp: 500,
    cost: 60,
    backgroundColor: "hsl(263, 70%, 55%)",
    level: "thinker",
  },
  {
    title: "Mythic Pack",
    pack_type: "mythic",
    description: "Test your knowledge with advanced mastery questions",
    reward_clevershard: 250,
    reward_xp: 750,
    cost: 125,
    backgroundColor: "hsl(45, 100%, 50%)",
    level: "mastermind",
  },
  {
    title: "Legendary Pack",
    pack_type: "legendary",
    description: "Ultimate challenge for the true expert",
    reward_clevershard: 500,
    reward_xp: 1000,
    cost: 250,
    backgroundColor: "hsl(210, 100%, 85%)",
    level: "sage",
  },
];

export function GameSelector({ xp }: { xp: number }) {
  const userLevel = getUserLevel(xp);

  return (
    <Carousel className="overflow-visible">
      <CarouselContent className="mr-6 pl-4 pb-3 -ml-4">
        {gameCards.map((gameCard, index) => {
          const isLocked =
            levelOrder.indexOf(userLevel) < levelOrder.indexOf(gameCard.level);
          return (
            <CarouselItem
              key={index}
              className={`basis-[70%] md:basis-[40%] xl:basis-[24%] pr-4`}
            >
              <GamePack
                pack_type={gameCard.pack_type}
                title={gameCard.title}
                cost={gameCard.cost}
                description={gameCard.description}
                reward_clevershard={gameCard.reward_clevershard}
                reward_xp={gameCard.reward_xp}
                backgroundColor={gameCard.backgroundColor}
                level={gameCard.level}
                isLocked={isLocked}
                userLevel={userLevel}
                index={index}
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}
