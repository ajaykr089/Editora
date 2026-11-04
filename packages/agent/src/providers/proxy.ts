/**
 * Browser side of the agent proxy: the page sends each model turn to your
 * server (made with `createAgentHandler` from `@editora/agent/server`),
 * which holds the API keys. The tools still run in the page.
 */
import type { AgentProvider, ChatTurn } from '../core/loop.js';
import { postJson, resolveFetch, type FetchLike } from './http.js';

export const AGENT_KEY_HEADER = 'x-editora-agent-key';

export interface ProxyAgentProviderOptions {
  /** Your endpoint, e.g. "/api/agent". */
  url: string;
  /** Which of the server's providers to use. */
  provider?: string;
  model?: string;
  /** A key the user typed in, when the server allows client keys. */
  apiKey?: string;
  headers?: Record<string, string>;
  fetch?: FetchLike;
}

export function createProxyAgentProvider(options: ProxyAgentProviderOptions): AgentProvider {
  const doFetch = resolveFetch(options.fetch);
  return {
    id: options.provider ?? 'proxy',
    model: options.model,
    async chat(request): Promise<ChatTurn> {
      const data = await postJson(
        'The agent endpoint',
        doFetch,
        options.url,
        { provider: options.provider, model: options.model, system: request.system, messages: request.messages, tools: request.tools },
        { ...(options.apiKey ? { [AGENT_KEY_HEADER]: options.apiKey } : {}), ...options.headers },
        request.signal,
      );
      return { content: String(data.content ?? ''), toolCalls: Array.isArray(data.toolCalls) ? data.toolCalls : [], raw: data.raw, stop: data.stop };
    },
  };
}
