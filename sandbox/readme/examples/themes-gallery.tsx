import { EditoraEditor } from '@editora/react';
import { BoldPlugin, HistoryPlugin, ItalicPlugin, LinkPlugin, ListPlugin, UnderlinePlugin } from '@editora/plugins/lite';

import '@editora/themes/themes/default.css';
import '@editora/themes/themes/dark.css';
import '@editora/themes/themes/acme.css';
import '@editora/plugins/styles.css';

const plugins = [BoldPlugin(), ItalicPlugin(), UnderlinePlugin(), ListPlugin(), LinkPlugin(), HistoryPlugin()];
const text = (name: string) => `<p>The <strong>${name}</strong> theme, with a toolbar, text and a <a href="#">link</a>.</p>`;

// Put data-theme on any element: everything inside it follows that theme.
export default function ThemeGallery() {
  return (
    <>
      <div data-theme="light">
        <EditoraEditor defaultValue={text('light')} plugins={plugins} content={{ minHeight: 70 }} />
      </div>
      <div data-theme="dark">
        <EditoraEditor defaultValue={text('dark')} plugins={plugins} content={{ minHeight: 70 }} />
      </div>
      <div data-theme="acme">
        <EditoraEditor defaultValue={text('acme')} plugins={plugins} content={{ minHeight: 70 }} />
      </div>
    </>
  );
}
