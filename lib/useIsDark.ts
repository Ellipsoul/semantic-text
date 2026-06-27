import { useSyncExternalStore } from "react";

const QUERY = "(prefers-color-scheme: dark)";

function subscribe(callback: () => void): () => void {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

/** SSR has no media query; default to light to match the CSS default. */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Subscribe to the system colour scheme without setState-in-effect. Drives the
 * monochrome ink mapping so emphasised words stay legible in both themes.
 */
export function useIsDark(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
