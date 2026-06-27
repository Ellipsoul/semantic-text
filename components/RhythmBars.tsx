"use client";

import type { ScoredToken } from "@/lib/types";
import { scoreToColor } from "@/lib/scoreToStyle";

/**
 * A bar chart of per-word scores beneath the text — makes the "prosodic stress
 * profile" legible as a rhythm. Bar height + ink both track the score.
 */
export function RhythmBars({
  tokens,
  isDark,
}: {
  tokens: ScoredToken[];
  isDark: boolean;
}) {
  return (
    <div
      className="flex items-end gap-[2px] h-16 w-full overflow-hidden"
      aria-hidden
    >
      {tokens.map((tok, i) => (
        <div
          key={i}
          className="flex-1 min-w-[2px] rounded-t-[1px]"
          style={{
            height: `${Math.max(4, tok.score * 100)}%`,
            backgroundColor: scoreToColor(tok.score, isDark),
          }}
          title={`${tok.word} · ${tok.score.toFixed(2)}`}
        />
      ))}
    </div>
  );
}
