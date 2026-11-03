// Demo: convert between formats and load the result in the real editors.
//
//   npm run build -w @editora/rich-text-convert
//   node packages/rich-text-convert/demo/server.mjs   # http://localhost:5194
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const pkg = join(here, '..');
const port = Number(process.env.PORT ?? 5194);
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.map': 'application/json' };

// URL prefix -> folder on disk.
const roots = [
  ['/demo/', join(pkg, 'demo')],
  ['/dist/', join(pkg, 'dist')],
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
}).listen(port, () => console.log(`Rich-text convert demo on http://localhost:${port}`));
