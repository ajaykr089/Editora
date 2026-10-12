import { useState } from 'react';
import { EditoraEditor } from '@editora/react';
import { BoldPlugin, HistoryPlugin, ItalicPlugin } from '@editora/plugins/lite';
import { getCurrentTheme, toggleTheme } from '@editora/themes';

import '@editora/themes/themes/default.css';
import '@editora/themes/themes/dark.css';
import '@editora/plugins/styles.css';

const plugins = [BoldPlugin(), ItalicPlugin(), HistoryPlugin()];

// toggleTheme() switches the whole page between light and dark and returns the new theme.
export default function ThemeToggle() {
  const [theme, setTheme] = useState(getCurrentTheme());

  return (
    <>
      <button onClick={() => setTheme(toggleTheme())}>Theme: {theme}</button>
      <EditoraEditor defaultValue="<p>This editor follows the page theme.</p>" plugins={plugins} />
    </>
  );
}
