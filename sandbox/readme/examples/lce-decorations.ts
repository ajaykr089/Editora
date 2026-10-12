import { createEditor, type EditorDecoration } from '@editora/light-code-editor';
import '@editora/light-code-editor/light-code-editor.css';

const editor = createEditor(document.getElementById('editor') as HTMLElement, {
  value: `const total = items.reduce((sum, item) => sum + item.price, 0);
const tax = total * 0.2;
console.log(totl + tax);
`,
  lineNumbers: true,
});

const decorations: EditorDecoration[] = [
  // Tint a whole line.
  { id: 'review-line', type: 'line', line: 2, className: 'lce-decoration-line--active' },
  // Put a badge in the gutter.
  { id: 'review-gutter', type: 'gutter', line: 2, label: '●', title: 'Unknown name', className: 'lce-decoration-gutter--error' },
  // Mark a range of text.
  {
    id: 'review-inline',
    type: 'inline',
    range: { start: { line: 2, column: 12 }, end: { line: 2, column: 16 } },
    style: {
      backgroundColor: 'rgba(255, 107, 107, 0.18)',
      textDecoration: 'underline wavy rgba(255, 107, 107, 0.95)',
    },
  },
];

// A layer is replaced as a whole: call setDecorations again with the full next set.
editor.setDecorations('review', decorations);
