import { CheckSquare2, HomeIcon, SquareXIcon } from "lucide-react";
import BrandedText from "../ui/branded-text";
import { Button } from "../ui/button";
import { useViewStore } from "@/app/stores/view-store";
import Image from "next/image";
import { motion } from "motion/react";
import { useEffect } from "react";
import { launchConfetti } from "@/lib/utils";
import { useFlashcardStore } from "@/app/stores/flashcard-store";
import { useUserStore } from "@/app/stores/user-store";

export default function CompletionOverlay() {
  const switchView = useViewStore((state) => state.switchView);
  const userId = useUserStore((store) => store.userId);
  const pack = useViewStore((store) => store.selectedPack);
  const answers = useFlashcardStore((store) => store.getResults());
  const correctCount = answers.filter((a) => a.isCorrect).length;

  //   XP earned based on right and wrong
  const xp = (correctCount / answers.length) * pack!.reward_xp;

  //   Shards Earned based on percentage of right and wrong
  const shards = (correctCount / answers.length) * pack!.reward_clevershard;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const scheduleConf = () => {
      launchConfetti();

      const nextBurst = Math.random() * 5000 + 500;

      timeout = setTimeout(scheduleConf, nextBurst);
    };
    scheduleConf();

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: "easeIn",
        }}
        className="fixed top-0 left-0 right-0 bottom-0 z-50 "
      >
        <div className="h-full w-full flex items-center justify-center px-4">
          <div
            className="shadow-[12px 12px 0px rgba(0,0,0,1) max-w-md w-full min-h-[60dvh] bg-white p-4 flex flex-col"
            style={{ boxShadow: "12px 12px 0px rgba(0,0,0,1)" }}
          >
            <BrandedText className="text-4xl text-pink-500">
              Finished!!!
            </BrandedText>

            <div className="border-3 border-black h-full flex-1 my-4 p-4 text-xl">
              <ul className="space-y-4">
                <li className="flex items-center">
                  <CheckSquare2 className="mr-2 fill-green-500 text-green-800" />
                  Correct x {correctCount}{" "}
                </li>
                <li className="flex items-center">
                  <SquareXIcon className="mr-2 fill-red-500 text-red-800" />{" "}
                  Wrong x {answers.length - correctCount}{" "}
                </li>
                <li className="flex items-center">
                  <Image
                    src={"/images/clever-shard.png"}
                    alt={""}
                    height={24}
                    width={24}
                    className="mr-2"
                  />
                  Clever Shards x {shards}{" "}
                  <span className="text-muted-foreground ml-2">
                    (out of {pack?.reward_clevershard})
                  </span>
                </li>
                <li className="flex items-center">
                  <BrandedText className="text-pink-500 text-2xl mr-2">
                    XP
                  </BrandedText>
                  x {xp}
                </li>
              </ul>
            </div>

            <Button
              className="rounded-none lg:hover:shadow-[4px_4px_0_rgba(0,0,0,1)] border-3 border-black text-black  w-1/3 ml-auto bg-green-500 hover:bg-green-400"
              onClick={() => {
                switchView("dashboard");
              }}
            >
              Home <HomeIcon />
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
