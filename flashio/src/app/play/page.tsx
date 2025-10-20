import { Suspense } from "react";
import PlayClient from "./playClient";

export default function Playpage() {
  return (
    <Suspense fallback={"loading..."}>
      <PlayClient />
    </Suspense>
  );
}
