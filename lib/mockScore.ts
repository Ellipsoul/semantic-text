/**
 * Dev-only heuristic scorer. Used ONLY when no AI Gateway credential is present,
 * so the app runs end-to-end locally without paid calls. It is intentionally
 * crude — just enough to make the typographic effect visible while building.
 * Real scoring (Sonnet via the Gateway) takes over the moment creds exist.
 */
const FUNCTION_WORDS = new Set([
  "a", "an", "the", "and", "but", "or", "nor", "for", "so", "yet",
  "of", "to", "in", "on", "at", "by", "with", "from", "as", "into",
  "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
  "do", "does", "did", "i", "you", "he", "she", "it", "we", "they",
  "that", "which", "who", "this", "these", "those", "if", "then", "than",
]);

function strip(token: string): string {
  return token.toLowerCase().replace(/[^a-z0-9]/gi, "");
}

export function mockScore(tokens: string[]): number[] {
  return tokens.map((tok) => {
    const bare = strip(tok);
    if (bare.length === 0) return 0; // punctuation-only
    if (FUNCTION_WORDS.has(bare)) return 0.08 + Math.min(bare.length, 4) * 0.02;
    if (/^[A-Z]/.test(tok)) return 0.9; // likely proper noun / entity
    const lengthSignal = Math.min(1, bare.length / 9);
    return Math.round((0.45 + lengthSignal * 0.4) * 100) / 100;
  });
}
