// Renders one README example by name: /readme/index.html?example=react-quick-start
//
// Every file in ./examples is a complete example whose code is quoted in a package README. They are compiled by
// `npm run check:readme-examples`, and `scripts/readme-examples/screenshots.mjs` takes the README screenshots from this page.
import React from 'react';
import { createRoot } from 'react-dom/client';

const modules = import.meta.glob('./examples/*.{ts,tsx}') as Record<string, () => Promise<{ default?: React.ComponentType }>>;

const params = new URLSearchParams(location.search);
const name = params.get('example') ?? '';
const load = modules[`./examples/${name}.tsx`] ?? modules[`./examples/${name}.ts`];
const shot = document.getElementById('shot') as HTMLElement;
if (params.get('backdrop')) shot.dataset.backdrop = params.get('backdrop') as string;

if (!load) {
  document.getElementById('root')!.textContent = `No example called "${name}". Available: ${Object.keys(modules)
    .map((key) => key.replace('./examples/', '').replace(/\.tsx?$/, ''))
    .join(', ')}`;
} else {
  const root = document.getElementById('root') as HTMLElement;
  // A plain module looks its container up by id, as the README's code does.
  root.innerHTML = '<div id="editor"></div>';
  load().then(({ default: Example }) => {
    if (Example) {
      root.innerHTML = '';
      // StrictMode, as in most apps: effects run twice in development, so cleanup bugs show up.
      return createRoot(root).render(
        <React.StrictMode>
          <Example />
        </React.StrictMode>,
      );
    }
    // This one only registers the web component: give it an element to upgrade, as the README's HTML does.
    if (name === 'core-bundler') {
      root.innerHTML = '<editora-editor plugins="bold italic link history" toolbar="undo redo | bold italic | link"><p>Bundled</p></editora-editor>';
    }
  });
}
