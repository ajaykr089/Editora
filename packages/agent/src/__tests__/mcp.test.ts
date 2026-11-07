// @vitest-environment node
import { PassThrough } from 'node:stream';
import { mcpToolDefinitions, runEditoraMcp } from '../mcp.js';
import { startBridge } from '../mcp/bridge.js';
import { handleMcpMessage, serveStdio } from '../mcp/stdio.js';

const server = (call = async () => ({ text: 'ok' })) => ({ name: 'editora', version: '1.2.3', tools: mcpToolDefinitions(), call });

describe('MCP protocol', () => {
  it('initializes, lists the seven tools and calls one', async () => {
    const init = await handleMcpMessage(server(), { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-03-26', clientInfo: { name: 'claude-code' } } });
    expect(init).toMatchObject({ id: 1, result: { protocolVersion: '2025-03-26', capabilities: { tools: {} }, serverInfo: { name: 'editora', version: '1.2.3' } } });
    const future = await handleMcpMessage(server(), { jsonrpc: '2.0', id: 2, method: 'initialize', params: { protocolVersion: '2099-01-01' } });
    expect((future!.result as { protocolVersion: string }).protocolVersion).toBe('2025-06-18');

    const list = await handleMcpMessage(server(), { jsonrpc: '2.0', id: 3, method: 'tools/list' });
    const tools = (list!.result as { tools: Array<{ name: string; inputSchema: { type: string } }> }).tools;
    expect(tools.map((tool) => tool.name)).toEqual(['get_document', 'get_selection', 'search', 'replace_text', 'rewrite_block', 'insert_blocks', 'delete_blocks']);
    expect(tools.every((tool) => tool.inputSchema.type === 'object')).toBe(true);

    const called = await handleMcpMessage(server(async () => ({ text: 'Error: nope', isError: true })), { jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'search', arguments: { query: 'x' } } });
    expect(called!.result).toEqual({ content: [{ type: 'text', text: 'Error: nope' }], isError: true });
    expect((await handleMcpMessage(server(), { jsonrpc: '2.0', id: 5, method: 'tools/call', params: { name: 'rm_rf' } }))!.error!.code).toBe(-32602);
    expect((await handleMcpMessage(server(), { jsonrpc: '2.0', id: 6, method: 'resources/list' }))!.error!.code).toBe(-32601);
    expect(await handleMcpMessage(server(), { jsonrpc: '2.0', method: 'notifications/initialized' })).toBeNull();
  });

  it('frames JSON-RPC as newline-delimited stdio, split across chunks', async () => {
    const input = new PassThrough();
    const output = new PassThrough();
    const lines: string[] = [];
    output.on('data', (chunk) => lines.push(...chunk.toString().split('\n').filter(Boolean)));
    const done = serveStdio(server(), input, output);
    input.write('{"jsonrpc":"2.0","id":1,"me');
    input.write('thod":"ping"}\n{not json}\n');
    input.end();
    await done;
    await new Promise((resolve) => setTimeout(resolve, 10));
    // Replies may arrive in any order: tools/call can take a while.
    const replies = lines.map((line) => JSON.parse(line));
    expect(replies).toHaveLength(2);
    expect(replies).toEqual(expect.arrayContaining([{ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }, { jsonrpc: '2.0', id: 1, result: {} }]));
  });
});

/** A page: reads the SSE stream and answers each call. */
async function fakePage(url: string, token: string, answer: (call: { id: string; name: string }) => string, origin = 'http://localhost:5199') {
  const response = await fetch(`${url}/events?token=${token}`, { headers: { Origin: origin } });
  const reader = response.body!.getReader();
  let buffer = '';
  let stopped = false;
  void (async () => {
    while (!stopped) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += new TextDecoder().decode(value);
      let end: number;
      while ((end = buffer.indexOf('\n\n')) >= 0) {
        const event = buffer.slice(0, end);
        buffer = buffer.slice(end + 2);
        const data = event.split('\n').find((line) => line.startsWith('data: '));
        if (!event.startsWith('event: call') || !data) continue;
        const call = JSON.parse(data.slice(6));
        await fetch(`${url}/result?token=${token}`, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ id: call.id, text: answer(call) }) });
      }
    }
  })();
  return { stop: () => ((stopped = true), reader.cancel()) };
}

describe('bridge', () => {
  it('forwards calls to the connected page and its answers back', async () => {
    const bridge = await startBridge({ port: 0, token: 'secret-token' });
    expect((await bridge.call('get_document', {})).text).toMatch(/no Editora editor is connected/);
    const page = await fakePage(bridge.url, 'secret-token', (call) => `answer to ${call.name}`);
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(bridge.connected).toBe(true);
    expect(await bridge.call('get_document', {})).toEqual({ text: 'answer to get_document', isError: false });
    await page.stop();
    await bridge.close();
  });

  it('refuses a wrong token, a foreign origin, and times out a silent page', async () => {
    const bridge = await startBridge({ port: 0, token: 'secret-token', timeoutMs: 100 });
    expect((await fetch(`${bridge.url}/events?token=wrong`)).status).toBe(401);
    expect((await fetch(`${bridge.url}/events?token=secret-token`, { headers: { Origin: 'https://evil.example' } })).status).toBe(403);
    const preflight = await fetch(`${bridge.url}/result`, { method: 'OPTIONS', headers: { Origin: 'http://localhost:3000' } });
    expect(preflight.headers.get('access-control-allow-origin')).toBe('http://localhost:3000');
    expect(preflight.headers.get('access-control-allow-private-network')).toBe('true');
    const silent = await fetch(`${bridge.url}/events?token=secret-token`);
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect((await bridge.call('search', { query: 'x' })).text).toMatch(/did not answer in time/);
    await silent.body!.cancel();
    await bridge.close();
  });

  it('binds to 127.0.0.1 only', async () => {
    const bridge = await startBridge({ port: 0, token: 't' });
    expect(bridge.url).toMatch(/^http:\/\/127\.0\.0\.1:\d+$/);
    await bridge.close();
  });

  it('runs end to end over stdio', async () => {
    const input = new PassThrough();
    const output = new PassThrough();
    const replies: Array<{ id: number; result?: any }> = [];
    output.on('data', (chunk) => chunk.toString().split('\n').filter(Boolean).forEach((line: string) => replies.push(JSON.parse(line))));
    const { bridge, done } = await runEditoraMcp({ port: 0, token: 'tok', input, output });
    const page = await fakePage(bridge.url, 'tok', () => '2 blocks.\n[b1] paragraph: Hello');
    await new Promise((resolve) => setTimeout(resolve, 30));
    input.write(`${JSON.stringify({ jsonrpc: '2.0', id: 7, method: 'tools/call', params: { name: 'get_document', arguments: {} } })}\n`);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(replies.find((reply) => reply.id === 7)!.result).toEqual({ content: [{ type: 'text', text: '2 blocks.\n[b1] paragraph: Hello' }], isError: false });
    await page.stop();
    input.end();
    await done;
  });
});
