import { useEffect, useState } from 'react';
import type { Plugin } from '@editora/core';
import { EditoraEditor } from '@editora/react';
import { BoldPlugin, HistoryPlugin, ItalicPlugin } from '@editora/plugins/lite';

import '@editora/themes/themes/default.css';
import '@editora/plugins/styles.css';

const basePlugins: Plugin[] = [BoldPlugin(), ItalicPlugin(), HistoryPlugin()];

// Load a heavy plugin only when the editor is shown, so it stays out of your main bundle.
export default function LazyPlugins() {
  const [plugins, setPlugins] = useState<Plugin[]>(basePlugins);

  useEffect(() => {
    import('@editora/plugins/spell-check').then(({ SpellCheckPlugin }) => {
      setPlugins([...basePlugins, SpellCheckPlugin()]);
    });
  }, []);

  return <EditoraEditor defaultValue="<p>Spell check arrives after the first render.</p>" plugins={plugins} />;
}
