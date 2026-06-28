"use client";

import { useState } from "react";
import type { ScoredToken } from "@/lib/types";
import { scoreToWeight, scoreToColor, HIGHLIGHT_COLOR } from "@/lib/scoreToStyle";
import { Button } from "@/components/ui/button";

type Mode = "plain" | "emphasis";

/** Uniform weight used in the "before" (plain) view — ordinary reading weight. */
const PLAIN_WEIGHT = 400;

/**
 * The hero: renders each word at a variable font weight + monochrome lightness
 * derived from its semantic score. A before/after toggle flips between the plain
 * passage and the emphasis rendering so the difference is felt on a click. Hover
 * state is shared with RhythmBars (via props) so hovering links both ways.
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
  const [mode, setMode] = useState<Mode>("emphasis");
  const plain = mode === "plain";

  return (
    <div className="flex flex-col gap-4">
      <div className="inline-flex self-start gap-0.5 rounded-full border border-border p-0.5">
        {(["plain", "emphasis"] as const).map((m) => (
          <Button
            key={m}
            type="button"
            size="sm"
            variant={mode === m ? "default" : "ghost"}
            className="rounded-full px-3 text-xs"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
          >
            {m === "plain" ? "Before" : "After"}
          </Button>
        ))}
      </div>

      <p
        className="text-[clamp(0.84rem,1.23vw+0.56rem,1.27rem)] leading-[1.65] tracking-[-0.01em]"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {tokens.map((tok, i) => {
          const isHovered = hovered === i;
          return (
            <span
              key={i}
              className="inline-block mr-[0.26em] rounded-[3px] px-[2px] transition-colors duration-150"
              style={{
                fontWeight: plain ? PLAIN_WEIGHT : scoreToWeight(tok.score),
                color: isHovered
                  ? HIGHLIGHT_COLOR
                  : plain
                    ? "var(--foreground)"
                    : scoreToColor(tok.score, isDark),
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

      <div className="h-5 font-mono text-xs text-muted-foreground">
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
