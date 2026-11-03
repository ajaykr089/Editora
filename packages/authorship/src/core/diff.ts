/**
 * Text diff for reconciling the editor's text after a change. Most changes
 * are one contiguous edit (a keystroke, a paste), found by common prefix and
 * suffix. When the changed middle spans several lines (a remote update that
 * touched two paragraphs, a replace-all), lines are matched first so the
 * untouched lines between the edits keep their origin.
 */

export interface TextEdit {
  /** Offset in the text as it is just before this edit (earlier edits already applied). */
  at: number;
  del: number;
  ins: string;
}

const MAX_LINE_MATRIX = 250_000;

function commonPrefix(a: string, b: string, limit: number): number {
  let i = 0;
  while (i < limit && a.charCodeAt(i) === b.charCodeAt(i)) i += 1;
  return i;
}

function commonSuffix(a: string, b: string, limit: number): number {
  let i = 0;
  while (i < limit && a.charCodeAt(a.length - 1 - i) === b.charCodeAt(b.length - 1 - i)) i += 1;
  return i;
}

/** One edit turning `a` into `b`; `hint` (the caret offset) settles ambiguous repeats like "aa" -> "aaa". */
function singleEdit(a: string, b: string, offset: number, hint?: number): TextEdit | null {
  if (a === b) return null;
  const min = Math.min(a.length, b.length);
  let prefix = commonPrefix(a, b, min);
  if (hint !== undefined && hint - offset >= 0 && hint - offset < prefix) prefix = hint - offset;
  const suffix = commonSuffix(a, b, min - prefix);
  return { at: offset + prefix, del: a.length - prefix - suffix, ins: b.slice(prefix, b.length - suffix) };
}

function splitLines(text: string): string[] {
  const lines = text.split(/(?<=\n)/);
  return lines.length === 1 && lines[0] === '' ? [] : lines;
}

/** Pairs of matching line indexes (longest common subsequence). */
function matchLines(a: string[], b: string[]): Array<[number, number]> {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const table = new Uint32Array(rows * cols);
  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      table[i * cols + j] = a[i] === b[j] ? table[(i + 1) * cols + j + 1] + 1 : Math.max(table[(i + 1) * cols + j], table[i * cols + j + 1]);
    }
  }
  const pairs: Array<[number, number]> = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      pairs.push([i, j]);
      i += 1;
      j += 1;
    } else if (table[(i + 1) * cols + j] >= table[i * cols + j + 1]) i += 1;
    else j += 1;
  }
  return pairs;
}

/**
 * Edits turning `before` into `after`, in order. Apply them one after another:
 * each `at` already accounts for the edits before it.
 */
export function diffText(before: string, after: string, hint?: number): TextEdit[] {
  if (before === after) return [];
  const min = Math.min(before.length, after.length);
  let prefix = commonPrefix(before, after, min);
  if (hint !== undefined && hint >= 0 && hint < prefix) prefix = hint;
  const suffix = commonSuffix(before, after, min - prefix);
  const oldMid = before.slice(prefix, before.length - suffix);
  const newMid = after.slice(prefix, after.length - suffix);

  const oldLines = splitLines(oldMid);
  const newLines = splitLines(newMid);
  if (oldLines.length < 3 || newLines.length < 3 || oldLines.length * newLines.length > MAX_LINE_MATRIX) {
    return [{ at: prefix, del: oldMid.length, ins: newMid }];
  }

  const edits: TextEdit[] = [];
  let shift = 0;
  let i = 0;
  let j = 0;
  let oldPos = prefix;
  const flush = (toI: number, toJ: number) => {
    const a = oldLines.slice(i, toI).join('');
    const b = newLines.slice(j, toJ).join('');
    const edit = singleEdit(a, b, oldPos + shift);
    if (edit) {
      edits.push(edit);
      shift += edit.ins.length - edit.del;
    }
    oldPos += a.length;
  };
  for (const [mi, mj] of [...matchLines(oldLines, newLines), [oldLines.length, newLines.length] as [number, number]]) {
    flush(mi, mj);
    if (mi < oldLines.length) oldPos += oldLines[mi].length;
    i = mi + 1;
    j = mj + 1;
  }
  return edits;
}

/** Apply edits from `diffText` (for tests and replay). */
export function applyEdits(text: string, edits: readonly TextEdit[]): string {
  let out = text;
  for (const edit of edits) out = out.slice(0, edit.at) + edit.ins + out.slice(edit.at + edit.del);
  return out;
}
