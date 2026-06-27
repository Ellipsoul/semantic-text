/**
 * Shift a passage's scores so their mean equals `targetMean`, keeping the
 * relative spread between words intact (it's a translation, not a rescale).
 *
 * Why: raw scores from different passages sit at different average levels — a
 * dense passage runs hot, a light one runs cool. Without this, one passage would
 * render uniformly heavier than another and "dominate." Anchoring every passage
 * to the same average weight makes relative emphasis comparable across inputs.
 *
 * Clamping to [0,1] can nudge the realised mean slightly when scores pile up at
 * an extreme, which is acceptable for a display transform.
 */
export function normalizeScores(scores: number[], targetMean: number): number[] {
  if (scores.length === 0) return scores;
  const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  const shift = targetMean - mean;
  return scores.map((s) => Math.min(1, Math.max(0, s + shift)));
}
