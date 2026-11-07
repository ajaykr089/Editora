/**
 * Claude through the Anthropic SDK, with tool use. Pass a client you made:
 * on a server `new Anthropic()` (reads ANTHROPIC_API_KEY); in a browser with
 * a key the user typed `new Anthropic({ apiKey, dangerouslyAllowBrowser: true })`.
 *
 *   import { createAnthropicAgentProvider } from '@editora/agent/anthropic';
 */
import type Anthropic from '@anthropic-ai/sdk';
import type { AgentMessage, AgentProvider, ChatRequest, ChatTurn } from './core/loop.js';
import { AgentProviderError } from './providers/http.js';

export type ClaudeEffort = 'low' | 'medium' | 'high' | 'xhigh' | 'max';

export interface AnthropicAgentProviderOptions {
  client: Anthropic;
  model?: string;
  /** Thinking depth. Editing a document is routine tool use, so the default is `low`. */
  effort?: ClaudeEffort;
  maxTokens?: number;
  /** Re-run a declined request on Anthropic's recommended fallback model (Claude API only). Default true. */
  fallbacks?: boolean;
}

export const DEFAULT_CLAUDE_MODEL = 'claude-opus-5-5';
const FALLBACK_BETA = 'server-side-fallback-2026-07-01';

type Block = Record<string, unknown> & { type: string };

export function toAnthropicMessages(messages: AgentMessage[]): Array<{ role: 'user' | 'assistant'; content: unknown }> {
  return messages.map((message) => {
    if (message.role === 'user') return { role: 'user', content: message.content };
    if (message.role === 'assistant') {
      // Claude's own content goes back unchanged: it carries thinking blocks the model needs.
      if (Array.isArray(message.raw)) return { role: 'assistant', content: message.raw };
      const content: Block[] = [];
      if (message.content) content.push({ type: 'text', text: message.content });
      for (const call of message.toolCalls) content.push({ type: 'tool_use', id: call.id, name: call.name, input: call.arguments });
      return { role: 'assistant', content };
    }
    // All results of one turn in a single user message.
    return {
      role: 'user',
      content: message.results.map((result) => ({ type: 'tool_result', tool_use_id: result.callId, content: result.text, ...(result.isError ? { is_error: true } : {}) })),
    };
  });
}

export function createAnthropicAgentProvider(options: AnthropicAgentProviderOptions): AgentProvider {
  const model = options.model ?? DEFAULT_CLAUDE_MODEL;
  const useFallbacks = options.fallbacks !== false;
  return {
    id: 'anthropic',
    model,
    async chat(request: ChatRequest): Promise<ChatTurn> {
      // No temperature (current models reject sampling parameters) and no forced tool_choice.
      const params = {
        model,
        max_tokens: options.maxTokens ?? 16000,
        system: request.system,
        messages: toAnthropicMessages(request.messages),
        tools: request.tools.map((tool) => ({ name: tool.name, description: tool.description, input_schema: tool.parameters })),
        output_config: { effort: options.effort ?? 'low' },
        ...(useFallbacks ? { betas: [FALLBACK_BETA], fallbacks: 'default' as const } : {}),
      };
      const message = (await options.client.beta.messages.create(params as never, { signal: request.signal })) as unknown as {
        content: Block[];
        stop_reason: string | null;
      };
      if (message.stop_reason === 'refusal') return { content: 'Claude declined this request.', toolCalls: [], raw: message.content, stop: 'refusal' };
      if (!Array.isArray(message.content)) throw new AgentProviderError('anthropic', 'Claude returned no content.');
      const text = message.content
        .filter((block) => block.type === 'text')
        .map((block) => String(block.text ?? ''))
        .join('');
      const toolCalls = message.content
        .filter((block) => block.type === 'tool_use')
        .map((block) => ({ id: String(block.id), name: String(block.name), arguments: (block.input as Record<string, unknown>) ?? {} }));
      return {
        content: text,
        toolCalls,
        raw: message.content,
        stop: toolCalls.length ? 'tool_use' : message.stop_reason === 'max_tokens' ? 'length' : 'end',
      };
    },
  };
}
