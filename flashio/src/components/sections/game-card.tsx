interface GameCardProps {
  title: string;
  description: string;
  reward: number;
  backgroundColors: string;
  isLocked: boolean;
}

export default function GameCard({ ...props }: GameCardProps) {
  return (
    <div className="h-full w-full rounded-xl overflow-hidden flex flex-col">
      <h1>{props.title}</h1>
      <div>{props.description}</div>
      <div>{props.reward}</div>
    </div>
  );
}
