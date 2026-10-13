import { useEffect, useRef, useState } from 'react';
import {
  LineNumbersExtension,
  SearchExtension,
  SyntaxHighlightingExtension,
  createEditor,
  type EditorAPI,
} from '@editora/light-code-editor';
import '@editora/light-code-editor/light-code-editor.css';

type CodeEditorProps = { value: string; onChange: (value: string) => void; language?: string };

export function CodeEditor({ value, onChange, language = 'json' }: CodeEditorProps) {
  const container = useRef<HTMLDivElement>(null);
  const editor = useRef<EditorAPI | null>(null);
  const latestOnChange = useRef(onChange);
  latestOnChange.current = onChange;

  // Create the editor once, and destroy it when the component goes away.
  useEffect(() => {
    const instance = createEditor(container.current as HTMLElement, {
      value,
      lineNumbers: true,
      extensions: [new LineNumbersExtension(), new SyntaxHighlightingExtension(), new SearchExtension()],
    });
    instance.executeCommand('setSyntaxLanguage', language);
    instance.on('change', () => latestOnChange.current(instance.getValue()));
    editor.current = instance;
    return () => instance.destroy();
  }, []);

  // Copy a value that changed outside the editor into it, but not the editor's own edits.
  useEffect(() => {
    if (editor.current && editor.current.getValue() !== value) editor.current.setValue(value);
  }, [value]);

  return <div ref={container} style={{ height: 180 }} />;
}

export default function App() {
  const [config, setConfig] = useState('{\n  "name": "my-app",\n  "private": true\n}\n');

  return (
    <>
      <CodeEditor value={config} onChange={setConfig} />
      <p>{config.length} characters</p>
      <button onClick={() => setConfig('{}\n')}>Reset</button>
    </>
  );
}
