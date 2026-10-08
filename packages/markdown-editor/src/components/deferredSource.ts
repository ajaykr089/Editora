import { useEffect, useReducer, useRef } from 'react';

/**
 * Turning a long document into a preview costs more than a keystroke can afford: on a document of several
 * thousand lines it is a few hundred milliseconds of building and swapping the preview, after every character.
 * So while the source pane is being typed in, a preview that is slow to build waits for a pause in the typing.
 *
 * Nothing changes for an ordinary document: below `DEFER_FROM` characters, or while a build is quick, the
 * preview is as current as the text, in the same render.
 */

/** Documents shorter than this (in characters, about 400 lines) are always shown as they are. */
export const DEFER_FROM = 20_000;
/** A build quicker than this (in ms) is not worth waiting for. */
export const CHEAP_BUILD = 25;
/** The shortest and longest pause, in ms, that a slow build waits for. */
export const MIN_LAG = 120;
export const MAX_LAG = 1_000;
/** Typing without a pause longer than the lag still refreshes the preview this often (in ms). */
export const MAX_WAIT = 2_000;

/** Wall-clock time, in ms; a property of this object so that tests can set the clock. */
export const clock = {
  now: (): number => (typeof performance !== 'undefined' ? performance.now() : Date.now()),
};

/** How long the preview waits for the typing to pause, given the text and what the last build cost. */
export function previewLag(length: number, buildMs: number): number {
  if (length < DEFER_FROM || buildMs < CHEAP_BUILD) return 0;
  // Twice the build, since swapping the result into the page costs about as much again.
  return Math.min(MAX_LAG, Math.max(MIN_LAG, Math.round(buildMs * 2)));
}

/**
 * The text the preview should be built from: `value`, or an earlier value while `value` is still being typed.
 * `buildMs` holds how long the last build took (the caller writes it); `enabled` is false when nobody is typing
 * next to the preview (it is shown alone, or not at all), when it is always current.
 */
export function useDeferredSource(value: string, enabled: boolean, buildMs: { current: number }): string {
  const [, show] = useReducer((count: number) => count + 1, 0);
  const shown = useRef(value);
  const waitingSince = useRef<number | null>(null);

  const lag = enabled ? previewLag(value.length, buildMs.current) : 0;
  // Idempotent, so safe to repeat when React renders twice.
  if (lag === 0) shown.current = value;
  const stale = shown.current !== value;

  useEffect(() => {
    if (!stale) {
      waitingSince.current = null;
      return undefined;
    }
    const now = Date.now();
    if (waitingSince.current === null) waitingSince.current = now;
    // Each keystroke restarts the pause, but the preview is never older than MAX_WAIT.
    const wait = Math.max(0, Math.min(lag, MAX_WAIT - (now - waitingSince.current)));
    const timer = setTimeout(() => {
      shown.current = value;
      waitingSince.current = null;
      show();
    }, wait);
    return () => clearTimeout(timer);
  }, [value, stale, lag]);

  return shown.current;
}
