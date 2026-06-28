"use client";

import type { ScoredToken, EmphasisMode } from "@/lib/types";
import { scoreToWeight, scoreToColor, HIGHLIGHT_COLOR } from "@/lib/scoreToStyle";
import { Button } from "@/components/ui/button";

/** Uniform weight used in the "none" view — ordinary reading weight. */
export const PLAIN_WEIGHT = 400;

const MODES: { value: EmphasisMode; label: string }[] = [
  { value: "none", label: "None" },
  { value: "pos", label: "POS" },
  { value: "emphasis", label: "Semantic" },
];

/**
 * The hero: renders each word at a variable font weight + monochrome lightness.
 * The three-way mode (owned by the page, shared with RhythmBars) steps through
 * the progression of the work — no emphasis, Level-1 POS-keyed emphasis, and the
 * current discourse-level (v2) emphasis. Hover state is shared with RhythmBars.
 */
export function EmphasisRenderer({
  tokens,
  posScores,
  isDark,
  mode,
  onModeChange,
  hovered,
  onHover,
}: {
  tokens: ScoredToken[];
  posScores: number[];
  isDark: boolean;
  mode: EmphasisMode;
  onModeChange: (mode: EmphasisMode) => void;
  hovered: number | null;
  onHover: (index: number | null) => void;
}) {
  /** The score driving the current view for token i (null in "none"). */
  const scoreFor = (i: number): number | null => {
    if (mode === "none") return null;
    return mode === "pos" ? posScores[i] : tokens[i].score;
  };

  const hoveredScore = hovered === null ? null : scoreFor(hovered);

  return (
    <div className="flex flex-col gap-4">
      <div className="inline-flex self-start gap-0.5 rounded-full border border-border p-0.5">
        {MODES.map((m) => (
          <Button
            key={m.value}
            type="button"
            size="sm"
            variant={mode === m.value ? "default" : "ghost"}
            className="rounded-full px-3 text-xs"
            onClick={() => onModeChange(m.value)}
            aria-pressed={mode === m.value}
          >
            {m.label}
          </Button>
        ))}
      </div>

      <p
        className="text-[clamp(0.84rem,1.23vw+0.56rem,1.27rem)] leading-[1.65] tracking-[-0.01em]"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {tokens.map((tok, i) => {
          const isHovered = hovered === i;
          const score = scoreFor(i);
          return (
            <span
              key={i}
              className="inline-block mr-[0.26em] rounded-[3px] px-[2px] transition-all duration-150"
              style={{
                fontWeight: score === null ? PLAIN_WEIGHT : scoreToWeight(score),
                color: isHovered
                  ? HIGHLIGHT_COLOR
                  : score === null
                    ? "var(--foreground)"
                    : scoreToColor(score, isDark),
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
            &ldquo;{tokens[hovered].word}&rdquo;
            {hoveredScore === null
              ? " · plain · weight " + PLAIN_WEIGHT
              : ` · ${mode === "pos" ? "POS " : ""}score ${hoveredScore.toFixed(2)} · weight ${scoreToWeight(hoveredScore)}`}
          </span>
        )}
      </div>
    </div>
  );
}
