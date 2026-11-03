/** Where a piece of text came from. */
export type OriginKind = 'existing' | 'typed' | 'pasted' | 'ai' | 'tool' | 'collaborator' | 'external';

export const ORIGIN_KINDS: readonly OriginKind[] = ['typed', 'pasted', 'ai', 'collaborator', 'tool', 'external', 'existing'];

export interface Origin {
  id: number;
  kind: OriginKind;
  /** When this origin first added text (ms since epoch). */
  t: number;
  /** Person who typed, pasted or accepted the text. */
  author?: string;
  /** Where pasted text came from ("word", "google-docs", "web", "plain", "internal") or the tool that inserted it. */
  source?: string;
  /** How it arrived: "paste", "drop", or a command name for tools. */
  via?: string;
  /** AI model and provider, for AI text. */
  model?: string;
  provider?: string;
  /** Free-form label shown in the UI. */
  label?: string;
  /** Writing session number for typed text. */
  session?: number;
}

/** What a caller describes; the engine fills in `id` and `t`. */
export type OriginSpec = Omit<Origin, 'id' | 't' | 'session'> & { t?: number };

/** `[length, originId]`: the next `length` characters came from `originId`. */
export type Run = [number, number];

/** Why the text changed, as recorded in the log. */
export type ChangeCause = 'type' | 'correct' | 'paste' | 'drop' | 'move' | 'ai' | 'tool' | 'undo' | 'remote' | 'external' | 'load';

export interface LogEvent {
  /** Start time (ms since epoch). */
  t: number;
  /** Duration in ms, for a burst of keystrokes merged into one event. */
  d?: number;
  c: ChangeCause;
  /** Offset in the text as it was just before this event. */
  at: number;
  /** Characters removed at `at`. */
  del: number;
  /** Characters inserted at `at`. */
  ins: string;
  /** Origin of the inserted text: one id, or runs when it mixes origins. */
  o?: number | Run[];
}

export interface LogBase {
  t: number;
  text: string;
  runs: Run[];
}

/** A sealed slice of the log, hash-chained to the previous one. */
export interface LogBatch {
  seq: number;
  /** Event index range `[from, to)`. */
  from: number;
  to: number;
  prev: string;
  hash: string;
  receipt?: WitnessReceipt;
}

/** A server's signed statement that it saw `hash` at `time`. */
export interface WitnessReceipt {
  doc: string;
  seq: number;
  hash: string;
  time: number;
  sig: string;
}

export interface AuthorshipLog {
  base: LogBase;
  events: LogEvent[];
  batches?: LogBatch[];
}

/** Everything needed to restore authorship for a document; store it next to the HTML. */
export interface AuthorshipState {
  format: 'editora-authorship';
  version: 1;
  updated: number;
  length: number;
  textHash: string;
  /** The plain text the runs describe; lets `load` reconcile after edits made elsewhere. */
  text?: string;
  origins: Origin[];
  runs: Run[];
  log?: AuthorshipLog;
}
