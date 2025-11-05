"use client";

import Header from "@/components/sections/header";
import BrandedText from "@/components/ui/branded-text";
import { AnimatePresence, motion } from "motion/react";
import { supabaseClient } from "@/supabase/client";
import { useEffect, useState } from "react";
import Loader from "@/components/ui/loader";
import { User } from "@supabase/supabase-js";
import { getUserStats, UserStats } from "@/supabase/game/game-session";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { BarChart3, Brain, Clock, Star, Target, UserXIcon } from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabaseClient.auth.getUser();
        if (error) throw new Error(error.message);
        const userData = data.user ?? null;
        setUser(userData);

        if (userData) {
          const statsData = await getUserStats();
          setStats(statsData);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  async function handleDeleteAccount() {
    const confirmed = confirm(
      "Are you sure you want to permanently delete your account? This cannot be undone."
    );
    if (!confirmed) return;

    const res = await fetch("/api/delete-user", { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      alert(`Failed to delete account: ${data.error}`);
    } else {
      alert("Your account and all data were deleted successfully.");
      // Optionally redirect to homepage or logout
      window.location.href = "/auth/get-authed";
    }
  }

  return (
    <div className={`flex items-center justify-center h-[100dvh]`}>
      <div className="h-full w-full">
        <Header />
        <div className="p-4">
          <BrandedText className="text-pink-500 text-4xl md:text-7xl max-w-2xl mx-auto">
            Your Profile
          </BrandedText>

          <AnimatePresence mode="wait">
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

            {!loading && (
              <div
                className={`mt-8 flex flex-col items-start justify-start gap-4 p-6 bg-white min-h-96 max-w-2xl mx-auto border-black shadow-[4px_4px_0_rgba(0,0,0,1)]`}
              >
                <div>
                  <div className="text-xl font-semibold">Signed In As</div>
                  <div>{user?.email}</div>
                </div>

                <div className="w-full">
                  <div className="text-xl font-semibold">Stats</div>
                  {stats ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      <div className="flex items-center gap-3  bg-muted p-3">
                        <BarChart3 className="text-blue-500" />
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Sessions
                          </div>
                          <div className="text-lg font-semibold">
                            {stats.totalSessions}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3  bg-muted p-3">
                        <Brain className="text-purple-500" />
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Answered
                          </div>
                          <div className="text-lg font-semibold">
                            {stats.totalAnswered}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3  bg-muted p-3">
                        <Target className="text-green-500" />
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Correct
                          </div>
                          <div className="text-lg font-semibold">
                            {stats.totalCorrect}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3  bg-muted p-3">
                        <Star className="text-yellow-500" />
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Accuracy
                          </div>
                          <div className="text-lg font-semibold">
                            {stats.accuracy.toFixed(1)}%
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3  bg-muted p-3">
                        <BrandedText className="text-blue-600 text-2xl">
                          XP
                        </BrandedText>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Total XP
                          </div>
                          <div className="text-lg font-semibold">
                            {stats.totalXp}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3  bg-muted p-3">
                        {/* <Trophy className="text-pink-500" /> */}
                        <Image
                          src={"/images/clever-shard.png"}
                          alt={""}
                          height={32}
                          width={32}
                        />
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Clever Shards
                          </div>
                          <div className="text-lg font-semibold">
                            {stats.totalCleverShards}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3  bg-muted p-3 col-span-2 sm:col-span-3 ">
                        <Clock className="text-gray-500" />
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Last Session
                          </div>
                          <div className="text-lg font-semibold">
                            {stats.lastSession
                              ? new Date(stats.lastSession).toLocaleString()
                              : "—"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>No stats available yet.</div>
                  )}
                </div>

                <Button
                  className="rounded-none lg:hover:shadow-[4px_4px_0_rgba(0,0,0,1)] border-3 border-black text-black flex-1 bg-red-500 hover:bg-red-400"
                  onClick={handleDeleteAccount}
                >
                  Delete Account <UserXIcon />
                </Button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
