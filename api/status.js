import { sendError, sendSuccess } from "../lib/api-response.js";

// Public, non-sensitive status endpoint for the Mindora frontend.
export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return sendError(res, 405, "Method not allowed.", "METHOD_NOT_ALLOWED");
  }

  return sendSuccess(res, {
    service: "Mindora",
    status: "ready",
    features: {
      notesSummarizer: "coming_soon",
      quizGenerator: "coming_soon",
      flashcards: "coming_soon",
      pdfAssistant: "coming_soon"
    },
    aiConfigured: Boolean(process.env.OPENAI_API_KEY)
  });
}
