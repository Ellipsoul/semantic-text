# Semantic Emphasis

Plain text in, the same text rendered back with a **variable font weight per
word**, where each word's weight reflects **how much that word matters to the
meaning of the passage**. Load‑bearing words come forward (heavier, darker);
words a reader fills in automatically recede (lighter, thinner). The result is a
typographic view of a passage's *stress profile* — the way a thoughtful speaker
would emphasise it when reading aloud.

---

## Why this exists

Spoken language has a rich prosodic toolkit: we vary pitch, pace, loudness, and
pause to signal which words carry the information. **Written** language has
almost none of this. Typographic emphasis is coarse and binary — **bold,**
*italic*, <u>underline</u>, ALL CAPS — and none of it is graded or applied
automatically from what the text actually *means*.

A few ideas motivate the project:

- **Content vs. function words.** Content words (nouns, main verbs, adjectives)
  carry the semantic payload; function words (articles, prepositions, auxiliaries)
  are grammatical scaffolding. Dropping content words wrecks comprehension;
  dropping function words barely dents it.
- **Implicit prosody.** Even in *silent* reading, the brain generates an internal
  prosodic representation — assigning stress and rhythm. Typographic cues can
  reinforce or guide that inner voice.
- **Information is unevenly distributed.** Within any sentence, a few words do
  most of the work. This tool makes that distribution *visually legible*.

The deeper, more interesting claim: importance is **not** a property of a word's
part of speech — it's a property of the word **in this specific passage**. "The
committee met for three hours and **rejected** the proposal" — *rejected* is the
single most important word, even though *committee* and *proposal* are perfectly
good nouns, because it carries the outcome. Capturing that requires something
that understands the passage's *point*. That is the thing an LLM can do and a
1990s part‑of‑speech tagger fundamentally cannot.

---

## What it can be used for

- **Reading & comprehension aids** — guide the eye straight to the load‑bearing
  words; skim dense technical, legal, or academic prose faster.
- **Accessibility** — an additional, automatic emphasis channel (best paired with
  size/colour cues for low‑vision or dyslexic readers, not weight alone).
- **Language learning** — surface the words that carry meaning in unfamiliar text.
- **Information‑dense UI** — subtitles, dashboards, notifications where attention
  must be directed quickly.
- **"What matters here?" visualisation** — a glanceable preview of a passage's
  key content, adjacent to summarisation.
- **A research instrument** — every call is logged with its prompt version, so the
  scoring itself can be studied: how does importance shift with context? Where do
  *statistically surprising* and *actually meaningful* diverge?

---

## The scoring strategies we implemented

The system deliberately climbs from "what part of speech is this word" to "how
much does this word matter to the meaning here."

### 1. Discourse‑level LLM scoring (the core idea)

The prompt (`lib/config.ts`, `PROMPT_VERSION` `v2`) does **not** hand the model a
part‑of‑speech rubric. Instead it asks for genuine comprehension first:

1. **Comprehend.** The model states the passage's **core point** in one sentence
   (returned as `corePoint`, shown in the UI and stored in telemetry).
2. **Score by removal‑damage.** Each word is scored `0.0–1.0` by *how much a
   reader's grasp of that core point would suffer if the word were removed* — an
   essentiality test, not a category lookup. The prompt explicitly states that
   importance is contextual and that importance is **scarce** (only a few words
   per passage are load‑bearing), which keeps scores well‑spread.

This is the jump from **Level 1** (lexical class / POS — context‑free) to
**Level 3** (discourse importance — the same word scores differently across
passages). It's grounded in the information‑theoretic notion of *surprisal*
(self‑information) and the prompt‑compression literature (Selective Context,
LLMLingua), which solve the same "score every token by how much it matters"
problem.

### 2. Robust token alignment (echo validation)

The client tokenises the text (whitespace split, punctuation attached) and that
array is the **source of truth** for rendering. The model echoes `{token, score}`
per token; we validate the echo **by index**, tolerating punctuation/case
normalisation (`tokensEquivalent` in `lib/tokenise.ts`). Any drifted word falls
back to a neutral `0.5` and is flagged `misaligned` in telemetry — so a model
hiccup degrades a word or two, never the whole render.

### 3. Cross‑passage normalisation

Different passages naturally run "hot" or "cool." Each passage is shifted so its
**mean score is constant** (`lib/normalize.ts`), keeping the *average* word
weight identical across inputs. This preserves each passage's internal spread
while preventing one passage from rendering uniformly heavier than another. Raw
model scores are persisted to telemetry; normalisation is display‑only.

### 4. Variable‑font rendering

Scores map to the **Inter** variable font's continuous weight axis
(`lib/scoreToStyle.ts`), currently `360–560` with a tunable contrast exponent —
a deliberately *subtle* range so emphasis guides attention without the text
looking "formatted." Colour is monochrome lightness, shifted toward pure
black (light theme) / white (dark theme) so important words read crisp rather
than grey. A live **score → weight** sample ladder and per‑word **rhythm bars**
make the mapping legible.

### 5. Telemetry as a research seam

Every call (success or failure) writes one row to **Neon Postgres**
(`lib/telemetry.ts`, schema in `db/schema.sql`): input, raw scores, model,
`prompt_version`, token usage, latency, status, and a `meta` JSONB catch‑all
(holding `corePoint`, drift count, etc.). Bumping `PROMPT_VERSION` on any rubric
change lets you compare score distributions across versions on identical inputs —
the whole point of instrumenting a research instrument.

### Cost & safety guards

A hard server‑enforced **2,000‑character** input cap bounds per‑call cost; a
Vercel Firewall rate‑limit rule guards request volume. The model is
`anthropic/claude-haiku-4.5` (free‑tier eligible on the AI Gateway), hot‑swappable
via `lib/config.ts`.

---

## How a request flows

```
type text → client tokenises (source of truth)
          → POST /api/score { tokens, text }
          → AI Gateway · generateText + Output.object (Zod) · v2 discourse prompt
          → model returns { corePoint, scores: [{token, score}] }
          → echo validated by index · drift → 0.5
          → raw scores persisted to Neon (telemetry)
          → scores normalised to a constant mean (display)
          → client renders variable‑weight Inter spans + rhythm + corePoint
```

---

## Local development

```bash
npm run dev
```

Environment (`.env.local`, gitignored):

- `DATABASE_URL` — Neon Postgres connection string (telemetry).
- `AI_GATEWAY_API_KEY` — Vercel AI Gateway key for real scoring.

Without `AI_GATEWAY_API_KEY`, **local** dev falls back to a heuristic mock scorer
(`lib/mockScore.ts`) so the UI runs end‑to‑end with no paid calls. On any Vercel
deployment the real model is **always** used — a missing credential fails loudly
rather than silently serving mock scores.

Apply the telemetry schema once:

```bash
node --env-file=.env.local scripts/migrate.mjs
```

---

## Roadmap

Implemented Step 1 of the scoring‑depth roadmap (the discourse prompt reframe).
Deferred: a local **surprisal** backend (small model as an auxiliary importance
meter — needs a separate service, not Vercel serverless), a **TextRank** client
fallback to replace the dev mock, an offline **ablation** gold‑standard eval, a
weight‑*reveal* animation, and a tunable‑parameter research UI.
