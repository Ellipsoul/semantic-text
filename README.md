# Semantic Emphasis

Plain text in, the same text rendered back with a **variable font weight per
word** chosen by each word's **semantic importance**. Function words recede
(thin, muted); content words and named entities come forward (heavy, dark) — a
typographic view of a sentence's stress profile.

## How it works

1. The client tokenises the text (whitespace split, punctuation attached) — this
   array is the source of truth for rendering.
2. `POST /api/score` sends the tokens + full text to a model via the
   **Vercel AI Gateway** (`generateObject` + a Zod schema). The model echoes
   `{token, score}` per token; we validate the echo by index (tolerating
   punctuation/case normalisation) and fall back drifted words to `0.5`.
3. Each score maps to an Inter weight (200–800) and a monochrome ink lightness.
4. Every call is persisted to Neon Postgres for telemetry.

## Configuration

All tunable parameters live in [`lib/config.ts`](lib/config.ts): model,
`PROMPT_VERSION`, the scoring rubric, the weight range + contrast exponent, and
the input cap. Bump `PROMPT_VERSION` whenever the rubric changes so telemetry
stays comparable across versions.

## Local development

```bash
npm run dev
```

Environment (`.env.local`, gitignored):

- `DATABASE_URL` — Neon Postgres connection string (telemetry).
- `AI_GATEWAY_API_KEY` — Vercel AI Gateway key for real scoring.

Without `AI_GATEWAY_API_KEY`, the route falls back to a **heuristic mock scorer**
([`lib/mockScore.ts`](lib/mockScore.ts)) so the UI runs end-to-end with no paid
calls. The current model is `anthropic/claude-haiku-4.5` (free-tier eligible).

## Database

Apply the telemetry schema once:

```bash
node --env-file=.env.local scripts/migrate.mjs
```

Schema: [`db/schema.sql`](db/schema.sql). The `meta` JSONB column is the
no-migration extensibility seam for future research fields.

## Status

MVP: verified static slice with real scoring + telemetry. Deferred: weight-reveal
motion, a Vercel Firewall rate-limit rule, and production deploy.
