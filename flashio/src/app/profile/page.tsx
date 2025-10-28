"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/supabase/client";
import Header from "@/components/sections/header";

export default function MyComponent() {
  const [sessions, setSessions] = useState<any[]>([]); // state for sessions
  const [loading, setLoading] = useState(true);

  useEffect(() => {}, []); // empty dependency array = run once on mount

  if (loading) return <div>Loading sessions...</div>;
  return (
    <div
      className={`flex items-center justify-center h-[100dvh]`}
      style={{ backgroundColor: `oklch(0.8703 0.1524 84.08)` }}
    >
      <div className="h-full w-full">
        <Header />
        <div className="p-4">
          <div>Your Profile</div>
        </div>
      </div>
    </div>
  );
}
