import { Flashcard } from "@/app/stores/flashcard-store";
import { supabaseClient } from "../client";

export async function createGameSession(
  pack:
    | "review"
    | "basic"
    | "apprentice"
    | "advanced"
    | "elite"
    | "mythic"
    | "legendary"
) {
  // ✅ Get the logged-in user directly from Supabase auth
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser();

  if (userError || !user) throw new Error("User not authenticated");

  const { data: session, error } = await supabaseClient
    .from("sessions")
    .insert({
      user_id: user.id,
      pack,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
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

  const { data, error } = await supabaseClient
    .from("flashcards")
    .insert(cardsToInsert);

  if (error) throw new Error(error.message, {});
  return data;
}

export async function getFlashcardsBySession(sessionId: string) {
  const { data, error } = await supabaseClient
    .from("flashcards")
    .select("*")
    .eq("session_id", sessionId);

  if (error) throw new Error(error.message, {});
  return data;
}

export async function submitAnswers(
  answers: { id: string; user_answer: string; is_correct: boolean }[]
) {
  const { data, error } = await supabaseClient
    .from("flashcards")
    .upsert(answers, { onConflict: "id" });
  if (error) throw new Error(error.message, {});
  return data;
}

export async function getAllSessionsForUser() {
  const { data, error } = await supabaseClient.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  const user = data?.user;
  if (!user) {
    console.warn("No user found.");
    return null;
  }

  // Now you can fetch sessions for this user
  const { data: sessions, error: sessionsError } = await supabaseClient
    .from("sessions")
    .select("*")
    .eq("user_id", user.id);

  if (sessionsError) {
    console.error("Error fetching sessions:", sessionsError);
    return null;
  }

  return sessions;
}

export async function updateSessionRewards(
  sessionId: string,
  xpReward: number,
  cleverShardsReward: number
) {
  const { data, error } = await supabaseClient
    .from("sessions")
    .update({
      xp_rewarded: xpReward,
      clever_shards_rewarded: cleverShardsReward,
    })
    .eq("id", sessionId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
