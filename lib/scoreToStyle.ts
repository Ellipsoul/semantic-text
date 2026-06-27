/**
 * Pure score -> visual mappings. Monochrome by design: a single ink colour
 * whose lightness scales with score, reinforcing the same signal as weight (no
 * hue shift). All ranges come from config so they become research knobs later.
 */
import { MAPPING } from "./config";

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
 * Monochrome ink whose lightness tracks score.
 * Light mode: low score -> soft grey, high score -> near-black.
 * Dark mode:  low score -> dim grey,  high score -> bright.
 */
export function scoreToColor(score: number, isDark: boolean): string {
  const a = adjust(score);
  const v = isDark
    ? Math.round(90 + a * 150) // 90 (dim) -> 240 (bright)
    : Math.round(185 - a * 165); // 185 (soft grey) -> 20 (near-black)
  return `rgb(${v}, ${v}, ${v})`;
}
