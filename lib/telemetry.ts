/**
 * Telemetry seam. One row per scoring call, written on EVERY path.
 *
 * Backed by Neon Postgres when DATABASE_URL is set; otherwise falls back to a
 * structured console line so "log every call" holds even before the DB exists.
 * This single function is the only thing that changes if the store is swapped
 * (e.g. local SQLite during experiments -> Neon in production).
 */
import type { ScoringStatus } from "./types";

export interface ScoringRow {
  inputText: string;
  tokens: string[];
  scores: number[] | null;
  model: string;
  promptVersion: string;
  latencyMs: number;
  inputTokens: number | null;
  outputTokens: number | null;
  status: ScoringStatus;
  errorMessage: string | null;
  /** Catch-all, no-migration extensibility: drift count, mapping config, etc. */
  meta: Record<string, unknown>;
}

export async function recordScoringCall(row: ScoringRow): Promise<void> {
  const url = process.env.DATABASE_URL;

  if (!url) {
    console.log(
      "[telemetry]",
      JSON.stringify({
        status: row.status,
        model: row.model,
        promptVersion: row.promptVersion,
        latencyMs: row.latencyMs,
        tokenCount: row.tokens.length,
        meta: row.meta,
      }),
    );
    return;
  }

  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(url);
    await sql`
      INSERT INTO scoring_requests
        (input_text, tokens, scores, model, prompt_version,
         latency_ms, input_tokens, output_tokens, status, error_message, meta)
      VALUES
        (${row.inputText}, ${JSON.stringify(row.tokens)}, ${row.scores ? JSON.stringify(row.scores) : null},
         ${row.model}, ${row.promptVersion}, ${row.latencyMs}, ${row.inputTokens},
         ${row.outputTokens}, ${row.status}, ${row.errorMessage}, ${JSON.stringify(row.meta)})
    `;
  } catch (err) {
    // Telemetry must never break the user-facing request.
    console.error("[telemetry] write failed:", err);
  }
}
