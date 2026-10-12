// Shared helpers for the README example tools (check.mjs and screenshots.mjs).
//
// The examples live in sandbox/readme/examples. Each .tsx file is a complete React example and each .html file is a
// page fragment; the package READMEs quote them word for word. They are rendered by the sandbox dev server
// (React examples, /readme/index.html?example=<name>) or loaded into a blank page with the CDN URLs pointed at the
// local build (HTML examples), so what is checked and photographed is the code a reader copies.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const examplesDir = path.join(root, 'sandbox/readme/examples');
export const readmes = {
  core: path.join(root, 'packages/core/README.md'),
  react: path.join(root, 'packages/react/README.md'),
  plugins: path.join(root, 'packages/plugins/README.md'),
  'light-code-editor': path.join(root, 'packages/light-code-editor/README.md'),
  themes: path.join(root, 'packages/themes/README.md'),
  'ui-core': path.join(root, 'packages/ui-core/README.md'),
  'ui-react': path.join(root, 'packages/ui-react/README.md'),
  'ui-sortable': path.join(root, 'packages/ui-sortable/README.md'),
  toast: path.join(root, 'packages/editora-toast/README.md'),
  cli: path.join(root, 'packages/cli/README.md'),
  icons: path.join(root, 'packages/icons/README.md'),
  'react-icons': path.join(root, 'packages/react-icons/README.md'),
};

/** Playwright is not a dependency of the repo: use the one next to the local e2e harness when there is no other. */
export async function loadPlaywright() {
  const candidates = [path.join(root, 'package.json'), path.join(root, 'e2e-local/package.json')];
  for (const candidate of candidates) {
    try {
      return createRequire(candidate)('playwright');
    } catch {
      // try the next place
    }
  }
  throw new Error('Playwright is not installed. Run `npm i --no-save playwright && npx playwright install chromium`.');
}

export function listExamples() {
  return fs
    .readdirSync(examplesDir)
    .filter((file) => /\.(tsx?|html|css)$/.test(file))
    .sort()
    .map((file) => ({
      name: file.replace(/\.(tsx?|html|css)$/, ''),
      file,
      kind: file.endsWith('.html') ? 'html' : file.endsWith('.css') ? 'css' : 'react',
      source: fs.readFileSync(path.join(examplesDir, file), 'utf8'),
    }));
}

const types = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.map': 'application/json' };

// The directory of each package that the examples load from a CDN.
const packageDirs = {
  core: 'core',
  themes: 'themes',
  'light-code-editor': 'light-code-editor',
  toast: 'editora-toast',
  'ui-core': 'ui-core',
  'ui-sortable': 'ui-sortable',
  icons: 'icons',
};

/** Answer requests for the published CDN files with the local build of the same package. */
export async function serveCdnFromBuild(page) {
  await page.route('https://cdn.jsdelivr.net/npm/@editora/**', async (route) => {
    // /npm/@editora/<package>[@version]/<path inside the package>
    const [, name, rest] = new URL(route.request().url()).pathname.match(/^\/npm\/@editora\/([^/@]+)(?:@[^/]*)?\/(.*)$/) ?? [];
    const dir = packageDirs[name];
    const file = dir && path.join(root, 'packages', dir, rest);
    if (!file || !fs.existsSync(file)) return route.fulfill({ status: 404, body: `not in the local build: ${name}/${rest}` });
    return route.fulfill({
      status: 200,
      body: fs.readFileSync(file),
      headers: {
        'content-type': types[path.extname(file)] ?? 'application/octet-stream',
        'access-control-allow-origin': '*',
      },
    });
  });
}

// A page without a bundler resolves bare imports with an import map. An example that imports an @editora package and does
// not bring its own map gets this one, so the README can show only the code that matters.
const importMapEntries = {
  '@editora/ui-core': 'ui-core/dist/index.esm.js',
  '@editora/ui-core/runtime': 'ui-core/dist/runtime.esm.js',
  '@editora/ui-core/sortable': 'ui-core/dist/sortable.esm.js',
  '@editora/icons': 'icons/dist/index.esm.js',
  '@editora/ui-sortable': 'ui-sortable/dist/index.esm.js',
  '@editora/toast': 'toast/dist/index.esm.js',
};

export function importMapFor(fragment) {
  if (/type="importmap"/.test(fragment)) return '';
  if (!/(?:from|import)\s+['"]@editora\//.test(fragment)) return '';
  const imports = Object.fromEntries(
    Object.entries(importMapEntries).map(([name, file]) => [name, `https://cdn.jsdelivr.net/npm/@editora/${file}`]),
  );
  return `<script type="importmap">${JSON.stringify({ imports })}</script>`;
}

/** An HTML example is a fragment; give it the page a reader would put it in. */
export function wrapFragment(fragment, { backdrop } = {}) {
  const background = backdrop === 'dark' ? '#0b1220' : '#ffffff';
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${importMapFor(fragment)}
    <style>
      body { margin: 0; padding: 24px; width: 960px; box-sizing: border-box; background: ${background};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      editora-editor { display: block; margin-bottom: 16px; }
      button { margin: 12px 8px 0 0; }
      pre { white-space: pre-wrap; font-size: 12px; }
    </style>
  </head>
  <body>
${fragment}
  </body>
</html>`;
}

export const sandboxUrl = process.env.SANDBOX_URL ?? 'http://localhost:5190';

/** Open an example in the page, whatever its kind, and wait until the editor has built itself. */
export async function openExample(page, example, options = {}) {
  if (example.kind === 'html') {
    await serveCdnFromBuild(page);
    // Served from a made-up https origin, not about:blank, so the page can use localStorage like a real one.
    await page.route('https://readme.test/', (route) =>
      route.fulfill({ status: 200, contentType: 'text/html', body: wrapFragment(example.source, options) }),
    );
    await page.goto('https://readme.test/', { waitUntil: 'load' });
  } else {
    const query = new URLSearchParams({ example: example.name, ...(options.backdrop ? { backdrop: options.backdrop } : {}) });
    await page.goto(`${sandboxUrl}/readme/index.html?${query}`, { waitUntil: 'load' });
  }
  if (/^(ui-|sortable-|toast-|icons-|react-icons-|performance-)/.test(example.name)) {
    // The UI components are not editors: wait for the page's requests, then for the elements to upgrade.
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(700);
    return;
  }
  await page.waitForSelector('[contenteditable="true"], [contenteditable="false"].editora-content, .rte-content', {
    timeout: 20000,
  });
  // The toolbar is built just after the content area; give plugins that load lazily a moment to settle.
  await page.waitForTimeout(700);
}
