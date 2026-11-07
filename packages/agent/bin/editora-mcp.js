#!/usr/bin/env node
// MCP server that lets Claude Desktop, Claude Code, Cursor or any MCP client
// edit the document open in an Editora page (as suggestions).
//
//   EDITORA_MCP_TOKEN=some-long-secret npx editora-mcp [--port 41820] [--origin https://app.example.com]
//
// stdout carries the MCP protocol; everything for people goes to stderr.
import { randomBytes } from 'node:crypto';
import { createRequire } from 'node:module';
import { runEditoraMcp } from '../dist/mcp.js';

const args = process.argv.slice(2);
const value = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};
if (args.includes('--help') || args.includes('-h')) {
  process.stderr.write(`editora-mcp: MCP server for the Editora editor open in your browser.

  --port <n>        Bridge port on 127.0.0.1 (default 41820, or EDITORA_MCP_PORT)
  --token <secret>  Pairing token shared with the page (default EDITORA_MCP_TOKEN, else a random one)
  --origin <url>    Also allow this page origin (repeatable); localhost origins are always allowed

In the page: AgentPlugin({ mcp: { url: 'http://127.0.0.1:<port>', token: '<secret>' } })
`);
  process.exit(0);
}

const origins = args.flatMap((arg, index) => (arg === '--origin' ? [args[index + 1]] : [])).filter(Boolean);
const token = value('--token') ?? process.env.EDITORA_MCP_TOKEN ?? randomBytes(18).toString('base64url');
const port = Number(value('--port') ?? process.env.EDITORA_MCP_PORT ?? 41820);
const { version } = createRequire(import.meta.url)('../package.json');
const local = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;

try {
  const { bridge, done } = await runEditoraMcp({
    port,
    token,
    version,
    allowedOrigins: [local, ...origins],
    input: process.stdin,
    output: process.stdout,
    log: (message) => process.stderr.write(`[editora-mcp] ${message}\n`),
  });
  process.stderr.write(`[editora-mcp] Bridge on ${bridge.url}. In the page: AgentPlugin({ mcp: { url: '${bridge.url}', token: '${token}' } })\n`);
  await done;
} catch (error) {
  process.stderr.write(`[editora-mcp] ${error?.code === 'EADDRINUSE' ? `Port ${port} is in use; pass --port.` : error?.message ?? error}\n`);
  process.exit(1);
}
