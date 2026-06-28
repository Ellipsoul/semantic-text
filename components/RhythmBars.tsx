"use client";

import type { ScoredToken, EmphasisMode } from "@/lib/types";
import { scoreToColor, HIGHLIGHT_COLOR } from "@/lib/scoreToStyle";

/** Flat value used for every bar in "none" mode — a uniform distribution. */
const UNIFORM = 0.5;

/**
 * A bar chart of per-word scores beneath the text — makes the "prosodic stress
 * profile" legible as a rhythm. Follows the active emphasis mode: flat in "none",
 * Level-1 POS scores in "pos", discourse (v2) scores in "emphasis". Hover state
 * is shared with EmphasisRenderer (the hovered bar turns blue).
 *
 * Each bar lives in a full-width, gapless slice (the visual 2px gap is inner
 * padding) so the hover area has no dead zones and the highlight glides smoothly.
 */
export function RhythmBars({
  tokens,
  posScores,
  isDark,
  mode,
  hovered,
  onHover,
}: {
  tokens: ScoredToken[];
  posScores: number[];
  isDark: boolean;
  mode: EmphasisMode;
  hovered: number | null;
  onHover: (index: number | null) => void;
}) {
  const scoreFor = (i: number): number => {
    if (mode === "none") return UNIFORM;
    return mode === "pos" ? posScores[i] : tokens[i].score;
  };

  return (
    <div className="flex h-16 w-full items-end overflow-hidden">
      {tokens.map((tok, i) => {
        const isHovered = hovered === i;
        const score = scoreFor(i);
        return (
          <div
            key={i}
            className="flex h-full flex-1 cursor-default items-end px-px"
            onMouseEnter={() => onHover(i)}
            onMouseLeave={() => onHover(null)}
            title={`${tok.word} · ${score.toFixed(2)}`}
          >
            <div
              className="w-full rounded-t-[1px] transition-all duration-150"
              style={{
                height: `${Math.max(4, score * 100)}%`,
                backgroundColor: isHovered
                  ? HIGHLIGHT_COLOR
                  : scoreToColor(score, isDark),
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
