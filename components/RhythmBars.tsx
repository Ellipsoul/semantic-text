"use client";

import type { ScoredToken } from "@/lib/types";
import { scoreToColor, HIGHLIGHT_COLOR } from "@/lib/scoreToStyle";

/**
 * A bar chart of per-word scores beneath the text — makes the "prosodic stress
 * profile" legible as a rhythm. Hover state is shared with EmphasisRenderer, so
 * hovering a bar highlights its word and vice versa (the hovered bar turns blue).
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
    <div className="flex items-end gap-[2px] h-16 w-full overflow-hidden">
      {tokens.map((tok, i) => {
        const isHovered = hovered === i;
        return (
          <div
            key={i}
            className="flex-1 min-w-[2px] cursor-default rounded-t-[1px] transition-colors duration-150"
            style={{
              height: `${Math.max(4, tok.score * 100)}%`,
              backgroundColor: isHovered ? HIGHLIGHT_COLOR : scoreToColor(tok.score, isDark),
            }}
            title={`${tok.word} · ${tok.score.toFixed(2)}`}
            onMouseEnter={() => onHover(i)}
            onMouseLeave={() => onHover(null)}
          />
        );
      })}
    </div>
  );
}
