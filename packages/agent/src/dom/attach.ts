/**
 * One editor's agent: runs instructions, commits each run as one review,
 * and refuses a new run while the previous one is running or still has
 * suggestions to decide. Shared by the chat panel, the Editora plugin and
 * the MCP bridge.
 */
import type { ReviewEndInfo, ReviewLabels } from '@editora/ai-review';
import { runAgent, type AgentProvider, type AgentRunResult, type AgentStep } from '../core/loop.js';
import { createDocumentTools } from '../core/tools.js';
import type { AgentTool } from '../core/types.js';
import { hasPendingSuggestions, readEditor, type EditorSnapshot } from './document.js';
import { commitDraft, type CommitResult } from './edits.js';

export interface AgentChoice {
  id: string;
  label: string;
  create: () => AgentProvider | Promise<AgentProvider>;
}

export interface AttachAgentOptions {
  /** The model to use, or a function that makes it. */
  provider?: AgentProvider | (() => AgentProvider | Promise<AgentProvider>);
  /** Models the user can pick from in the panel (the first is the default). */
  providers?: AgentChoice[];
  /** "suggest" (default): edits are suggestions; "apply": edits are made at once (one undo step). */
  mode?: 'suggest' | 'apply';
  maxSteps?: number;
  /** Replaces the default system prompt. */
  system?: string;
  reviewLabels?: Partial<ReviewLabels>;
  /** Where ai-review's review bar goes (default: right before the editable element). */
  barHost?: (root: HTMLElement) => { parent: Node; before: Node | null } | undefined;
  /** Called when a run's suggestions are all decided (record an undo step here). */
  onReviewEnd?: (info: ReviewEndInfo) => void;
}

export interface AgentRunSummary {
  result: AgentRunResult;
  /** Suggestions shown (0 when the agent changed nothing or was stopped). */
  suggestions: number;
  /** Blocks the user changed while the agent worked; their edits were dropped. */
  conflicts: string[];
}

/** A run that edits through external tool calls (MCP); commit when the caller is done. */
export interface AgentSession {
  tools: AgentTool[];
  readonly changeCount: number;
  commit(): CommitResult;
  discard(): void;
}

export class AgentBusyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AgentBusyError';
  }
}

type Events = { state: void; step: AgentStep; review: { count: number }; reviewEnd: ReviewEndInfo };

export interface AgentController {
  readonly root: HTMLElement;
  readonly busy: boolean;
  /** A previous run's suggestions are still waiting for the user. */
  readonly reviewing: boolean;
  readonly choices: AgentChoice[];
  run(instruction: string, options?: { choice?: string }): Promise<AgentRunSummary>;
  stop(): void;
  /** Start an externally driven session (used by the MCP bridge). */
  openSession(onEdit?: (tool: string) => void): AgentSession;
  on<K extends keyof Events>(event: K, listener: (value: Events[K]) => void): () => void;
  destroy(): void;
}

export function attachAgent(root: HTMLElement, options: AttachAgentOptions = {}): AgentController {
  const listeners = new Map<keyof Events, Set<(value: never) => void>>();
  const emit = <K extends keyof Events>(event: K, value: Events[K]) => listeners.get(event)?.forEach((listener) => (listener as (value: Events[K]) => void)(value));
  const choices = options.providers ?? [];
  let abort: AbortController | null = null;
  let session: AgentSession | null = null;
  let reviewOpen = false;

  const reviewing = () => reviewOpen || hasPendingSuggestions(root);

  const resolveProvider = async (choice?: string): Promise<AgentProvider> => {
    const picked = choices.find((candidate) => candidate.id === choice) ?? choices[0];
    if (picked) return picked.create();
    if (typeof options.provider === 'function') return options.provider();
    if (options.provider) return options.provider;
    throw new Error('No model is set up for the agent: pass `provider` or `providers`.');
  };

  const commit = (snapshot: EditorSnapshot, provider?: { id?: string; model?: string }): CommitResult => {
    const result = commitDraft(root, snapshot, {
      mode: options.mode,
      model: provider?.model,
      provider: provider?.id,
      labels: options.reviewLabels,
      barHost: options.barHost?.(root),
      onEnd: (info) => {
        reviewOpen = false;
        options.onReviewEnd?.(info);
        emit('reviewEnd', info);
        emit('state', undefined);
      },
    });
    if (result.review && options.mode !== 'apply') {
      reviewOpen = !result.review.ended;
      emit('review', { count: result.count });
    }
    emit('state', undefined);
    return result;
  };

  const guard = () => {
    if (abort || session) throw new AgentBusyError('The agent is already working on this document.');
    if (reviewing()) throw new AgentBusyError('Accept or reject the previous suggestions first.');
  };

  const controller: AgentController = {
    root,
    choices,
    get busy() {
      return Boolean(abort);
    },
    get reviewing() {
      return reviewing();
    },
    async run(instruction, runOptions = {}) {
      guard();
      const text = instruction.trim();
      if (!text) throw new Error('Say what the agent should do.');
      const run = new AbortController();
      abort = run;
      emit('state', undefined);
      try {
        const provider = await resolveProvider(runOptions.choice);
        const snapshot = readEditor(root);
        const result = await runAgent({
          provider,
          tools: createDocumentTools(snapshot.draft),
          instruction: text,
          system: options.system,
          maxSteps: options.maxSteps,
          signal: run.signal,
          onStep: (step) => emit('step', step),
        });
        // A stopped run leaves the page as it was.
        if (result.stopped === 'aborted' || run.signal.aborted) return { result: { ...result, stopped: 'aborted' }, suggestions: 0, conflicts: [] };
        const committed = commit(snapshot, provider);
        return { result, suggestions: committed.count, conflicts: committed.conflicts };
      } finally {
        if (abort === run) abort = null;
        emit('state', undefined);
      }
    },
    stop() {
      abort?.abort();
    },
    openSession(onEdit) {
      guard();
      const snapshot = readEditor(root);
      const tools = createDocumentTools(snapshot.draft, { onEdit });
      const current: AgentSession = {
        tools,
        get changeCount() {
          return snapshot.draft.changeCount;
        },
        commit() {
          if (session === current) session = null;
          return commit(snapshot, { id: 'mcp' });
        },
        discard() {
          if (session === current) session = null;
          emit('state', undefined);
        },
      };
      session = current;
      emit('state', undefined);
      return current;
    },
    on(event, listener) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event)!.add(listener as (value: never) => void);
      return () => listeners.get(event)?.delete(listener as (value: never) => void);
    },
    destroy() {
      abort?.abort();
      session?.discard();
      listeners.clear();
    },
  };
  return controller;
}
