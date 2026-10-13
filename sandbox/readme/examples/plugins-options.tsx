import { EditoraEditor } from '@editora/react';
import { BoldPlugin, HeadingPlugin, HistoryPlugin } from '@editora/plugins/lite';
import { DataBindingPlugin, MergeTagPlugin, TrackChangesPlugin } from '@editora/plugins/enterprise';

import '@editora/themes/themes/default.css';
import '@editora/plugins/styles.css';

const plugins = [
  HeadingPlugin(),
  BoldPlugin(),
  HistoryPlugin(),

  // Tags the author can insert, grouped by category, with a preview value.
  MergeTagPlugin({
    tags: [
      { key: 'first_name', label: 'First name', category: 'Contact', preview: 'Ava' },
      { key: 'company', label: 'Company', category: 'Account', preview: 'Editora Labs' },
    ],
  }),

  // Record edits as suggestions that can be accepted or rejected, attributed to this author.
  TrackChangesPlugin({ author: 'Ava Miller', enabledByDefault: false }),

  // Values that data-bound fields in the document are resolved against.
  DataBindingPlugin({ data: { user: { firstName: 'Ava' }, account: { name: 'Editora Labs' } } }),
];

export default function PluginOptions() {
  return (
    <EditoraEditor
      defaultValue="<h2>Welcome</h2><p>Insert a merge tag, or turn on track changes and edit this sentence.</p>"
      plugins={plugins}
      toolbar={{ items: 'undo redo | heading bold | mergetag | trackchanges databinding' }}
    />
  );
}
