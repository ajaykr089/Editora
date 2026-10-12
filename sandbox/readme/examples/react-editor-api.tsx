import { useRef, useState } from 'react';
import { EditoraEditor, type EditorAPI } from '@editora/react';
import { BoldPlugin, HistoryPlugin, ItalicPlugin } from '@editora/plugins/lite';

import '@editora/themes/themes/default.css';
import '@editora/plugins/styles.css';

const plugins = [BoldPlugin(), ItalicPlugin(), HistoryPlugin()];

export default function WithEditorApi() {
  const editor = useRef<EditorAPI | null>(null);
  const [saved, setSaved] = useState('');

  return (
    <>
      <EditoraEditor
        defaultValue="<p>Select some text, then use the buttons below.</p>"
        plugins={plugins}
        onInit={(api) => {
          editor.current = api;
        }}
      />

      <button onClick={() => editor.current?.execCommand('toggleBold')}>Bold</button>
      <button onClick={() => editor.current?.setHTML('<p>Replaced from outside.</p>')}>Replace</button>
      <button onClick={() => setSaved(editor.current?.getHTML() ?? '')}>Read HTML</button>

      <pre>{saved}</pre>
    </>
  );
}
