import { motion } from "framer-motion";
import BrandedText from "./branded-text";

const LoadingFlashCards = () => {
  const cards = [0, 1, 2];

  return (
    <div className="flex gap-2">
      {cards.map((card) => (
        <motion.div
          key={card}
          className="size-4 bg-white "
          initial={{ rotateY: 0, y: 0, opacity: 0.3 }}
          animate={{
            rotateY: [0, 180, 0],
            y: [0, -10, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 0.5,
            delay: card * 0.9,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default function Loader() {
  return (
    <div className="flex items-center flex-col gap-8">
      <BrandedText className="text-5xl tracking-wider">Loading</BrandedText>
      <LoadingFlashCards />
    </div>
  );
}
