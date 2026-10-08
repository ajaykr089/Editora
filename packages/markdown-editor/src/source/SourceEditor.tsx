import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { SourceToolbar, type ToolbarCommand } from './SourceToolbar';
import { readEditoraTheme, useEditoraTheme } from './useEditoraTheme';

type CodeEditor = ReturnType<typeof createEditor>;

export interface SourceEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly: boolean;
  placeholder: string;
}

/** The code editor keeps lines separated by "\n"; a stray "\r" would show up as a character. */
const normalizeNewlines = (text: string): string => text.replace(/\r\n?/g, '\n');

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
export const SourceEditor: React.FC<SourceEditorProps> = ({ value, onChange, readOnly, placeholder }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<CodeEditor | null>(null);
  const statusBarRef = useRef<StatusBar | null>(null);
  const applyingExternalValue = useRef(false);
  const onChangeRef = useRef(onChange);
  const readOnlyRef = useRef(readOnly);
  const [empty, setEmpty] = useState(value === '');
  const [headingLevel, setHeadingLevelState] = useState(0);
  const theme = useEditoraTheme(rootRef);

  useEffect(() => {
    onChangeRef.current = onChange;
    readOnlyRef.current = readOnly;
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
      language: 'Markdown',
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
    surface.setAttribute('aria-label', 'Markdown source');
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

    return () => {
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
      <SourceToolbar disabled={readOnly} headingLevel={headingLevel} onCommand={handleCommand} onHeading={handleHeading} />
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
};
