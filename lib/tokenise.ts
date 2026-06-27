/**
 * Client-side tokenisation. Whitespace split, punctuation stays attached to its
 * word ("change," is one token). This array is the SOURCE OF TRUTH for both the
 * model request and the render, so indices can never drift between them.
 *
 * Edge cases deliberately left for later: em-dashes, ellipses, brackets,
 * hyphenated compounds. For the MVP, attached punctuation simply inherits its
 * word's weight, which is visually correct.
 */
export function tokenise(text: string): string[] {
  const trimmed = text.trim();
  if (trimmed.length === 0) return [];
  return trimmed.split(/\s+/);
}

/**
 * Whether the model's echoed token refers to the same word as ours, ignoring
 * surrounding punctuation and case. Models routinely strip a trailing period or
 * comma when echoing ("rainforest." -> "rainforest"), which must NOT count as
 * drift. Internal punctuation (don't, state-of-the-art) is preserved, so a truly
 * different or dropped word still fails the check.
 */
export function tokensEquivalent(a: string, b: string): boolean {
  const core = (s: string) =>
    s.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "");
  return core(a) === core(b);
}
