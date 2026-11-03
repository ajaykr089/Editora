// Demo: open a .docx as HTML, or turn HTML into a .docx.
//
//   npm run build -w @editora/docx -w @editora/rich-text-convert
//   node packages/docx/demo/server.mjs   # http://localhost:5196
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const pkg = join(here, '..');
const port = Number(process.env.PORT ?? 5196);
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.map': 'application/json', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };

// URL prefix -> folder on disk.
const roots = [
  ['/demo/', join(pkg, 'demo')],
  ['/dist/', join(pkg, 'dist')],
  ['/convert/', join(pkg, '..', 'rich-text-convert', 'dist')],
  ['/fixtures/', join(pkg, 'src', '__tests__', 'fixtures')],
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
}).listen(port, () => console.log(`DOCX demo on http://localhost:${port}`));
