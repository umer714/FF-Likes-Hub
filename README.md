# Mindora — Learn Smarter. Go Further.

Mindora is an AI-powered study and notes platform in development. The responsive landing page, text-based AI study workspace, and PDF study workflow have been added. Live functionality still depends on deployment and server-side API configuration.

## Current capabilities
- [x] Mindora landing page
- [x] Lightweight backend health endpoint
- [x] Shared API response helpers
- [x] AI study endpoint for summaries, simple explanations, quizzes, and flashcards
- [x] Status endpoint reports whether the AI key is configured
- [ ] Connect and verify a real provider key in the deployment environment
- [x] Connect the homepage study form to the study endpoint
- [x] PDF text extraction and document study (text-based PDFs up to 1.5 MB; scanned/image-only PDFs are not supported yet)
- [ ] Accounts, saved notes, progress tracking, and study plans
- [ ] Free/premium limits and billing

## AI endpoint

Endpoint: `POST /api/study`

JSON body example:

```json
{
  "task": "summarize",
  "text": "Paste your study notes here."
}
```

Supported `task` values: `summarize`, `explain`, `quiz`, `flashcards`.

The endpoint accepts up to 12,000 characters of text. It requires the server-side `OPENAI_API_KEY` environment variable. Optionally set `OPENAI_MODEL` to select an available model; the default is `gpt-4.1-mini`. Never put provider keys in frontend code or commit them to GitHub.

### PDF study endpoint\n\nEndpoint: `POST /api/pdf-study`\n\nJSON body fields: `filename` (must end in `.pdf`) and `base64` (the PDF file encoded as base64). The endpoint validates the PDF signature, limits uploads to 1.5 MB, extracts selectable text, and creates a study guide with key concepts, definitions, and revision questions. Extracted text is capped at 12,000 characters. Scanned/image-only PDFs are not supported yet. The endpoint uses the same server-side `OPENAI_API_KEY` and optional `OPENAI_MODEL` settings.\n\n## Configure in Vercel
1. Open the Mindora project in Vercel.
2. Go to Project Settings → Environment Variables.
3. Add `OPENAI_API_KEY` with your provider key as the value. Do not send the key in chat or place it in this repository.
4. Optionally add `OPENAI_MODEL`.
5. Redeploy the project, then test `/api/status` and `POST /api/study`.

AI usage may incur provider charges. Review your provider's pricing and usage limits before enabling it publicly.

## Important status
The AI backend code and homepage forms are implemented, but they are **not confirmed live or usable until a valid key is configured and the deployment is tested**. PDF extraction currently supports selectable text only; OCR, accounts, database persistence, and billing are not implemented.

## Development notes
This repository was originally used for a Free Fire project and is being converted in stages. Some legacy files may remain until they can be safely reviewed and removed. Never commit API keys, credentials, or environment files. Validate user input and uploaded files before processing.
