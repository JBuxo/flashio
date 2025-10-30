import { Flashcard } from "@/app/stores/flashcard-store";
import { supabaseClient } from "../client";
import { getAllSessionsForUser, getFlashcardsBySession } from "./game-session";

export async function getFlashcardsForReview() {
  const { data, error } = await supabaseClient.auth.getUser();
  if (error) throw new Error("Error fetching user:", { cause: error });

  const user = data?.user;
  if (!user) throw new Error("No user found.");

  const sessions = await getAllSessionsForUser();
  if (!sessions || sessions.length === 0)
    throw new Error("No sessions found for user.");

  const flashcards = await Promise.all(
    sessions.map((session) => getFlashcardsBySession(session.id))
  );

  console.log("Flashcards for shuffling:", flashcards.flat().slice(0, 20));

  function getRandomFlashcards(flashcards: Flashcard[], count: number) {
    const shuffled = [...flashcards].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  const reviewFlashcards = getRandomFlashcards(flashcards.flat(), 10).map(
    (f, i) => ({
      ...f,
      questionNumber: f.questionNumber ?? i + 1,
    })
  );

  console.log("Review Flashcards:", reviewFlashcards);
  return reviewFlashcards;
}
