import { levelOrder, thresholds } from "@/components/sections/game-card";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserLevel(points: number): (typeof levelOrder)[number] {
  if (points < thresholds.intermediate) return "beginner";
  if (points < thresholds.pro) return "intermediate";
  if (points < thresholds.goat) return "pro";
  return "goat";
}
