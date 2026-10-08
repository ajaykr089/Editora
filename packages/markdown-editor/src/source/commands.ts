/**
 * Text commands for the markdown source editor.
 *
 * Every command is a pure function: it gets the document and the selection (as character offsets) and
 * returns ONE edit - replace `[from, to)` with `insert`, then select `[selectionStart, selectionEnd)` in the
 * new text - or null when it does not apply. The editor applies it as a single replace, so each command
 * is a single undo step, and everything here can be tested without a DOM.
 */

export interface TextState {
  text: string;
  /** Selection start offset (inclusive). */
  start: number;
  /** Selection end offset (exclusive); equal to `start` for a caret. */
  end: number;
}

export interface TextEdit {
  from: number;
  to: number;
  insert: string;
  /** Selection after the edit, as offsets into the text *after* it was applied. */
  selectionStart: number;
  selectionEnd: number;
}

export type MarkdownCommand =
  | 'bold'
  | 'italic'
  | 'strikethrough'
  | 'inlineCode'
  | 'link'
  | 'quote'
  | 'bulletList'
  | 'orderedList'
  | 'taskList'
  | 'codeBlock'
  | 'horizontalRule'
  | 'image'
  | 'table';

export const applyEdit = (text: string, edit: TextEdit): string =>
  text.slice(0, edit.from) + edit.insert + text.slice(edit.to);

export function offsetToPosition(text: string, offset: number): { line: number; column: number } {
  const safe = Math.max(0, Math.min(offset, text.length));
  const before = text.slice(0, safe);
  const line = before.split('\n').length - 1;
  return { line, column: safe - (before.lastIndexOf('\n') + 1) };
}

export function positionToOffset(text: string, position: { line: number; column: number }): number {
  const lines = text.split('\n');
  const line = Math.max(0, Math.min(position.line, lines.length - 1));
  let offset = 0;
  for (let i = 0; i < line; i += 1) offset += lines[i].length + 1;
  return offset + Math.max(0, Math.min(position.column, lines[line].length));
}

export function runMarkdownCommand(command: MarkdownCommand, state: TextState): TextEdit | null {
  switch (command) {
    case 'bold':
      return toggleInline(state, '**', 'bold text');
    case 'italic':
      return toggleInline(state, '*', 'italic text');
    case 'strikethrough':
      return toggleInline(state, '~~', 'struck text');
    case 'inlineCode':
      return toggleInline(state, '`', 'code');
    case 'link':
      return insertLink(state);
    case 'quote':
      return toggleQuote(state);
    case 'bulletList':
      return toggleBulletList(state);
    case 'orderedList':
      return toggleOrderedList(state);
    case 'taskList':
      return toggleTaskList(state);
    case 'codeBlock':
      return toggleCodeBlock(state);
    case 'horizontalRule':
      return insertHorizontalRule(state);
    case 'image':
      return insertImage(state);
    case 'table':
      return insertTable(state);
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------------------------
// Lines
// ---------------------------------------------------------------------------------------------

const lineStartOf = (text: string, offset: number): number =>
  offset <= 0 ? 0 : text.lastIndexOf('\n', offset - 1) + 1;

const lineEndOf = (text: string, offset: number): number => {
  const index = text.indexOf('\n', offset);
  return index === -1 ? text.length : index;
};

interface Block {
  from: number;
  to: number;
  lines: string[];
}

/** The whole lines touched by the selection. A selection ending at the start of a line excludes it. */
function blockOf({ text, start, end }: TextState): Block {
  const from = lineStartOf(text, start);
  const last = end > start && text[end - 1] === '\n' ? end - 1 : end;
  const to = lineEndOf(text, last);
  return { from, to, lines: text.slice(from, to).split('\n') };
}

const isBlank = (line: string): boolean => line.trim() === '';

/** Replace a block of lines, keeping a caret on its line (shifted by what was added or removed) or
 *  selecting the whole block when there was a selection. */
function replaceBlock(state: TextState, block: Block, lines: string[]): TextEdit {
  const insert = lines.join('\n');
  if (state.start !== state.end) {
    return { from: block.from, to: block.to, insert, selectionStart: block.from, selectionEnd: block.from + insert.length };
  }

  const index = state.text.slice(block.from, state.start).split('\n').length - 1;
  const offsetInOld = block.lines.slice(0, index).reduce((sum, line) => sum + line.length + 1, 0);
  const column = state.start - block.from - offsetInOld;
  const offsetInNew = lines.slice(0, index).reduce((sum, line) => sum + line.length + 1, 0);
  const delta = (lines[index]?.length ?? 0) - (block.lines[index]?.length ?? 0);
  const caret = block.from + offsetInNew + Math.max(0, column + delta);
  return { from: block.from, to: block.to, insert, selectionStart: caret, selectionEnd: caret };
}

// ---------------------------------------------------------------------------------------------
// Inline formatting
// ---------------------------------------------------------------------------------------------

/** Length of the run of `char` ending just before `index` (backwards) or starting at it (forwards). */
function runLength(text: string, index: number, char: string, direction: 'back' | 'forward'): number {
  let count = 0;
  if (direction === 'back') {
    while (index - 1 - count >= 0 && text[index - 1 - count] === char) count += 1;
  } else {
    while (index + count < text.length && text[index + count] === char) count += 1;
  }
  return count;
}

/**
 * Whether a run of the marker's character means the marker is on. `*` is overloaded: one or three
 * asterisks is italic, two is bold, so `**bold**` must not read as already italic.
 */
function markerOn(run: number, marker: string): boolean {
  if (marker === '*') return run % 2 === 1;
  if (marker === '**') return run >= 2;
  return run >= marker.length;
}

function toggleInline(state: TextState, marker: string, placeholder: string): TextEdit {
  const { text, start, end } = state;
  const selected = text.slice(start, end);
  if (selected.includes('\n')) return toggleInlinePerLine(state, marker);

  const char = marker.charAt(0);
  const length = marker.length;

  // The markers are inside the selection: unwrap.
  const lead = runLength(selected, 0, char, 'forward');
  const trail = runLength(selected, selected.length, char, 'back');
  if (lead > 0 && trail > 0 && markerOn(Math.min(lead, trail), marker) && selected.length >= length * 2) {
    const inner = selected.slice(length, selected.length - length);
    return { from: start, to: end, insert: inner, selectionStart: start, selectionEnd: start + inner.length };
  }

  // The markers are just outside the selection: unwrap.
  const before = runLength(text, start, char, 'back');
  const after = runLength(text, end, char, 'forward');
  if (before > 0 && after > 0 && markerOn(Math.min(before, after), marker)) {
    return {
      from: start - length,
      to: end + length,
      insert: selected,
      selectionStart: start - length,
      selectionEnd: end - length,
    };
  }

  // Wrap. Spaces stay outside the markers: `** bold **` is not emphasis.
  const core = selected.trim();
  if (!core) {
    const insert = `${marker}${placeholder}${marker}`;
    return { from: start, to: end, insert, selectionStart: start + length, selectionEnd: start + length + placeholder.length };
  }
  const leading = /^\s*/.exec(selected)?.[0] ?? '';
  const trailing = /\s*$/.exec(selected)?.[0] ?? '';
  const insert = `${leading}${marker}${core}${marker}${trailing}`;
  const selectionStart = start + leading.length + length;
  return { from: start, to: end, insert, selectionStart, selectionEnd: selectionStart + core.length };
}

/** Emphasis cannot span a blank line, so a multi-line selection is wrapped (or unwrapped) line by line. */
function toggleInlinePerLine(state: TextState, marker: string): TextEdit {
  const { text, start, end } = state;
  const length = marker.length;
  const lines = text.slice(start, end).split('\n');
  const content = lines.filter((line) => !isBlank(line));
  const wrapped = (line: string): boolean => {
    const core = line.trim();
    return core.length > length * 2 && core.startsWith(marker) && core.endsWith(marker)
      && markerOn(Math.min(runLength(core, 0, marker.charAt(0), 'forward'), runLength(core, core.length, marker.charAt(0), 'back')), marker);
  };
  const unwrap = content.length > 0 && content.every(wrapped);

  const next = lines.map((line) => {
    if (isBlank(line)) return line;
    const leading = /^\s*/.exec(line)?.[0] ?? '';
    const trailing = /\s*$/.exec(line)?.[0] ?? '';
    const core = line.trim();
    return unwrap
      ? `${leading}${core.slice(length, core.length - length)}${trailing}`
      : `${leading}${marker}${core}${marker}${trailing}`;
  });
  const insert = next.join('\n');
  return { from: start, to: end, insert, selectionStart: start, selectionEnd: start + insert.length };
}

const LINK_TEXT = 'link text';

function insertLink({ text, start, end }: TextState): TextEdit {
  const selected = text.slice(start, end);
  if (!selected) {
    const insert = `[${LINK_TEXT}](url)`;
    return { from: start, to: end, insert, selectionStart: start + 1, selectionEnd: start + 1 + LINK_TEXT.length };
  }
  // A selected URL becomes the destination; anything else becomes the link text.
  if (/^(https?:\/\/|www\.)\S+$/i.test(selected.trim())) {
    const insert = `[${LINK_TEXT}](${selected.trim()})`;
    return { from: start, to: end, insert, selectionStart: start + 1, selectionEnd: start + 1 + LINK_TEXT.length };
  }
  const insert = `[${selected}](url)`;
  const urlStart = start + selected.length + 3;
  return { from: start, to: end, insert, selectionStart: urlStart, selectionEnd: urlStart + 3 };
}

const IMAGE_ALT = 'alt text';
const IMAGE_URL = /^(?:https?:\/\/|www\.)\S+$|^\S+\.(?:png|jpe?g|gif|webp|svg|avif)(?:[?#]\S*)?$/i;

function insertImage({ text, start, end }: TextState): TextEdit {
  const selected = text.slice(start, end);
  if (!selected) {
    const insert = `![${IMAGE_ALT}](url)`;
    return { from: start, to: end, insert, selectionStart: start + 2, selectionEnd: start + 2 + IMAGE_ALT.length };
  }
  // A selected address becomes the source; any other selection becomes the description.
  if (IMAGE_URL.test(selected.trim())) {
    const insert = `![${IMAGE_ALT}](${selected.trim()})`;
    return { from: start, to: end, insert, selectionStart: start + 2, selectionEnd: start + 2 + IMAGE_ALT.length };
  }
  const insert = `![${selected}](url)`;
  const urlStart = start + selected.length + 4;
  return { from: start, to: end, insert, selectionStart: urlStart, selectionEnd: urlStart + 3 };
}

// ---------------------------------------------------------------------------------------------
// Block formatting
// ---------------------------------------------------------------------------------------------

const QUOTE =/^(\s{0,3})>\s?/;
const TASK = /^(\s*)[-*+]\s+\[[ xX]\]\s+/;
const BULLET_ONLY = /^(\s*)[-*+]\s+(?!\[[ xX]\](?:\s|$))/;
const ORDERED = /^(\s*)\d+[.)]\s+/;
const HEADING = /^\s{0,3}#{1,6}\s+/;

/** A line without its list marker or task box, plus the indentation it had. */
function stripListMarker(line: string): { indent: string; content: string } {
  const match = TASK.exec(line) ?? BULLET_ONLY.exec(line) ?? ORDERED.exec(line);
  if (match) return { indent: match[1], content: line.slice(match[0].length) };
  const indent = /^\s*/.exec(line)?.[0] ?? '';
  return { indent, content: line.slice(indent.length) };
}

function toggleQuote(state: TextState): TextEdit {
  const block = blockOf(state);
  const content = block.lines.filter((line) => !isBlank(line));
  const allQuoted = content.length > 0 && content.every((line) => QUOTE.test(line));
  const lines = block.lines.map((line) => {
    if (allQuoted) return QUOTE.test(line) ? line.replace(QUOTE, '$1') : line;
    if (!isBlank(line)) return `> ${line}`;
    return block.lines.length > 1 ? '>' : '> ';
  });
  return replaceBlock(state, block, lines);
}

function toggleBulletList(state: TextState): TextEdit {
  const block = blockOf(state);
  const content = block.lines.filter((line) => !isBlank(line));
  const allBullets = content.length > 0 && content.every((line) => BULLET_ONLY.test(line));
  const lines = block.lines.map((line) => {
    if (isBlank(line)) return block.lines.length > 1 ? line : '- ';
    const { indent, content: body } = stripListMarker(line);
    return allBullets ? `${indent}${body}` : `${indent}- ${body}`;
  });
  return replaceBlock(state, block, lines);
}

function toggleOrderedList(state: TextState): TextEdit {
  const block = blockOf(state);
  const content = block.lines.filter((line) => !isBlank(line));
  const allOrdered = content.length > 0 && content.every((line) => ORDERED.test(line));
  let counter = 0;
  const lines = block.lines.map((line) => {
    if (isBlank(line)) return block.lines.length > 1 ? line : '1. ';
    const { indent, content: body } = stripListMarker(line);
    if (allOrdered) return `${indent}${body}`;
    counter += 1;
    return `${indent}${counter}. ${body}`;
  });
  return replaceBlock(state, block, lines);
}

function toggleTaskList(state: TextState): TextEdit {
  const block = blockOf(state);
  const content = block.lines.filter((line) => !isBlank(line));
  const allTasks = content.length > 0 && content.every((line) => TASK.test(line));
  const lines = block.lines.map((line) => {
    if (isBlank(line)) return block.lines.length > 1 ? line : '- [ ] ';
    const { indent, content: body } = stripListMarker(line);
    if (allTasks) return `${indent}${body}`;
    return TASK.test(line) ? line : `${indent}- [ ] ${body}`;
  });
  return replaceBlock(state, block, lines);
}

/**
 * Line numbers `[open, close]` of the fenced block containing `line`, if any. A fence that is never
 * closed runs to the end of the document, as it does when rendered.
 */
function fenceAround(lines: string[], line: number): [number, number] | null {
  let open = -1;
  let fence = '';
  for (let i = 0; i < lines.length; i += 1) {
    if (open === -1) {
      const match = /^\s{0,3}(`{3,}|~{3,})/.exec(lines[i]);
      if (match) {
        open = i;
        fence = match[1];
      }
      continue;
    }
    const match = /^\s{0,3}(`{3,}|~{3,})\s*$/.exec(lines[i]);
    if (match && match[1][0] === fence[0] && match[1].length >= fence.length) {
      if (line >= open && line <= i) return [open, i];
      open = -1;
    }
  }
  return open !== -1 && line >= open ? [open, lines.length - 1] : null;
}

function toggleCodeBlock(state: TextState): TextEdit {
  const { text, start } = state;
  const allLines = text.split('\n');
  const caretLine = text.slice(0, start).split('\n').length - 1;
  const lineOffsets: number[] = [];
  allLines.reduce((offset, line) => {
    lineOffsets.push(offset);
    return offset + line.length + 1;
  }, 0);

  // Inside a fenced block (or on one): take the fences off.
  const around = fenceAround(allLines, caretLine);
  if (around) {
    const [open, close] = around;
    const closed = close > open && /^\s{0,3}(`{3,}|~{3,})\s*$/.test(allLines[close]);
    const inner = allLines.slice(open + 1, closed ? close : allLines.length);
    const from = lineOffsets[open];
    const to = closed ? lineOffsets[close] + allLines[close].length : text.length;
    const insert = inner.join('\n');
    return { from, to, insert, selectionStart: from, selectionEnd: from + insert.length };
  }

  const block = blockOf(state);
  const body = block.lines.join('\n');
  const longest = (body.match(/`{3,}/g) || []).reduce((max, run) => Math.max(max, run.length), 0);
  const fence = '`'.repeat(Math.max(3, longest + 1));
  const insert = `${fence}\n${body}\n${fence}`;
  const bodyStart = block.from + fence.length + 1;
  // On an empty line the caret goes between the fences; otherwise the code stays selected.
  return isBlank(body)
    ? { from: block.from, to: block.to, insert, selectionStart: bodyStart, selectionEnd: bodyStart }
    : { from: block.from, to: block.to, insert, selectionStart: bodyStart, selectionEnd: bodyStart + body.length };
}

function insertHorizontalRule({ text, end }: TextState): TextEdit {
  const lineStart = lineStartOf(text, end);
  const lineEnd = lineEndOf(text, end);
  const line = text.slice(lineStart, lineEnd);

  // A rule directly under a line of text would turn that text into a heading, so a blank line goes first.
  if (!isBlank(line)) {
    const insert = '\n\n---\n\n';
    const caret = lineEnd + insert.length;
    return { from: lineEnd, to: lineEnd, insert, selectionStart: caret, selectionEnd: caret };
  }
  const previousStart = lineStartOf(text, Math.max(0, lineStart - 1));
  const previousBlank = lineStart === 0 || isBlank(text.slice(previousStart, lineStart - 1));
  const insert = `${previousBlank ? '' : '\n'}---\n\n`;
  const caret = lineStart + insert.length;
  return { from: lineStart, to: lineEnd, insert, selectionStart: caret, selectionEnd: caret };
}

const TABLE_COLUMNS = 3;
const TABLE_BODY_ROWS = 2;

/** A table needs a blank line on both sides (right under a paragraph it would be read as paragraph text),
 *  so it goes after the current line, or replaces the line when that is empty. The first header is selected. */
function insertTable({ text, end }: TextState): TextEdit {
  const lineStart = lineStartOf(text, end);
  const lineEnd = lineEndOf(text, end);
  const onBlankLine = isBlank(text.slice(lineStart, lineEnd));

  const row = (cell: (column: number) => string) =>
    `| ${Array.from({ length: TABLE_COLUMNS }, (_, column) => cell(column)).join(' | ')} |`;
  const rows = [
    row((column) => `Header ${column + 1}`),
    row(() => '---'),
    ...Array.from({ length: TABLE_BODY_ROWS }, () => row(() => 'Cell')),
  ];

  const from = onBlankLine ? lineStart : lineEnd;
  const previousStart = lineStartOf(text, Math.max(0, lineStart - 1));
  const previousBlank = lineStart === 0 || isBlank(text.slice(previousStart, lineStart - 1));
  const prefix = onBlankLine ? (previousBlank ? '' : '\n') : '\n\n';

  // The line after the insertion point: a table directly above text would swallow it as a row.
  const nextStart = lineEnd + 1;
  const nextLine = nextStart <= text.length ? text.slice(nextStart, lineEndOf(text, nextStart)) : '';
  const suffix = nextStart < text.length && !isBlank(nextLine) ? '\n' : '';

  const insert = `${prefix}${rows.join('\n')}${suffix}`;
  const firstHeader = from + prefix.length + 2;
  return { from, to: lineEnd, insert, selectionStart: firstHeader, selectionEnd: firstHeader + 'Header 1'.length };
}

// ---------------------------------------------------------------------------------------------
// Headings
// ---------------------------------------------------------------------------------------------

export function headingLevelAt(text: string, offset: number): number {
  const start = lineStartOf(text, offset);
  const match = /^\s{0,3}(#{1,6})\s/.exec(text.slice(start, lineEndOf(text, offset)) + ' ');
  return match ? match[1].length : 0;
}

/** Set the heading level (1-6) of the selected lines, or 0 to make them plain paragraphs. */
export function setHeadingLevel(state: TextState, level: number): TextEdit {
  const block = blockOf(state);
  const prefix = level > 0 ? `${'#'.repeat(level)} ` : '';
  const lines = block.lines.map((line) => {
    if (isBlank(line)) return block.lines.length > 1 ? line : prefix;
    const content = line.replace(HEADING, '').replace(/^\s+/, '');
    return `${prefix}${content}`;
  });
  return replaceBlock(state, block, lines);
}

// ---------------------------------------------------------------------------------------------
// Enter key
// ---------------------------------------------------------------------------------------------

const LIST_LINE = /^(\s*)(?:([-*+])|(\d+)([.)]))(\s+)(\[[ xX]\]\s+)?/;
const QUOTE_LINE = /^(\s{0,3}(?:>\s?)+)/;

/** Indentation of the nearest list item above that is indented less than `indent`, or null. */
function parentIndentOf(text: string, lineStart: number, indent: number): number | null {
  if (indent === 0) return null;
  const above = text.slice(0, Math.max(0, lineStart - 1)).split('\n');
  for (let i = above.length - 1; i >= 0; i -= 1) {
    const match = LIST_LINE.exec(above[i]);
    if (match && match[1].length < indent) return match[1].length;
    if (isBlank(above[i]) || (!match && !/^\s/.test(above[i]))) return null;
  }
  return null;
}

/**
 * Enter inside a list item or quote line: carry the marker onto the next line (numbers count up, task
 * boxes start unchecked), taking any text after the caret with it, so the item splits in two; Enter on
 * an empty item ends the list. Null leaves Enter alone: with a selection, with the caret inside the
 * marker itself, or on any other line.
 */
export function continueMarkdownList({ text, start, end }: TextState): TextEdit | null {
  if (start !== end) return null;
  const lineStart = lineStartOf(text, start);
  const lineEnd = lineEndOf(text, start);
  const line = text.slice(lineStart, lineEnd);
  const caretInLine = start - lineStart;
  const atEnd = start === lineEnd;

  /**
   * Enter on an empty item. Text right under a list or quote would be read as part of it (a lazy
   * continuation), so ending one leaves a blank line before the caret.
   */
  const endBlock = (): TextEdit => {
    const previous = lineStart === 0 ? '' : text.slice(lineStartOf(text, lineStart - 1), lineStart - 1);
    const insert = isBlank(previous) ? '' : '\n';
    const caret = lineStart + insert.length;
    return { from: lineStart, to: lineEnd, insert, selectionStart: caret, selectionEnd: caret };
  };

  const list = LIST_LINE.exec(line);
  if (list) {
    const [prefix, indent, bullet, number, delimiter, space, task] = list;
    if (caretInLine < prefix.length) return null;
    if (atEnd && isBlank(line.slice(prefix.length))) {
      // An empty nested item moves out one level; an empty top-level item ends the list.
      const parentIndent = parentIndentOf(text, lineStart, indent.length);
      if (parentIndent === null) return endBlock();
      const outdented = `${' '.repeat(parentIndent)}${line.slice(indent.length)}`;
      const caret = lineStart + outdented.length;
      return { from: lineStart, to: lineEnd, insert: outdented, selectionStart: caret, selectionEnd: caret };
    }
    const marker = bullet ?? `${Number(number) + 1}${delimiter}`;
    const insert = `\n${indent}${marker}${space}${task ? '[ ] ' : ''}`;
    const caret = start + insert.length;
    return { from: start, to: start, insert, selectionStart: caret, selectionEnd: caret };
  }

  const quote = QUOTE_LINE.exec(line);
  if (quote) {
    if (caretInLine < quote[0].length) return null;
    if (atEnd && isBlank(line.slice(quote[0].length))) return endBlock();
    const marker = quote[1].endsWith(' ') ? quote[1] : `${quote[1]} `;
    const insert = `\n${marker}`;
    const caret = start + insert.length;
    return { from: start, to: start, insert, selectionStart: caret, selectionEnd: caret };
  }
  return null;
}
