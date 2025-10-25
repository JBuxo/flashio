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
import { motion } from "motion/react";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  // let xp = 0;
  const [xp, setXp] = useState<number>(3000);
  const view = useViewStore((state) => state.view);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <div className="h-[100dvh] flex flex-col pt-0">
      <div className="flex justify-between items-center h-16 px-4">
        <BrandedText className="text-4xl " color="text-pink-500">
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
            <div className="ml-1 font-semibold">1234</div>
          </div>

          <div className="rounded-sm bg-accent p-1 size-10 aspect-square flex items-center justify-center">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {view === "dashboard" && <Dashboard xp={xp} />}
      {view === "unboxing" && <UnboxingOverlay />}
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
    </div>
  );
}
