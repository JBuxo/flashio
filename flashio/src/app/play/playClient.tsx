"use client";

import { useSearchParams } from "next/navigation";

export default function Playpage() {
  const searchParams = useSearchParams();
  const level = searchParams.get("level");
  return <div>you are playing {level} game </div>;
}
