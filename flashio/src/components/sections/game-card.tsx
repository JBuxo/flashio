interface GameCardProps {
  title: string;
  description: string;
  reward: number;
  backgroundColors: string[];
  isLocked: boolean;
}

export default function GameCard({ ...props }: GameCardProps) {
  if (
    props.backgroundColors.length > 2 ||
    props.backgroundColors.length === 1
  ) {
    throw new Error("Use exactly 2 colors for GameCard background");
  }

  return (
    <div className="p-4 h-full w-full">
      <h1>{props.title}</h1>
      <div>{props.description}</div>
      <div>{props.reward}</div>
    </div>
  );
}
