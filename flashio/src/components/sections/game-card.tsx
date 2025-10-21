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
  level: "beginner" | "intermediate" | "pro" | "goat";
  userLevel?: "beginner" | "intermediate" | "pro" | "goat";
  isLocked?: boolean;
}

export const levelOrder = ["beginner", "intermediate", "pro", "goat"] as const;

export const thresholds = {
  beginner: 0,
  intermediate: 500,
  pro: 1000,
  goat: 10000,
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
        <div className="z-20 absolute right-0 left-0 bottom-0 top-0 bg-white/10 flex flex-col items-center justify-center backdrop-blur-md">
          <LockIcon className="size-16 z-20 stroke-1" />
          <p className="text-center mt-4 max-w-48">
            You need to be at least
            <strong> {props.level.toUpperCase()}</strong> to unlock this
            gamemode
          </p>
        </div>
      )}
    </div>
  );
}
