import {
  ArrowUpRightIcon,
  CheckSquare2Icon,
  LockIcon,
  SquareXIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import BrandedText from "../ui/branded-text";
import Image from "next/image";
import { useViewStore } from "@/app/stores/view-store";
import { useFlashcardStore } from "@/app/stores/flashcard-store";
import { motion } from "motion/react";
import { createGameSession } from "@/supabase/game/game-session";
import { useUserStore } from "@/app/stores/user-store";

export interface GamePackProps {
  title: string;
  description: string;
  reward_clevershard: number;
  reward_xp: number;
  backgroundColor: string;
  cost: number;
  level: "spark" | "seeker" | "scholar" | "thinker" | "mastermind" | "sage";
  pack_type:
    | "review"
    | "basic"
    | "apprentice"
    | "advanced"
    | "elite"
    | "mythic"
    | "legendary";
  userLevel?:
    | "spark"
    | "seeker"
    | "scholar"
    | "thinker"
    | "mastermind"
    | "sage";
  isLocked?: boolean;
  index?: number;
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

export default function GamePack({ ...props }: GamePackProps) {
  const selectPack = useViewStore((state) => state.selectPack);
  const switchView = useViewStore((state) => state.switchView);
  const confirmPack = useViewStore((state) => state.confirmPack);
  const setGameSession = useFlashcardStore((state) => state.setGameSession);
  const setFlashcards = useFlashcardStore((store) => store.setFlashcards);
  const view = useViewStore((state) => state.view);
  const userId = useUserStore((state) => state.userId);
  const selectedPack = useViewStore((state) => state.selectedPack);

  const handleConfirmPack = async () => {
    try {
      confirmPack();

      const { selectedPack } = useViewStore.getState();
      if (!selectedPack) throw new Error("No pack selected");

      const pack_level = selectedPack.level;

      // make the api call the right thing
      const endpoint =
        selectedPack.title === "Review Pack"
          ? "/api/review-pack"
          : "/api/generate-questions";

      // call openai
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: pack_level }),
      });

      if (!res.ok) throw new Error(`Failed to fetch from ${endpoint}`);

      const flashcards = await res.json();
      console.log("Generated Flashcards:", flashcards);

      // Store flashcards and start session
      setFlashcards(flashcards);

      const gameSession = await createGameSession(props.pack_type);
      setGameSession(gameSession.id);
    } catch (err) {
      console.error("Error loading flashcards:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300, // bounce
        damping: 20, // speed
        delay: props.index !== undefined ? props.index * 0.1 : 0, //stagger
      }}
      className="h-[44dvh] w-full flex flex-col relative p-4 pb-16 border-4 border-black select-none"
      style={{
        backgroundColor: props.backgroundColor,
        boxShadow: "12px 12px 0px rgba(0,0,0,1)",
      }}
    >
      <div className="z-10 h-full p-2 bg-white/30 border-4 border-black relative">
        <h1 className="text-3xl leading-none font-semibold">{props.title}</h1>
        <div className="leading-none mt-2">{props.description}</div>
        <div className="mt-4 font-bold">Rewards:</div>
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <div>{props.reward_clevershard}</div>{" "}
            <Image
              className="ml-1 object-contain "
              src={`/images/clever-shard.png`}
              alt=""
              height={28}
              width={28}
            />
          </div>
          <div className="flex items-center">
            <div className="mr-1">{props.reward_xp}</div>{" "}
            <BrandedText
              className="text-lg brightness-50"
              style={{ color: props.backgroundColor }}
            >
              XP
            </BrandedText>
          </div>
        </div>
        <div className="absolute bottom-2 right-2 flex">
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

      <div className="absolute bottom-4 left-4 right-4 flex gap-4">
        <Button
          className={`rounded-none lg:hover:shadow-[4px_4px_0_rgba(0,0,0,1)] border-3 border-black text-black flex-1 ${
            view === "unboxing"
              ? "bg-green-500 lg:hover:bg-green-300"
              : "bg-transparent lg:hover:bg-transparent"
          }`}
          onClick={() => {
            if (!props.isLocked && view === "dashboard") {
              selectPack(props);
            } else {
              handleConfirmPack();
            }
          }}
        >
          {view === "dashboard" ? (
            <>
              Open This Pack <ArrowUpRightIcon />
            </>
          ) : (
            <>
              Confirm <CheckSquare2Icon />
            </>
          )}
        </Button>

        {view === "unboxing" && (
          <Button
            className="rounded-none lg:hover:shadow-[4px_4px_0_rgba(0,0,0,1)] border-3 border-black text-black flex-1 bg-red-500 hover:bg-red-400"
            onClick={() => switchView("dashboard")}
          >
            Cancel <SquareXIcon />
          </Button>
        )}
      </div>

      {props.isLocked && (
        <div className="z-20 absolute inset-0 bg-black/30 flex flex-col items-center justify-center backdrop-blur-md">
          <LockIcon className="size-12 mb-2 text-white/80" />
          <div className="text-center text-white text-sm px-4 ">
            Reach{" "}
            <BrandedText
              className=" tracking-wider text-xl leading-none"
              color="capitalize"
            >
              {props.level.toUpperCase()}
            </BrandedText>{" "}
            to unlock this pack
          </div>
        </div>
      )}
    </motion.div>
  );
}
