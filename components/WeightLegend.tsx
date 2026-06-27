"use client";

import { scoreToWeight, scoreToColor } from "@/lib/scoreToStyle";

/** Teaches the viewer how to read the effect: a static low->high scale. */
const STOPS: { label: string; score: number }[] = [
  { label: "article", score: 0.05 },
  { label: "preposition", score: 0.12 },
  { label: "pronoun", score: 0.18 },
  { label: "adjective", score: 0.6 },
  { label: "verb", score: 0.72 },
  { label: "noun", score: 0.82 },
  { label: "entity", score: 0.95 },
];

export function WeightLegend({ isDark }: { isDark: boolean }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
      {STOPS.map((stop) => (
        <span
          key={stop.label}
          className="text-base"
          style={{
            fontFamily: "var(--font-inter)",
            fontWeight: scoreToWeight(stop.score),
            color: scoreToColor(stop.score, isDark),
          }}
        >
          {stop.label}
        </span>
      ))}
    </div>
  );
}
