import type Anthropic from '@anthropic-ai/sdk';
import { AIProviderError, type AIProvider, type CompletionRequest } from './providers/types';

export type ClaudeEffort = 'low' | 'medium' | 'high' | 'xhigh' | 'max';

export interface AnthropicProviderOptions {
  /**
   * An Anthropic SDK client you created. On a server: `new Anthropic()` reads
   * ANTHROPIC_API_KEY. In a browser with a key the user typed in:
   * `new Anthropic({ apiKey, dangerouslyAllowBrowser: true })`.
   */
  client: Anthropic;
  model?: string;
  /** Thinking depth; rewriting a paragraph is a simple task, so the default is `low`. */
  effort?: ClaudeEffort;
  maxTokens?: number;
  /** Re-run a declined request on Anthropic's recommended fallback model (Claude API only). Default true. */
  fallbacks?: boolean;
}

export const DEFAULT_CLAUDE_MODEL = 'claude-opus-5-5';

const FALLBACK_BETA = 'server-side-fallback-2026-07-01';

export function createAnthropicProvider(options: AnthropicProviderOptions): AIProvider {
  const model = options.model ?? DEFAULT_CLAUDE_MODEL;
  const useFallbacks = options.fallbacks !== false;

  return {
    id: 'anthropic',
    model,
    async *stream(request: CompletionRequest) {
      // Sampling parameters (temperature) are not sent: current models reject them.
      const stream = options.client.beta.messages.stream(
        {
          model: request.model ?? model,
          max_tokens: request.maxTokens ?? options.maxTokens ?? 16000,
          system: request.system,
          messages: [{ role: 'user', content: request.prompt }],
          output_config: { effort: options.effort ?? 'low' },
          ...(useFallbacks ? { betas: [FALLBACK_BETA], fallbacks: 'default' as const } : {}),
        },
        { signal: request.signal },
      );

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          yield event.delta.text;
        }
      }

      const message = await stream.finalMessage();
      if (message.stop_reason === 'refusal') {
        throw new AIProviderError('anthropic', 'Claude declined to rewrite this text.');
      }
    },
  };
}
