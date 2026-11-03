// Demo: an Editora editor recording authorship, plus a witness endpoint.
//
//   npm run build -w @editora/core && npm run build -w @editora/authorship
//   npm run build -w @editora/paste-cleaner && npm run build -w @editora/ai-review   # optional extras
//   node packages/authorship/demo/server.mjs        # http://localhost:5197
//
// The witness only ever receives hashes. /api/verify checks a saved record
// with the witness secret, the way a school or publisher's server would.
import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createAuthorshipWitness, toNodeHandler, verifyWitnessed } from '../dist/server.js';

const repo = fileURLToPath(new URL('../../../', import.meta.url));
const port = Number(process.env.PORT ?? 5197);
const secret = process.env.AUTHORSHIP_SECRET ?? randomBytes(24).toString('hex');
const served = ['packages/authorship/demo/', 'packages/authorship/dist/', 'packages/core/dist/', 'packages/paste-cleaner/dist/', 'packages/ai-review/dist/'];
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.map': 'application/json' };

// In-memory store: rejects a second history for the same document.
const receipts = new Map();
const witness = toNodeHandler(createAuthorshipWitness({ secret, store: { get: (doc) => receipts.get(doc), set: (doc, receipt) => void receipts.set(doc, receipt) } }));

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  if (url.pathname === '/api/witness') return witness(req, res);
  if (url.pathname === '/api/verify' && req.method === 'POST') {
    try {
      const { state, doc } = await readJson(req);
      const result = await verifyWitnessed(state, { secret, doc });
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(result));
    } catch (error) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: String(error) }));
    }
  }

  const path = url.pathname === '/' ? 'packages/authorship/demo/index.html' : normalize(decodeURIComponent(url.pathname)).replace(/^[/\\]+/, '');
  if (!served.some((prefix) => path.startsWith(prefix.replaceAll('/', sep))) || path.includes('..')) {
    res.statusCode = 404;
    return res.end('Not found');
  }
  try {
    const body = await readFile(join(repo, path));
    res.setHeader('Content-Type', types[extname(path)] ?? 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    res.end(body);
  } catch {
    res.statusCode = 404;
    res.end('Not found');
  }
}).listen(port, () => console.log(`Authorship demo on http://localhost:${port}`));
