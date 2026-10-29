import { readServerSentData } from './streams';
import { errorFromResponse, resolveFetch, AIProviderError, type AIProvider, type CompletionRequest, type FetchLike } from './types';

/**
 * Base URLs of common services that speak the OpenAI chat completions API.
 * Users bring their own key and model name.
 */
export const OPENAI_COMPATIBLE_PRESETS = {
  openai: { label: 'OpenAI', baseUrl: 'https://api.openai.com/v1' },
  openrouter: { label: 'OpenRouter', baseUrl: 'https://openrouter.ai/api/v1' },
  groq: { label: 'Groq', baseUrl: 'https://api.groq.com/openai/v1' },
  together: { label: 'Together AI', baseUrl: 'https://api.together.xyz/v1' },
  mistral: { label: 'Mistral', baseUrl: 'https://api.mistral.ai/v1' },
  deepseek: { label: 'DeepSeek', baseUrl: 'https://api.deepseek.com/v1' },
  lmstudio: { label: 'LM Studio (local)', baseUrl: 'http://localhost:1234/v1' },
  ollama: { label: 'Ollama (OpenAI API)', baseUrl: 'http://localhost:11434/v1' },
} as const;

export type OpenAICompatiblePreset = keyof typeof OPENAI_COMPATIBLE_PRESETS;

export interface OpenAICompatibleProviderOptions {
  baseUrl?: string;
  preset?: OpenAICompatiblePreset;
  apiKey?: string;
  model: string;
  headers?: Record<string, string>;
  /** Merged into the request body (e.g. `{ reasoning_effort: 'low' }`). */
  extraBody?: Record<string, unknown>;
  fetch?: FetchLike;
}

export function createOpenAICompatibleProvider(options: OpenAICompatibleProviderOptions): AIProvider {
  const baseUrl = (options.baseUrl ?? OPENAI_COMPATIBLE_PRESETS[options.preset ?? 'openai'].baseUrl).replace(/\/+$/, '');
  const id = options.preset ?? 'openai-compatible';
  const doFetch = resolveFetch(options.fetch);

  return {
    id,
    model: options.model,
    async *stream(request: CompletionRequest) {
      const headers: Record<string, string> = { 'Content-Type': 'application/json', ...options.headers };
      if (options.apiKey) headers.Authorization = `Bearer ${options.apiKey}`;

      let response: Response;
      try {
        response = await doFetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers,
          signal: request.signal,
          body: JSON.stringify({
            model: request.model ?? options.model,
            stream: true,
            temperature: request.temperature,
            max_tokens: request.maxTokens,
            messages: [
              { role: 'system', content: request.system },
              { role: 'user', content: request.prompt },
            ],
            ...options.extraBody,
          }),
        });
      } catch (error) {
        if (request.signal?.aborted) throw error;
        throw new AIProviderError(id, `Could not reach ${baseUrl}. Check the URL, and that the service allows requests from this page (CORS).`);
      }

      if (!response.ok || !response.body) throw await errorFromResponse(id, response);

      for await (const data of readServerSentData(response.body, request.signal)) {
        if (data === '[DONE]') return;
        const chunk = JSON.parse(data);
        if (chunk.error) throw new AIProviderError(id, chunk.error.message ?? String(chunk.error));
        const content = chunk.choices?.[0]?.delta?.content;
        if (content) yield content as string;
      }
    },
  };
}
