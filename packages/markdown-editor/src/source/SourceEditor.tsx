import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  createEditor,
  LineNumbersExtension,
  SearchExtension,
  SyntaxHighlightingExtension,
} from '@editora/light-code-editor';
import { StatusBar, calculateTextStats } from '@editora/core';
import {
  continueMarkdownList,
  headingLevelAt,
  offsetToPosition,
  positionToOffset,
  runMarkdownCommand,
  setHeadingLevel,
  type MarkdownCommand,
  type TextEdit,
  type TextState,
} from './commands';
import type { MarkdownEditorLabels } from '../components/labels';
import { SourceToolbar, type ToolbarCommand } from './SourceToolbar';
import { readEditoraTheme, useEditoraTheme } from './useEditoraTheme';

type CodeEditor = ReturnType<typeof createEditor>;

export interface SourceEditorProps {
  labels: MarkdownEditorLabels;
  value: string;
  onChange: (value: string) => void;
  readOnly: boolean;
  placeholder: string;
  /** Called when the text is scrolled, by the user or by `scrollToLine`. */
  onScroll?: (info: ScrollInfo) => void;
}

export interface ScrollInfo {
  scrollTop: number;
  /** Whether the text is scrolled as far down as it goes. */
  atBottom: boolean;
}

export interface SourceEditorHandle {
  focus(): void;
  /** Replaces the selection with text and puts the caret after it. False when read-only. */
  insertText(text: string): boolean;
  /** Runs a toolbar command on the selection. False when read-only or when it does not apply. */
  runCommand(command: MarkdownCommand): boolean;
  /** The (fractional, 0-based) line of the text at the top of the visible area. */
  getTopLine(): number;
  /**
   * Scrolls so that a (fractional, 0-based) line is at the top of the visible area; a line past the last
   * scrolls to the end. Returns the scroll position it ended at.
   */
  scrollToLine(line: number): number;
}

/** The code editor keeps lines separated by "\n"; a stray "\r" would show up as a character. */
const normalizeNewlines = (text: string): string => text.replace(/\r\n?/g, '\n');

/** Offset of the first character of every line. */
const lineStarts = (text: string): number[] => {
  const starts = [0];
  for (let i = 0; i < text.length; i += 1) if (text.charCodeAt(i) === 10) starts.push(i + 1);
  return starts;
};

/**
 * Where each line is. The code editor draws the text as one flow (a wrapped line is several rows, there is
 * no element per line), so the only way to find a line on screen is to ask the browser where its first
 * character is. `topOf(line)` is the distance from the top of the scrollable content to the line's first
 * row; for a line past the last it is the bottom of the text.
 *
 * An empty line has no character to ask about (the browser gives an empty rectangle), so it is placed from
 * the nearest line that has text, a line height away for each line in between.
 */
const measureLines = (editor: CodeEditor) => {
  const view = editor.getView();
  const scroller = view.getScrollElement();
  const text = editor.getValue();
  const starts = lineStarts(text);
  const origin = scroller.getBoundingClientRect().top - scroller.scrollTop;

  const style = getComputedStyle(view.getContentElement());
  const pitch = parseFloat(style.lineHeight) || (parseFloat(style.fontSize) || 14) * 1.5;

  /** The top of the row that holds the character at `offset`, or null when there is none to ask about. */
  const rowTop = (offset: number): number | null => {
    const rect = view.createDomRangeFromOffsets(offset, offset)?.getClientRects()[0];
    return rect && (rect.width > 0 || rect.height > 0) ? rect.top - origin : null;
  };
  const lineEnd = (line: number): number => (line + 1 < starts.length ? starts[line + 1] - 1 : text.length);

  const tops = new Map<number, number>();
  const topOf = (line: number): number => {
    const index = Math.max(0, line);
    const known = tops.get(index);
    if (known !== undefined) return known;

    let top: number;
    if (index >= starts.length) {
      // The bottom of the text: a row below the top of the last row of the last line.
      const last = starts.length - 1;
      top = (rowTop(lineEnd(last)) ?? topOf(last)) + pitch;
    } else {
      const own = rowTop(starts[index]);
      if (own !== null) {
        top = own;
      } else {
        let after = index + 1;
        while (after < starts.length && rowTop(starts[after]) === null) after += 1;
        if (after < starts.length) {
          top = topOf(after) - (after - index) * pitch;
        } else {
          let before = index - 1;
          while (before >= 0 && rowTop(starts[before]) === null) before -= 1;
          top = before >= 0 ? (rowTop(lineEnd(before)) ?? topOf(before)) + (index - before) * pitch : 0;
        }
      }
    }
    tops.set(index, top);
    return top;
  };
  return { scroller, lines: starts.length, topOf };
};

const topLineOf = (editor: CodeEditor): number => {
  const { scroller, lines, topOf } = measureLines(editor);
  // The first line sits a little below the top of the content (its padding); scrolled to the very top, that
  // line is the one at the top, so positions are measured from there.
  const scrollTop = scroller.scrollTop + topOf(0);
  // The last line that starts at or above the top of the visible area (tops only ever increase).
  let low = 0;
  let high = lines - 1;
  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    if (topOf(middle) <= scrollTop + 1) low = middle;
    else high = middle - 1;
  }
  const top = topOf(low);
  const next = topOf(low + 1);
  return next > top ? low + Math.min(0.999, Math.max(0, (scrollTop - top) / (next - top))) : low;
};

const scrollToLineOf = (editor: CodeEditor, line: number): number => {
  const { scroller, lines, topOf } = measureLines(editor);
  const whole = Math.max(0, Math.min(Math.floor(line), lines));
  const top = topOf(whole);
  const next = topOf(whole + 1);
  const position = top + (next > top ? Math.max(0, Math.min(1, line - whole)) * (next - top) : 0);
  scroller.scrollTop = position - topOf(0);
  return scroller.scrollTop;
};

const SHORTCUTS: Record<string, MarkdownCommand | undefined> = {
  b: 'bold',
  i: 'italic',
  k: 'link',
  e: 'inlineCode',
};

/**
 * Edit pane for markdown as plain text: the markdown is the document, so nothing is converted and
 * nothing is lost, whatever the markdown contains. A toolbar in the Editora editor's style and the usual
 * shortcuts edit the text, Enter continues lists and quotes, and the status bar is Editora's.
 */
export const SourceEditor = forwardRef<SourceEditorHandle, SourceEditorProps>(function SourceEditor(
  { labels, value, onChange, readOnly, placeholder, onScroll },
  ref,
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<CodeEditor | null>(null);
  const statusBarRef = useRef<StatusBar | null>(null);
  const applyingExternalValue = useRef(false);
  const onChangeRef = useRef(onChange);
  const readOnlyRef = useRef(readOnly);
  const onScrollRef = useRef(onScroll);
  const labelsRef = useRef(labels);
  const [empty, setEmpty] = useState(value === '');
  const [headingLevel, setHeadingLevelState] = useState(0);
  const theme = useEditoraTheme(rootRef);

  useEffect(() => {
    onChangeRef.current = onChange;
    readOnlyRef.current = readOnly;
    onScrollRef.current = onScroll;
    labelsRef.current = labels;
  });

  const currentState = useCallback((): TextState | null => {
    const editor = editorRef.current;
    if (!editor) return null;
    const text = editor.getValue();
    const selection = editor.getView().getSelectionOffsets();
    if (selection.isInEditor) {
      return {
        text,
        start: Math.min(selection.startOffset, selection.endOffset),
        end: Math.max(selection.startOffset, selection.endOffset),
      };
    }
    // Nothing selected in the editor (it was never focused): act at the last known caret.
    const caret = positionToOffset(text, editor.getCursor().position);
    return { text, start: caret, end: caret };
  }, []);

  const refreshStatus = useCallback(() => {
    const state = currentState();
    const bar = statusBarRef.current;
    if (!state || !bar) return;

    const { words, chars } = calculateTextStats(state.text);
    const from = offsetToPosition(state.text, state.start);
    const to = offsetToPosition(state.text, state.end);
    const collapsed = state.start === state.end;
    bar.update({
      language: labelsRef.current.statusLanguage,
      wordCount: words,
      charCount: chars,
      lineCount: state.text.split('\n').length,
      cursorPosition: collapsed ? { line: from.line + 1, column: from.column + 1 } : undefined,
      selectionInfo: collapsed
        ? undefined
        : {
            startLine: from.line + 1,
            startColumn: from.column + 1,
            endLine: to.line + 1,
            endColumn: to.column + 1,
            selectedChars: state.end - state.start,
            selectedWords: calculateTextStats(state.text.slice(state.start, state.end)).words,
          },
    });
    setHeadingLevelState(headingLevelAt(state.text, state.start));
  }, [currentState]);

  /** Apply one command's edit as a single replace (one undo step) and select what it asks for. */
  const applyTextEdit = useCallback(
    (edit: TextEdit | null) => {
      const editor = editorRef.current;
      if (!edit || !editor || readOnlyRef.current) return;
      const text = editor.getValue();
      editor.replace(
        { start: offsetToPosition(text, edit.from), end: offsetToPosition(text, edit.to) },
        edit.insert,
      );
      editor.getView().setSelectionOffsets(edit.selectionStart, edit.selectionEnd);
      editor.focus();
      refreshStatus();
    },
    [refreshStatus],
  );

  const handleCommand = useCallback(
    (command: ToolbarCommand) => {
      const editor = editorRef.current;
      if (!editor || readOnlyRef.current) return;
      if (command === 'undo' || command === 'redo') {
        editor.executeCommand(command);
        editor.focus();
        refreshStatus();
        return;
      }
      const state = currentState();
      if (state) applyTextEdit(runMarkdownCommand(command, state));
    },
    [applyTextEdit, currentState, refreshStatus],
  );

  const handleHeading = useCallback(
    (level: number) => {
      const state = currentState();
      if (state) applyTextEdit(setHeadingLevel(state, level));
    },
    [applyTextEdit, currentState],
  );

  useImperativeHandle(
    ref,
    () => ({
      focus: () => editorRef.current?.focus(),
      insertText: (text) => {
        const state = currentState();
        if (!state || readOnlyRef.current) return false;
        const caret = state.start + text.length;
        applyTextEdit({ from: state.start, to: state.end, insert: text, selectionStart: caret, selectionEnd: caret });
        return true;
      },
      runCommand: (command) => {
        const state = currentState();
        const edit = state && !readOnlyRef.current ? runMarkdownCommand(command, state) : null;
        applyTextEdit(edit);
        return edit !== null;
      },
      getTopLine: () => {
        const editor = editorRef.current;
        return editor ? topLineOf(editor) : 0;
      },
      scrollToLine: (line) => {
        const editor = editorRef.current;
        return editor ? scrollToLineOf(editor, line) : 0;
      },
    }),
    [applyTextEdit, currentState],
  );

  // Create the code editor and the status bar once.
  useEffect(() => {
    const host = hostRef.current;
    const statusHost = statusRef.current;
    if (!host || !statusHost) return undefined;

    const editor = createEditor(host, {
      value: normalizeNewlines(value),
      theme: readEditoraTheme(rootRef.current),
      readOnly,
      lineNumbers: true,
      lineWrapping: true,
      tabSize: 2,
      extensions: [new LineNumbersExtension(), new SyntaxHighlightingExtension(), new SearchExtension()],
    });
    editor.executeCommand('setSyntaxLanguage', 'markdown');
    editorRef.current = editor;

    const surface = editor.getView().getContentElement();
    surface.setAttribute('role', 'textbox');
    surface.setAttribute('aria-multiline', 'true');
    surface.setAttribute('aria-label', labelsRef.current.sourceTextbox);
    surface.setAttribute('spellcheck', 'false');

    const bar = new StatusBar({ enabled: true, position: 'bottom' });
    bar.create(statusHost);
    statusBarRef.current = bar;

    const handleChange = () => {
      if (applyingExternalValue.current) return;
      const next = editor.getValue();
      setEmpty(next === '');
      onChangeRef.current(next);
      refreshStatus();
    };
    editor.on('change', handleChange);
    editor.on('cursor', refreshStatus);
    editor.on('selection', refreshStatus);

    const handleSelectionChange = () => {
      if (rootRef.current?.contains(document.activeElement)) refreshStatus();
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    refreshStatus();

    const scroller = editor.getView().getScrollElement();
    const handleScroll = () =>
      onScrollRef.current?.({
        scrollTop: scroller.scrollTop,
        atBottom: scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1,
      });
    scroller.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scroller.removeEventListener('scroll', handleScroll);
      document.removeEventListener('selectionchange', handleSelectionChange);
      editor.destroy();
      bar.destroy();
      editorRef.current = null;
      statusBarRef.current = null;
    };
    // The editor is created once; later changes to value, readOnly and theme are applied below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A value that changed from outside (not an echo of what the editor just reported) replaces the text.
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const next = normalizeNewlines(value);
    if (editor.getValue() === next) return;
    applyingExternalValue.current = true;
    try {
      editor.setValue(next);
    } finally {
      applyingExternalValue.current = false;
    }
    setEmpty(next === '');
    refreshStatus();
  }, [value, refreshStatus]);

  // The labels can change after the editor was created; the status bar picks the language up on its next refresh.
  useEffect(() => {
    editorRef.current?.getView().getContentElement().setAttribute('aria-label', labels.sourceTextbox);
    refreshStatus();
  }, [labels.sourceTextbox, labels.statusLanguage, refreshStatus]);

  useEffect(() => {
    editorRef.current?.setReadOnly(readOnly);
    editorRef.current?.getView().getContentElement().setAttribute('aria-readonly', readOnly ? 'true' : 'false');
  }, [readOnly]);

  useEffect(() => {
    editorRef.current?.setTheme(theme);
  }, [theme]);

  // Shortcuts and list continuation. A native capture listener, because the code editor handles keys on
  // its own element and this has to run first (React's synthetic capture would be too late before React 17).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (readOnlyRef.current || event.isComposing) return;
      const inEditor = hostRef.current?.contains(event.target as Node) ?? false;
      const modifier = event.metaKey || event.ctrlKey;

      let command: MarkdownCommand | undefined;
      if (modifier && !event.altKey) {
        const key = event.key.toLowerCase();
        if (key === 'x' && event.shiftKey) command = 'strikethrough';
        else if (!event.shiftKey) command = SHORTCUTS[key];
      }
      if (command && inEditor) {
        event.preventDefault();
        event.stopPropagation();
        const state = currentState();
        if (state) applyTextEdit(runMarkdownCommand(command, state));
        return;
      }

      if (event.key === 'Enter' && !modifier && !event.shiftKey && !event.altKey && inEditor) {
        const state = currentState();
        const edit = state ? continueMarkdownList(state) : null;
        if (edit) {
          event.preventDefault();
          event.stopPropagation();
          applyTextEdit(edit);
        }
      }
    };

    root.addEventListener('keydown', handleKeyDown, true);
    return () => root.removeEventListener('keydown', handleKeyDown, true);
  }, [applyTextEdit, currentState]);

  return (
    <div className="md-source" ref={rootRef}>
      <SourceToolbar labels={labels} disabled={readOnly} headingLevel={headingLevel} onCommand={handleCommand} onHeading={handleHeading} />
      <div className="md-source-surface">
        <div className="md-source-editor" ref={hostRef} />
        {empty && (
          <div className="md-source-placeholder" aria-hidden="true">
            {placeholder}
          </div>
        )}
      </div>
      <div className="editora-statusbar-container" ref={statusRef} />
    </div>
  );
});
