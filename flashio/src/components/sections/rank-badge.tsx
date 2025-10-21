import { getUserLevel } from "@/lib/utils";
import { thresholds } from "./game-card";

export default function RankBadge({ xp }: { xp: number }) {
  const userLevel = getUserLevel(xp);
  return <div>{userLevel}</div>;
}
