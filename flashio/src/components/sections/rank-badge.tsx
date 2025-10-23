"use clien";
import { getUserLevel } from "@/lib/utils";
import Image from "next/image";
import BrandedText from "../ui/branded-text";
import RayColorProvider from "../providers/ray-color-provider";
import { useEffect, useState } from "react";

type Sparkle = { id: number; x: number; y: number };

export default function RankBadge({ xp }: { xp: number }) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const userLevel = getUserLevel(xp);
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

  useEffect(() => {
    let idCounter = 0;

    const interval = setInterval(() => {
      setSparkles((prev) => {
        const newSparkles = [...prev];

        const sparklesToAdd = Math.min(
          3 - newSparkles.length,
          Math.floor(Math.random() * 2) + 1
        );

        for (let i = 0; i < sparklesToAdd; i++) {
          const x = Math.random() * 80 + 10;
          const y = Math.random() * 80 + 10;
          const id = idCounter++;
          newSparkles.push({ id, x, y });

          setTimeout(() => {
            setSparkles((s) => s.filter((sp) => sp.id !== id));
          }, 2000);
        }

        return newSparkles;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <RayColorProvider rayColor={rayColor} />
      <div className="relative flex items-center justify-center -mx-4 h-[30dvh]">
        <div className="absolute inset-0 flex items-center justify-center z-0 bg-white/40 rounded-full blur-2xl  max-h-full aspect-square mx-auto">
          {/* Sparkle effect, I will add a svg later so just show a div for now */}
          {sparkles.map((sparkle) => (
            <div
              key={sparkle.id}
              className="absolute bg-white"
              style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
            ></div>
          ))}
        </div>

        <Image
          className="absolute object-contain "
          src={`/images/${rankImage}`}
          alt=""
          fill
        />
      </div>
      <BrandedText
        className="text-4xl text-center brightness-50"
        style={{ color: rayColor }}
      >
        XP: {xp}
      </BrandedText>
    </>
  );
}
