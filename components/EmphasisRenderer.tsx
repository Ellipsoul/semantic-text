"use client";

import { useState } from "react";
import type { ScoredToken } from "@/lib/types";
import { scoreToWeight, scoreToColor } from "@/lib/scoreToStyle";

/**
 * The hero: renders each word at a variable font weight + monochrome lightness
 * derived from its semantic score. Hovering a word reveals its score/weight.
 */
export function EmphasisRenderer({
  tokens,
  isDark,
}: {
  tokens: ScoredToken[];
  isDark: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div>
      <p
        className="text-[clamp(1.05rem,1.54vw+0.7rem,1.58rem)] leading-[1.8] tracking-[-0.01em]"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {tokens.map((tok, i) => (
          <span
            key={i}
            className="inline-block mr-[0.26em] transition-colors duration-150"
            style={{
              fontWeight: scoreToWeight(tok.score),
              color: scoreToColor(tok.score, isDark),
              outline:
                hovered === i ? "1px solid color-mix(in srgb, currentColor 30%, transparent)" : "none",
              outlineOffset: "3px",
              borderRadius: "2px",
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {tok.word}
          </span>
        ))}
      </p>

      <div className="mt-4 h-5 font-mono text-xs text-muted">
        {hovered !== null && (
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
