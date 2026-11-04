/**
 * Localhost bridge between the MCP server (this process) and the editor
 * page: the page subscribes to /events (server-sent events) and posts tool
 * results to /result. Bound to 127.0.0.1, every request needs the pairing
 * token, and only allowed origins get CORS headers.
 */
import type { ToolResult } from '../core/types.js';

export interface BridgeOptions {
  port?: number;
  token: string;
  /** Page origins allowed to connect. Default: any http(s)://localhost or 127.0.0.1 port. */
  allowedOrigins?: Array<string | RegExp>;
  /** How long a tool call waits for the page (default 60 s). */
  timeoutMs?: number;
  log?: (message: string) => void;
}

export interface Bridge {
  readonly port: number;
  readonly url: string;
  readonly connected: boolean;
  call(name: string, args: Record<string, unknown>): Promise<ToolResult>;
  close(): Promise<void>;
}

const LOCAL_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;

interface NodeResponse {
  writeHead(status: number, headers?: Record<string, string>): unknown;
  write(chunk: string): unknown;
  end(body?: string): unknown;
  on(event: 'close', listener: () => void): unknown;
}

export async function startBridge(options: BridgeOptions): Promise<Bridge> {
  const http = await import('node:http');
  const { timingSafeEqual } = await import('node:crypto');
  const allowed = options.allowedOrigins ?? [LOCAL_ORIGIN];
  const timeout = options.timeoutMs ?? 60_000;
  const log = options.log ?? (() => undefined);
  const pending = new Map<string, { resolve: (result: ToolResult) => void; timer: ReturnType<typeof setTimeout> }>();
  let page: NodeResponse | null = null;
  let nextId = 1;

  const originAllowed = (origin: string | undefined) => !origin || allowed.some((rule) => (typeof rule === 'string' ? rule === origin : rule.test(origin)));
  const tokenOk = (given: string | null) => {
    if (!given) return false;
    const a = Buffer.from(given);
    const b = Buffer.from(options.token);
    return a.length === b.length && timingSafeEqual(a, b);
  };

  const server = http.createServer((req, res) => {
    const origin = req.headers.origin;
    const cors: Record<string, string> = origin && originAllowed(origin) ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {};
    if (req.method === 'OPTIONS') {
      res.writeHead(originAllowed(origin) ? 204 : 403, {
        ...cors,
        'Access-Control-Allow-Methods': 'GET, POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        // Chrome asks before a public page reaches a local address.
        'Access-Control-Allow-Private-Network': 'true',
      });
      return res.end();
    }
    const url = new URL(req.url ?? '/', 'http://127.0.0.1');
    if (!originAllowed(origin)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      return res.end('Origin not allowed');
    }
    if (!tokenOk(url.searchParams.get('token'))) {
      res.writeHead(401, { ...cors, 'Content-Type': 'text/plain' });
      return res.end('Wrong or missing token');
    }

    if (req.method === 'GET' && url.pathname === '/events') {
      res.writeHead(200, { ...cors, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
      res.write(': connected\n\n');
      page = res as unknown as NodeResponse;
      log('An editor connected.');
      const keepAlive = setInterval(() => res.write(': ping\n\n'), 20_000);
      res.on('close', () => {
        clearInterval(keepAlive);
        if (page === (res as unknown as NodeResponse)) {
          page = null;
          log('The editor disconnected.');
        }
      });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/result') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
        if (body.length > 1_000_000) req.destroy();
      });
      req.on('end', () => {
        try {
          const { id, text, isError } = JSON.parse(body);
          const waiting = pending.get(String(id));
          if (waiting) {
            clearTimeout(waiting.timer);
            pending.delete(String(id));
            waiting.resolve({ text: String(text ?? ''), isError: Boolean(isError) });
          }
          res.writeHead(204, cors);
          res.end();
        } catch {
          res.writeHead(400, cors);
          res.end();
        }
      });
      return;
    }
    res.writeHead(404, cors);
    res.end();
  });

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(options.port ?? 41820, '127.0.0.1', () => resolve());
  });
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : options.port ?? 41820;

  return {
    port,
    url: `http://127.0.0.1:${port}`,
    get connected() {
      return Boolean(page);
    },
    call(name, args) {
      if (!page) {
        return Promise.resolve({
          text: 'Error: no Editora editor is connected. Open the page that uses AgentPlugin({ mcp: { url, token } }) with this bridge\'s address and token.',
          isError: true,
        });
      }
      const id = String(nextId++);
      return new Promise<ToolResult>((resolve) => {
        const timer = setTimeout(() => {
          pending.delete(id);
          resolve({ text: 'Error: the editor did not answer in time.', isError: true });
        }, timeout);
        pending.set(id, { resolve, timer });
        page!.write(`event: call\ndata: ${JSON.stringify({ id, name, arguments: args })}\n\n`);
      });
    },
    close() {
      for (const [, waiting] of pending) {
        clearTimeout(waiting.timer);
        waiting.resolve({ text: 'Error: the bridge closed.', isError: true });
      }
      pending.clear();
      page?.end();
      return new Promise((resolve) => server.close(() => resolve()));
    },
  };
}
