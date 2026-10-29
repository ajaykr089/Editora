/**
 * Word-level diff used to turn a model's rewrite into reviewable hunks.
 *
 * Text is split into words, whitespace runs and single punctuation marks, then
 * diffed with Myers' O(ND) algorithm. The edit distance is capped so a total
 * rewrite of a long text cannot allocate unbounded memory; callers fall back
 * to a whole-text replacement when `diffTokens` returns null.
 */

export type DiffOpType = 'equal' | 'delete' | 'insert';

export interface DiffOp {
  type: DiffOpType;
  tokens: string[];
}

/** A contiguous change: `original.slice(start, end)` becomes `inserted`. */
export interface TextChange {
  start: number;
  end: number;
  deleted: string;
  inserted: string;
}

const TOKEN_PATTERN = /\s+|[\p{L}\p{N}\p{M}_]+(?:['’][\p{L}\p{N}\p{M}_]+)*|[^\s\p{L}\p{N}\p{M}_]/gu;

export function tokenize(text: string): string[] {
  return text.match(TOKEN_PATTERN) ?? [];
}

/** Default cap on the edit distance explored before giving up. */
export const DEFAULT_MAX_EDIT_DISTANCE = 2000;

export function diffTokens(a: string[], b: string[], maxEditDistance = DEFAULT_MAX_EDIT_DISTANCE): DiffOp[] | null {
  let prefix = 0;
  while (prefix < a.length && prefix < b.length && a[prefix] === b[prefix]) prefix += 1;

  let suffix = 0;
  while (
    suffix < a.length - prefix &&
    suffix < b.length - prefix &&
    a[a.length - 1 - suffix] === b[b.length - 1 - suffix]
  ) {
    suffix += 1;
  }

  const middle = myers(a.slice(prefix, a.length - suffix), b.slice(prefix, b.length - suffix), maxEditDistance);
  if (!middle) return null;

  const ops: DiffOp[] = [];
  if (prefix > 0) ops.push({ type: 'equal', tokens: a.slice(0, prefix) });
  ops.push(...middle);
  if (suffix > 0) ops.push({ type: 'equal', tokens: a.slice(a.length - suffix) });
  return mergeOps(ops);
}

function myers(a: string[], b: string[], maxD: number): DiffOp[] | null {
  const n = a.length;
  const m = b.length;
  if (n === 0 && m === 0) return [];
  if (n === 0) return [{ type: 'insert', tokens: b.slice() }];
  if (m === 0) return [{ type: 'delete', tokens: a.slice() }];

  const limit = Math.min(maxD, n + m);
  const offset = limit + 2;
  const v = new Int32Array(2 * offset + 1);
  v[offset + 1] = 0;
  // trace[d] holds v[-d-1 .. d+1] as it was before step d.
  const trace: Int32Array[] = [];

  for (let d = 0; d <= limit; d += 1) {
    trace.push(v.slice(offset - d - 1, offset + d + 2));
    for (let k = -d; k <= d; k += 2) {
      let x =
        k === -d || (k !== d && v[offset + k - 1] < v[offset + k + 1])
          ? v[offset + k + 1]
          : v[offset + k - 1] + 1;
      let y = x - k;
      while (x < n && y < m && a[x] === b[y]) {
        x += 1;
        y += 1;
      }
      v[offset + k] = x;
      if (x >= n && y >= m) return backtrack(a, b, trace);
    }
  }
  return null;
}

function backtrack(a: string[], b: string[], trace: Int32Array[]): DiffOp[] {
  const reversed: DiffOp[] = [];
  let x = a.length;
  let y = b.length;

  for (let d = trace.length - 1; d >= 0; d -= 1) {
    const snapshot = trace[d];
    const at = (k: number) => snapshot[k + d + 1];
    const k = x - y;
    const prevK = k === -d || (k !== d && at(k - 1) < at(k + 1)) ? k + 1 : k - 1;
    const prevX = at(prevK);
    const prevY = prevX - prevK;

    while (x > prevX && y > prevY) {
      reversed.push({ type: 'equal', tokens: [a[x - 1]] });
      x -= 1;
      y -= 1;
    }
    if (d > 0) {
      if (x === prevX) reversed.push({ type: 'insert', tokens: [b[prevY]] });
      else reversed.push({ type: 'delete', tokens: [a[prevX]] });
    }
    x = prevX;
    y = prevY;
  }

  return mergeOps(reversed.reverse());
}

function mergeOps(ops: DiffOp[]): DiffOp[] {
  const merged: DiffOp[] = [];
  for (const op of ops) {
    if (op.tokens.length === 0) continue;
    const last = merged[merged.length - 1];
    if (last && last.type === op.type) last.tokens.push(...op.tokens);
    else merged.push({ type: op.type, tokens: op.tokens.slice() });
  }
  return merged;
}

/**
 * Collapse diff ops into changes against the original text. Changes separated
 * only by whitespace are joined, so "quick brown" -> "fast red" reads as one
 * suggestion instead of two.
 */
export function opsToChanges(ops: DiffOp[]): TextChange[] {
  const changes: TextChange[] = [];
  let position = 0;
  let current: TextChange | null = null;
  let pendingGap: string | null = null;

  for (const op of ops) {
    const text = op.tokens.join('');
    if (op.type === 'equal') {
      if (current && pendingGap === null && /^[ \t]+$/.test(text)) {
        pendingGap = text;
      } else {
        current = null;
        pendingGap = null;
      }
      position += text.length;
      continue;
    }

    if (current && pendingGap !== null) {
      current.end += pendingGap.length;
      current.deleted += pendingGap;
      current.inserted += pendingGap;
      pendingGap = null;
    } else if (!current || current.end !== position) {
      current = { start: position, end: position, deleted: '', inserted: '' };
      changes.push(current);
    }

    if (op.type === 'delete') {
      current.deleted += text;
      current.end += text.length;
      position += text.length;
    } else {
      current.inserted += text;
    }
  }

  return changes;
}

/** Changes that turn `original` into `proposed`, or null when they are too different to diff. */
export function diffText(original: string, proposed: string, maxEditDistance?: number): TextChange[] | null {
  const ops = diffTokens(tokenize(original), tokenize(proposed), maxEditDistance);
  return ops ? opsToChanges(ops) : null;
}

/** Apply changes (sorted by `start`, non-overlapping) to `original`. */
export function applyChanges(original: string, changes: TextChange[]): string {
  let result = '';
  let cursor = 0;
  for (const change of changes) {
    result += original.slice(cursor, change.start) + change.inserted;
    cursor = change.end;
  }
  return result + original.slice(cursor);
}
