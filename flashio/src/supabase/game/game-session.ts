import { Flashcard } from "@/app/stores/flashcard-store";
import { supabase } from "../client";

export async function createGameSession(
  userId: string,
  pack:
    | "review"
    | "basic"
    | "apprentice"
    | "advanced"
    | "elite"
    | "mythic"
    | "legendary"
) {
  const { data: session, error } = await supabase
    .from("sessions")
    .insert({ user_id: userId, pack: pack })
    .select()
    .single();

  if (error) throw new Error(error.message, {});
  return session;
}
export async function insertFlashcardsToSession(
  sessionId: string,
  flashcards: Flashcard[]
) {
  const cardsToInsert = flashcards.map((card) => ({
    session_id: sessionId,
    question: card.question,
    answer: card.answer,
    is_correct: card.isCorrect,
    question_number: card.questionNumber,
  }));

  const { data, error } = await supabase
    .from("flashcards")
    .insert(cardsToInsert);

  if (error) throw new Error(error.message, {});
  return data;
}

export async function getFlashcardsBySession(sessionId: string) {
  const { data, error } = await supabase
    .from("flashcards")
    .select("*")
    .eq("session_id", sessionId);

  if (error) throw new Error(error.message, {});
  return data;
}

export async function submitAnswers(
  answers: { id: string; user_answer: string; is_correct: boolean }[]
) {
  const { data, error } = await supabase
    .from("flashcards")
    .upsert(answers, { onConflict: "id" });
  if (error) throw new Error(error.message, {});
  return data;
}
