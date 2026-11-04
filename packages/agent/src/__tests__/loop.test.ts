// @vitest-environment node
import { createAnthropicAgentProvider, toAnthropicMessages } from '../anthropic.js';
import { DraftDocument } from '../core/draft.js';
import { runAgent, type AgentProvider, type ChatRequest, type ChatTurn } from '../core/loop.js';
import { createDocumentTools } from '../core/tools.js';
import { createOllamaAgentProvider } from '../providers/ollama.js';
import { createOpenAICompatibleAgentProvider } from '../providers/openai.js';
import { createProxyAgentProvider } from '../providers/proxy.js';
import { createAgentHandler } from '../server.js';

const draft = () =>
  new DraftDocument([
    { id: 'b1', type: 'heading', level: 2, text: 'Quarterly Update' },
    { id: 'b2', type: 'paragraph', text: 'Signups is up.' },
  ]);

/** A model that plays back scripted turns and records what it was sent. */
function scripted(turns: ChatTurn[]): AgentProvider & { requests: ChatRequest[] } {
  const requests: ChatRequest[] = [];
  return {
    id: 'fake',
    requests,
    async chat(request) {
      requests.push(structuredClone({ ...request, signal: undefined }));
      const turn = turns.shift();
      if (!turn) throw new Error('script ran out');
      return turn;
    },
  };
}

const call = (id: string, name: string, args: Record<string, unknown>) => ({ id, name, arguments: args });

describe('runAgent', () => {
  it('runs tool calls, feeds results back and stops at the answer', async () => {
    const doc = draft();
    const provider = scripted([
      { content: '', toolCalls: [call('c1', 'get_document', {})], stop: 'tool_use' },
      { content: 'Fixing.', toolCalls: [call('c2', 'replace_text', { block_id: 'b2', find: 'is', replace: 'are' }), call('c3', 'rewrite_block', { block_id: 'b9', text: 'x' })], stop: 'tool_use' },
      { content: 'Changed "is" to "are".', toolCalls: [], stop: 'end' },
    ]);
    const steps: string[] = [];
    const result = await runAgent({ provider, tools: createDocumentTools(doc), instruction: 'Fix grammar', onStep: (step) => steps.push(step.type === 'tool' ? `${step.name}${step.isError ? '!' : ''}` : 'model') });
    expect(result).toMatchObject({ answer: 'Changed "is" to "are".', stopped: 'done' });
    expect(steps).toEqual(['model', 'get_document', 'model', 'replace_text', 'rewrite_block!', 'model']);
    expect(doc.get('b2').text).toBe('Signups are up.');
    // The second request carries the document; the third carries both results, the bad id as an error.
    expect(JSON.stringify(provider.requests[1].messages)).toContain('[b2] paragraph: Signups is up.');
    const toolMessage = provider.requests[2].messages.at(-1)!;
    expect(toolMessage).toMatchObject({ role: 'tool', results: [{ callId: 'c2', isError: undefined }, { callId: 'c3', isError: true }] });
  });

  it('stops at the step limit, on abort and on refusal', async () => {
    const loop = () => ({ content: 'again', toolCalls: [call('c', 'get_document', {})], stop: 'tool_use' as const });
    expect((await runAgent({ provider: scripted([loop(), loop(), loop()]), tools: createDocumentTools(draft()), instruction: 'x', maxSteps: 2 })).stopped).toBe('limit');

    const controller = new AbortController();
    const aborting: AgentProvider = { id: 'a', chat: async () => (controller.abort(), loop()) };
    const aborted = await runAgent({ provider: aborting, tools: createDocumentTools(draft()), instruction: 'x', signal: controller.signal });
    expect(aborted.stopped).toBe('aborted');
    // The pending call still got an answer, so the history stays valid.
    expect(aborted.messages.at(-1)).toMatchObject({ role: 'tool', results: [{ text: 'Error: the user stopped the run.' }] });

    expect((await runAgent({ provider: scripted([{ content: 'No.', toolCalls: [], stop: 'refusal' }]), tools: [], instruction: 'x' })).stopped).toBe('refusal');
  });
});

/** fetch that records the request and returns `reply`. */
function fakeFetch(reply: unknown, status = 200) {
  const calls: Array<{ url: string; body: any; headers: Record<string, string> }> = [];
  const doFetch = async (url: string, init?: RequestInit) => {
    calls.push({ url, body: JSON.parse(String(init?.body)), headers: init?.headers as Record<string, string> });
    return new Response(JSON.stringify(reply), { status });
  };
  return { calls, doFetch };
}

const history = [
  { role: 'user' as const, content: 'Fix it' },
  { role: 'assistant' as const, content: '', toolCalls: [call('c1', 'get_document', {})] },
  { role: 'tool' as const, results: [{ callId: 'c1', name: 'get_document', text: '1 blocks.' }] },
];
const tools = [{ name: 'get_document', description: 'Read', parameters: { type: 'object' as const, properties: {} } }];

describe('providers', () => {
  it('Ollama: sends tools and tool results, parses object arguments', async () => {
    const { calls, doFetch } = fakeFetch({ message: { content: '', tool_calls: [{ id: 'x1', function: { name: 'rewrite_block', arguments: { block_id: 'b1', text: 'Hi' } } }] }, done_reason: 'stop' });
    const turn = await createOllamaAgentProvider({ fetch: doFetch }).chat({ system: 'S', messages: history, tools });
    expect(turn).toEqual({ content: '', toolCalls: [{ id: 'x1', name: 'rewrite_block', arguments: { block_id: 'b1', text: 'Hi' } }], stop: 'tool_use' });
    expect(calls[0].url).toBe('http://localhost:11434/api/chat');
    expect(calls[0].body).toMatchObject({ model: 'gpt-oss:20b-cloud', stream: false, think: false, tools: [{ type: 'function', function: { name: 'get_document' } }] });
    expect(calls[0].body.messages.map((m: any) => m.role)).toEqual(['system', 'user', 'assistant', 'tool']);
    expect(calls[0].body.messages[3]).toMatchObject({ content: '1 blocks.', tool_name: 'get_document' });
  });

  it('Ollama: sends a reasoning model its earlier thinking back (gpt-oss fails without it)', async () => {
    const { calls, doFetch } = fakeFetch({ message: { content: '', thinking: 'Need to read first.', tool_calls: [{ function: { name: 'get_document', arguments: {} } }] }, done_reason: 'stop' });
    const provider = createOllamaAgentProvider({ fetch: doFetch });
    const first = await provider.chat({ system: 'S', messages: [{ role: 'user', content: 'Fix' }], tools });
    expect(first.raw).toEqual({ thinking: 'Need to read first.' });
    expect(first.toolCalls[0].id).toMatch(/^call_/);
    await provider.chat({ system: 'S', messages: [{ role: 'user', content: 'Fix' }, { role: 'assistant', content: '', toolCalls: first.toolCalls, raw: first.raw }], tools });
    expect(calls[1].body.messages[2]).toMatchObject({ role: 'assistant', thinking: 'Need to read first.' });
  });

  it('OpenAI-compatible: string arguments, tool_call_id, bad JSON reported', async () => {
    const { calls, doFetch } = fakeFetch({ choices: [{ finish_reason: 'tool_calls', message: { content: null, tool_calls: [{ id: 't1', type: 'function', function: { name: 'search', arguments: '{"query":"x"}' } }, { id: 't2', type: 'function', function: { name: 'search', arguments: '{oops' } }] } }] });
    const turn = await createOpenAICompatibleAgentProvider({ baseUrl: 'https://api.example.com/v1/', model: 'm', apiKey: 'k', fetch: doFetch }).chat({ system: 'S', messages: history, tools });
    expect(turn.toolCalls).toEqual([{ id: 't1', name: 'search', arguments: { query: 'x' } }, { id: 't2', name: 'search', arguments: { __invalid_arguments: '{oops' } }]);
    expect(calls[0].url).toBe('https://api.example.com/v1/chat/completions');
    expect(calls[0].headers.Authorization).toBe('Bearer k');
    expect(calls[0].body.messages[2]).toMatchObject({ role: 'assistant', content: null, tool_calls: [{ id: 'c1', type: 'function', function: { name: 'get_document', arguments: '{}' } }] });
    expect(calls[0].body.messages[3]).toEqual({ role: 'tool', tool_call_id: 'c1', content: '1 blocks.' });
  });

  it('reports API errors with the provider message', async () => {
    const { doFetch } = fakeFetch({ error: { message: 'model not found' } }, 404);
    await expect(createOllamaAgentProvider({ fetch: doFetch }).chat({ system: 'S', messages: history, tools })).rejects.toThrow('Ollama answered 404: model not found');
  });

  it('Anthropic: tools as input_schema, results in one user message, raw content sent back unchanged', async () => {
    const sent: any[] = [];
    const content = [
      { type: 'thinking', thinking: '', signature: 'sig' },
      { type: 'text', text: 'Reading.' },
      { type: 'tool_use', id: 'tu1', name: 'get_document', input: {} },
    ];
    const client = { beta: { messages: { create: async (params: any) => (sent.push(params), { content, stop_reason: 'tool_use' }) } } };
    const provider = createAnthropicAgentProvider({ client: client as never });
    const turn = await provider.chat({ system: 'S', messages: [{ role: 'user', content: 'Fix' }], tools });
    expect(turn).toMatchObject({ content: 'Reading.', toolCalls: [{ id: 'tu1', name: 'get_document', arguments: {} }], stop: 'tool_use' });
    expect(sent[0]).toMatchObject({ model: 'claude-opus-5-5', output_config: { effort: 'low' }, fallbacks: 'default', betas: ['server-side-fallback-2026-07-01'], tools: [{ name: 'get_document', input_schema: { type: 'object' } }] });
    expect(sent[0].temperature).toBeUndefined();
    expect(sent[0].tool_choice).toBeUndefined();

    const next = toAnthropicMessages([
      { role: 'user', content: 'Fix' },
      { role: 'assistant', content: 'Reading.', toolCalls: turn.toolCalls, raw: turn.raw },
      { role: 'tool', results: [{ callId: 'tu1', name: 'get_document', text: 'doc' }, { callId: 'tu2', name: 'x', text: 'Error', isError: true }] },
    ]);
    expect(next[1].content).toBe(content);
    expect(next[2]).toEqual({ role: 'user', content: [{ type: 'tool_result', tool_use_id: 'tu1', content: 'doc' }, { type: 'tool_result', tool_use_id: 'tu2', content: 'Error', is_error: true }] });

    const refusing = { beta: { messages: { create: async () => ({ content: [], stop_reason: 'refusal' }) } } };
    expect((await createAnthropicAgentProvider({ client: refusing as never }).chat({ system: 'S', messages: [], tools })).stop).toBe('refusal');
  });
});

describe('proxy', () => {
  it('runs one turn on the server with the server-side provider', async () => {
    const seen: Array<{ apiKey?: string; model?: string }> = [];
    const handler = createAgentHandler({
      providers: { fake: (input) => (seen.push(input), scripted([{ content: 'done', toolCalls: [], stop: 'end' }])) },
      allowClientKeys: true,
      allowedModels: ['ok-model'],
    });
    const doFetch = (url: string, init?: RequestInit) => handler(new Request(`http://x${url}`, init));
    const provider = createProxyAgentProvider({ url: '/api/agent', provider: 'fake', model: 'ok-model', apiKey: 'user-key', fetch: doFetch });
    expect(await provider.chat({ system: 'S', messages: history, tools })).toMatchObject({ content: 'done', stop: 'end' });
    expect(seen).toEqual([{ apiKey: 'user-key', model: 'ok-model' }]);

    const other = createProxyAgentProvider({ url: '/api/agent', provider: 'fake', model: 'not-allowed', fetch: doFetch });
    await other.chat({ system: 'S', messages: history, tools });
    expect(seen[1]).toEqual({ apiKey: undefined, model: undefined });

    expect((await handler(new Request('http://x/', { method: 'POST', body: '{"system":1}' }))).status).toBe(400);
    expect((await handler(new Request('http://x/', { method: 'POST', body: JSON.stringify({ provider: 'nope', system: 'S', messages: [], tools: [] }) }))).status).toBe(400);
    expect((await handler(new Request('http://x/', { method: 'GET' }))).status).toBe(405);
  });
});
