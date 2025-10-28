"use client";

import Header from "@/components/sections/header";
import BrandedText from "@/components/ui/branded-text";
import { getAllSessionsForUser } from "@/supabase/game/game-session";
import { useEffect, useState } from "react";
import Image from "next/image";
import Loader from "@/components/ui/loader";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[] | null>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);

    getAllSessionsForUser().then((sessions) => {
      setSessions(sessions);
    });

    setLoading(false);
  }, []);

  const filteredSessions = sessions?.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div
      className={`flex items-center justify-center h-[100dvh]`}
      //   style={{ backgroundColor: `oklch(0.8703 0.1524 84.08)` }}
    >
      <div className="h-full w-full">
        <Header />
        <div className="p-4">
          <BrandedText className="text-pink-500 text-4xl md:text-7xl">
            Your Sessions
          </BrandedText>

          <AnimatePresence>
            {loading && (
              <motion.div
                key="loader"
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }} // smooth fade + slight shrink
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex items-center justify-center h-48 mt-16 max-w-sm text-white bg-pink-500 mx-auto"
                style={{
                  boxShadow: "12px 12px 0 #000000",
                }}
              >
                <Loader />
              </motion.div>
            )}
          </AnimatePresence>

          {!loading && (
            <div>
              {filteredSessions && filteredSessions.length > 0 ? (
                <ul className="mt-4 grid gap-8 md:grid-cols-2 lg:grid-cols-3 pr-4">
                  {filteredSessions.map((session) => (
                    <li key={session.id}>
                      <div
                        className="bg-white p-4 border-3 border-black "
                        style={{
                          boxShadow: "12px 12px 0px rgba(0,0,0,1)",
                        }}
                      >
                        <p className="font-semibold text-lg">
                          Session From{" "}
                          {new Date(session.created_at).toLocaleString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          Session ID: {session.id}
                        </div>
                        <div className="mt-6 font-semibold mb-2">Rewards</div>
                        <div className="space-y-4 grid grid-cols-2 ">
                          <div className="flex items-center">
                            <Image
                              src={"/images/clever-shard.png"}
                              alt={""}
                              height={32}
                              width={32}
                            />
                            <div className="ml-2">
                              X {session.clever_shards_rewarded}
                            </div>
                          </div>
                          <div className="flex items-center mb-auto">
                            <BrandedText className="text-2xl text-pink-500">
                              XP
                            </BrandedText>
                            <div className="ml-2">{session.xp_rewarded}</div>
                          </div>
                        </div>

                        <div className="sm:w-fit ml-auto w-full">
                          <Button className="rounded-none w-full lg:hover:shadow-[4px_4px_0_rgba(0,0,0,1)] border-3 border-black text-black flex-1 bg-pink-500 hover:bg-pink-400">
                            <Link href={`/sessions/${session.id}`}>
                              View Session
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-white">No sessions found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
