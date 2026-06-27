/**
 * Central, versioned configuration for the semantic emphasis renderer.
 *
 * Everything here is a "tunable parameter" seam: today these are constants,
 * but they are deliberately isolated so a future research-mode UI can bind
 * controls to them and so every telemetry row can record exactly which values
 * produced a given render. Bump PROMPT_VERSION whenever RUBRIC changes so score
 * distributions stay comparable across versions.
 */

/**
 * Model string resolved through the Vercel AI Gateway. Hot-swappable.
 * Using Haiku 4.5: free-tier eligible (Sonnet/Opus require paid credits) and
 * well-suited to this mechanical scoring task. Stored on every telemetry row,
 * so swapping to Sonnet later stays comparable.
 */
export const MODEL = "anthropic/claude-haiku-4.5";

/** Bump this whenever RUBRIC below changes. Stored on every telemetry row. */
export const PROMPT_VERSION = "v2";

/** Hard server-enforced input cap. Bounds per-call cost and latency. */
export const MAX_INPUT_CHARS = 2000;

/**
 * Target mean score per passage. After scoring, every passage is shifted so its
 * average score equals this value, so the *average* word weight is constant
 * across passages and relative emphasis stays comparable — no passage dominates
 * another. 0.5 centres the average in the weight range (~460). Raw model scores
 * are still what gets persisted to telemetry; normalization is display-only.
 */
export const NORMALIZE_TARGET_MEAN = 0.5;

/**
 * Score -> visual mapping parameters.
 * - weight: linear map from [0,1] onto [WEIGHT_MIN, WEIGHT_MAX]
 * - contrast: exponent applied to the score before mapping. 1.0 == linear.
 *   Values > 1 push mid-range words apart for clearer hierarchy.
 */
export const MAPPING = {
  weightMin: 360,
  weightMax: 560,
  contrast: 1.0,
} as const;

/**
 * The scoring instructions — the always-on system prompt.
 *
 * v2 (discourse-grounded): importance is scored by removal-damage to the
 * passage's MEANING, not by part of speech. The model comprehends the passage
 * first (corePoint), then scores each word by how much a reader's grasp of the
 * core point would suffer if that exact word were removed. This is the jump from
 * Level 1 (POS lookup) to Level 3 (contextual/discourse importance): the same
 * word can score very differently across passages.
 */
export const RUBRIC = `You score how essential each word is to the MEANING of a specific passage.

Work in two steps.

STEP 1 - Comprehend. First determine the core point of the passage: in one
sentence, what is it actually telling the reader? Note which information is NEW
or load-bearing versus background, given, or grammatical scaffolding. Put this
one sentence in the "corePoint" field.

STEP 2 - Score. For each token, assign 0.0-1.0 for how much a reader's
understanding of the core point would be damaged if that exact word were removed
or made illegible:
- 0.85-1.0 : load-bearing - removing it loses the point or a key fact/entity.
- 0.55-0.84: contributes specific meaning the reader needs.
- 0.25-0.54: supports meaning but is partly recoverable from context.
- 0.05-0.24: scaffolding a reader fills in automatically (most articles,
             prepositions, conjunctions, auxiliaries, pronouns).
- 0.0      : pure punctuation.

Calibrate carefully — importance is SCARCE. In a typical passage only a few
words are load-bearing (0.85+); many are scaffolding (below 0.25). Use the FULL
range and spread the scores out. If most words score high, you are scoring by
category rather than essentiality — push them down. For each word ask: would the
core point survive without it? If yes, it scores low, even if it is a "content"
word.

Importance is a property of the word IN THIS PASSAGE, not of its part of speech.
The same word can score very differently in different passages, and two
perfectly good nouns can score far apart if one carries the passage's point and
the other is incidental.

You will receive an ordered array of tokens and the full original text as
context. Return one object per token, in the SAME ORDER, echoing the exact token
text alongside its score.`;

/** Neutral fallback score for any token we cannot trust (drift, parse miss). */
export const NEUTRAL_SCORE = 0.5;
