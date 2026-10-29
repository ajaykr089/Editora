import { createOllamaProvider, ollamaLocalCloudTag } from '../providers/ollama';
import { createOpenAICompatibleProvider } from '../providers/openai';
import { createProxyProvider } from '../providers/proxy';
import { AIProviderError, type AIProvider } from '../providers/types';
import { runRewrite } from '../core/run';
import { AIReview } from '../core/review';
import { createAIReviewHandler, ollamaCloudProvider } from '../server';

function streamOf(parts: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      parts.forEach((part) => controller.enqueue(encoder.encode(part)));
      controller.close();
    },
  });
}

async function collect(provider: AIProvider): Promise<string> {
  let text = '';
  for await (const chunk of provider.stream({ system: 's', prompt: 'p' })) text += chunk;
  return text;
}

describe('ollama provider', () => {
  it('streams NDJSON content split across network chunks, ignoring thinking', async () => {
    const calls: Array<{ url: string; body: any; headers: any }> = [];
    const provider = createOllamaProvider({
      model: 'gemma4:31b-cloud',
      fetch: async (url, init) => {
        calls.push({ url, body: JSON.parse(String(init!.body)), headers: init!.headers });
        return new Response(
          streamOf([
            '{"message":{"content":"","thinking":"hmm"},"done":false}\n{"message":{"content":"Hel',
            'lo"},"done":false}\n',
            '{"message":{"content":" world"},"done":false}\n{"message":{"content":""},"done":true}\n',
          ]),
        );
      },
    });
    expect(await collect(provider)).toBe('Hello world');
    expect(calls[0].url).toBe('http://localhost:11434/api/chat');
    expect(calls[0].body).toMatchObject({ model: 'gemma4:31b-cloud', stream: true, think: false });
    expect(calls[0].headers.Authorization).toBeUndefined();
  });

  it('sends the key to ollama.com and surfaces API errors', async () => {
    const provider = createOllamaProvider({
      baseUrl: 'https://ollama.com',
      apiKey: 'k',
      fetch: async (_url, init) => {
        expect((init!.headers as any).Authorization).toBe('Bearer k');
        expect(JSON.parse(String(init!.body)).model).toBe('gemma4:31b');
        return new Response('{"error":"unauthorized"}', { status: 401 });
      },
    });
    await expect(collect(provider)).rejects.toMatchObject({ status: 401, message: expect.stringContaining('unauthorized') });
  });

  it('explains when the local daemon is not running', async () => {
    const provider = createOllamaProvider({ fetch: async () => Promise.reject(new TypeError('Failed to fetch')) });
    await expect(collect(provider)).rejects.toThrow(/not running on this computer.*ollama\.com\/download/);
  });

  it('maps library ids to local cloud tags', () => {
    expect(ollamaLocalCloudTag('gpt-oss:120b')).toBe('gpt-oss:120b-cloud');
    expect(ollamaLocalCloudTag('nemotron-3-super')).toBe('nemotron-3-super:cloud');
    expect(ollamaLocalCloudTag('gemma4:31b-cloud')).toBe('gemma4:31b-cloud');
  });
});

describe('OpenAI-compatible provider', () => {
  it('parses server-sent events until [DONE]', async () => {
    const provider = createOpenAICompatibleProvider({
      preset: 'openrouter',
      apiKey: 'sk',
      model: 'm',
      fetch: async (url, init) => {
        expect(url).toBe('https://openrouter.ai/api/v1/chat/completions');
        expect((init!.headers as any).Authorization).toBe('Bearer sk');
        return new Response(
          streamOf([
            'data: {"choices":[{"delta":{"role":"assistant"}}]}\n\n',
            'data: {"choices":[{"delta":{"content":"Hi"}}]}\n\ndata: {"choices":[{"del',
            'ta":{"content":" there"}}]}\n\n: keep-alive\n\ndata: [DONE]\n\n',
          ]),
        );
      },
    });
    expect(await collect(provider)).toBe('Hi there');
  });
});

describe('runRewrite', () => {
  it('streams cleaned text into the review and finishes it', async () => {
    const provider: AIProvider = {
      id: 'fake',
      async *stream() {
        yield "Here's the text:\n\n";
        yield 'The cat ';
        yield 'sat.';
      },
    };
    const review = new AIReview(['Teh cat sat.']);
    const seen: string[] = [];
    const result = await runRewrite({ provider, review, instruction: 'fix', onText: (text) => seen.push(text) });
    expect(result).toBe('The cat sat.');
    expect(review.isStreaming).toBe(false);
    expect(review.hunks.map((hunk) => hunk.inserted)).toEqual(['The']);
    expect(seen[seen.length - 1]).toBe('The cat sat.');
  });

  it('rejects an empty answer instead of suggesting to delete everything', async () => {
    const provider: AIProvider = {
      id: 'fake',
      async *stream() {
        yield '```\n```';
      },
    };
    await expect(runRewrite({ provider, review: new AIReview(['Text.']), instruction: 'x' })).rejects.toThrow(/no text/);
  });
});

describe('server handler + proxy provider', () => {
  const echo: AIProvider = {
    id: 'echo',
    async *stream(request) {
      yield 'model=' + (request.model ?? 'default');
      yield ' prompt=' + request.prompt;
    },
  };

  const handlerFetch = (handler: (request: Request) => Promise<Response>) => async (url: string, init?: RequestInit) =>
    handler(new Request(`http://test${url}`, init));

  it('streams a provider through the proxy', async () => {
    const handler = createAIReviewHandler({ providers: { echo: () => echo } });
    const provider = createProxyProvider({ url: '/ai', fetch: handlerFetch(handler) });
    expect(await collect(provider)).toBe('model=default prompt=p');
  });

  it('refuses models that are not allowed and unknown providers', async () => {
    const handler = createAIReviewHandler({ providers: { echo: () => echo }, allowedModels: ['ok'] });
    await expect(collect(createProxyProvider({ url: '/ai', model: 'other', fetch: handlerFetch(handler) }))).rejects.toMatchObject({ status: 400 });
    expect(await collect(createProxyProvider({ url: '/ai', model: 'ok', fetch: handlerFetch(handler) }))).toBe('model=ok prompt=p');
    await expect(collect(createProxyProvider({ url: '/ai', provider: 'nope', fetch: handlerFetch(handler) }))).rejects.toThrow(/^Unknown provider "nope"\.$/);
  });

  it('passes a client key only when allowed', async () => {
    const keys: Array<string | undefined> = [];
    const factory = (input: { apiKey?: string }) => {
      keys.push(input.apiKey);
      return echo;
    };
    const closed = createAIReviewHandler({ providers: { echo: factory } });
    const open = createAIReviewHandler({ providers: { echo: factory }, allowClientKeys: true });
    await collect(createProxyProvider({ url: '/ai', apiKey: 'user-key', fetch: handlerFetch(closed) }));
    await collect(createProxyProvider({ url: '/ai', apiKey: 'user-key', fetch: handlerFetch(open) }));
    expect(keys).toEqual([undefined, 'user-key']);
  });

  it('turns an upstream failure before the first chunk into an HTTP error', async () => {
    const failing: AIProvider = {
      id: 'bad',
      // eslint-disable-next-line require-yield
      async *stream() {
        throw new AIProviderError('bad', 'upstream said no', 429);
      },
    };
    const handler = createAIReviewHandler({ providers: { bad: () => failing } });
    const response = await handler(new Request('http://test/ai', { method: 'POST', body: JSON.stringify({ prompt: 'p' }) }));
    expect(response.status).toBe(429);
    expect((await response.json()).error.message).toBe('upstream said no');
  });

  it('requires a key for Ollama Cloud', async () => {
    const handler = createAIReviewHandler({ providers: { 'ollama-cloud': ollamaCloudProvider() }, allowClientKeys: true });
    const response = await handler(new Request('http://test/ai', { method: 'POST', body: JSON.stringify({ prompt: 'p' }) }));
    expect(response.status).toBe(401);
  });

  it('rejects oversized prompts', async () => {
    const handler = createAIReviewHandler({ providers: { echo: () => echo }, maxPromptChars: 5 });
    const response = await handler(new Request('http://test/ai', { method: 'POST', body: JSON.stringify({ prompt: 'too long' }) }));
    expect(response.status).toBe(413);
  });
});
