import { GamePackProps } from "@/components/sections/game-pack";
import { create } from "zustand";

export type View = "dashboard" | "unboxing" | "quiz";

export type ViewStore = {
  view: View;
  selectedPack: GamePackProps | null;
  packConfirmed: boolean;
  flashActive: boolean;
  setFlashActive: (value: boolean) => void;
  switchView: (view: View) => void;
  selectPack: (pack: GamePackProps | null) => void;
  confirmPack: () => void;
};

export const useViewStore = create<ViewStore>((set) => ({
  view: "dashboard",
  selectedPack: null,
  packConfirmed: false,
  flashActive: false,
  setFlashActive: (value) => set({ flashActive: value }),
  switchView: (view) => set({ view }),
  selectPack: (pack) =>
    set({
      selectedPack: pack,
      view: pack ? "unboxing" : "dashboard",
      packConfirmed: false,
    }),
  confirmPack: () => set({ packConfirmed: true }),
}));
