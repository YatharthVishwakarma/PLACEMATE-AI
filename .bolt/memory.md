# Project memory

## Product intent & audience

- **PlaceMate AI**: job/interview preparation platform.
- Core features: Dashboard, DSA Tracker, Mock Interview, Resume AI review.
- Target users: job seekers preparing for technical interviews and placements.

## Brand personality & voice

- Name implies a supportive companion for placement success.
- No copy/voice details inferred yet.

## Visual design & UX direction

- Stack: React + Vite, JSX, Tailwind CSS, shadcn/ui, Lucide React icons.
- No specific aesthetic, color, typography, or layout decisions inferred yet beyond component-library defaults.

## Decisions, constraints & rationale

- **Frontend-only architecture** — no backend, no server code, no edge functions.
- Data persistence uses browser **local storage** only.
- **No external APIs or AI services integrated** — all features run on hard-coded demo/sample data.
- Supabase client library is installed as a dependency but **never used** (dormant; no tables configured).
- README contains placeholder text for API integration, confirming it was never completed.
- No environment variables are referenced in any source file.

## Open questions & assumptions

- Whether and when to wire real AI services for mock interview and resume review (provider not yet chosen — Gemini, OpenAI, etc.).
- Whether to activate Supabase for backend/data persistence or remove the unused dependency.
- Whether a backend or edge-function layer will be needed for secure API key handling once real integrations begin.