import { readText } from './streams';
import { errorFromResponse, resolveFetch, AIProviderError, type AIProvider, type CompletionRequest, type FetchLike } from './types';

export interface ProxyProviderOptions {
  /** Your endpoint built with `createAIReviewHandler` from `@editora/ai-review/server`. */
  url: string;
  /** Which provider the server should use, when it offers several. */
  provider?: string;
  model?: string;
  /** A key the user typed in, forwarded for this request only. The server must opt in with `allowClientKeys`. */
  apiKey?: string;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  fetch?: FetchLike;
}

export const CLIENT_KEY_HEADER = 'x-ai-review-key';

/** Streams completions through your own server, which holds the provider keys. */
export function createProxyProvider(options: ProxyProviderOptions): AIProvider {
  const doFetch = resolveFetch(options.fetch);

  return {
    id: options.provider ? `proxy:${options.provider}` : 'proxy',
    model: options.model,
    async *stream(request: CompletionRequest) {
      const headers: Record<string, string> = { 'Content-Type': 'application/json', ...options.headers };
      if (options.apiKey) headers[CLIENT_KEY_HEADER] = options.apiKey;

      let response: Response;
      try {
        response = await doFetch(options.url, {
          method: 'POST',
          headers,
          credentials: options.credentials,
          signal: request.signal,
          body: JSON.stringify({
            provider: options.provider,
            model: request.model ?? options.model,
            system: request.system,
            prompt: request.prompt,
            temperature: request.temperature,
            maxTokens: request.maxTokens,
          }),
        });
      } catch (error) {
        if (request.signal?.aborted) throw error;
        throw new AIProviderError('proxy', `Could not reach ${options.url}.`);
      }

      // The handler's messages are written for users ("An Ollama API key is required...").
      if (!response.ok || !response.body) throw await errorFromResponse('proxy', response, true);
      yield* readText(response.body, request.signal);
    },
  };
}
