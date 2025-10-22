import { LockIcon, SparklesIcon } from "lucide-react";
import BackgroundSvg from "../ui/backround-svg";
import { Button } from "../ui/button";
import Link from "next/link";

export interface GameCardProps {
  title: string;
  description: string;
  reward: number;
  backgroundColor: string;
  cost: number;
  level: "spark" | "seeker" | "scholar" | "thinker" | "mastermind" | "sage";
  userLevel?:
    | "spark"
    | "seeker"
    | "scholar"
    | "thinker"
    | "mastermind"
    | "sage";
  isLocked?: boolean;
}

export const levelOrder = [
  "spark",
  "seeker",
  "scholar",
  "thinker",
  "mastermind",
  "sage",
] as const;

export const ranks = {
  spark: 0,
  seeker: 500,
  scholar: 1000,
  thinker: 2500,
  mastermind: 5000,
  sage: 10000,
} as const;

export default function GameCard({ ...props }: GameCardProps) {
  return (
    <div className="h-[40vh] w-full rounded-xl overflow-hidden flex flex-col relative ">
      <div className="absolute right-0 left-0">
        <BackgroundSvg color={props.backgroundColor} />
      </div>

      <div className="z-10 p-6 h-full backdrop-blur-sm ">
        <h1 className="text-4xl ">{props.title}</h1>
        <div className="mt-4 text-xl">{props.description}</div>
        <div className="text-3xl">{props.reward}</div>
        <Button
          className={`absolute left-6 right-6 bottom-6 h-16`}
          size={"lg"}
          style={{ backgroundColor: props.backgroundColor }}
          asChild
        >
          <Link href={`/api-fetch?level=${props.level}`}>
            Play <SparklesIcon className="size-5" />
          </Link>
        </Button>
      </div>

      {props.isLocked && (
        <div className="z-20 absolute inset-0 bg-black/30 flex flex-col items-center justify-center backdrop-blur-md rounded-xl">
          <LockIcon className="size-12 mb-2 text-white/80" />
          <p className="text-center text-white text-sm px-4">
            Reach <strong>{props.level.toUpperCase()}</strong> to unlock this
            pack
          </p>
        </div>
      )}
    </div>
  );
}
