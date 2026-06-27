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
export const PROMPT_VERSION = "v1";

/** Hard server-enforced input cap. Bounds per-call cost and latency. */
export const MAX_INPUT_CHARS = 1000;

/**
 * Score -> visual mapping parameters.
 * - weight: linear map from [0,1] onto [WEIGHT_MIN, WEIGHT_MAX]
 * - contrast: exponent applied to the score before mapping. 1.0 == linear.
 *   Values > 1 push mid-range words apart for clearer hierarchy.
 */
export const MAPPING = {
  weightMin: 200,
  weightMax: 800,
  contrast: 1.0,
} as const;

/**
 * The scoring rubric — the always-on instructions handed to the model.
 * Carried verbatim from the validated handoff (v1).
 */
export const RUBRIC = `You assign semantic emphasis scores (0.0-1.0) to text tokens.

Scoring guide:
- Named entities, key technical terms:               0.85-1.0
- Concrete nouns carrying primary meaning:            0.70-0.85
- Main action/state verbs:                            0.60-0.80
- Meaningful adjectives and adverbs:                  0.50-0.75
- Secondary nouns or generic verbs:                   0.38-0.58
- Auxiliary/linking verbs (is are was have had):      0.14-0.28
- Pronouns:                                           0.10-0.22
- Articles (a, an, the):                              0.02-0.08
- Prepositions:                                       0.04-0.14
- Conjunctions (and but or because that which):       0.04-0.14
- Punctuation-only tokens:                            0.00

You will receive an ordered array of tokens and the full original text as
context. Use the context to make discourse-level decisions (e.g. "change"
scores higher in "climate change" than in "a change of plans").

Return one object per token, in the SAME ORDER, echoing the exact token text
alongside its score.`;

/** Neutral fallback score for any token we cannot trust (drift, parse miss). */
export const NEUTRAL_SCORE = 0.5;
