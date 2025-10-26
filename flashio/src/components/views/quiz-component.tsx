import { useState } from "react";
import Flashcard from "../sections/flashcard";
import CompletionOverlay from "./completion-overlay";
import { useFlashcardStore } from "@/app/stores/flashcard-store";
import { insertFlashcardsToSession } from "@/supabase/game/game-session";

export default function QuizComponent() {
  const questionCards = useFlashcardStore((state) => state.flashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const gameSession = useFlashcardStore((store) => store.gameSession);
  const answers = useFlashcardStore((store) => store.getResults());

  const nextCard = async () => {
    if (currentIndex < questionCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCompleted(true);
      if (gameSession) await insertFlashcardsToSession(gameSession, answers);
    }
  };

  if (!questionCards || questionCards.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  if (completed) return <CompletionOverlay />;

  return (
    <div className="px-4 h-[calc(100dvh-64px)] relative flex flex-col items-center justify-start overflow-hidden pt-4">
      {/* Main Active Card */}
      <Flashcard
        key={questionCards[currentIndex].questionNumber}
        questionNumber={questionCards[currentIndex].questionNumber}
        question={questionCards[currentIndex].question}
        answer={questionCards[currentIndex].answer}
        isActive
        onComplete={nextCard}
      />

      {/* Upcoming Cards (Fanned Out) */}
      <div className="absolute bottom-0 flex items-end justify-center">
        {/* <pre>{JSON.stringify(questionCards, null, 2)}</pre> */}

        {questionCards
          .slice(currentIndex + 1, currentIndex + 6)
          .map((card, idx) => {
            const rotation = idx * 5; // fan angle
            const translateX = idx * 20; // horizontal spacing
            const translateY = idx * 5; // slight vertical offset

            return (
              <div
                key={idx}
                className="absolute transition-all duration-500 ease-out"
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
