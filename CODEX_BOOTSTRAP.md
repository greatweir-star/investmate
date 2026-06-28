# CODEX BOOTSTRAP TASK

## Goal

Build the first working InvestMate MVP based on this repository's Markdown specs.

## Recommended Stack

Use one of the following:

### Option A — Fullstack Next.js

- Next.js App Router
- TypeScript
- Tailwind CSS
- PostgreSQL / Prisma
- API routes for backend

### Option B — Python Backend + Simple Frontend

- FastAPI
- PostgreSQL / SQLAlchemy
- React / Next.js frontend

For fastest MVP, Option A is recommended.

## Build Tasks

1. Initialize project structure.
2. Create database schema based on `specs/DATABASE.md`.
3. Implement Investment DNA onboarding.
4. Implement Daily Decision page with mock data first.
5. Implement Second Opinion form and structured output.
6. Implement Portfolio Review form.
7. Implement Decision History page.
8. Add disclaimer and compliance copy globally.
9. Keep AI calls modular so prompts can be replaced.

## Important Product Rules

- Do not build trading execution.
- Do not build broker integration.
- Do not make guaranteed recommendation language.
- Store all decisions for traceability.
- Use structured JSON for AI outputs.

## Initial Pages

- `/onboarding`
- `/`
- `/second-opinion`
- `/portfolio`
- `/history`

## Deliverable

A runnable local MVP with mocked data and placeholder AI provider interface.
