import { levelOrder, ranks } from "@/components/sections/game-pack";
import confetti from "canvas-confetti";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserLevel(xp: number): (typeof levelOrder)[number] {
  if (xp >= ranks.sage) return "sage";
  if (xp >= ranks.mastermind) return "mastermind";
  if (xp >= ranks.thinker) return "thinker";
  if (xp >= ranks.scholar) return "scholar";
  if (xp >= ranks.seeker) return "seeker";
  return "spark";
}

export function launchConfetti() {
  confetti({
    zIndex: 1,
    particleCount: 100,
    startVelocity: 30,
    spread: 360,
    origin: {
      x: Math.random(),
      y: Math.random() - 0.2,
    },
  });
}
