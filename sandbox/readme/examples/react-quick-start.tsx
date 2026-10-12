import { useState } from 'react';
import { EditoraEditor } from '@editora/react';
import {
  BoldPlugin,
  HeadingPlugin,
  HistoryPlugin,
  ItalicPlugin,
  LinkPlugin,
  ListPlugin,
  UnderlinePlugin,
} from '@editora/plugins/lite';

import '@editora/themes/themes/default.css';
import '@editora/plugins/styles.css';

// Create the plugins once, outside the component (or with useMemo), so the editor is not rebuilt on every render.
const plugins = [
  HeadingPlugin(),
  BoldPlugin(),
  ItalicPlugin(),
  UnderlinePlugin(),
  ListPlugin(),
  LinkPlugin(),
  HistoryPlugin(),
];

const toolbar = {
  items: ['undo', 'redo', 'heading', 'bold', 'italic', 'underline', 'link', 'bullist', 'numlist'],
};

export default function App() {
  const [html, setHtml] = useState('<h2>Launch briefing</h2><p>Start writing, or paste something in.</p>');

  return (
    <EditoraEditor
      value={html}
      onChange={setHtml}
      plugins={plugins}
      toolbar={toolbar}
      placeholder="Start writing..."
    />
  );
}
