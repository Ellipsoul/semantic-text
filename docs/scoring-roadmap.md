# Semantic Emphasis — Deferred Scoring/Emphasis Extensions

A handoff of the scoring/emphasis extensions we have **not** yet built, grounded
in the current codebase so the next agent knows exactly where each one plugs in.

---

## Where we are now

The scorer is at **Level 3 (discourse importance)**, not Level 1 (part-of-speech).

- `app/api/score/route.ts` — calls `anthropic/claude-haiku-4.5` via the Vercel AI
  Gateway with `generateText` + `Output.object` (Zod). Returns
  `{ corePoint, scores: [{token, score}] }`.
- `lib/config.ts` — the **tunable-parameter seam**: `MODEL`, `PROMPT_VERSION`
  (`v2`), `RUBRIC` (the comprehend-then-score discourse prompt), `MAPPING`
  (weight 360–560 + `contrast` exponent), `MAX_INPUT_CHARS` (2000),
  `NORMALIZE_TARGET_MEAN` (0.5), `NEUTRAL_SCORE`.
- `lib/alignScores.ts` — resync-tolerant alignment of the model's echoed tokens
  against the client tokens; returns `scores`, `driftCount`, `slipped`.
- `lib/normalize.ts` — shifts each passage to a constant mean so average weight
  is comparable across passages (display-only; raw scores go to telemetry).
- `lib/mockScore.ts` — heuristic fallback, **local-dev only**.
- **Telemetry** → Neon `scoring_requests`, with `prompt_version` and a `meta`
  JSONB (`corePoint`, `driftCount`, `slipped`, `normalizeTargetMean`). This is
  the research instrument: the same input under different `prompt_version`/`model`
  is directly comparable.

**Core intellectual goal:** the project's value is the gap between *statistically
surprising* and *actually meaningful*. Let the data, not a hand-tuned rubric,
define importance. We completed **Step 1** of the scoring-depth roadmap
(`~/Downloads/semantic-emphasis-scoring-depth-roadmap.md`); the rest follow.

### The three levels of importance

- **Level 1 — lexical class:** importance ≈ part of speech, context-free. A POS
  tagger does this. The old `v1` rubric lived here.
- **Level 2 — contextual salience:** importance depends on the surrounding
  sentence and the word's information content in that position.
- **Level 3 — discourse importance:** importance depends on the whole passage —
  its topic, what's new vs. given, what would survive compression to a headline.
  This is the target; `v2` is here.

---

## A. Local surprisal backend *(roadmap Step 2 — highest-value validation signal)*

**What:** A second scoring backend that computes per-token **surprisal**
(`I(x) = −log₂ P(xₜ | context)`) from a small local model (GPT-2 / Pythia /
small Llama), LLMLingua-style. Surprisal is contextual by construction and needs
no rubric.

**Why:** A principled, independent signal to validate the LLM's discourse scores
against. Where Claude's scores and local surprisal **agree**, you're confident;
where they **diverge** is the genuinely interesting case — "surprising but not
meaningful" vs "meaningful but predictable." That divergence is the heart of the
project.

**How it fits us:** Add a selectable `scorer` to `lib/config.ts`
(`'llm-discourse' | 'surprisal-local' | 'mock'`). Persist which scorer produced
each row in telemetry `meta`. The route branches on `scorer`.

**Trade-off / blocker:** Not viable on the current Vercel serverless deployment —
loading transformer weights per request blows cold-start and memory budgets. It
needs a **separate always-on service** (small GPU/CPU box, Modal/Replicate
endpoint, or dedicated container) that the Next.js route calls over HTTP. This is
the main architectural decision before starting.

**Priority:** High value, high setup cost. Best done as an **offline reference
signal first** (score a fixed test set, store alongside the LLM scores, compare
distributions) before considering a live backend.

---

## B. Graph-based client fallback — TextRank/LexRank *(roadmap Step 3)*

**What:** Replace the naive `lib/mockScore.ts` heuristic with an unsupervised
**TextRank/LexRank** salience scorer — build a word/phrase graph, score by
centrality. Pure client-side, deterministic, no API cost.

**Why:** The current mock is POS-ish and crude. TextRank gives contextually
plausible scores with zero API calls — a better no-key dev experience, and a
cheap instant pre-pass or offline baseline.

**How it fits us:** New `lib/textRankScore.ts`, swapped in where `mockScore` is
called (route's `useMock` branch). Keep the same `number[]` contract so it drops
into `alignScores`/`normalizeScores` unchanged.

**Trade-off:** Bag-of-words centrality — captures topical recurrence, not
discourse meaning. Weak on "the one outcome word in the passage." Good baseline,
not a replacement for the LLM scorer.

**Priority:** Low effort, low-but-real value. Good warm-up task.

---

## C. Ablation gold-standard — offline eval only *(roadmap Step 4)*

**What:** On a small curated test set, compute **ablation-based importance**:
`I(xᵢ) = ‖LLM(full) − LLM(full \ xᵢ)‖₂` (L2 distance between final-layer
embeddings with vs. without the token), normalized to [0,1].

**Why:** The closest thing to a **ground-truth** importance ranking. Benchmark
Steps 1–3 against it via rank correlation (Spearman) — an objective answer to "is
the v2 prompt actually better than v1?" beyond eyeballing.

**How it fits us:** A standalone offline script (`scripts/ablation-eval.ts` or a
notebook), **never in the production path** — it's N forward passes per N tokens,
far too slow for real-time.

**Priority:** Medium. Turns "I think it's better" into measured evidence. Do it
once you have ≥2 scorers/prompt versions to compare.

---

## D. Two-pass scoring for long passages

**What:** For long/complex inputs, split scoring into two model calls. **Pass 1**
extracts a structured "meaning frame" (thesis / key claims / new-vs-given / 3–5
central concepts); **Pass 2** scores each token's essentiality relative to that
frame.

**Why:** Anchors scoring to the passage's actual thesis and gives a natural
sentence-level weighting (a token in a thesis-carrying sentence outranks the same
token in an aside). Mirrors the summarization literature.

**How it fits us:** We already capture `corePoint` (a lightweight one-call version
of Pass 1). Two-pass is the heavier version. **Gate by input length** (e.g.
single-pass under ~40 tokens, two-pass above). Bump `PROMPT_VERSION` and compare
via telemetry.

**Trade-off:** ~2× tokens/latency. Worth it for long passages (we allow up to
2000 chars), overkill for a sentence.

**Priority:** Medium. Natural step after confirming single-pass v2 quality,
especially since inputs got longer.

---

## E. Minimal-pairs evaluation harness

**What:** A fixed test set of **minimal pairs** — the same word in two passages
where its importance differs — run automatically, asserting the scores diverge
correctly. Examples already used:
- "I'll **transfer** the money tomorrow" (action, high) vs "the bank **transfer**
  failed" (`failed` should carry the news).
- "...met for three hours and **rejected** the proposal" (`rejected` should win
  over the content nouns) vs "He **rejected** the gift politely."

**Why:** The whole promise of v2 is *contextual* scoring. This is the cheap,
repeatable check that the Level-1 ceiling stays broken. Success = the same word
gets meaningfully different scores across contexts, and the top-scored word
matches what a human would underline. Log `corePoint` alongside: a bad
distribution tells you whether the model **misunderstood** the passage (fix the
prompt) or **understood but mis-scored** (fix the scoring criteria).

**How it fits us:** `scripts/minimal-pairs-eval.ts` hitting the real route (we ran
these ad-hoc with curl; formalize them). Pairs with expected inequalities,
pass/fail output.

**Priority:** Medium-high, low effort. The guardrail for every future prompt
change.

---

## F. Multiple variable-font axes

**What:** Encode importance along more than one visual dimension — weight +
optical size (**Roboto Flex**), or weight + slant (**Recursive**). Currently we
use weight + monochrome lightness only.

**Why:** A second axis adds bandwidth and can improve accessibility (weight alone
is insufficient for low-vision/dyslexic readers).

**How it fits us:** Swap/extend the font in `app/layout.tsx`; extend
`lib/scoreToStyle.ts` to map score → multiple axes (`font-variation-settings` for
non-standard axes like Recursive's `MONO`/`CASL`; `font-optical-sizing: auto` for
optical size). Add axis ranges to `MAPPING` in `config.ts`.

**Trade-off:** Risk of visual noise — easy to overdo. Keep it subtle.

**Priority:** Low / exploratory.

---

## G. POS-tagging hard-clamp override *(use with caution)*

**What:** Run **compromise.js** (browser NLP) to hard-clamp trivially
classifiable tokens (determiners < 0.1, proper nouns > 0.75) before/after the LLM
call.

**Why:** Cuts LLM variance on obvious cases.

**Caveat:** In *tension* with the project's philosophy. We deliberately moved
**away** from POS-keyed scoring (Level 1) to discourse importance (Level 3).
Hard-clamping by POS reintroduces Level-1 behavior. Only apply to the extreme
tails (pure punctuation, articles) where POS and discourse importance never
disagree — never to content words.

**Priority:** Low, philosophically careful. Probably not worth it given v2 + the
"importance is scarce" calibration already handle function words well.

---

## H. Tunable-parameter research UI + model/prompt A-B comparison

**What:** Expose the `config.ts` seam as live UI controls — sliders/inputs for
weight range, `contrast` exponent, `NORMALIZE_TARGET_MEAN`, the rubric text, and
the model — re-scoring on the fly. Plus a comparison view that runs the same
input under two `model`/`prompt_version` settings side-by-side.

**Why:** The toy → **research instrument** transition the project was architected
for. Every parameter already flows into telemetry, so comparisons are already
queryable; this surfaces them interactively.

**How it fits us:** The constants in `config.ts` were designed as binding
targets. Extend the route to accept optional overrides (model, rubric, mapping)
so the UI can drive experiments without redeploying. Persist overrides in
telemetry `meta`.

**Priority:** Medium-high if the goal shifts toward research. Highest-leverage
step for "play with it / study the scoring."

---

## I. Retry-on-severe-drift safety net

**What:** When `alignScores` still reports high `driftCount` *after* resync (rare
— the model badly scrambled the echo), automatically retry the call once.

**Why:** Belt-and-suspenders on top of the resync. A retry of the exact same
input has been observed to succeed.

**How it fits us:** A small loop in `route.ts` around the `generateText` +
`alignScores` block, gated on `driftCount > threshold`. Keep it to **one** retry
to bound cost/latency.

**Priority:** Low — the resync already handles the realistic failure. Add only if
telemetry shows residual severe-drift cases.

---

## Quick reference — where each plugs in

| Extension | Primary files / seam | Production-safe? |
|---|---|---|
| A. Local surprisal | new service + `scorer` in `config.ts`, route branch | No — needs separate service |
| B. TextRank fallback | `lib/textRankScore.ts`, route `useMock` branch | Yes — client-side |
| C. Ablation eval | `scripts/ablation-eval.ts` | Offline only |
| D. Two-pass | `route.ts` + new prompt, gate by length, bump `PROMPT_VERSION` | Yes (2× cost) |
| E. Minimal-pairs eval | `scripts/minimal-pairs-eval.ts` | Offline |
| F. Multi-axis font | `layout.tsx`, `scoreToStyle.ts`, `MAPPING` | Yes |
| G. POS clamp | compromise.js pre/post-process in route | Yes (use sparingly) |
| H. Research UI / A-B | `config.ts` controls + route overrides + telemetry | Yes |
| I. Retry-on-drift | `route.ts` loop | Yes |

**Suggested order:** E (eval guardrail) → D (two-pass) → H (research UI) →
C (ablation gold standard) → A (surprisal, once a service exists) → B/F/G/I
opportunistically.

---

## Reference links

- Selective Context / self-information filtering: arXiv 2304.12102, 2310.06201
- LLMLingua (small-model token importance under a budget): jiang2023llmlingua
- LongLLMLingua: jiang2024longllmlingua
- TextRank salience for transformers: arXiv 2108.13759
- Ablation-based token importance: arXiv 2503.01926
- SemEval-2020 Task 10 (human emphasis labels, for few-shot/eval):
  https://github.com/RiTUAL-UH/SemEval2020_Task10_Emphasis_Selection
