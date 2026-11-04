/**
 * Provider-neutral agent loop: ask the model, run the tools it calls, give
 * it the results, until it answers without calling a tool, the step limit
 * is reached, or the run is stopped.
 */
import { callTool } from './tools.js';
import type { AgentTool, JsonSchema } from './types.js';

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface ToolCallResult {
  callId: string;
  name: string;
  text: string;
  isError?: boolean;
}

export type AgentMessage =
  | { role: 'user'; content: string }
  /** `raw` keeps the provider's own message (e.g. Claude's thinking blocks) to send back unchanged. */
  | { role: 'assistant'; content: string; toolCalls: ToolCall[]; raw?: unknown }
  | { role: 'tool'; results: ToolCallResult[] };

export interface ToolSpec {
  name: string;
  description: string;
  parameters: JsonSchema;
}

export interface ChatRequest {
  system: string;
  messages: AgentMessage[];
  tools: ToolSpec[];
  signal?: AbortSignal;
}

export interface ChatTurn {
  content: string;
  toolCalls: ToolCall[];
  raw?: unknown;
  /** Why the model stopped; "refusal" and "length" end the run. */
  stop?: 'end' | 'tool_use' | 'length' | 'refusal';
}

/** A model that can call tools. */
export interface AgentProvider {
  readonly id: string;
  readonly model?: string;
  chat(request: ChatRequest): Promise<ChatTurn>;
}

export type AgentStep =
  | { type: 'model'; content: string; toolCalls: number }
  | { type: 'tool'; name: string; arguments: Record<string, unknown>; result: string; isError: boolean };

export interface RunAgentOptions {
  provider: AgentProvider;
  tools: AgentTool[];
  instruction: string;
  /** Earlier turns of the same conversation. */
  history?: AgentMessage[];
  system?: string;
  /** Model turns before the run stops (default 12). */
  maxSteps?: number;
  signal?: AbortSignal;
  onStep?: (step: AgentStep) => void;
}

export interface AgentRunResult {
  /** The model's final message (or its last words when the run stopped early). */
  answer: string;
  stopped: 'done' | 'limit' | 'aborted' | 'refusal' | 'length';
  messages: AgentMessage[];
  steps: AgentStep[];
}

export const DEFAULT_AGENT_SYSTEM = `You edit a document in a rich text editor for the user.

- Call get_document before editing, and use the block ids it returns.
- Make only the changes the user asked for. Keep the user's wording elsewhere.
- Prefer replace_text for small fixes and rewrite_block for rewording a block. Use insert_blocks and delete_blocks for structure.
- Every edit is shown to the user as a suggestion to accept or reject, so edit directly rather than asking for permission.
- Text is plain: do not use Markdown, HTML or quotes around it.
- If a tool returns an error, read it and try again (for example, call get_document for fresh ids).
- When you are done, reply with one or two sentences saying what you changed. If nothing needed changing, say so.`;

export const toToolSpecs = (tools: AgentTool[]): ToolSpec[] => tools.map(({ name, description, parameters }) => ({ name, description, parameters }));

const isAbort = (error: unknown, signal?: AbortSignal) => signal?.aborted || (error instanceof Error && error.name === 'AbortError');

export async function runAgent(options: RunAgentOptions): Promise<AgentRunResult> {
  const { provider, tools, signal } = options;
  const maxSteps = options.maxSteps ?? 12;
  const specs = toToolSpecs(tools);
  const messages: AgentMessage[] = [...(options.history ?? []), { role: 'user', content: options.instruction }];
  const steps: AgentStep[] = [];
  const step = (value: AgentStep) => {
    steps.push(value);
    options.onStep?.(value);
  };
  let last = '';

  for (let turn = 0; turn < maxSteps; turn += 1) {
    if (signal?.aborted) return { answer: last, stopped: 'aborted', messages, steps };
    let reply: ChatTurn;
    try {
      reply = await provider.chat({ system: options.system ?? DEFAULT_AGENT_SYSTEM, messages, tools: specs, signal });
    } catch (error) {
      if (isAbort(error, signal)) return { answer: last, stopped: 'aborted', messages, steps };
      throw error;
    }
    last = reply.content || last;
    messages.push({ role: 'assistant', content: reply.content, toolCalls: reply.toolCalls, raw: reply.raw });
    step({ type: 'model', content: reply.content, toolCalls: reply.toolCalls.length });

    if (reply.stop === 'refusal') return { answer: reply.content, stopped: 'refusal', messages, steps };
    if (!reply.toolCalls.length) return { answer: reply.content, stopped: reply.stop === 'length' ? 'length' : 'done', messages, steps };

    // Run calls in order: later edits may build on earlier ones.
    const results: ToolCallResult[] = [];
    for (const call of reply.toolCalls) {
      if (signal?.aborted) break;
      const result = await callTool(tools, call.name, call.arguments);
      results.push({ callId: call.id, name: call.name, text: result.text, isError: result.isError });
      step({ type: 'tool', name: call.name, arguments: call.arguments, result: result.text, isError: Boolean(result.isError) });
    }
    // Every call gets an answer, also when the run was stopped half way.
    for (const call of reply.toolCalls.slice(results.length)) results.push({ callId: call.id, name: call.name, text: 'Error: the user stopped the run.', isError: true });
    messages.push({ role: 'tool', results });
    if (signal?.aborted) return { answer: last, stopped: 'aborted', messages, steps };
  }
  return { answer: last, stopped: 'limit', messages, steps };
}
