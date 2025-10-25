import { useState } from "react";
import Flashcard from "../sections/flashcard";
import CompletionOverlay from "./completion-overlay";

export default function QuizComponent() {
  const questionCards = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    question: `Question ${i + 1}`,
    answer: `Answer ${i + 1}`,
  }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  const nextCard = () => {
    if (currentIndex < questionCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  if (completed) return <CompletionOverlay />;

  return (
    <div className="px-4 h-[calc(100dvh-64px)] relative flex flex-col items-center justify-start overflow-hidden pt-4">
      {/* Main Active Card */}
      <Flashcard
        key={questionCards[currentIndex].id}
        questionNumber={questionCards[currentIndex].id}
        question={questionCards[currentIndex].question}
        answer={questionCards[currentIndex].answer}
        isActive
        onComplete={nextCard}
      />

      {/* Upcoming Cards (Fanned Out) */}
      <div className="absolute bottom-0 flex items-end justify-center">
        {questionCards
          .slice(currentIndex + 1, currentIndex + 6)
          .map((card, idx) => {
            const rotation = idx * 5; // fan angle
            const translateX = idx * 20; // horizontal spacing
            const translateY = idx * 5; // slight vertical offset

            return (
              <div
                key={card.id}
                className="absolute transition-all duration-500 ease-out"
                style={{
                  transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotation}deg) scale(0.5)`,
                  transformOrigin: "bottom center",
                  zIndex: 10 - idx,
                }}
              >
                <Flashcard
                  questionNumber={card.id}
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
