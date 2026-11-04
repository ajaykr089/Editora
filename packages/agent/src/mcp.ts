/**
 * MCP server for Editora (Node): lets Claude Desktop, Claude Code, Cursor
 * or any MCP client read and edit the document open in your page. Edits
 * show up there as suggestions. Most people run the `editora-mcp` command;
 * this entry point is for embedding it.
 */
import { DraftDocument } from './core/draft.js';
import { createDocumentTools } from './core/tools.js';
import { startBridge, type Bridge, type BridgeOptions } from './mcp/bridge.js';
import { handleMcpMessage, serveStdio, type McpServerOptions, type McpToolDefinition, type Readable, type Writable } from './mcp/stdio.js';

export const MCP_INSTRUCTIONS =
  'These tools read and edit the rich text document open in the user\'s Editora editor. Call get_document first and use its block ids. Every edit appears to the user as a suggestion to accept or reject; they appear once you pause, so make all related edits in one go.';

/** The document tools as MCP tool definitions. */
export function mcpToolDefinitions(): McpToolDefinition[] {
  return createDocumentTools(new DraftDocument([])).map((tool) => ({ name: tool.name, description: tool.description, inputSchema: tool.parameters }));
}

export interface EditoraMcpOptions extends Omit<BridgeOptions, 'token'> {
  token: string;
  input: Readable;
  output: Writable;
  version?: string;
}

/** Start the bridge and serve MCP on the given streams. Resolves when the input ends. */
export async function runEditoraMcp(options: EditoraMcpOptions): Promise<{ bridge: Bridge; done: Promise<void> }> {
  const bridge = await startBridge(options);
  let client: string | undefined;
  const done = serveStdio(
    {
      name: 'editora',
      version: options.version,
      instructions: MCP_INSTRUCTIONS,
      tools: mcpToolDefinitions(),
      onInitialize: (info) => (client = typeof info.name === 'string' ? info.name.slice(0, 80) : undefined),
      call: (name, args) => bridge.call(name, args, client),
    },
    options.input,
    options.output,
  ).then(() => bridge.close());
  return { bridge, done };
}

export { startBridge, handleMcpMessage, serveStdio };
export type { Bridge, BridgeOptions, McpServerOptions, McpToolDefinition };
