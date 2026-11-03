import type { AuthorshipState, LogEvent, Origin, OriginKind, Run } from './types';
import { ORIGIN_KINDS } from './types';

export interface KindTotal {
  chars: number;
  /** Share of counted characters, 0..1. */
  share: number;
}

export interface OriginTotal {
  origin: Origin;
  /** Characters of this origin still in the document. */
  chars: number;
  /** Characters it added in the first place (from the log), when known. */
  inserted?: number;
}

export interface WritingSession {
  start: number;
  end: number;
  /** Time spent changing the text: pauses longer than a minute are not counted. */
  activeMs: number;
  events: number;
  typedChars: number;
}

export interface AuthorshipReport {
  generated: number;
  /** Characters in the document. */
  length: number;
  /** Characters counted for shares: everything except whitespace. */
  counted: number;
  byKind: Record<OriginKind, KindTotal>;
  byAuthor: Array<{ author: string; chars: number; share: number }>;
  /** Pasted stretches still in the document, largest first. */
  pastes: OriginTotal[];
  /** AI-written stretches still in the document, largest first. */
  ai: OriginTotal[];
  sessions: WritingSession[];
  activeMs: number;
  /** Logged events; 0 when the state has no log. */
  events: number;
}

export interface ReportOptions {
  /** Gap that splits writing sessions (default 10 minutes). */
  sessionGapMs?: number;
  /** Longest pause still counted as active time (default 60 seconds). */
  idleMs?: number;
  now?: number;
}

const isCounted = (code: number) => code > 32 && code !== 0xa0 && code !== 0xfffc;

/** Counted characters per origin id. */
function countByOrigin(text: string | undefined, runs: readonly Run[]): Map<number, number> {
  const counts = new Map<number, number>();
  let pos = 0;
  for (const [length, id] of runs) {
    let chars = length;
    if (text !== undefined) {
      chars = 0;
      for (let i = pos; i < pos + length; i += 1) if (isCounted(text.charCodeAt(i))) chars += 1;
    }
    counts.set(id, (counts.get(id) ?? 0) + chars);
    pos += length;
  }
  return counts;
}

function insertedByOrigin(events: readonly LogEvent[]): Map<number, number> {
  const inserted = new Map<number, number>();
  for (const event of events) {
    if (event.o === undefined) continue;
    const runs: Run[] = typeof event.o === 'number' ? [[event.ins.length, event.o]] : event.o;
    for (const [length, id] of runs) inserted.set(id, (inserted.get(id) ?? 0) + length);
  }
  return inserted;
}

export function sessionsFromEvents(events: readonly LogEvent[], options: ReportOptions = {}): WritingSession[] {
  const gap = options.sessionGapMs ?? 10 * 60_000;
  const idle = options.idleMs ?? 60_000;
  const sessions: WritingSession[] = [];
  let current: WritingSession | null = null;
  let lastEnd = 0;
  for (const event of [...events].sort((a, b) => a.t - b.t)) {
    const end = event.t + (event.d ?? 0);
    if (!current || event.t - lastEnd > gap) {
      current = { start: event.t, end, activeMs: event.d ?? 0, events: 0, typedChars: 0 };
      sessions.push(current);
    } else {
      current.activeMs += Math.min(Math.max(0, event.t - lastEnd), idle) + (event.d ?? 0);
      current.end = Math.max(current.end, end);
    }
    current.events += 1;
    if (event.c === 'type') current.typedChars += event.ins.length;
    lastEnd = Math.max(lastEnd, end);
  }
  return sessions;
}

export function buildReport(state: Pick<AuthorshipState, 'origins' | 'runs' | 'text' | 'length' | 'log'>, options: ReportOptions = {}): AuthorshipReport {
  const counts = countByOrigin(state.text, state.runs);
  const counted = [...counts.values()].reduce((sum, chars) => sum + chars, 0);
  const share = (chars: number) => (counted ? chars / counted : 0);
  const inserted = state.log ? insertedByOrigin(state.log.events) : new Map<number, number>();

  const byKind = Object.fromEntries(ORIGIN_KINDS.map((kind) => [kind, { chars: 0, share: 0 }])) as Record<OriginKind, KindTotal>;
  const authors = new Map<string, number>();
  const pastes: OriginTotal[] = [];
  const ai: OriginTotal[] = [];
  for (const [id, chars] of counts) {
    const origin = state.origins[id];
    if (!origin) continue;
    byKind[origin.kind].chars += chars;
    if (origin.author && origin.kind !== 'existing' && origin.kind !== 'external') authors.set(origin.author, (authors.get(origin.author) ?? 0) + chars);
    const total: OriginTotal = { origin, chars, ...(inserted.has(id) ? { inserted: inserted.get(id) } : {}) };
    if (origin.kind === 'pasted' && chars > 0) pastes.push(total);
    if (origin.kind === 'ai' && chars > 0) ai.push(total);
  }
  for (const total of Object.values(byKind)) total.share = share(total.chars);

  const sessions = state.log ? sessionsFromEvents(state.log.events, options) : [];
  return {
    generated: options.now ?? Date.now(),
    length: state.length,
    counted,
    byKind,
    byAuthor: [...authors].map(([author, chars]) => ({ author, chars, share: share(chars) })).sort((a, b) => b.chars - a.chars),
    pastes: pastes.sort((a, b) => b.chars - a.chars),
    ai: ai.sort((a, b) => b.chars - a.chars),
    sessions,
    activeMs: sessions.reduce((sum, session) => sum + session.activeMs, 0),
    events: state.log?.events.length ?? 0,
  };
}
