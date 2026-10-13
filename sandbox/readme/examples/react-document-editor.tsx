import { EditoraEditor } from '@editora/react';
import {
  BackgroundColorPlugin,
  BlockquotePlugin,
  BoldPlugin,
  ChecklistPlugin,
  ClearFormattingPlugin,
  HeadingPlugin,
  HistoryPlugin,
  ItalicPlugin,
  LinkPlugin,
  ListPlugin,
  StrikethroughPlugin,
  TablePlugin,
  TextAlignmentPlugin,
  TextColorPlugin,
  UnderlinePlugin,
} from '@editora/plugins/lite';
import { A11yCheckerPlugin, CommentsPlugin } from '@editora/plugins/enterprise';
import { CodeSamplePlugin } from '@editora/plugins/code-sample';
import { EmojisPlugin } from '@editora/plugins/emojis';
import { MathPlugin } from '@editora/plugins/math';

import '@editora/themes/themes/default.css';
import '@editora/plugins/styles.css';

const plugins = [
  HeadingPlugin(),
  BoldPlugin(),
  ItalicPlugin(),
  UnderlinePlugin(),
  StrikethroughPlugin(),
  ListPlugin(),
  ChecklistPlugin(),
  LinkPlugin(),
  BlockquotePlugin(),
  HistoryPlugin(),
  ClearFormattingPlugin(),
  TextAlignmentPlugin(),
  TextColorPlugin(),
  BackgroundColorPlugin(),
  TablePlugin(),
  CodeSamplePlugin(),
  MathPlugin(),
  EmojisPlugin(),
  CommentsPlugin(),
  A11yCheckerPlugin(),
];

const initialHtml = `
  <h2>Quarterly business review</h2>
  <p>Revenue grew <strong>18%</strong> year on year. The numbers below feed the board summary.</p>
  <table>
    <tr><th>Region</th><th>Q1</th><th>Q2</th></tr>
    <tr><td>Europe</td><td>1.2M</td><td>1.4M</td></tr>
    <tr><td>Americas</td><td>2.1M</td><td>2.5M</td></tr>
  </table>
  <p>Next steps: confirm the forecast, then publish the report.</p>
`;

export default function DocumentEditor() {
  return (
    <EditoraEditor
      defaultValue={initialHtml}
      plugins={plugins}
      toolbar={{ sticky: true, showMoreOptions: true }}
      statusbar={{ enabled: true }}
      paste={{ clean: true, keepFormatting: true, convertWord: true }}
      spellcheck={{ enabled: true, provider: 'browser' }}
      accessibility={{ enableARIA: true, keyboardNavigation: true, checker: true }}
      security={{ sanitizeOnInput: true, sanitizeOnPaste: true }}
      content={{ minHeight: 260 }}
    />
  );
}
