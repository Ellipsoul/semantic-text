"use client";

import type { ScoredToken } from "@/lib/types";
import { scoreToColor, HIGHLIGHT_COLOR } from "@/lib/scoreToStyle";

/**
 * A bar chart of per-word scores beneath the text — makes the "prosodic stress
 * profile" legible as a rhythm. Hover state is shared with EmphasisRenderer, so
 * hovering a bar highlights its word and vice versa (the hovered bar turns blue).
 *
 * Each bar lives in a full-width, gapless slice (the visual 2px gap is inner
 * padding), so the hover area has no dead zones — moving the mouse across the
 * chart glides the highlight from word to word instead of blinking through gaps.
 */
export function RhythmBars({
  tokens,
  isDark,
  hovered,
  onHover,
}: {
  tokens: ScoredToken[];
  isDark: boolean;
  hovered: number | null;
  onHover: (index: number | null) => void;
}) {
  return (
    <div className="flex h-16 w-full items-end overflow-hidden">
      {tokens.map((tok, i) => {
        const isHovered = hovered === i;
        return (
          <div
            key={i}
            className="flex h-full flex-1 cursor-default items-end px-px"
            onMouseEnter={() => onHover(i)}
            onMouseLeave={() => onHover(null)}
            title={`${tok.word} · ${tok.score.toFixed(2)}`}
          >
            <div
              className="w-full rounded-t-[1px] transition-colors duration-150"
              style={{
                height: `${Math.max(4, tok.score * 100)}%`,
                backgroundColor: isHovered
                  ? HIGHLIGHT_COLOR
                  : scoreToColor(tok.score, isDark),
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
