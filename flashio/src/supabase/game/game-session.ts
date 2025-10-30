import { Flashcard } from "@/app/stores/flashcard-store";
import { supabaseClient } from "../client";

export interface UserStats {
  totalSessions: number;
  totalAnswered: number;
  totalCorrect: number;
  accuracy: number;
  totalXp: number;
  totalCleverShards: number;
  lastSession: Date | string;
}

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

export interface GameSession {
  id: string;
  user_id: string;
  pack:
    | "review"
    | "basic"
    | "apprentice"
    | "advanced"
    | "elite"
    | "mythic"
    | "legendary";
  xp_rewarded: number;
  clever_shards_rewarded: number;
  created_at: string | Date;
  updated_at?: string | Date;
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
  return data.map((card: any) => ({
    questionNumber: card.question_number,
    question: card.question,
    answer: card.answer,
    isCorrect: card.is_correct,
    id: card.id,
    sessionId: card.session_id,
  }));
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

export async function getUserStats() {
  // get user sessions
  const sessions = await getAllSessionsForUser();
  if (!sessions || sessions.length === 0) {
    return {
      totalSessions: 0,
      totalAnswered: 0,
      totalCorrect: 0,
      accuracy: 0,
      totalXp: 0,
      totalCleverShards: 0,
      lastSession: null,
    };
  }

  // get cards for each session
  const flashcardsArrays = await Promise.all(
    sessions.map((session) => getFlashcardsBySession(session.id))
  );

  // flatten
  const allFlashcards = flashcardsArrays.flat();

  // stats maths
  const totalAnswered = allFlashcards.length;
  const totalCorrect = allFlashcards.filter((f) => f.isCorrect).length;
  const accuracy = totalAnswered ? (totalCorrect / totalAnswered) * 100 : 0;

  const totalXp = sessions.reduce((sum, s) => sum + (s.xp_rewarded || 0), 0);
  const totalCleverShards = sessions.reduce(
    (sum, s) => sum + (s.clever_shards_rewarded || 0),
    0
  );
  const totalSessions = sessions.length;
  const lastSession =
    sessions.length > 0
      ? sessions.reduce(
          (latest, s) =>
            new Date(s.created_at) > new Date(latest.created_at) ? s : latest,
          sessions[0]
        ).created_at
      : null;

  // Step 4: Return clean summary
  return {
    totalSessions,
    totalAnswered,
    totalCorrect,
    accuracy,
    totalXp,
    totalCleverShards,
    lastSession,
  };
}
