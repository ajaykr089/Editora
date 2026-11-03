/**
 * Rebuild a document's text (and origins) from its log at any moment. Bursts
 * of typing are spread over their duration, so playback looks like typing.
 */
import { spliceRuns } from './runs.js';
import type { AuthorshipLog, LogEvent, Run } from './types.js';

export interface ReplayFrame {
  text: string;
  runs: Run[];
  /** Events fully applied. */
  index: number;
}

export interface Replay {
  start: number;
  end: number;
  events: number;
  /** The document as it was at `time`. */
  at(time: number): ReplayFrame;
  /** The document after the first `count` events. */
  after(count: number): ReplayFrame;
}

const CHECKPOINT_EVERY = 100;

function eventRuns(event: LogEvent, length: number): Run[] {
  if (event.o === undefined || length === 0) return [];
  if (typeof event.o === 'number') return [[length, event.o]];
  const out: Run[] = [];
  let left = length;
  for (const [runLength, id] of event.o) {
    if (left <= 0) break;
    const take = Math.min(runLength, left);
    out.push([take, id]);
    left -= take;
  }
  return out;
}

function apply(frame: ReplayFrame, event: LogEvent, chars = event.ins.length): ReplayFrame {
  const ins = event.ins.slice(0, chars);
  return {
    text: frame.text.slice(0, event.at) + ins + frame.text.slice(event.at + event.del),
    runs: spliceRuns(frame.runs, event.at, event.del, eventRuns(event, ins.length)),
    index: frame.index + 1,
  };
}

export function createReplay(log: AuthorshipLog): Replay {
  const events = log.events;
  const base: ReplayFrame = { text: log.base.text, runs: log.base.runs.map((run) => [...run] as Run), index: 0 };
  const checkpoints: ReplayFrame[] = [base];

  const after = (count: number): ReplayFrame => {
    const target = Math.max(0, Math.min(count, events.length));
    const checkpoint = Math.min(Math.floor(target / CHECKPOINT_EVERY), checkpoints.length - 1);
    let frame = checkpoints[checkpoint];
    while (frame.index < target) {
      frame = apply(frame, events[frame.index]);
      if (frame.index % CHECKPOINT_EVERY === 0 && frame.index / CHECKPOINT_EVERY === checkpoints.length) checkpoints.push(frame);
    }
    return frame;
  };

  const start = events.length ? events[0].t : log.base.t;
  const end = events.reduce((latest, event) => Math.max(latest, event.t + (event.d ?? 0)), start);

  return {
    start,
    end,
    events: events.length,
    after,
    at(time: number) {
      // Events are in time order; find the first one that has not finished by `time`.
      let lo = 0;
      let hi = events.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (events[mid].t + (events[mid].d ?? 0) <= time) lo = mid + 1;
        else hi = mid;
      }
      const frame = after(lo);
      const next = events[lo];
      if (next && next.d && next.t < time && next.del === 0) {
        const chars = Math.floor((next.ins.length * (time - next.t)) / next.d);
        if (chars > 0) return { ...apply(frame, next, chars), index: frame.index };
      }
      return frame;
    },
  };
}
