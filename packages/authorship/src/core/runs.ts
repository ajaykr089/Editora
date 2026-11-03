import type { Run } from './types.js';

export function runsLength(runs: readonly Run[]): number {
  let total = 0;
  for (const [length] of runs) total += length;
  return total;
}

/** Drop empty runs and merge neighbours with the same origin. */
export function normalizeRuns(runs: readonly Run[]): Run[] {
  const out: Run[] = [];
  for (const [length, id] of runs) {
    if (length <= 0) continue;
    const last = out[out.length - 1];
    if (last && last[1] === id) last[0] += length;
    else out.push([length, id]);
  }
  return out;
}

/** The runs covering `[start, end)`. */
export function sliceRuns(runs: readonly Run[], start: number, end: number): Run[] {
  const out: Run[] = [];
  let pos = 0;
  for (const [length, id] of runs) {
    const runEnd = pos + length;
    const from = Math.max(start, pos);
    const to = Math.min(end, runEnd);
    if (to > from) out.push([to - from, id]);
    pos = runEnd;
    if (pos >= end) break;
  }
  return out;
}

/** Replace `del` characters at `at` with `inserted`. */
export function spliceRuns(runs: readonly Run[], at: number, del: number, inserted: readonly Run[]): Run[] {
  const total = runsLength(runs);
  return normalizeRuns([...sliceRuns(runs, 0, at), ...inserted.map((run) => [run[0], run[1]] as Run), ...sliceRuns(runs, at + del, total)]);
}

/** Origin id of the character at `offset`, or of the last character when `offset` is past the end. */
export function originIdAt(runs: readonly Run[], offset: number): number | undefined {
  let pos = 0;
  let last: number | undefined;
  for (const [length, id] of runs) {
    if (offset < pos + length) return id;
    pos += length;
    last = id;
  }
  return last;
}

/** Spread `runs` proportionally over `length` characters (for text that changed shape, e.g. whitespace). */
export function scaleRuns(runs: readonly Run[], length: number): Run[] {
  const total = runsLength(runs);
  if (total === length || total === 0) return runs.map((run) => [run[0], run[1]] as Run);
  const out: Run[] = [];
  let used = 0;
  let acc = 0;
  runs.forEach(([runLength, id], index) => {
    acc += runLength;
    const target = index === runs.length - 1 ? length : Math.round((acc / total) * length);
    out.push([target - used, id]);
    used = target;
  });
  return normalizeRuns(out);
}
