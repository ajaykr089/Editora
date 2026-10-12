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
  SearchExtension,
  SyntaxHighlightingExtension,
  createEditor,
} from '@editora/light-code-editor';
import '@editora/light-code-editor/light-code-editor.css';

const container = document.getElementById('editor');

if (!container) {
  throw new Error('Missing #editor container');
}

const editor = createEditor(container, {
  value: `interface User {
  id: number;
  name: string;
}

function greet(user: User): string {
  if (!user.name) {
    return 'Hello, stranger';
  }

  return \`Hello, \${user.name}\`;
}

console.log(greet({ id: 1, name: 'Ada' }));
`,
  theme: 'dark',
  tabSize: 2,
  lineNumbers: true,
  extensions: [
    new LineNumbersExtension(),
    new SyntaxHighlightingExtension(),
    new SearchExtension(),
    new DiagnosticsExtension(),
    new CompletionExtension(),
    new FormattingExtension(),
    new ContextMenuExtension(),
    new EditingCommandsExtension(),
    new ActiveLineAndIndentGuidesExtension(),
    new BracketMatchingExtension(),
    new CodeFoldingExtension(),
  ],
});

editor.executeCommand('setSyntaxLanguage', 'typescript');

editor.on('change', (changes) => {
  console.log('Content changed:', changes);
});
