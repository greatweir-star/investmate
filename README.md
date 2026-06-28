# InvestMate

> AI Investment Copilot — every investment decision deserves a second opinion.

InvestMate is an AI-native investment decision support system. It does **not** replace investors, does **not** promise returns, and does **not** execute trades. Its first-stage mission is to help individual investors make clearer, calmer, evidence-based investment decisions.

## Product Positioning

InvestMate is positioned as an **AI Investment Copilot**:

- It helps users think before they trade.
- It provides transparent second opinions.
- It evaluates decisions against market conditions, portfolio risk, and the user's Investment DNA.
- It reduces impulsive trading, over-concentration, and decision anxiety.

The core product question is:

> Before I buy, sell, add, reduce, or hold — what should I consider?

## First Principle

InvestMate does not make decisions for users. It provides transparent, verifiable, risk-aware decision support. The final decision always belongs to the user.

## MVP Scope

The first version focuses on four user jobs:

1. **Daily Decision** — What is today's market state and suggested exposure range?
2. **Second Opinion** — Should I buy/sell/hold a specific asset?
3. **Portfolio Review** — Is my current portfolio balanced and aligned with my risk profile?
4. **Decision History** — What did the AI suggest before, and what happened afterward?

## Repository Structure

```text
investmate/
├── README.md
├── VISION.md
├── PRINCIPLES.md
├── ROADMAP.md
├── CHANGELOG.md
├── docs/
├── specs/
├── prompts/
└── tasks/
```

## Suggested Tech Direction

- Frontend: Next.js / React
- Backend: FastAPI or Next.js API routes
- Database: PostgreSQL
- Data Source: Tushare Pro first
- AI Layer: LLM orchestration with structured prompts and JSON outputs
- Deployment: Vercel + managed Postgres, or Docker-based single-server deployment

## Disclaimer

InvestMate is an investment decision support and educational analysis tool. It is not a licensed investment advisor, broker, asset manager, or trading system. Any output should be treated as informational support, not financial advice or guaranteed recommendation.
