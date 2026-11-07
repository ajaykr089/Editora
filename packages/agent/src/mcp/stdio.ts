/**
 * The small part of the Model Context Protocol an editing server needs:
 * JSON-RPC 2.0 over newline-delimited stdio with initialize, ping,
 * tools/list and tools/call. No dependencies.
 */
import type { JsonSchema, ToolResult } from '../core/types.js';

export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: JsonSchema;
}

export interface McpServerOptions {
  name?: string;
  version?: string;
  instructions?: string;
  tools: McpToolDefinition[];
  /** Run a tool; throw to report a protocol error, return isError for a tool error. */
  call: (name: string, args: Record<string, unknown>) => Promise<ToolResult>;
  /** Called with the client's name once it says hello (e.g. "claude-code"). */
  onInitialize?: (client: { name?: string; version?: string }) => void;
}

const SUPPORTED_VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05'];

type JsonRpcRequest = { jsonrpc: '2.0'; id?: string | number | null; method: string; params?: any };
type JsonRpcResponse = { jsonrpc: '2.0'; id: string | number | null; result?: unknown; error?: { code: number; message: string } };

/** Handle one JSON-RPC message; returns the response, or null for a notification. */
export async function handleMcpMessage(options: McpServerOptions, message: JsonRpcRequest): Promise<JsonRpcResponse | null> {
  const id = message.id ?? null;
  const isNotification = message.id === undefined;
  const ok = (result: unknown): JsonRpcResponse => ({ jsonrpc: '2.0', id, result });
  const fail = (code: number, text: string): JsonRpcResponse => ({ jsonrpc: '2.0', id, error: { code, message: text } });

  switch (message.method) {
    case 'initialize': {
      const requested = message.params?.protocolVersion;
      options.onInitialize?.(message.params?.clientInfo ?? {});
      return ok({
        protocolVersion: SUPPORTED_VERSIONS.includes(requested) ? requested : SUPPORTED_VERSIONS[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: options.name ?? 'editora', version: options.version ?? '0.0.0' },
        ...(options.instructions ? { instructions: options.instructions } : {}),
      });
    }
    case 'ping':
      return ok({});
    case 'tools/list':
      return ok({ tools: options.tools });
    case 'tools/call': {
      const name = message.params?.name;
      if (typeof name !== 'string' || !options.tools.some((tool) => tool.name === name)) return fail(-32602, `Unknown tool: ${String(name)}`);
      try {
        const result = await options.call(name, message.params?.arguments ?? {});
        return ok({ content: [{ type: 'text', text: result.text }], isError: Boolean(result.isError) });
      } catch (error) {
        return ok({ content: [{ type: 'text', text: `Error: ${(error as Error)?.message ?? String(error)}` }], isError: true });
      }
    }
    default:
      if (isNotification) return null;
      return fail(-32601, `Method not found: ${message.method}`);
  }
}

export interface Readable {
  /** Chunks are strings or Node Buffers (anything with toString()). */
  on(event: 'data', listener: (chunk: { toString(): string }) => void): unknown;
  on(event: 'end', listener: () => void): unknown;
}
export interface Writable {
  write(chunk: string): unknown;
}

/** Serve MCP over stdio-like streams until the input ends. */
export function serveStdio(options: McpServerOptions, input: Readable, output: Writable): Promise<void> {
  let buffer = '';
  const send = (response: JsonRpcResponse | null) => {
    if (response) output.write(`${JSON.stringify(response)}\n`);
  };
  return new Promise((resolve) => {
    input.on('data', (chunk) => {
      buffer += chunk.toString();
      let newline: number;
      while ((newline = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        if (!line) continue;
        let message: JsonRpcRequest;
        try {
          message = JSON.parse(line);
        } catch {
          send({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } });
          continue;
        }
        // Answer in arrival order is not required; tools/call may take a while.
        void handleMcpMessage(options, message).then(send);
      }
    });
    input.on('end', () => resolve());
  });
}
