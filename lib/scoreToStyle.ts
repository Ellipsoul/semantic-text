/**
 * Pure score -> visual mappings. Monochrome by design: a single ink colour
 * whose lightness scales with score, reinforcing the same signal as weight (no
 * hue shift). All ranges come from config so they become research knobs later.
 */
import { MAPPING } from "./config";

/** Accent used to link a hovered word with its rhythm bar (and vice versa). */
export const HIGHLIGHT_COLOR = "#3b82f6";

/** Clamp to [0,1] and apply the contrast exponent. Shared by weight + colour. */
function adjust(score: number): number {
  const clamped = Math.min(1, Math.max(0, score));
  return Math.pow(clamped, MAPPING.contrast);
}

/** Map a score onto Inter's continuous weight axis. */
export function scoreToWeight(score: number): number {
  const a = adjust(score);
  return Math.round(MAPPING.weightMin + a * (MAPPING.weightMax - MAPPING.weightMin));
}

/**
 * Monochrome ink whose lightness tracks score, shifted toward the extreme so
 * text reads crisp rather than grey. The most important words reach pure
 * black/white; even low-importance words stay dark/bright.
 * Light mode: low score -> medium grey, high score -> pure black.
 * Dark mode:  low score -> medium grey, high score -> pure white.
 */
export function scoreToColor(score: number, isDark: boolean): string {
  const a = adjust(score);
  const v = isDark
    ? Math.round(155 + a * 100) // 155 -> 255 (toward white)
    : Math.round(100 - a * 100); // 100 -> 0 (toward black)
  return `rgb(${v}, ${v}, ${v})`;
}
