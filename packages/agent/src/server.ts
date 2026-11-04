/**
 * Server side of the agent proxy: runs one model turn per request with the
 * provider keys kept on the server. Tools are not run here; they run in the
 * page, so the document never has to be sent anywhere but the model.
 *
 *   import { createAgentHandler, toNodeHandler } from '@editora/agent/server';
 *   import { createOllamaAgentProvider } from '@editora/agent';
 *   export const POST = createAgentHandler({ providers: { ollama: ({ model }) => createOllamaAgentProvider({ model }) } });
 */
import type { AgentMessage, AgentProvider, ToolSpec } from './core/loop.js';
import { AgentProviderError } from './providers/http.js';
import { AGENT_KEY_HEADER } from './providers/proxy.js';

export interface AgentProviderInput {
  /** The key the user typed in, when `allowClientKeys` is on and one was sent. */
  apiKey?: string;
  /** The model the client asked for, when `allowedModels` permits it. */
  model?: string;
}

export interface AgentHandlerOptions {
  providers: Record<string, (input: AgentProviderInput) => AgentProvider>;
  /** Accept a user's own key in the `x-editora-agent-key` header. */
  allowClientKeys?: boolean;
  /** Models a client may ask for. Without it, each provider's default model is used. */
  allowedModels?: string[] | ((model: string, provider: string) => boolean);
  /** Largest request body accepted (default 2 MB). */
  maxBodyBytes?: number;
}

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

function validMessages(value: unknown): value is AgentMessage[] {
  return (
    Array.isArray(value) &&
    value.length <= 400 &&
    value.every((message) => message && typeof message === 'object' && ['user', 'assistant', 'tool'].includes((message as { role: string }).role))
  );
}

function validTools(value: unknown): value is ToolSpec[] {
  return Array.isArray(value) && value.length <= 64 && value.every((tool) => tool && typeof tool.name === 'string' && typeof tool.description === 'string' && tool.parameters?.type === 'object');
}

export function createAgentHandler(options: AgentHandlerOptions): (request: Request) => Promise<Response> {
  const names = Object.keys(options.providers);
  if (!names.length) throw new Error('createAgentHandler: pass at least one provider.');
  const maxBytes = options.maxBodyBytes ?? 2_000_000;
  const modelAllowed = (model: string, provider: string) => {
    const allowed = options.allowedModels;
    if (!allowed) return false;
    return typeof allowed === 'function' ? allowed(model, provider) : allowed.includes(model);
  };

  return async (request) => {
    if (request.method !== 'POST') return json(405, { error: 'Use POST.' });
    const length = Number(request.headers.get('content-length') ?? 0);
    if (length > maxBytes) return json(413, { error: 'Request too large.' });
    let body: Record<string, unknown>;
    try {
      const text = await request.text();
      if (text.length > maxBytes) return json(413, { error: 'Request too large.' });
      body = JSON.parse(text);
    } catch {
      return json(400, { error: 'Body must be JSON.' });
    }
    const providerName = typeof body.provider === 'string' && body.provider ? body.provider : names[0];
    const factory = options.providers[providerName];
    if (!factory) return json(400, { error: `Unknown provider "${providerName}". Available: ${names.join(', ')}.` });
    if (typeof body.system !== 'string' || !validMessages(body.messages) || !validTools(body.tools)) return json(400, { error: 'Expected { system, messages, tools }.' });
    const model = typeof body.model === 'string' && modelAllowed(body.model, providerName) ? body.model : undefined;
    const apiKey = options.allowClientKeys ? request.headers.get(AGENT_KEY_HEADER) ?? undefined : undefined;

    try {
      const turn = await factory({ apiKey, model }).chat({ system: body.system, messages: body.messages, tools: body.tools, signal: request.signal });
      return json(200, turn);
    } catch (error) {
      if (error instanceof AgentProviderError) return json(error.status && error.status < 500 ? error.status : 502, { error: error.message });
      return json(500, { error: 'The model request failed.' });
    }
  };
}

interface NodeRequest {
  method?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  on(event: 'data', listener: (chunk: Uint8Array) => void): unknown;
  on(event: 'end', listener: () => void): unknown;
  on(event: 'error', listener: (error: Error) => void): unknown;
}
interface NodeResponse {
  statusCode: number;
  setHeader(name: string, value: string): unknown;
  end(body?: string): unknown;
}

/** Adapt a fetch-style handler to Node's http / Express (req, res). */
export function toNodeHandler(handler: (request: Request) => Promise<Response>) {
  return async (req: NodeRequest, res: NodeResponse) => {
    const chunks: Uint8Array[] = [];
    await new Promise<void>((resolve, reject) => {
      req.on('data', (chunk) => chunks.push(chunk));
      req.on('end', () => resolve());
      req.on('error', reject);
    });
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) if (typeof value === 'string') headers.set(key, value);
    const size = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const body = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.length;
    }
    const response = await handler(new Request(`http://localhost${req.url ?? '/'}`, { method: req.method, headers, body: req.method === 'GET' || req.method === 'HEAD' ? undefined : body }));
    res.statusCode = response.status;
    response.headers.forEach((value, key) => res.setHeader(key, value));
    res.end(await response.text());
  };
}
