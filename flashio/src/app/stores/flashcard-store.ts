import { create } from "zustand";

export type Flashcard = {
  questionNumber: number;
  question: string;
  answer: string;
  isCorrect?: boolean;
};

export type FlashcardStore = {
  gameSession: string | undefined;
  flashcards: Flashcard[];
  setGameSession: (gameSession: string) => void;
  setFlashcards: (flashcards: Flashcard[]) => void;
  markAnswer: (questionNumber: number, isCorrect: boolean) => void;
  getResults: () => Flashcard[];
  reset: () => void;
};

export const useFlashcardStore = create<FlashcardStore>((set, get) => ({
  gameSession: undefined,
  flashcards: [],
  setFlashcards: (flashcards) => set({ flashcards }),
  markAnswer: (questionNumber, isCorrect) => {
    const updated = get().flashcards.map((card) =>
      card.questionNumber === questionNumber ? { ...card, isCorrect } : card
    );
    set({ flashcards: updated });
  },
  getResults: () => get().flashcards,
  reset: () => set({ flashcards: [] }),
  setGameSession: (gameSession) => set({ gameSession }),
}));
