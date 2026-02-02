import { useState } from 'react';
import { RichTextEditor } from '@editora/react';
import {
  createBoldPlugin,
  createItalicPlugin,
  createUnderlinePlugin,
  createStrikethroughPlugin,
  createHeadingPlugin,
  createParagraphPlugin,
  createListPlugin,
  createLinkPlugin,
  createHistoryPlugin
} from '@editora/plugins';
import '@editora/themes/styles';
import './App.css';

function App() {
  const [content, setContent] = useState('<p>Welcome to <strong>Editora</strong>!</p><p>Start typing to see it in action...</p>');

  // Initialize plugins
  const plugins = [
    createBoldPlugin(),
    createItalicPlugin(),
    createUnderlinePlugin(),
    createStrikethroughPlugin(),
    createHeadingPlugin(),
    createParagraphPlugin(),
    createListPlugin(),
    createLinkPlugin(),
    createHistoryPlugin()
  ];

  return (
    <div className="app">
      <header className="app-header">
        <h1>Editora - Basic Example</h1>
        <p>A simple rich text editor setup with essential formatting tools</p>
      </header>

      <main className="app-main">
        <div className="editor-container">
          <RichTextEditor
            value={content}
            onChange={setContent}
            plugins={plugins}
            placeholder="Start typing..."
            theme="light"
          />
        </div>

        <div className="output-container">
          <h2>Output (HTML)</h2>
          <pre><code>{content}</code></pre>
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Learn more at{' '}
          <a href="https://github.com/ajaykr089/Editora" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
