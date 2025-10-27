"use clien";
import { getUserLevel } from "@/lib/utils";
import Image from "next/image";
import RayColorProvider from "../providers/ray-color-provider";
import { levelOrder, ranks } from "./game-pack";
import BrandedText from "../ui/branded-text";

const rankImages: Record<(typeof levelOrder)[number], string> = {
  spark: "spark-gem.png",
  seeker: "seeker-gem.png",
  scholar: "scholar-gem.png",
  thinker: "thinker-gem.png",
  mastermind: "mastermind-gem.png",
  sage: "sage-gem.png",
};

export default function RankBadge({ xp }: { xp: number }) {
  const userLevel = getUserLevel(xp);
  const currentIndex = levelOrder.indexOf(userLevel);
  const nextLevel = levelOrder[currentIndex + 1];
  const nextRankImage = nextLevel
    ? rankImages[nextLevel]
    : rankImages[userLevel];
  const currentXP = ranks[userLevel];
  const nextXP = nextLevel ? ranks[nextLevel] : currentXP + 1;
  const progress = ((xp - currentXP) / (nextXP - currentXP)) * 100;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  let rankImage;
  let rayColor;

  switch (userLevel) {
    case "spark":
      rankImage = "spark-gem.png";
      rayColor = "oklch(62.3% 0.35 259.815)";
      break;
    case "seeker":
      rankImage = "seeker-gem.png";
      rayColor = "oklch(70.4% 0.14 182.503)";
      break;
    case "scholar":
      rankImage = "scholar-gem.png";
      rayColor = "oklch(60.6% 0.25 292.717)";
      break;
    case "thinker":
      rankImage = "thinker-gem.png";
      rayColor = "oklch(0.8703 0.1524 84.08)";
      break;
    case "mastermind":
      rankImage = "mastermind-gem.png";
      rayColor = "oklch(69.6% 0.17 162.48)";
      break;
    case "sage":
      rankImage = "sage-gem.png";
      rayColor = "oklch(82.3% 0.12 346.018)";
      break;
  }

  return (
    <>
      <RayColorProvider rayColor={rayColor} />
      <div className="relative flex items-center justify-center -mx-4 h-[25dvh] select-none pointer-events-none">
        <div className="absolute inset-0 flex items-center justify-center z-0 bg-white/70 rounded-full blur-2xl  max-h-full aspect-square mx-auto" />

        <Image
          className="object-contain"
          src={`/images/${rankImage}`}
          alt=""
          fill
          loading="eager"
        />
      </div>
      <div className="flex flex-col items-center relative max-w-96 mx-auto">
        {xp <= 9999 && (
          <div className="flex items-center relative w-full">
            <Image
              className="absolute object-contain left-0"
              src={`/images/${rankImage}`}
              alt=""
              height={36}
              width={36}
            />
            <div className="bg-gray-200/80 w-full h-6 mx-auto my-4 overflow-hidden relative rounded-sm border-2 border-black max-w-64">
              <div
                className="absolute z-10 h-full transition-[width] duration-500 ease-out brightness-90 hue-rotate-90 rounded-r-sm"
                style={{
                  width: `${clampedProgress}%`,
                  backgroundColor: rayColor,
                }}
              />
            </div>
            <Image
              className="absolute object-contain right-0"
              src={`/images/${nextRankImage}`}
              alt=""
              height={36}
              width={36}
            />
          </div>
        )}

        {/* <div className="text-center text-sm text-black/70"></div> */}
        <BrandedText
          className="brightness-40 text-xl"
          style={{ color: "var(--ray-color" }}
        >
          {xp <= 9999 ? (
            <span>
              {xp} / {nextXP} XP
            </span>
          ) : (
            "MAX XP Reached"
          )}
        </BrandedText>
      </div>

      {/* <BrandedText
        className="text-4xl text-center brightness-50 select-none"
        style={{ color: rayColor }}
      >
        XP: {xp}
      </BrandedText> */}
    </>
  );
}
