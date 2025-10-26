"use client";

import { CheckSquare2Icon, SquareXIcon } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BrandedText from "../ui/branded-text";
import { Button } from "../ui/button";
import { useFlashcardStore } from "@/app/stores/flashcard-store";

export default function Flashcard({
  questionNumber,
  question,
  answer,
  isActive,
  onComplete,
}: {
  questionNumber: number;
  question: string;
  answer: string;
  isActive?: boolean;
  onComplete?: () => void;
}) {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [exitState, setExitState] = useState<"correct" | "incorrect" | null>(
    null
  );
  const markAnswer = useFlashcardStore((state) => state.markAnswer);

  const handleCorrect = () => {
    markAnswer(questionNumber, true);
    setExitState("correct");
    setTimeout(() => onComplete?.(), 800); // match exit animation duration
  };

  const handleIncorrect = () => {
    markAnswer(questionNumber, false);
    setExitState("incorrect");
    setTimeout(() => onComplete?.(), 800);
  };

  const getExitAnimation = () => {
    if (exitState === "correct") {
      return {
        rotate: [0, 3, -2, 2, 0],
        x: [0, -50, -800],
        opacity: [1, 0.9, 1, 0.8, 0],
        backgroundColor: ["#FFFFFF", "#22c55e", "white", "#22c55e", "#FFFFFF"],
        transition: { duration: 0.8, ease: "easeInOut" },
      };
    } else if (exitState === "incorrect") {
      return {
        x: [0, 20, 800],
        rotate: [0, -5, -15],
        opacity: [1, 0.8, 0],
        transition: { duration: 0.5, ease: "easeIn" },
      };
    }
    return {};
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      // @ts-expect-error - Animation type mismatch
      animate={exitState ? getExitAnimation() : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ perspective: "1000px" }}
      className={`relative w-full lg:w-xl h-96 sm:h-auto aspect-video ${
        isActive ? "" : "pointer-events-none"
      }`}
    >
      {/* Stamp overlay */}
      {exitState && (
        <motion.div
          key="stamp"
          initial={{ scale: 0, opacity: 0, rotate: -15 }}
          animate={{
            scale: [0, 1.2, 1],
            opacity: [0, 1, 1],
            rotate: [-15, 10, 0],
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
        >
          {exitState === "correct" ? (
            <CheckSquare2Icon
              className="w-32 h-32 text-white fill-green-500 "
              strokeWidth={1}
            />
          ) : (
            <SquareXIcon
              className="w-32 h-32 text-white fill-red-500 "
              strokeWidth={1}
            />
          )}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {!isFlipped ? (
          <motion.div
            key="front"
            initial={{ rotateY: 0 }}
            exit={{ rotateY: 90 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
            whileHover={{ scale: 1.02, boxShadow: "6px 6px 0 rgba(0,0,0,1)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsFlipped(true)}
            className="absolute inset-0 bg-white border-3 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] p-4 flex flex-col gap-2 cursor-pointer"
            style={{ backfaceVisibility: "hidden" }}
          >
            <BrandedText className="text-2xl" color="text-pink-500">
              Question {questionNumber}
            </BrandedText>
            <div className="flex-1 text-lg">{question}</div>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="w-full text-muted-foreground text-center"
            >
              Tap Card To Flip
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="back"
            initial={{ rotateY: -90 }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 bg-gray-300 border-3 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] p-4 flex flex-col gap-2"
            style={{ backfaceVisibility: "hidden" }}
          >
            <BrandedText className="text-2xl" color="text-pink-500">
              Answer
            </BrandedText>
            <div className="flex-1 text-lg">{answer}</div>
            <div className="w-full flex gap-4">
              <Button
                onClick={handleCorrect}
                className="rounded-none lg:hover:shadow-[4px_4px_0_rgba(0,0,0,1)] border-3 border-black text-black flex-1 bg-green-500 lg:hover:bg-green-300 transition-all"
              >
                Correct <CheckSquare2Icon />
              </Button>
              <Button
                onClick={handleIncorrect}
                className="rounded-none lg:hover:shadow-[4px_4px_0_rgba(0,0,0,1)] border-3 border-black text-black flex-1 bg-red-500 hover:bg-red-400 transition-all"
              >
                Wrong <SquareXIcon />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
