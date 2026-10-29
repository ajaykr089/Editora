export interface CompletionRequest {
  system: string;
  prompt: string;
  /** Overrides the provider's default model for this request. */
  model?: string;
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
}

/**
 * Anything that can stream a completion as text chunks. Implement this to
 * plug in a provider the package does not ship.
 */
export interface AIProvider {
  readonly id: string;
  readonly model?: string;
  stream(request: CompletionRequest): AsyncIterable<string>;
}

export class AIProviderError extends Error {
  readonly status?: number;
  readonly provider: string;

  constructor(provider: string, message: string, status?: number) {
    super(message);
    this.name = 'AIProviderError';
    this.provider = provider;
    this.status = status;
  }
}

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export function resolveFetch(custom?: FetchLike): FetchLike {
  if (custom) return custom;
  if (typeof fetch !== 'function') throw new Error('No fetch implementation available; pass `fetch` in the provider options.');
  return (input, init) => fetch(input, init);
}

/** `detailOnly` drops the "<provider> request failed (status):" prefix, for messages already written for users. */
export async function errorFromResponse(provider: string, response: Response, detailOnly = false): Promise<AIProviderError> {
  let detail = '';
  try {
    const body = await response.text();
    try {
      const parsed = JSON.parse(body);
      detail = parsed?.error?.message ?? parsed?.error ?? parsed?.message ?? body;
    } catch {
      detail = body;
    }
  } catch {
    // Body unreadable; fall back to the status line.
  }
  const text = typeof detail === 'string' && detail.trim() ? detail.trim().slice(0, 300) : response.statusText;
  return new AIProviderError(provider, detailOnly ? text : `${provider} request failed (${response.status}): ${text}`, response.status);
}
