import BrandedText from "../ui/branded-text";
import { GameSelector } from "../sections/game-selector";
import RankBadge from "../sections/rank-badge";

export default function Dashboard({ xp }: { xp: number }) {
  return (
    <>
      <div className="px-8">
        <RankBadge xp={xp} />
      </div>

      <div className=" flex flex-col flex-1">
        <div className="px-4 mb-2">
          <BrandedText
            className="text-4xl tracking-wider"
            color="text-pink-500"
          >
            Earn Points
          </BrandedText>
        </div>

        <GameSelector xp={xp} />
      </div>
    </>
  );
}
