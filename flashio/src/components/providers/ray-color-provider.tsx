"use cleint";

import { useLayoutEffect } from "react";

export default function RayColorProvider({ rayColor }: { rayColor: string }) {
  useLayoutEffect(() => {
    document.documentElement.style.setProperty("--ray-color", rayColor);
  }, [rayColor]);
  return null;
}
