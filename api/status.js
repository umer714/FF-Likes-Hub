import { sendError, sendSuccess } from "../lib/api-response.js";

// Public, non-sensitive status endpoint for the Mindora frontend.
export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return sendError(res, 405, "Method not allowed.", "METHOD_NOT_ALLOWED");
  }

  const configured = Boolean(process.env.OPENAI_API_KEY);

  return sendSuccess(res, {
    service: "Mindora",
    status: "ready",
    aiConfigured: configured,
    features: {
      notesSummarizer: configured ? "available" : "requires_api_key",
      simpleExplanation: configured ? "available" : "requires_api_key",
      quizGenerator: configured ? "available" : "requires_api_key",
      flashcards: configured ? "available" : "requires_api_key",
      pdfAssistant: configured ? "available" : "requires_api_key"
    }
  });
}
