"use client";

import { scoreToWeight, scoreToColor } from "@/lib/scoreToStyle";

/** Scores 0.00 -> 1.00 in 0.05 steps (21 values). */
const STEPS = Array.from({ length: 21 }, (_, i) => i * 0.05);

/** Same word at every weight, so the variable-weight ramp is obvious. */
const SAMPLE_WORD = "Emphasis";

/**
 * A reference ladder demonstrating the full score -> weight mapping. Each row
 * shows the score, its computed font weight, and a sample word rendered at that
 * weight + colour, so the variable font behaviour is plainly visible.
 */
export function WeightSample({ isDark }: { isDark: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      {STEPS.map((score) => {
        const weight = scoreToWeight(score);
        return (
          <div key={score} className="flex items-baseline gap-4">
            <span className="w-10 shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
              {score.toFixed(2)}
            </span>
            <span className="w-10 shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
              {weight}
            </span>
            <span
              className="text-xl"
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: weight,
                color: scoreToColor(score, isDark),
              }}
            >
              {SAMPLE_WORD}
            </span>
          </div>
        );
      })}
    </div>
  );
}
