import { EditoraEditor } from '@editora/react';

// 1. The common plugins, in one small entry point.
import { BoldPlugin, HeadingPlugin, HistoryPlugin, LinkPlugin, TablePlugin } from '@editora/plugins/lite';
// 2. Advanced plugins: review, workflow and structured authoring.
import { TrackChangesPlugin } from '@editora/plugins/enterprise';
// 3. A single plugin, and nothing else.
import { MathPlugin } from '@editora/plugins/math';

import '@editora/themes/themes/default.css';
import '@editora/plugins/styles.css';

const plugins = [
  HeadingPlugin(),
  BoldPlugin(),
  LinkPlugin(),
  TablePlugin(),
  MathPlugin(),
  TrackChangesPlugin({ author: 'Ava Miller' }),
  HistoryPlugin(),
];

export default function EntryPoints() {
  return (
    <EditoraEditor
      defaultValue="<p>Import from the smallest entry point that has what you need.</p>"
      plugins={plugins}
      toolbar={{ items: 'undo redo | heading bold link | table math | trackchanges' }}
    />
  );
}
