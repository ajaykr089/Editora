import React, { useRef, useState } from 'react';
import { MarkdownEditor, type MarkdownEditorHandle } from '@editora/markdown-editor';
import { Button } from '@editora/ui-react';

const panel: React.CSSProperties = { border: '1px solid #e2e8f0', borderRadius: 16, padding: 20, background: '#fff', marginBottom: 20 };
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#0f172a' };
const note: React.CSSProperties = { fontSize: 13, color: '#64748b', marginTop: 10 };

// Enough text, in paragraphs that wrap, to make the panes scroll.
const SECTIONS = Array.from(
  { length: 6 },
  (_, i) => `## Section ${i + 1}\n\n${'Some text to make the document long enough to scroll. '.repeat(6)}`,
).join('\n\n');

const SAMPLE = `---
title: Markdown editor demo
tags: [editor, markdown]
---

# Markdown editor

Write markdown on the left and watch it render on the right. The source is the document, so nothing is
rewritten as you type[^1].

## Try this

- Select a word and press **Cmd/Ctrl+B**, or use the toolbar
- Press Enter in a list to continue it
- [x] Task lists have checkboxes
- [ ] Scroll one pane: the other follows, block for block

| Feature | Status |
| --- | --- |
| Front matter | shown collapsed |
| Footnotes | linked both ways |
| Fullscreen | the button in the header |

\`\`\`ts
const greeting = 'Hello from Editora';
console.log(greeting);
\`\`\`

${SECTIONS}

[^1]: A footnote, with a link back to where it was used.
`;

/** The editor with a fixed height, so the panes scroll together, and buttons that drive it through its ref. */
export function MarkdownEditorDemo() {
  const editor = useRef<MarkdownEditorHandle>(null);
  const [value, setValue] = useState(SAMPLE);
  const [readOnly, setReadOnly] = useState(false);

  return (
    <div>
      <section style={panel}>
        <h2 style={h2}>Markdown Editor</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          <Button size="sm" onClick={() => editor.current?.insertText('![photo](https://placehold.co/320x80)')}>
            Insert image at cursor
          </Button>
          <Button size="sm" variant="secondary" onClick={() => editor.current?.runCommand('table')}>
            Insert table
          </Button>
          <Button size="sm" variant="secondary" onClick={() => editor.current?.runCommand('taskList')}>
            Task list
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setReadOnly((on) => !on)}>
            {readOnly ? 'Make editable' : 'Make read-only'}
          </Button>
        </div>
        <MarkdownEditor ref={editor} value={value} onChange={setValue} height={560} readOnly={readOnly} />
        <p style={note}>
          The buttons above use the editor&apos;s ref (<code>insertText</code>, <code>runCommand</code>). They act at the cursor,
          so click in the text first, and do nothing while it is read-only. The value below is the markdown, exactly as in
          the editor.
        </p>
      </section>

      <section style={panel}>
        <h2 style={h2}>Value</h2>
        <pre style={{ margin: 0, maxHeight: 220, overflow: 'auto', fontSize: 12, whiteSpace: 'pre-wrap' }}>{value}</pre>
      </section>
    </div>
  );
}
