"use client";

import type { ScoredToken } from "@/lib/types";
import { scoreToWeight, scoreToColor, HIGHLIGHT_COLOR } from "@/lib/scoreToStyle";

/**
 * The hero: renders each word at a variable font weight + monochrome lightness
 * derived from its semantic score. Hover state is shared with RhythmBars (via
 * props) so hovering a word also highlights its bar, and vice versa.
 */
export function EmphasisRenderer({
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
    <div>
      <p
        className="text-[clamp(1.05rem,1.54vw+0.7rem,1.58rem)] leading-[1.8] tracking-[-0.01em]"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {tokens.map((tok, i) => {
          const isHovered = hovered === i;
          return (
            <span
              key={i}
              className="inline-block mr-[0.26em] rounded-[3px] px-[2px] transition-colors duration-150"
              style={{
                fontWeight: scoreToWeight(tok.score),
                color: isHovered ? HIGHLIGHT_COLOR : scoreToColor(tok.score, isDark),
                backgroundColor: isHovered
                  ? "color-mix(in srgb, " + HIGHLIGHT_COLOR + " 15%, transparent)"
                  : "transparent",
                cursor: "default",
              }}
              onMouseEnter={() => onHover(i)}
              onMouseLeave={() => onHover(null)}
            >
              {tok.word}
            </span>
          );
        })}
      </p>

      <div className="mt-4 h-5 font-mono text-xs text-muted">
        {hovered !== null && tokens[hovered] && (
          <span>
            &ldquo;{tokens[hovered].word}&rdquo; · score{" "}
            {tokens[hovered].score.toFixed(2)} · weight{" "}
            {scoreToWeight(tokens[hovered].score)}
          </span>
        )}
      </div>
    </div>
  );
}
