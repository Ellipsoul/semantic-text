/**
 * Align the model's echoed {token, score} array to our source-of-truth token
 * array, tolerant of insertions/deletions.
 *
 * Why not a plain index zip: the model occasionally slips by one mid-stream
 * (inserts, drops, or splits an entry). A strict index comparison then fails for
 * every token after the slip, cascading the neutral fallback across the whole
 * tail of the passage (observed: one slip near token 18 → 130 neutral tokens).
 *
 * This greedy two-pointer resyncs within a small window, so a single slip costs
 * roughly one token instead of the rest of the passage. Our token array is
 * always the source of truth; we only borrow scores from matching echo entries.
 */
import { tokensEquivalent } from "./tokenise";

export interface EchoEntry {
  token: string;
  score: number;
}

export interface AlignmentResult {
  scores: number[];
  /** How many of our tokens couldn't be confidently matched (got the fallback). */
  driftCount: number;
  /**
   * Whether the echo deviated from a clean 1:1 index match at all — true even
   * when every token was recovered (e.g. a resynced insertion with driftCount 0).
   * This is the signal for warning the user that the model's response slipped.
   */
  slipped: boolean;
}

function isMatch(entry: EchoEntry | undefined, tok: string): boolean {
  return (
    !!entry &&
    typeof entry.score === "number" &&
    !Number.isNaN(entry.score) &&
    tokensEquivalent(entry.token, tok)
  );
}

export function alignScores(
  ourTokens: string[],
  echo: EchoEntry[],
  neutral: number,
  window = 4,
): AlignmentResult {
  const scores: number[] = [];
  let driftCount = 0;
  let slipped = false;
  let j = 0; // cursor into the model's echo array

  for (let i = 0; i < ourTokens.length; i++) {
    const tok = ourTokens[i];

    // 1. Direct hit at the current echo cursor.
    if (isMatch(echo[j], tok)) {
      scores.push(Math.min(1, Math.max(0, echo[j].score)));
      j++;
      continue;
    }

    // Anything past here means the echo deviated from a clean 1:1 match.
    slipped = true;

    // 2. Insertion: model emitted extra entries — skip ahead to find our token.
    let resynced = false;
    for (let k = 1; k <= window && j + k < echo.length; k++) {
      if (isMatch(echo[j + k], tok)) {
        j += k + 1;
        scores.push(Math.min(1, Math.max(0, echo[j - 1].score)));
        resynced = true;
        break;
      }
    }
    if (resynced) continue;

    // 3. Deletion: model skipped our token — if the current echo entry matches a
    //    later one of our tokens, leave this one neutral without consuming echo.
    let deletion = false;
    for (let k = 1; k <= window && i + k < ourTokens.length; k++) {
      if (isMatch(echo[j], ourTokens[i + k])) {
        deletion = true;
        break;
      }
    }

    // Unmatched: neutral fallback. For a substitution (not a clean deletion),
    // consume one echo entry to stay in step.
    scores.push(neutral);
    driftCount++;
    if (!deletion && j < echo.length) j++;
  }

  // Leftover echo entries (trailing insertions) or a length mismatch also count
  // as slippage even if every one of our tokens happened to match.
  if (j !== echo.length || echo.length !== ourTokens.length) slipped = true;

  return { scores, driftCount, slipped };
}
