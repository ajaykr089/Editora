// Demo: an Editora editor with AI review, plus the proxy endpoint.
//
//   npm run build -w @editora/core && npm run build -w @editora/ai-review
//   node packages/ai-review/demo/server.mjs        # http://localhost:5192
//
// Free models: install Ollama, run `ollama signin`, and the page talks to
// http://localhost:11434 directly. "Ollama Cloud (your key)" goes through
// /api/ai-review below with the key the user typed in (or OLLAMA_API_KEY).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  createAIReviewHandler,
  createOllamaProvider,
  ollamaCloudProvider,
  toNodeHandler,
  OLLAMA_CLOUD_MODELS,
} from '../dist/server.js';

const repo = fileURLToPath(new URL('../../../', import.meta.url));
const port = Number(process.env.PORT ?? 5192);
const served = ['packages/ai-review/demo/', 'packages/ai-review/dist/', 'packages/core/dist/'];
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.map': 'application/json' };

const cloudIds = OLLAMA_CLOUD_MODELS.map((model) => model.id);
const aiReview = toNodeHandler(
  createAIReviewHandler({
    providers: {
      // Runs on the server's own Ollama: no key needed.
      ollama: ({ model }) => createOllamaProvider({ model }),
      'ollama-cloud': ollamaCloudProvider(process.env.OLLAMA_API_KEY),
    },
    allowClientKeys: true,
    allowedModels: (model, provider) => (provider === 'ollama-cloud' ? cloudIds.includes(model) : /^[\w.:-]+$/.test(model)),
  }),
);

createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  if (url.pathname === '/api/ai-review') return aiReview(req, res);

  const path = url.pathname === '/' ? 'packages/ai-review/demo/index.html' : normalize(decodeURIComponent(url.pathname)).replace(/^[/\\]+/, '');
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
}).listen(port, () => console.log(`AI review demo on http://localhost:${port}`));
