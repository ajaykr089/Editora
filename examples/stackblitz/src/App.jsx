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

// Create the plugins once, outside the component, so the editor is not rebuilt on every render.
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
  const [html, setHtml] = useState(
    '<h2>Welcome to Editora</h2><p>Select some text and use the toolbar, or just start typing.</p>'
  );

  return (
    <main className="page">
      <h1>Editora</h1>
      <p className="lead">A free, accessible rich text editor for React and the web.</p>

      <EditoraEditor
        value={html}
        onChange={setHtml}
        plugins={plugins}
        toolbar={toolbar}
        placeholder="Start writing..."
      />

      <h2 className="label">Output HTML</h2>
      <pre className="output">{html}</pre>

      <p className="links">
        <a href="https://editora-ecosystem.netlify.app/" target="_blank" rel="noreferrer">Docs</a>
        {' · '}
        <a href="https://github.com/ajaykr089/Editora" target="_blank" rel="noreferrer">GitHub</a>
        {' · '}
        <a href="https://www.npmjs.com/package/@editora/react" target="_blank" rel="noreferrer">npm</a>
      </p>
    </main>
  );
}
