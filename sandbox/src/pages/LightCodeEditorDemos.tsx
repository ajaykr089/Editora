import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActiveLineAndIndentGuidesExtension,
  BracketMatchingExtension,
  CodeFoldingExtension,
  CompletionExtension,
  ContextMenuExtension,
  DiagnosticsExtension,
  EditingCommandsExtension,
  FormattingExtension,
  LineNumbersExtension,
  ReadOnlyExtension,
  SearchExtension,
  SyntaxHighlightingExtension,
  ThemeExtension,
  createEditor,
  type CompletionProvider,
  type EditorAPI,
  type EditorDiagnostic,
  type EditorExtension,
} from '@editora/light-code-editor';
import { Button, Flex, Grid } from '@editora/ui-react';

const panel: React.CSSProperties = { border: '1px solid #e2e8f0', borderRadius: 16, padding: 20, background: '#fff', marginBottom: 20 };
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#0f172a' };
const h3: React.CSSProperties = { fontSize: 15, fontWeight: 650, marginBottom: 12, color: '#334155' };
const note: React.CSSProperties = { fontSize: 13, color: '#64748b', marginTop: 10 };

type LightEditorProps = {
  value: string;
  theme?: string;
  readOnly?: boolean;
  lineNumbers?: boolean;
  lineWrapping?: boolean;
  tabSize?: number;
  height?: number;
  extensions?: EditorExtension[];
  language?: string;
  onReady?: (editor: EditorAPI) => void;
  onChange?: (value: string) => void;
};

function LightEditor({
  value,
  theme = 'dark',
  readOnly = false,
  lineNumbers = true,
  lineWrapping = false,
  tabSize = 2,
  height = 280,
  extensions = [],
  language = 'typescript',
  onReady,
  onChange,
}: LightEditorProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const onReadyRef = useRef(onReady);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onReadyRef.current = onReady;
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    if (!hostRef.current) return;
    hostRef.current.innerHTML = '';

    const syntax = new SyntaxHighlightingExtension();
    const editor = createEditor(hostRef.current, {
      value,
      theme,
      readOnly,
      lineNumbers,
      lineWrapping,
      tabSize,
      extensions: [
        new LineNumbersExtension(),
        syntax,
        new ThemeExtension(),
        new ActiveLineAndIndentGuidesExtension(),
        new BracketMatchingExtension(),
        ...extensions,
      ],
    });

    editor.executeCommand('setSyntaxLanguage', language);
    editor.on('change', () => onChangeRef.current?.(editor.getValue()));
    onReadyRef.current?.(editor);

    return () => editor.destroy();
  }, []);

  return (
    <div
      ref={hostRef}
      style={{ minHeight: height, border: '1px solid #1e293b', borderRadius: 12, overflow: 'hidden', background: theme === 'light' ? '#fff' : '#0f172a' }}
    />
  );
}

const tsCode = `type Patient = {
  id: string;
  name: string;
  status: 'waiting' | 'triage' | 'complete';
};

const queue: Patient[] = [
  { id: 'P-1001', name: 'Anika Rao', status: 'triage' },
  { id: 'P-1002', name: 'Jon Bell', status: 'waiting' }
];

export function nextPatient() {
  return queue.find((patient) => patient.status === 'waiting');
}
`;

const jsonCode = `{
  "name": "editora-sandbox",
  "features": ["syntax", "search", "diagnostics", "completion"],
  "theme": "dark"
}`;

const diagnostics: EditorDiagnostic[] = [
  {
    severity: 'warning',
    message: 'Consider handling the empty queue state.',
    source: 'demo-lint',
    code: 'QUEUE001',
    range: { start: { line: 10, column: 3 }, end: { line: 10, column: 60 } },
  },
  {
    severity: 'info',
    message: 'Exported functions can be documented for generated API references.',
    source: 'docs',
    code: 'DOCS001',
    range: { start: { line: 9, column: 1 }, end: { line: 9, column: 31 } },
  },
];

const completionProvider: CompletionProvider = (context) => {
  const items = [
    { label: 'patient.status', insertText: 'patient.status', detail: 'Patient status property', kind: 'property' as const },
    { label: 'queue.filter', insertText: 'queue.filter((patient) => patient.status === \"waiting\")', detail: 'Filter waiting patients', kind: 'snippet' as const },
    { label: 'console.table', insertText: 'console.table(queue)', detail: 'Print queue as a table', kind: 'function' as const },
  ];

  return items.filter((item) => item.label.toLowerCase().includes(context.prefix.toLowerCase()));
};

export function LightCodeEditorDemo() {
  const extensions = useMemo(() => [new SearchExtension(), new EditingCommandsExtension(), new ContextMenuExtension()], []);

  return (
    <div>
      <h2 style={h2}>Light Code Editor</h2>
      <div style={panel}>
        <h3 style={h3}>TypeScript workspace</h3>
        <LightEditor value={tsCode} extensions={extensions} language="typescript" />
        <div style={note}>Syntax highlighting, line numbers, active line, bracket matching, context menu, and editing commands.</div>
      </div>
    </div>
  );
}

export function LightCodeEditorLanguageDemo() {
  const [language, setLanguage] = useState('typescript');
  const editorRef = useRef<EditorAPI | null>(null);
  const samples: Record<string, string> = {
    typescript: tsCode,
    json: jsonCode,
    markdown: '# Release checklist\\n\\n- [x] Build package\\n- [ ] Publish sandbox\\n- [ ] Share demo link',
    css: '.editor-shell {\\n  display: grid;\\n  gap: 12px;\\n  color: #0f172a;\\n}',
  };

  return (
    <div>
      <h2 style={h2}>Languages and Themes</h2>
      <div style={panel}>
        <Flex style={{ gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {Object.keys(samples).map((item) => (
            <Button
              key={item}
              size="sm"
              variant={language === item ? 'primary' : 'secondary'}
              onClick={() => {
                setLanguage(item);
                editorRef.current?.setValue(samples[item]);
                editorRef.current?.executeCommand('setSyntaxLanguage', item);
              }}
            >
              {item}
            </Button>
          ))}
          <Button size="sm" variant="ghost" onClick={() => editorRef.current?.executeCommand('toggleTheme')}>Toggle theme</Button>
        </Flex>
        <LightEditor value={samples.typescript} language={language} onReady={(editor) => (editorRef.current = editor)} />
      </div>
    </div>
  );
}

export function LightCodeEditorSearchDemo() {
  const editorRef = useRef<EditorAPI | null>(null);
  const extensions = useMemo(() => [new SearchExtension({ replaceAndFindNext: true }), new EditingCommandsExtension()], []);

  return (
    <div>
      <h2 style={h2}>Search and Replace</h2>
      <div style={panel}>
        <Flex style={{ gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <Button size="sm" onClick={() => editorRef.current?.executeCommand('find')}>Open find</Button>
          <Button size="sm" variant="secondary" onClick={() => editorRef.current?.executeCommand('findNext')}>Next match</Button>
          <Button size="sm" variant="secondary" onClick={() => editorRef.current?.replaceAll('patient', 'member')}>Replace patient</Button>
        </Flex>
        <LightEditor value={tsCode} extensions={extensions} onReady={(editor) => (editorRef.current = editor)} />
      </div>
    </div>
  );
}

export function LightCodeEditorDiagnosticsDemo() {
  const diagnosticExtension = useMemo(() => new DiagnosticsExtension({ diagnostics, showStatusBar: true }), []);

  return (
    <div>
      <h2 style={h2}>Diagnostics</h2>
      <div style={panel}>
        <h3 style={h3}>Warnings, gutter markers, and status</h3>
        <LightEditor value={tsCode} extensions={[diagnosticExtension, new SearchExtension()]} />
      </div>
    </div>
  );
}

export function LightCodeEditorCompletionDemo() {
  const extensions = useMemo(() => [
    new CompletionExtension({
      providers: [completionProvider],
      minPrefixLength: 0,
      autoTrigger: true,
      triggerCharacters: ['.', 'q', 'p'],
    }),
    new EditingCommandsExtension(),
  ], []);

  return (
    <div>
      <h2 style={h2}>Completion</h2>
      <div style={panel}>
        <h3 style={h3}>Completion provider</h3>
        <LightEditor value={`${tsCode}\\n// Type queue or patient to see suggestions\\n`} extensions={extensions} />
        <div style={note}>Try typing "queue" or "patient" in the editor, or use the keyboard shortcut for completions if enabled by the extension.</div>
      </div>
    </div>
  );
}

export function LightCodeEditorFormattingDemo() {
  const editorRef = useRef<EditorAPI | null>(null);
  const formatter = useMemo(() => new FormattingExtension({
    formatter: ({ input }) => input
      .replace(/\\{\\s+/g, '{\\n  ')
      .replace(/,\\s+/g, ',\\n  ')
      .replace(/\\s+\\}/g, '\\n}')
      .trim(),
  }), []);

  return (
    <div>
      <h2 style={h2}>Formatting</h2>
      <div style={panel}>
        <Flex style={{ gap: 8, marginBottom: 12 }}>
          <Button size="sm" onClick={() => editorRef.current?.executeCommand('formatDocument')}>Format document</Button>
          <Button size="sm" variant="secondary" onClick={() => editorRef.current?.setValue('{ name: \"Editora\", type: \"demo\", ready: true }')}>Reset messy code</Button>
        </Flex>
        <LightEditor
          value={'{ name: "Editora", type: "demo", ready: true }'}
          language="javascript"
          lineWrapping
          extensions={[formatter, new EditingCommandsExtension()]}
          onReady={(editor) => (editorRef.current = editor)}
        />
      </div>
    </div>
  );
}

export function LightCodeEditorReadOnlyDemo() {
  return (
    <div>
      <h2 style={h2}>Read-only Code Review</h2>
      <Grid style={{ gap: 20 }}>
        <div style={panel}>
          <h3 style={h3}>Read-only with wrapping</h3>
          <LightEditor value={jsonCode} language="json" theme="light" readOnly lineWrapping height={220} extensions={[new ReadOnlyExtension()]} />
        </div>
        <div style={panel}>
          <h3 style={h3}>No line numbers</h3>
          <LightEditor value="npm install @editora/light-code-editor\\nnpm run dev" language="bash" lineNumbers={false} height={180} />
        </div>
      </Grid>
    </div>
  );
}

export function LightCodeEditorFullDemo() {
  const editorRef = useRef<EditorAPI | null>(null);
  const extensions = useMemo(() => [
    new SearchExtension(),
    new DiagnosticsExtension({ diagnostics, showStatusBar: true }),
    new CompletionExtension({ providers: [completionProvider], autoTrigger: true, minPrefixLength: 0 }),
    new FormattingExtension(),
    new ContextMenuExtension(),
    new EditingCommandsExtension(),
    new CodeFoldingExtension(),
  ], []);

  return (
    <div>
      <h2 style={h2}>Full Light Code Editor</h2>
      <div style={panel}>
        <Flex style={{ gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <Button size="sm" onClick={() => editorRef.current?.executeCommand('find')}>Find</Button>
          <Button size="sm" variant="secondary" onClick={() => editorRef.current?.executeCommand('formatDocument')}>Format</Button>
          <Button size="sm" variant="secondary" onClick={() => editorRef.current?.executeCommand('toggleTheme')}>Theme</Button>
        </Flex>
        <LightEditor value={tsCode} height={360} extensions={extensions} onReady={(editor) => (editorRef.current = editor)} />
        <div style={note}>Combined syntax, search, diagnostics, completion, formatting, folding, context menu, and command controls.</div>
      </div>
    </div>
  );
}
