"use client";

import { CheckSquare2Icon, SquareXIcon } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import BrandedText from "../ui/branded-text";
import { Button } from "../ui/button";
import { useFlashcardStore } from "@/app/stores/flashcard-store";

type FlashcardProps = {
  questionNumber: number;
  question: string;
  answer: string;
  isActive?: boolean;
  isReview?: boolean;
  wasCorrect?: boolean;
  onComplete?: () => void;
};

export default function Flashcard({
  questionNumber,
  question,
  answer,
  isActive = false,
  isReview = false,
  wasCorrect,
  onComplete,
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [exitState, setExitState] = useState<"correct" | "incorrect" | null>(
    null
  );
  const markAnswer = useFlashcardStore((state) => state.markAnswer);

  // --- Handlers ----------------------------------------------------

  const handleCorrect = useCallback(() => {
    markAnswer(questionNumber, true);
    setExitState("correct");
  }, [markAnswer, questionNumber]);

  const handleIncorrect = useCallback(() => {
    markAnswer(questionNumber, false);
    setExitState("incorrect");
  }, [markAnswer, questionNumber]);

  // --- Animations --------------------------------------------------

  const getExitAnimation = useCallback(() => {
    switch (exitState) {
      case "correct":
        return {
          rotate: [0, 3, -2, 2, 0],
          x: [0, -50, -800],
          opacity: [1, 0.9, 1, 0.8, 0],
          backgroundColor: ["#fff", "#22c55e", "#22c55e", "#fff"],
          transition: { duration: 0.8, ease: "anticipate" },
        };
      case "incorrect":
        return {
          x: [0, 20, 800],
          rotate: [0, -5, -15],
          opacity: [1, 0.8, 0],
          transition: { duration: 0.5, ease: "easeIn" },
        };
      default:
        return {};
    }
  }, [exitState]);

  // --- Lifecycle ---------------------------------------------------

  useEffect(() => {
    setIsFlipped(false);
    setExitState(null);
  }, [questionNumber]);

  useEffect(() => {
    if (!exitState) return;
    const timer = setTimeout(() => onComplete?.(), 800);
    return () => clearTimeout(timer);
  }, [exitState, onComplete]);

  // --- Render ------------------------------------------------------

  const animationProps = exitState ? getExitAnimation() : { opacity: 1, y: 0 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      // @ts-expect-error - Animation Type Mismatch (not finna debug that tbh)
      animate={animationProps}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`w-full h-96 sm:h-auto aspect-video ${
        isActive ? "" : "pointer-events-none"
      }`}
    >
      <div className="relative w-full h-full" style={{ perspective: 1000 }}>
        {/* Rotating container */}
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{
            transformStyle: "preserve-3d",
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          {/* Front side */}
          <div
            onClick={() => setIsFlipped(true)}
            className="absolute inset-0 bg-white border-3 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] p-4 flex flex-col gap-2 cursor-pointer"
            style={{ backfaceVisibility: "hidden" }}
          >
            {isReview && wasCorrect !== undefined && (
              <motion.div
                initial={{ scale: 0, rotate: 20, opacity: 0 }}
                animate={{ scale: 1, rotate: 20, opacity: 1 }}
                transition={{ duration: 0.4, ease: "backOut" }}
                className={`absolute top-5 right-2 z-20 text-white text-sm font-bold px-3 py-1 rounded-md border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,1)] ${
                  wasCorrect ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {wasCorrect ? "CORRECT" : "WRONG"}
              </motion.div>
            )}

            <BrandedText className="text-2xl" color="text-pink-500">
              Question {questionNumber}
            </BrandedText>

            <div className="flex-1 text-lg">{question}</div>

            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-full text-muted-foreground text-center"
            >
              Tap Card To Flip
            </motion.div>
          </div>

          {/* Back side */}
          <div
            onClick={() => isReview && setIsFlipped(false)}
            className={`absolute inset-0 bg-gray-300 border-3 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] p-4 flex flex-col gap-2 ${
              isReview ? "cursor-pointer" : ""
            }`}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <BrandedText className="text-2xl" color="text-pink-500">
              Answer
            </BrandedText>

            <div className="flex-1 text-lg">{answer}</div>

            {!isReview ? (
              <div className="w-full flex gap-4">
                <Button
                  onClick={handleCorrect}
                  className="rounded-none border-3 border-black text-black flex-1 bg-green-500 hover:bg-green-300 transition-all lg:hover:shadow-[4px_4px_0_rgba(0,0,0,1)]"
                >
                  Correct <CheckSquare2Icon />
                </Button>
                <Button
                  onClick={handleIncorrect}
                  className="rounded-none border-3 border-black text-black flex-1 bg-red-500 hover:bg-red-400 transition-all lg:hover:shadow-[4px_4px_0_rgba(0,0,0,1)]"
                >
                  Wrong <SquareXIcon />
                </Button>
              </div>
            ) : (
              <p className="text-center text-sm text-gray-600 mt-2">
                Tap anywhere to flip back
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
