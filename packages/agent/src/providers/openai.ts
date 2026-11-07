/**
 * Any OpenAI-compatible `chat/completions` API with tools: OpenAI, Groq,
 * Together, OpenRouter, Mistral, LM Studio, vLLM, llama.cpp server…
 */
import type { AgentProvider, ChatRequest, ChatTurn } from '../core/loop.js';
import { AgentProviderError, callId, parseArguments, postJson, resolveFetch, type FetchLike } from './http.js';

export interface OpenAICompatibleAgentOptions {
  /** API base, e.g. "https://api.openai.com/v1". */
  baseUrl: string;
  model: string;
  apiKey?: string;
  /** Label used in errors (default "OpenAI-compatible API"). */
  name?: string;
  temperature?: number;
  headers?: Record<string, string>;
  fetch?: FetchLike;
}

export function toOpenAIMessages(request: ChatRequest): unknown[] {
  const out: unknown[] = [{ role: 'system', content: request.system }];
  for (const message of request.messages) {
    if (message.role === 'user') out.push({ role: 'user', content: message.content });
    else if (message.role === 'assistant') {
      out.push({
        role: 'assistant',
        content: message.content || null,
        ...(message.toolCalls.length
          ? { tool_calls: message.toolCalls.map((call) => ({ id: call.id, type: 'function', function: { name: call.name, arguments: JSON.stringify(call.arguments) } })) }
          : {}),
      });
    } else for (const result of message.results) out.push({ role: 'tool', tool_call_id: result.callId, content: result.text });
  }
  return out;
}

export function createOpenAICompatibleAgentProvider(options: OpenAICompatibleAgentOptions): AgentProvider {
  const name = options.name ?? 'OpenAI-compatible API';
  const url = `${options.baseUrl.replace(/\/+$/, '')}/chat/completions`;
  const doFetch = resolveFetch(options.fetch);
  return {
    id: 'openai',
    model: options.model,
    async chat(request): Promise<ChatTurn> {
      const data = await postJson(
        name,
        doFetch,
        url,
        {
          model: options.model,
          messages: toOpenAIMessages(request),
          tools: request.tools.map((tool) => ({ type: 'function', function: { name: tool.name, description: tool.description, parameters: tool.parameters } })),
          tool_choice: 'auto',
          ...(options.temperature !== undefined ? { temperature: options.temperature } : {}),
        },
        { ...(options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : {}), ...options.headers },
        request.signal,
      );
      const choice = data.choices?.[0];
      if (!choice?.message) throw new AgentProviderError(name, `${name} returned no message.`);
      const toolCalls = (Array.isArray(choice.message.tool_calls) ? choice.message.tool_calls : []).map((call: any) => ({
        id: typeof call.id === 'string' ? call.id : callId(),
        name: String(call.function?.name ?? ''),
        arguments: parseArguments(call.function?.arguments),
      }));
      const reason = choice.finish_reason;
      return {
        content: typeof choice.message.content === 'string' ? choice.message.content : '',
        toolCalls,
        stop: toolCalls.length ? 'tool_use' : reason === 'length' ? 'length' : reason === 'content_filter' ? 'refusal' : 'end',
      };
    },
  };
}
