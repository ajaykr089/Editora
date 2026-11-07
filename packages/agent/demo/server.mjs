// Demo: an Editora editor with the agent panel.
//
//   npm run build -w @editora/core -w @editora/ai-review -w @editora/authorship -w @editora/agent
//   node packages/agent/demo/server.mjs            # http://localhost:5199
//
// Models: a local Ollama (http://localhost:11434, free cloud models after
// `ollama signin`), or "Demo script", which makes fixed edits without AI.
// MCP: start `EDITORA_MCP_TOKEN=demo-token-123 node packages/agent/bin/editora-mcp.js`
// and open http://localhost:5199/?mcp=1 to let an MCP client edit the page.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = fileURLToPath(new URL('../../../', import.meta.url));
const port = Number(process.env.PORT ?? 5199);
const served = ['packages/agent/demo/', 'packages/agent/dist/', 'packages/ai-review/dist/', 'packages/authorship/dist/', 'packages/core/dist/'];
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.map': 'application/json' };

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const path = url.pathname === '/' ? 'packages/agent/demo/index.html' : normalize(decodeURIComponent(url.pathname)).replace(/^[/\\]+/, '');
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
}).listen(port, () => console.log(`Agent demo on http://localhost:${port}`));
