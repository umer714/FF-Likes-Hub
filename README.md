# Mindora — Learn Smarter. Go Further.

Mindora is an AI-powered study and notes platform in development. The current homepage is a responsive frontend preview; real AI processing, accounts, uploads, and saved study data are not yet connected.

## Product direction
- Organize study notes and generate summaries
- Create practice quizzes and MCQs
- Build flashcards from study material
- Explain difficult topics in simple language
- Assist with PDF study material
- Later: accounts, saved notes, progress tracking, study plans, and free/premium plans

## Current status
- [x] Mindora landing page
- [ ] Clean up legacy Free Fire API code and configuration
- [ ] Establish a minimal, reliable Mindora backend health endpoint
- [ ] Add secure AI service integration (server-side keys only)
- [ ] Add study tools one at a time and test each
- [ ] Add accounts and persistence after core tools are stable

## Development notes
This repository was originally used for a Free Fire project and is being converted in stages. Some legacy API files and dependencies may remain until they can be safely reviewed and removed. Do not assume the AI study features are functional until their implementation and tests are added.

## Safety and configuration
- Never commit API keys, credentials, or environment files.
- Keep AI provider secrets in deployment environment variables.
- Validate uploaded files and user input before processing.
