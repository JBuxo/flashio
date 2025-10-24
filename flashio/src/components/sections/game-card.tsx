import { ArrowUpRightIcon, LockIcon, SparklesIcon } from "lucide-react";
import BackgroundSvg from "../ui/backround-svg";
import { Button } from "../ui/button";
import Link from "next/link";
import BrandedText from "../ui/branded-text";
import Image from "next/image";

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
    <div
      className="h-[44dvh] w-full flex flex-col relative p-4 pb-16 border-4 border-black select-none"
      style={{
        backgroundColor: props.backgroundColor,
        boxShadow: "12px 12px 0px rgba(0,0,0,1)",
      }}
    >
      {/* <div className="absolute right-0 left-0">
        <BackgroundSvg color={props.backgroundColor} />
      </div> */}

      <div className="z-10 h-full p-4 bg-white/30 border-4 border-black relative">
        <h1 className="text-4xl ">{props.title}</h1>
        <div className="mt-4 text-xl">{props.description}</div>
        <div className="text-2xl flex">
          Reward: {props.reward}{" "}
          <Image
            className="ml-1 object-contain "
            src={`/images/clever-shard.png`}
            alt=""
            height={28}
            width={28}
          />
        </div>
        <div className=" absolute bottom-2 right-2   flex">
          <div>Costs {props.cost} </div>
          <Image
            className="ml-1 object-contain "
            src={`/images/clever-shard.png`}
            alt=""
            height={28}
            width={28}
          />
        </div>
      </div>

      <Button
        className="absolute bottom-4 right-4 left-4 rounded-none lg:hover:shadow-[4px_4px_0_rgba(0,0,0,1)] border-3 border-black text-black"
        style={{
          backgroundColor: props.backgroundColor,
        }}
      >
        Open This Pack <ArrowUpRightIcon />
      </Button>

      {props.isLocked && (
        <div className="z-20 absolute inset-0 bg-black/30 flex flex-col items-center justify-center backdrop-blur-md">
          <LockIcon className="size-12 mb-2 text-white/80" />
          <div className="text-center text-white text-sm px-4 ">
            Reach{" "}
            <BrandedText className=" tracking-wider text-xl leading-none capitalize">
              {props.level}
            </BrandedText>{" "}
            to unlock this pack
          </div>
        </div>
      )}
    </div>
  );
}
