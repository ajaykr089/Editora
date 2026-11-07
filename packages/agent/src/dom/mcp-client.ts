/**
 * Page side of the MCP bridge: receives tool calls from `editora-mcp` as
 * server-sent events, runs them on this editor, and posts the results back.
 * Edits collect in one session and become suggestions once the external
 * agent pauses, so a burst of tool calls is one review.
 */
import { callTool } from '../core/tools.js';
import type { AgentController, AgentSession } from './attach.js';

export interface McpBridgeOptions {
  /** The bridge's address, e.g. "http://127.0.0.1:41820". */
  url: string;
  token: string;
  /** Quiet time after the last edit before the edits are shown (default 1500 ms). */
  commitDelayMs?: number;
  /** An open session with no edits ends after this long (default 60 s). */
  idleMs?: number;
  /** For tests. */
  EventSource?: typeof EventSource;
  fetch?: typeof fetch;
}

export interface McpBridgeConnection {
  readonly connected: boolean;
  close(): void;
}

interface CallEvent {
  id: string;
  name: string;
  arguments?: Record<string, unknown>;
  /** The MCP client's name, as it introduced itself. */
  client?: string;
}

export function connectMcpBridge(controller: AgentController, options: McpBridgeOptions): McpBridgeConnection {
  const base = options.url.replace(/\/+$/, '');
  const query = `token=${encodeURIComponent(options.token)}`;
  const Source = options.EventSource ?? (typeof EventSource !== 'undefined' ? EventSource : undefined);
  const doFetch = options.fetch ?? fetch;
  const commitDelay = options.commitDelayMs ?? 1500;
  const idle = options.idleMs ?? 60_000;
  let session: AgentSession | null = null;
  let commitTimer: ReturnType<typeof setTimeout> | null = null;
  let idleTimer: ReturnType<typeof setTimeout> | null = null;
  let connected = false;
  let closed = false;
  let client: string | undefined;

  const clearTimers = () => {
    if (commitTimer) clearTimeout(commitTimer);
    if (idleTimer) clearTimeout(idleTimer);
    commitTimer = idleTimer = null;
  };

  const finish = () => {
    clearTimers();
    const current = session;
    session = null;
    if (!current) return;
    if (current.changeCount) current.commit(client);
    else current.discard();
  };

  const touch = (edited: boolean) => {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(finish, idle);
    if (edited) {
      if (commitTimer) clearTimeout(commitTimer);
      commitTimer = setTimeout(finish, commitDelay);
    }
  };

  const reply = (id: string, text: string, isError = false) =>
    doFetch(`${base}/result?${query}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, text, isError }) }).catch(() => undefined);

  const onCall = async (event: MessageEvent) => {
    let call: CallEvent;
    try {
      call = JSON.parse(event.data);
    } catch {
      return;
    }
    if (typeof call.client === 'string' && call.client) client = call.client;
    if (!session) {
      try {
        session = controller.openSession();
      } catch (error) {
        return reply(call.id, `Error: ${(error as Error).message}`, true);
      }
    }
    const before = session.changeCount;
    const result = await callTool(session.tools, call.name, call.arguments ?? {});
    const edited = session.changeCount !== before || /^(replace_text|rewrite_block|insert_blocks|delete_blocks)$/.test(call.name);
    touch(edited && !result.isError);
    const text = edited && !result.isError ? `${result.text} Suggestions appear in the editor once you stop editing for a moment.` : result.text;
    await reply(call.id, text, Boolean(result.isError));
  };

  let source: EventSource | null = null;
  if (Source) {
    source = new Source(`${base}/events?${query}`);
    source.addEventListener('open', () => (connected = true));
    source.addEventListener('error', () => (connected = false));
    source.addEventListener('call', (event) => void onCall(event as MessageEvent));
  }

  return {
    get connected() {
      return connected && !closed;
    },
    close() {
      closed = true;
      source?.close();
      finish();
    },
  };
}
