/**
 * Server-side proxy for `createProxyProvider`. Keeps provider keys off the
 * page and makes ollama.com (which refuses browser requests) usable from the
 * editor. Returns a standard fetch handler: use it as a Next.js route, in
 * Hono, Deno, Bun, Cloudflare Workers, or in Express via `toNodeHandler`.
 */
import { createOllamaProvider, OLLAMA_CLOUD_URL } from './providers/ollama';
import { CLIENT_KEY_HEADER } from './providers/proxy';
import { AIProviderError, type AIProvider } from './providers/types';

export interface ProviderFactoryInput {
  /** The key the user typed in, when `allowClientKeys` is on and one was sent. */
  apiKey?: string;
  model?: string;
}

export type ProviderFactory = (input: ProviderFactoryInput) => AIProvider;

export interface AIReviewHandlerOptions {
  /** Providers the client may pick by name; the first one is the default. */
  providers: Record<string, ProviderFactory>;
  /** Accept a user's own key in the `x-ai-review-key` header and pass it to the factory. */
  allowClientKeys?: boolean;
  /** Restrict the `model` a client may ask for. Without it, the factory's default model is always used. */
  allowedModels?: string[] | ((model: string, provider: string) => boolean);
  /** Reject prompts longer than this many characters (default 40 000). */
  maxPromptChars?: number;
  /** Return false (or a Response) to refuse a request, e.g. after checking a session. */
  authorize?: (request: Request) => boolean | Response | Promise<boolean | Response>;
}

/** Ollama's hosted models through ollama.com; the key comes from the user or `apiKey`. */
export function ollamaCloudProvider(apiKey?: string): ProviderFactory {
  return (input) => {
    const key = input.apiKey ?? apiKey;
    if (!key) throw new AIProviderError('ollama', 'An Ollama API key is required (https://ollama.com/settings/keys).', 401);
    return createOllamaProvider({ baseUrl: OLLAMA_CLOUD_URL, apiKey: key, model: input.model ?? 'gemma4:31b' });
  };
}

function json(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: { message } }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function createAIReviewHandler(options: AIReviewHandlerOptions): (request: Request) => Promise<Response> {
  const names = Object.keys(options.providers);
  if (names.length === 0) throw new Error('createAIReviewHandler: pass at least one provider');
  const maxPromptChars = options.maxPromptChars ?? 40_000;

  const modelAllowed = (model: string, provider: string) => {
    const allowed = options.allowedModels;
    if (!allowed) return false;
    return typeof allowed === 'function' ? allowed(model, provider) : allowed.includes(model);
  };

  return async (request) => {
    if (request.method !== 'POST') return json(405, 'Use POST.');

    if (options.authorize) {
      const verdict = await options.authorize(request);
      if (verdict instanceof Response) return verdict;
      if (!verdict) return json(403, 'Not allowed.');
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return json(400, 'Expected a JSON body.');
    }

    const system = typeof body.system === 'string' ? body.system : '';
    const prompt = typeof body.prompt === 'string' ? body.prompt : '';
    if (!prompt) return json(400, '`prompt` is required.');
    if (system.length + prompt.length > maxPromptChars) return json(413, 'The text is too long to rewrite in one request.');

    const providerName = typeof body.provider === 'string' && body.provider ? body.provider : names[0];
    const factory = options.providers[providerName];
    if (!factory) return json(400, `Unknown provider "${providerName}".`);

    const requestedModel = typeof body.model === 'string' && body.model ? body.model : undefined;
    if (requestedModel && !modelAllowed(requestedModel, providerName)) {
      return json(400, `Model "${requestedModel}" is not allowed.`);
    }

    const clientKey = options.allowClientKeys ? request.headers.get(CLIENT_KEY_HEADER) ?? undefined : undefined;

    let iterator: AsyncIterator<string>;
    let first: IteratorResult<string>;
    try {
      const provider = factory({ apiKey: clientKey || undefined, model: requestedModel });
      const chunks = provider.stream({
        system,
        prompt,
        model: requestedModel,
        temperature: typeof body.temperature === 'number' ? body.temperature : undefined,
        maxTokens: typeof body.maxTokens === 'number' ? body.maxTokens : undefined,
        signal: request.signal,
      });
      iterator = chunks[Symbol.asyncIterator]();
      // Wait for the first chunk so an upstream failure becomes a proper HTTP error.
      first = await iterator.next();
    } catch (error) {
      const status = error instanceof AIProviderError && error.status ? error.status : 502;
      return json(status >= 400 && status < 600 ? status : 502, error instanceof Error ? error.message : 'The AI provider failed.');
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        if (first.done) controller.close();
        else controller.enqueue(encoder.encode(first.value));
      },
      async pull(controller) {
        try {
          const next = await iterator.next();
          if (next.done) controller.close();
          else controller.enqueue(encoder.encode(next.value));
        } catch (error) {
          controller.error(error);
        }
      },
      async cancel() {
        await iterator.return?.();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Accel-Buffering': 'no',
      },
    });
  };
}

interface NodeRequestLike {
  method?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  on(event: 'data', listener: (chunk: Uint8Array) => void): unknown;
  on(event: 'end' | 'close', listener: () => void): unknown;
  on(event: 'error', listener: (error: Error) => void): unknown;
  body?: unknown;
}

interface NodeResponseLike {
  statusCode: number;
  setHeader(name: string, value: string): unknown;
  write(chunk: Uint8Array): unknown;
  end(): unknown;
  on(event: 'close', listener: () => void): unknown;
  destroy?(error?: Error): unknown;
}

/** Adapt a fetch handler to Node's `(req, res)` signature (Express, Connect, node:http). */
export function toNodeHandler(handler: (request: Request) => Promise<Response>) {
  return async (req: NodeRequestLike, res: NodeResponseLike): Promise<void> => {
    const controller = new AbortController();
    res.on('close', () => controller.abort());

    let body: string;
    if (req.body !== undefined && req.body !== null) {
      // A body parser (express.json()) already consumed the stream.
      body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    } else {
      body = await new Promise<string>((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', () => resolve(new TextDecoder().decode(concat(chunks))));
        req.on('error', reject);
      });
    }

    const headers = new Headers();
    for (const [name, value] of Object.entries(req.headers)) {
      if (typeof value === 'string') headers.set(name, value);
      else if (Array.isArray(value)) headers.set(name, value.join(', '));
    }

    const response = await handler(
      new Request(`http://localhost${req.url ?? '/'}`, {
        method: req.method ?? 'POST',
        headers,
        body: req.method === 'GET' || req.method === 'HEAD' ? undefined : body,
        signal: controller.signal,
      }),
    );

    res.statusCode = response.status;
    response.headers.forEach((value, name) => res.setHeader(name, value));
    if (!response.body) {
      res.end();
      return;
    }
    const reader = response.body.getReader();
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    } catch (error) {
      // Upstream failed mid-stream: drop the connection so the client sees an
      // error instead of a response that merely looks short.
      res.destroy?.(error instanceof Error ? error : undefined);
      return;
    }
    res.end();
  };
}

function concat(chunks: Uint8Array[]): Uint8Array {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

export { createOllamaProvider, OLLAMA_CLOUD_URL, OLLAMA_LOCAL_URL, OLLAMA_CLOUD_MODELS } from './providers/ollama';
export { createOpenAICompatibleProvider, OPENAI_COMPATIBLE_PRESETS } from './providers/openai';
export type { AIProvider } from './providers/types';
