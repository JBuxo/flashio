"use client";

import Header from "@/components/sections/header";
import BrandedText from "@/components/ui/branded-text";
import { getAllSessionsForUser } from "@/supabase/game/game-session";
import { useEffect, useState } from "react";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[] | null>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);

    getAllSessionsForUser().then((sessions) => {
      setSessions(sessions);
    });

    setLoading(false);
  }, []);

  return (
    <div
      className={`flex items-center justify-center h-[100dvh]`}
      //   style={{ backgroundColor: `oklch(0.8703 0.1524 84.08)` }}
    >
      <div className="h-full w-full">
        <Header />
        <div className="p-4">
          <BrandedText className="text-pink-500 text-4xl">
            Your Sessions
          </BrandedText>

          {loading && <p className="text-white mt-4">Loading sessions...</p>}

          {!loading && (
            <div>
              {sessions && sessions.length > 0 ? (
                <ul className="mt-4 grid gap-8 md:grid-cols-2 lg:grid-cols-3 pr-4">
                  {sessions.map((session) => (
                    <li key={session.id}>
                      <div
                        className="bg-white min-h-64 p-4"
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
                        </p>{" "}
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          Session ID: {session.id}
                        </div>
                        <div className="mt-6 font-semibold mb-2">Rewards</div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-gray-200 min-h-24">
                            Clever Shards
                          </div>
                          <div className="bg-gray-200 min-h-24">XP</div>
                          <div className="bg-gray-200 min-h-24">Correct</div>
                          <div className="bg-gray-200 min-h-24">Wrong</div>
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
