import { getUserLevel } from "@/lib/utils";
import Image from "next/image";
import BrandedText from "../ui/branded-text";

export default function RankBadge({ xp }: { xp: number }) {
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
    case "thinker": //broken
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
      {" "}
      <div className="relative flex items-center justify-center -mx-4 h-[30vh]">
        <div
          className="h-screen w-screen absolute -z-10"
          style={{
            background: `linear-gradient(to bottom, ${rayColor} 60%, var(--background) 80%)`,
          }}
        />
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
