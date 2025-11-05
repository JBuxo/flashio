"use client";

import UnboxingOverlay from "@/components/views/unboxing-overlay";
import QuizComponent from "@/components/views/quiz-component";
import Dashboard from "@/components/views/dashboard";
import { useViewStore } from "../stores/view-store";
import { AnimatePresence, motion } from "motion/react";
import { useUserStore } from "../stores/user-store";
import Loader from "@/components/ui/loader";
import Header from "@/components/sections/header";

export default function Home() {
  const { userXp, loading, authUser } = useUserStore();
  const view = useViewStore((state) => state.view);

  if (loading || !authUser) {
    return (
      <AnimatePresence>
        <motion.div
          key={"loading"}
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

  return (
    <div className="h-[100dvh] flex flex-col pt-0">
      <Header />

      <AnimatePresence>
        <motion.div
          key={"dashboard"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {view === "dashboard" && <Dashboard xp={userXp} />}
        </motion.div>

        <motion.div
          key={"unboxing"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {view === "unboxing" && <UnboxingOverlay />}
        </motion.div>
        {view === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <QuizComponent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
