// Demo: paste into an Editora editor and a plain contenteditable.
//
//   npm run build -w @editora/core && npm run build -w @editora/paste-cleaner
//   node packages/paste-cleaner/demo/server.mjs        # http://localhost:5193
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const pkg = join(here, '..');
// The repo's workspace link to @editora/core (its exports do not expose package.json).
const core = join(pkg, '..', '..', 'node_modules', '@editora', 'core');
const port = Number(process.env.PORT ?? 5193);
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.map': 'application/json' };

// URL prefix -> folder on disk.
const roots = [
  ['/demo/', join(pkg, 'demo')],
  ['/dist/', join(pkg, 'dist')],
  ['/fixtures/', join(pkg, 'src', '__tests__', 'fixtures')],
  ['/core/', join(core, 'dist')],
];

createServer(async (req, res) => {
  const path = new URL(req.url ?? '/', 'http://localhost').pathname;
  const [prefix, folder] = path === '/' ? ['/', join(pkg, 'demo', 'index.html')] : roots.find(([candidate]) => path.startsWith(candidate)) ?? [];
  const file = prefix === '/' ? folder : folder && normalize(join(folder, decodeURIComponent(path.slice(prefix.length))));
  if (!file || (prefix !== '/' && !file.startsWith(folder + sep))) {
    res.statusCode = 404;
    return res.end('Not found');
  }
  try {
    const body = await readFile(file);
    res.setHeader('Content-Type', types[extname(file)] ?? 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    res.end(body);
  } catch {
    res.statusCode = 404;
    res.end('Not found');
  }
}).listen(port, () => console.log(`Paste cleaner demo on http://localhost:${port}`));
