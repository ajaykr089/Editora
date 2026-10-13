import { EditoraEditor } from '@editora/react';
import { BoldPlugin, HistoryPlugin, ItalicPlugin } from '@editora/plugins/lite';

import '@editora/plugins/styles.css';
import './dark-brand.css'; // the file above: it imports default.css and dark.css, then changes them

export default function DarkBrand() {
  return (
    <div data-theme="dark">
      <EditoraEditor defaultValue="<p>The dark theme, with a cyan border.</p>" plugins={[BoldPlugin(), ItalicPlugin(), HistoryPlugin()]} />
    </div>
  );
}
