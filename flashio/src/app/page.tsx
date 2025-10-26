"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";
import { User } from "@supabase/supabase-js";
import BrandedText from "@/components/ui/branded-text";
import Image from "next/image";
import UnboxingOverlay from "@/components/views/unboxing-overlay";
import QuizComponent from "@/components/views/quiz-component";
import Dashboard from "@/components/views/dashboard";
import { useViewStore } from "./stores/view-store";
import { AnimatePresence, motion } from "motion/react";
import { useUserStore } from "./stores/user-store";
import Loader from "@/components/ui/loader";

export default function Home() {
  const { authUser, userXp, userCleverShards, loading, initAuthListener } =
    useUserStore();
  const view = useViewStore((state) => state.view);

  useEffect(() => {
    const unsubscribe = initAuthListener();
    return () => unsubscribe?.();
  }, [initAuthListener]);

  if (!loading) {
    return (
      <AnimatePresence>
        <motion.div
          key={"dashboard"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center justify-center h-[100dvh] text-white bg-pink-500"
        >
          <Loader />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col pt-0">
      <div className="flex justify-between items-center h-14 mt-2 mx-4 px-2 rounded-lg bg-black/50">
        <BrandedText
          className="text-4xl brightness-200"
          style={{ color: "var(--ray-color" }}
        >
          Flashio
        </BrandedText>

        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Image
              src={`/images/clever-shard.png`}
              alt=""
              height={32}
              width={32}
            />
            <div className="ml-1 font-semibold text-white">
              {userCleverShards}
            </div>
          </div>

          <div className="rounded-sm bg-accent p-1 size-10 aspect-square flex items-center justify-center">
            {authUser?.email?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

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
