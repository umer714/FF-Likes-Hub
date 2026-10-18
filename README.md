# Mindora — Learn Smarter. Go Further.

Mindora is an AI-powered study and notes platform in development. The responsive landing page is available; the first server-side AI study endpoint has now been added.

## Current capabilities
- [x] Mindora landing page
- [x] Lightweight backend health endpoint
- [x] Shared API response helpers
- [x] AI study endpoint for summaries, simple explanations, quizzes, and flashcards
- [x] Status endpoint reports whether the AI key is configured
- [ ] Connect and verify a real provider key in the deployment environment
- [ ] Connect the homepage forms to the study endpoint
- [ ] PDF text extraction and document study
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

### Configure in Vercel
1. Open the Mindora project in Vercel.
2. Go to Project Settings → Environment Variables.
3. Add `OPENAI_API_KEY` with your provider key as the value. Do not send the key in chat or place it in this repository.
4. Optionally add `OPENAI_MODEL`.
5. Redeploy the project, then test `/api/status` and `POST /api/study`.

AI usage may incur provider charges. Review your provider's pricing and usage limits before enabling it publicly.

## Important status
The AI backend code is implemented, but it is **not confirmed live or usable until a valid key is configured and the deployment is tested**. The homepage has not yet been connected to the new endpoint. PDF processing, accounts, database persistence, and billing are still planned.

## Development notes
This repository was originally used for a Free Fire project and is being converted in stages. Some legacy files may remain until they can be safely reviewed and removed. Never commit API keys, credentials, or environment files. Validate user input and uploaded files before processing.
