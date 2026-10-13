import { EditoraEditor } from '@editora/react';
import { BoldPlugin, HistoryPlugin, ItalicPlugin, LinkPlugin, ListPlugin } from '@editora/plugins/lite';

import '@editora/themes/themes/default.css';
import '@editora/plugins/styles.css';
import './my-brand.css';

const plugins = [BoldPlugin(), ItalicPlugin(), ListPlugin(), LinkPlugin(), HistoryPlugin()];

export default function BrandedEditor() {
  return (
    <div data-theme="my-brand">
      <EditoraEditor
        defaultValue="<h2>Our own look</h2><p>Select <strong>this text</strong> and the buttons show the brand colour.</p>"
        plugins={plugins}
      />
    </div>
  );
}
