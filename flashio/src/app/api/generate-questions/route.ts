import { Flashcard } from "@/app/stores/flashcard-store";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { level } = body;

    const difficultyDescriptions = {
      spark: "very easy, general knowledge questions anyone can answer",
      seeker: "easy trivia with simple reasoning",
      scholar: "moderate, requires some background knowledge",
      thinker: "challenging, less common facts or logic needed",
      mastermind: "hard, niche or multi-step reasoning questions",
      sage: "expert-level, specialized domain knowledge",
    } as const;

    if (!(level in difficultyDescriptions)) {
      return new Response(JSON.stringify({ error: "Invalid level provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = `
      Generate 10 trivia questions at the "${level}" level.
      "${level}" means: ${
      difficultyDescriptions[level as keyof typeof difficultyDescriptions]
    }.
      
      Respond ONLY with valid JSON (no explanations, no markdown).
      Format:
      [
        { "question": "string", "answer": "string" }
      ]
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const text = response.choices[0]?.message?.content?.trim();
    if (!text) throw new Error("No response from OpenAI");

    // --- Robust JSON extraction & parsing ---
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonText = codeBlockMatch ? codeBlockMatch[1] : text;

    let questions: Partial<Flashcard>[] = [];

    try {
      questions = JSON.parse(jsonText);
    } catch {
      try {
        const cleaned = jsonText.replace(/,\s*]/g, "]").replace(/,\s*}/g, "}");
        questions = JSON.parse(cleaned);
      } catch {
        console.error("Invalid JSON from OpenAI:", text);
        throw new Error("Failed to parse OpenAI JSON");
      }
    }

    const flashcards = questions.map((q: Partial<Flashcard>, i: number) => ({
      questionNumber: i + 1,
      question: q.question,
      answer: q.answer,
      level,
    }));

    return new Response(JSON.stringify(flashcards), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error generating flashcards:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate trivia" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Generate mock/test flashcards
export async function GET(_request: Request) {
  try {
    const flashcards: Flashcard[] = [
      {
        questionNumber: 1,
        question: "What is the capital of France?",
        answer: "Paris",
      },
      {
        questionNumber: 2,
        question: "What is 5 + 7?",
        answer: "12",
      },
      {
        questionNumber: 3,
        question: "Who wrote 'To Kill a Mockingbird'?",
        answer: "Harper Lee",
      },
      {
        questionNumber: 4,
        question: "What is the chemical symbol for water?",
        answer: "H₂O",
      },
      {
        questionNumber: 5,
        question: "What year did the first iPhone release?",
        answer: "2007",
      },
    ];

    return new Response(JSON.stringify(flashcards), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error generating test flashcards:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate test data" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
