import { useState } from "react";
import Flashcard from "../sections/flashcard";
import CompletionOverlay from "./completion-overlay";
import { useFlashcardStore } from "@/app/stores/flashcard-store";
import {
  insertFlashcardsToSession,
  updateSessionRewards,
} from "@/supabase/game/game-session";
import { useViewStore } from "@/app/stores/view-store";
import { useUserStore } from "@/app/stores/user-store";
import { AnimatePresence, motion } from "motion/react";
import Loader from "../ui/loader";

export default function QuizComponent() {
  const questionCards = useFlashcardStore((state) => state.flashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const pack = useViewStore((store) => store.selectedPack);
  const gameSession = useFlashcardStore((store) => store.gameSession);
  const answers = useFlashcardStore((store) => store.getResults());
  const user = useUserStore((store) => store);

  const nextCard = async () => {
    const isLastCard = currentIndex >= questionCards.length - 1;

    if (!isLastCard) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    setCompleted(true);

    if (!gameSession || !pack) return;

    try {
      // 1️⃣ Save flashcards
      await insertFlashcardsToSession(gameSession, answers);

      // 2️⃣ Compute rewards
      const correctCount = answers.filter((a) => a.isCorrect).length;
      const total = answers.length;
      const xp = total
        ? Math.round((correctCount / total) * Number(pack.reward_xp)) | 0
        : 0;
      const shards = total
        ? Math.round((correctCount / total) * Number(pack.reward_clevershard)) |
          0
        : 0;

      // 3️⃣ Update session and user
      await updateSessionRewards(gameSession, xp, shards);
      await user.addXp(xp);
      await user.addCleverShards(shards);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error submitting session:", err.message);
      } else {
        console.error("Unkown error submitting session:", err);
      }
    }
  };

  if (!questionCards || questionCards.length === 0) {
    return (
      <AnimatePresence>
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center justify-center h-[100dvh] text-white bg-pink-500 fixed top-0 left-0 right-0 bottom-0"
        >
          <Loader />
        </motion.div>
      </AnimatePresence>
    );
  }

  if (completed) return <CompletionOverlay />;

  return (
    <div className="px-4 h-[calc(100dvh-64px)] relative flex flex-col items-center justify-start overflow-hidden pt-4">
      {/* Main Active Card */}
      <div className="max-w-xl w-full">
        <Flashcard
          key={currentIndex} // 🔑 Ensures proper re-render
          questionNumber={questionCards[currentIndex].questionNumber}
          question={questionCards[currentIndex].question}
          answer={questionCards[currentIndex].answer}
          isActive
          onComplete={nextCard}
        />
      </div>

      {/* Upcoming Cards (Fanned Out) */}
      {/* Upcoming Cards (Fanned Out at Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center pointer-events-none pb-8 rotate-10 translate-y-12">
        {questionCards
          .slice(currentIndex + 1, currentIndex + 6)
          .map((card, idx) => {
            const rotation = idx * 5 - 10;
            const translateX = idx * 25 - 50;
            const translateY = idx * 7;

            return (
              <div
                key={card.questionNumber || idx}
                className="absolute transition-all duration-500 ease-out max-w-xl w-full"
                style={{
                  transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotation}deg) scale(0.5)`,
                  transformOrigin: "bottom center",
                  zIndex: 10 - idx,
                }}
              >
                <Flashcard
                  questionNumber={card.questionNumber}
                  question={card.question}
                  answer={card.answer}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
