"use client";
import { motion, AnimatePresence } from "motion/react";
import { useViewStore } from "@/app/stores/view-store";

export function RenderFlash() {
  const flash = useViewStore((state) => state.flashActive);

  return (
    <AnimatePresence>
      {flash && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-white pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        />
      )}
    </AnimatePresence>
  );
}
