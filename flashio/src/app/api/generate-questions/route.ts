import { Flashcard } from "@/app/stores/flashcard-store";

// Generate FlashcardQuestions
export async function POST(request: Request) {
  try {
    // get questions from OPENAI
    const body = await request.json();
    const { questions } = body;

    // Safety Check
    if (!Array.isArray(questions) || questions.length === 0) {
      return new Response(JSON.stringify({ error: "No Questions Generated" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Mold into flashcard type
    const flashcards: Flashcard[] = questions.map((card, index) => ({
      questionNumber: index + 1,
      question: card.question || "",
      answer: card.answer || "",
    }));

    // Return Flashcards
    return new Response(JSON.stringify(flashcards), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    //   Catch Block
    console.log("Error processing flashcards: ", err);
    return new Response(JSON.stringify({ error: "Failed to process" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Generate mock/test flashcards
export async function GET(request: Request) {
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
