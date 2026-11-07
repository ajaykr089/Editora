/**
 * Ollama `/api/chat` with tools. Works with a local Ollama (no key; free
 * cloud models through `ollama signin`) or ollama.com with an API key
 * (server side only: ollama.com sends no CORS headers).
 */
import type { AgentProvider, ChatRequest, ChatTurn } from '../core/loop.js';
import { callId, parseArguments, postJson, resolveFetch, type FetchLike } from './http.js';

export const OLLAMA_LOCAL_URL = 'http://localhost:11434';
export const OLLAMA_CLOUD_URL = 'https://ollama.com';
/** Calls tools reliably and runs on Ollama's free cloud tier. */
export const DEFAULT_OLLAMA_AGENT_MODEL = 'gpt-oss:20b-cloud';

export interface OllamaAgentProviderOptions {
  baseUrl?: string;
  model?: string;
  apiKey?: string;
  /** Reasoning models think before answering; off by default to keep edits quick. */
  think?: boolean | 'low' | 'medium' | 'high';
  temperature?: number;
  fetch?: FetchLike;
}

export function toOllamaMessages(request: ChatRequest): unknown[] {
  const out: unknown[] = [{ role: 'system', content: request.system }];
  for (const message of request.messages) {
    if (message.role === 'user') out.push({ role: 'user', content: message.content });
    else if (message.role === 'assistant') {
      // Reasoning models (gpt-oss) need their earlier thinking back, or the next turn fails.
      const thinking = (message.raw as { thinking?: unknown } | undefined)?.thinking;
      out.push({
        role: 'assistant',
        content: message.content,
        ...(typeof thinking === 'string' && thinking ? { thinking } : {}),
        ...(message.toolCalls.length ? { tool_calls: message.toolCalls.map((call) => ({ id: call.id, function: { name: call.name, arguments: call.arguments } })) } : {}),
      });
    } else for (const result of message.results) out.push({ role: 'tool', content: result.text, tool_name: result.name, tool_call_id: result.callId });
  }
  return out;
}

export function createOllamaAgentProvider(options: OllamaAgentProviderOptions = {}): AgentProvider {
  const baseUrl = (options.baseUrl ?? OLLAMA_LOCAL_URL).replace(/\/+$/, '');
  const model = options.model ?? DEFAULT_OLLAMA_AGENT_MODEL;
  const doFetch = resolveFetch(options.fetch);
  return {
    id: 'ollama',
    model,
    async chat(request): Promise<ChatTurn> {
      const data = await postJson(
        'Ollama',
        doFetch,
        `${baseUrl}/api/chat`,
        {
          model,
          stream: false,
          think: options.think ?? false,
          messages: toOllamaMessages(request),
          tools: request.tools.map((tool) => ({ type: 'function', function: { name: tool.name, description: tool.description, parameters: tool.parameters } })),
          ...(options.temperature !== undefined ? { options: { temperature: options.temperature } } : {}),
        },
        options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {},
        request.signal,
      );
      const message = data.message ?? {};
      const toolCalls = (Array.isArray(message.tool_calls) ? message.tool_calls : []).map((call: any) => ({
        id: typeof call.id === 'string' ? call.id : callId(),
        name: String(call.function?.name ?? ''),
        arguments: parseArguments(call.function?.arguments),
      }));
      return {
        content: typeof message.content === 'string' ? message.content : '',
        toolCalls,
        raw: typeof message.thinking === 'string' && message.thinking ? { thinking: message.thinking } : undefined,
        stop: toolCalls.length ? 'tool_use' : data.done_reason === 'length' ? 'length' : 'end',
      };
    },
  };
}
