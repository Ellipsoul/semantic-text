/** Shared types for the scoring request/response contract. */

/** A rendered word: the client's token text plus its trusted score. */
export interface ScoredToken {
  word: string;
  score: number;
}

/**
 * POST body sent from the client to /api/score.
 * `tokens` is the client's source-of-truth array (what will be rendered);
 * `text` is the full original string, sent as discourse context for the model.
 */
export interface ScoreRequest {
  text: string;
  tokens: string[];
}

/** Response returned by /api/score on success. */
export interface ScoreResponse {
  tokens: ScoredToken[];
  /** The model's one-sentence read of the passage (discourse-grounded v2). */
  corePoint: string | null;
  /** Status mirrors the telemetry status for client-side awareness. */
  status: "ok" | "misaligned";
}

/** Telemetry call outcome. Written on every path. */
export type ScoringStatus = "ok" | "misaligned" | "parse_error" | "api_error";
