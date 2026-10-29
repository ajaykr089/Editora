import type { AIProvider } from '../providers/types';
import { AIReview } from './review';
import { buildRewritePrompt, cleanModelOutput, type RewritePromptInput } from './prompt';

export interface RunRewriteOptions extends Omit<RewritePromptInput, 'blocks'> {
  provider: AIProvider;
  review: AIReview;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
  /** Called with the cleaned output so far after every chunk. */
  onText?: (text: string) => void;
}

/**
 * Stream a rewrite of `review.original` from `provider` into `review`.
 * Resolves with the cleaned output; rejects (leaving the review streaming) if
 * the provider fails, the request is aborted or the model returns nothing.
 */
export async function runRewrite(options: RunRewriteOptions): Promise<string> {
  const { provider, review } = options;
  const original = review.original.join('\n\n');
  const { system, prompt } = buildRewritePrompt({
    instruction: options.instruction,
    blocks: review.original,
    context: options.context,
    guidelines: options.guidelines,
  });

  let raw = '';
  let cleaned = '';
  for await (const chunk of provider.stream({
    system,
    prompt,
    model: options.model,
    temperature: options.temperature ?? 0.3,
    maxTokens: options.maxTokens,
    signal: options.signal,
  })) {
    if (options.signal?.aborted) break;
    raw += chunk;
    const next = cleanModelOutput(raw, original);
    if (next === cleaned) continue;
    cleaned = next;
    review.update(cleaned);
    options.onText?.(cleaned);
  }

  if (options.signal?.aborted) {
    throw options.signal.reason ?? new DOMException('The rewrite was cancelled.', 'AbortError');
  }

  cleaned = cleanModelOutput(raw, original).trim();
  if (!cleaned) throw new Error('The model returned no text.');
  review.finish(cleaned);
  return cleaned;
}
