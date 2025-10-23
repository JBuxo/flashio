"use cleint";

import { useEffect } from "react";

export default function RayColorProvider({ rayColor }: { rayColor: string }) {
  useEffect(() => {
    document.documentElement.style.setProperty("--ray-color", rayColor);
  }, [rayColor]);
  return null;
}
