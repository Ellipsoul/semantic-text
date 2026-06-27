import { generateText, Output } from "ai";
import { z } from "zod";
import {
  MODEL,
  PROMPT_VERSION,
  MAX_INPUT_CHARS,
  RUBRIC,
  NEUTRAL_SCORE,
  NORMALIZE_TARGET_MEAN,
} from "@/lib/config";
import { recordScoringCall } from "@/lib/telemetry";
import { tokensEquivalent } from "@/lib/tokenise";
import { normalizeScores } from "@/lib/normalize";
import { mockScore } from "@/lib/mockScore";
import type { ScoredToken, ScoringStatus } from "@/lib/types";

export const runtime = "nodejs";

/**
 * corePoint comes FIRST so the model comprehends the passage before scoring
 * (the field is generated first, scaffolding the per-token scores). Each score
 * echoes its token so we can verify alignment by index.
 */
const schema = z.object({
  corePoint: z.string(),
  scores: z.array(
    z.object({
      token: z.string(),
      score: z.number().min(0).max(1),
    }),
  ),
});

/** Is a real AI Gateway credential available? If not, we fall back to the mock. */
function hasGatewayCreds(): boolean {
  return Boolean(
    process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN,
  );
}

export async function POST(req: Request): Promise<Response> {
  const start = Date.now();

  // --- Parse + validate input -------------------------------------------
  let text: string;
  let tokens: string[];
  try {
    const body = await req.json();
    text = typeof body.text === "string" ? body.text : "";
    tokens = Array.isArray(body.tokens) ? body.tokens.map(String) : [];
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (tokens.length === 0) {
    return Response.json({ error: "No tokens provided." }, { status: 400 });
  }
  if (text.length > MAX_INPUT_CHARS) {
    return Response.json(
      { error: `Input exceeds ${MAX_INPUT_CHARS} characters.` },
      { status: 413 },
    );
  }

  const useMock = !hasGatewayCreds();
  const model = useMock ? "mock" : MODEL;

  let status: ScoringStatus = "ok";
  let errorMessage: string | null = null;
  let driftCount = 0;
  let resolvedScores: number[] = [];
  let corePoint: string | null = null;
  let inputTokens: number | null = null;
  let outputTokens: number | null = null;

  try {
    if (useMock) {
      resolvedScores = mockScore(tokens);
    } else {
      const result = await generateText({
        model: MODEL,
        output: Output.object({ schema }),
        system: RUBRIC,
        prompt: `Tokens (${tokens.length}):\n${JSON.stringify(
          tokens,
        )}\n\nContext: "${text}"`,
      });
      inputTokens = result.usage.inputTokens ?? null;
      outputTokens = result.usage.outputTokens ?? null;
      corePoint = result.output.corePoint ?? null;

      // --- Echo validation: OUR tokens are the source of truth ----------
      const echo = result.output.scores;
      resolvedScores = tokens.map((tok, i) => {
        const entry = echo[i];
        if (
          entry &&
          typeof entry.score === "number" &&
          tokensEquivalent(entry.token, tok)
        ) {
          return Math.min(1, Math.max(0, entry.score));
        }
        driftCount++;
        return NEUTRAL_SCORE;
      });
      if (driftCount > 0) status = "misaligned";
    }
  } catch (err) {
    status = "api_error";
    errorMessage = err instanceof Error ? err.message : String(err);
    await recordScoringCall({
      inputText: text,
      tokens,
      scores: null,
      model,
      promptVersion: PROMPT_VERSION,
      latencyMs: Date.now() - start,
      inputTokens,
      outputTokens,
      status,
      errorMessage,
      meta: { useMock },
    });
    return Response.json({ error: "Scoring failed." }, { status: 502 });
  }

  // --- Persist (success / misaligned) -----------------------------------
  await recordScoringCall({
    inputText: text,
    tokens,
    scores: resolvedScores,
    model,
    promptVersion: PROMPT_VERSION,
    latencyMs: Date.now() - start,
    inputTokens,
    outputTokens,
    status,
    errorMessage,
    meta: { useMock, driftCount, corePoint, normalizeTargetMean: NORMALIZE_TARGET_MEAN },
  });

  // Telemetry keeps the raw scores above; the client renders normalized ones so
  // the average word weight is constant across passages.
  const displayScores = normalizeScores(resolvedScores, NORMALIZE_TARGET_MEAN);
  const scored: ScoredToken[] = tokens.map((word, i) => ({
    word,
    score: displayScores[i],
  }));

  return Response.json({
    tokens: scored,
    corePoint,
    status: status === "misaligned" ? "misaligned" : "ok",
  });
}
