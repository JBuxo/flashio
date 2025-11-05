"use client";

import Header from "@/components/sections/header";
import BrandedText from "@/components/ui/branded-text";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getFlashcardsBySession } from "@/supabase/game/game-session";
import Loader from "@/components/ui/loader";
import { motion, AnimatePresence } from "motion/react";
import Flashcard from "@/components/sections/flashcard";
import { Flashcard as FlashcardType } from "@/app/stores/flashcard-store";

export default function SessionPage() {
  const params = useParams() as Record<string, string | undefined>;
  const sessionId = params.id;
  const [flashCards, setFlashcards] = useState<FlashcardType[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    let isMounted = true;

    async function loadSession() {
      try {
        if (!sessionId) {
          throw new Error("Session ID is missing in the route.");
        }
        setLoading(true);
        const data = await getFlashcardsBySession(sessionId);
        if (isMounted) setFlashcards(data);
      } catch (err) {
        console.error("Failed to load session:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadSession();
    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  return (
    <div className="h-full w-full">
      <Header />

      <div className="p-4">
        <BrandedText className="text-pink-500 text-4xl md:text-7xl mt-4">
          Session Recap
        </BrandedText>
      </div>

      {/* Animated loader */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex items-center justify-center h-48 mt-16 max-w-sm text-white bg-pink-500 mx-auto"
            style={{
              boxShadow: "12px 12px 0 #000000",
            }}
          >
            <Loader />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              delay: 0.2,
              duration: 0.6,
              ease: "easeOut",
              staggerChildren: 0.05,
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 gap-6"
          >
            {flashCards?.map((flashcard: FlashcardType, idx: number) => (
              <motion.div
                // @ts-expect-error - comes from db
                key={flashcard.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3 + idx * 0.05,
                  duration: 0.4,
                  ease: "easeOut",
                }}
                className="relative"
              >
                <Flashcard
                  questionNumber={flashcard.questionNumber}
                  question={flashcard.question}
                  answer={flashcard.answer}
                  isActive
                  isReview
                  wasCorrect={flashcard.isCorrect}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
