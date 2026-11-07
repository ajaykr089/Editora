export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export class AgentProviderError extends Error {
  readonly status?: number;
  readonly provider: string;

  constructor(provider: string, message: string, status?: number) {
    super(message);
    this.name = 'AgentProviderError';
    this.provider = provider;
    this.status = status;
  }
}

export function resolveFetch(custom?: FetchLike): FetchLike {
  if (custom) return custom;
  if (typeof fetch !== 'function') throw new Error('No fetch implementation available; pass `fetch` in the provider options.');
  return (input, init) => fetch(input, init);
}

/** POST JSON and return the parsed body, with the provider's own error message on failure. */
export async function postJson(provider: string, doFetch: FetchLike, url: string, body: unknown, headers: Record<string, string>, signal?: AbortSignal): Promise<any> {
  let response: Response;
  try {
    response = await doFetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body), signal });
  } catch (error) {
    if ((error as Error)?.name === 'AbortError') throw error;
    throw new AgentProviderError(provider, `Could not reach ${url}: ${(error as Error)?.message ?? error}`);
  }
  const text = await response.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // Not JSON; reported below.
  }
  if (!response.ok) {
    const message = data?.error?.message ?? data?.error ?? (text.slice(0, 300) || response.statusText);
    throw new AgentProviderError(provider, `${provider} answered ${response.status}: ${typeof message === 'string' ? message : JSON.stringify(message)}`, response.status);
  }
  if (data === null) throw new AgentProviderError(provider, `${provider} sent a response that is not JSON.`);
  return data;
}

/** Tool arguments arrive as an object or a JSON string, depending on the API. */
export function parseArguments(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value as Record<string, unknown>;
  if (typeof value === 'string') {
    if (!value.trim()) return {};
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    } catch {
      // The tool reports the bad input back to the model.
    }
    return { __invalid_arguments: value };
  }
  return {};
}

let counter = 0;
export const callId = () => `call_${Date.now().toString(36)}_${(counter++).toString(36)}`;
