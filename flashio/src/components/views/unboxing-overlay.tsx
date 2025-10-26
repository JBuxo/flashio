import { useEffect, useState } from "react";
import { useViewStore } from "@/app/stores/view-store";
import GamePack from "../sections/game-pack";
import BrandedText from "../ui/branded-text";
import { motion } from "motion/react";

export default function UnboxingOverlay() {
  const pack = useViewStore((state) => state.selectedPack);
  const packConfirmed = useViewStore((state) => state.packConfirmed);
  const switchView = useViewStore((state) => state.switchView);
  const setFlashActive = useViewStore((state) => state.setFlashActive);
  const [animatePack, setAnimatePack] = useState(false);

  useEffect(() => {
    if (packConfirmed) {
      setAnimatePack(true);
      const flashTimeout = setTimeout(() => {
        setFlashActive(true);
        switchView("quiz");
      }, 1500);
      return () => clearTimeout(flashTimeout);
    }
  }, [packConfirmed, setFlashActive, switchView]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative">
        <BrandedText className="text-5xl text-center" color="text-pink-400">
          Pack Purchase
        </BrandedText>

        <div className="max-w-84 mt-4">
          {pack ? (
            <motion.div
              animate={
                animatePack
                  ? {
                      rotate: [0, 1440],
                      y: [0, -140, 0, 1000],
                    }
                  : { rotate: 0, y: 0 }
              }
              transition={{
                duration: 1.5,
                ease: ["easeOut", "easeInOut", "easeIn"],
              }}
              className="relative"
            >
              <GamePack
                pack_type={pack.pack_type}
                title={pack.title}
                description={pack.description}
                reward_clevershard={pack.reward_clevershard}
                reward_xp={pack.reward_xp}
                backgroundColor={pack.backgroundColor}
                cost={pack.cost}
                level={pack.level}
              />
            </motion.div>
          ) : (
            "Something Went Wrong"
          )}
        </div>
      </div>
    </div>
  );
}
