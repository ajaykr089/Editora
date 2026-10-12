import { EditoraEditor } from '@editora/react';
import { BoldPlugin, HistoryPlugin, ItalicPlugin, LinkPlugin, UnderlinePlugin } from '@editora/plugins/lite';

import '@editora/themes/themes/default.css';
import '@editora/themes/themes/dark.css';
import '@editora/themes/themes/acme.css';
import '@editora/plugins/styles.css';

const plugins = [BoldPlugin(), ItalicPlugin(), UnderlinePlugin(), LinkPlugin(), HistoryPlugin()];

// A theme applies to everything inside an element that carries data-theme.
export default function Themes() {
  return (
    <>
      <div data-theme="dark">
        <EditoraEditor defaultValue="<p>This editor follows the <strong>dark</strong> theme.</p>" plugins={plugins} />
      </div>

      <div data-theme="acme">
        <EditoraEditor defaultValue="<p>This one follows the <strong>acme</strong> theme.</p>" plugins={plugins} />
      </div>
    </>
  );
}
