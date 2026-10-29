import { readLines } from './streams';
import { errorFromResponse, resolveFetch, AIProviderError, type AIProvider, type CompletionRequest, type FetchLike } from './types';

export interface ModelOption {
  id: string;
  label: string;
}

/**
 * Ollama's hosted models. Through a local Ollama signed in with `ollama signin`
 * they are free to try and are addressed with a cloud tag (see
 * `ollamaLocalCloudTag`); through https://ollama.com/api they take the bare id
 * and an API key.
 */
export const OLLAMA_CLOUD_MODELS: ModelOption[] = [
  { id: 'gemma4:31b', label: 'Gemma 4 31B' },
  { id: 'gpt-oss:120b', label: 'GPT-OSS 120B' },
  { id: 'gpt-oss:20b', label: 'GPT-OSS 20B' },
  { id: 'nemotron-3-nano:30b', label: 'Nemotron 3 Nano 30B' },
  { id: 'nemotron-3-super', label: 'Nemotron 3 Super' },
  { id: 'nemotron-3-ultra', label: 'Nemotron 3 Ultra' },
];

export const OLLAMA_LOCAL_URL = 'http://localhost:11434';
export const OLLAMA_CLOUD_URL = 'https://ollama.com';

/** `gpt-oss:120b` -> `gpt-oss:120b-cloud`, `nemotron-3-super` -> `nemotron-3-super:cloud`. */
export function ollamaLocalCloudTag(id: string): string {
  if (/[-:]cloud$/.test(id)) return id;
  return id.includes(':') ? `${id}-cloud` : `${id}:cloud`;
}

export interface OllamaProviderOptions {
  /** Defaults to the local daemon. Use `OLLAMA_CLOUD_URL` with an `apiKey` to call ollama.com directly (server-side only: it does not allow browser requests). */
  baseUrl?: string;
  model?: string;
  apiKey?: string;
  /** Reasoning models think before answering; off by default because a rewrite does not need it and it adds latency. */
  think?: boolean | 'low' | 'medium' | 'high';
  /** Extra Ollama model options (num_ctx, top_p, ...). */
  options?: Record<string, unknown>;
  keepAlive?: string | number;
  headers?: Record<string, string>;
  fetch?: FetchLike;
}

export const DEFAULT_OLLAMA_MODEL = 'gemma4:31b-cloud';

export function createOllamaProvider(options: OllamaProviderOptions = {}): AIProvider {
  const baseUrl = (options.baseUrl ?? OLLAMA_LOCAL_URL).replace(/\/+$/, '');
  const model = options.model ?? (options.apiKey ? 'gemma4:31b' : DEFAULT_OLLAMA_MODEL);
  const doFetch = resolveFetch(options.fetch);

  return {
    id: 'ollama',
    model,
    async *stream(request: CompletionRequest) {
      const headers: Record<string, string> = { 'Content-Type': 'application/json', ...options.headers };
      if (options.apiKey) headers.Authorization = `Bearer ${options.apiKey}`;

      const modelOptions: Record<string, unknown> = { ...options.options };
      if (request.temperature !== undefined) modelOptions.temperature = request.temperature;
      if (request.maxTokens !== undefined) modelOptions.num_predict = request.maxTokens;

      let response: Response;
      try {
        response = await doFetch(`${baseUrl}/api/chat`, {
          method: 'POST',
          headers,
          signal: request.signal,
          body: JSON.stringify({
            model: request.model ?? model,
            stream: true,
            think: options.think ?? false,
            keep_alive: options.keepAlive,
            options: Object.keys(modelOptions).length > 0 ? modelOptions : undefined,
            messages: [
              { role: 'system', content: request.system },
              { role: 'user', content: request.prompt },
            ],
          }),
        });
      } catch (error) {
        if (request.signal?.aborted) throw error;
        throw new AIProviderError(
          'ollama',
          baseUrl === OLLAMA_LOCAL_URL
            ? 'Ollama is not running on this computer. Install it from https://ollama.com/download and start it, or choose an online model.'
            : `Could not reach Ollama at ${baseUrl}. Check that it is running and allows requests from this page (OLLAMA_ORIGINS).`,
        );
      }

      if (!response.ok || !response.body) throw await errorFromResponse('ollama', response);

      for await (const line of readLines(response.body, request.signal)) {
        if (!line.trim()) continue;
        const chunk = JSON.parse(line);
        if (chunk.error) throw new AIProviderError('ollama', String(chunk.error));
        const content = chunk.message?.content;
        if (content) yield content as string;
        if (chunk.done) return;
      }
    },
  };
}
