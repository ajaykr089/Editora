// @vitest-environment node
import { webcrypto } from 'node:crypto';
import { applyEdits, diffText } from '../core/diff';
import { AuthorshipEngine } from '../core/engine';
import { buildReport } from '../core/report';
import { createReplay } from '../core/replay';
import { sealBatch, signReceipt, verifyAuthorship } from '../core/chain';
import { scaleRuns, sliceRuns, spliceRuns } from '../core/runs';

const subtle = webcrypto.subtle as unknown as SubtleCrypto;

function clock(start = 1_000_000) {
  let t = start;
  return { now: () => t, tick: (ms: number) => (t += ms) };
}

describe('runs', () => {
  it('splices, slices and merges', () => {
    const runs = spliceRuns([[5, 0]], 2, 1, [[3, 1]]);
    expect(runs).toEqual([[2, 0], [3, 1], [2, 0]]);
    expect(sliceRuns(runs, 1, 6)).toEqual([[1, 0], [3, 1], [1, 0]]);
    expect(spliceRuns(runs, 2, 3, [[1, 0]])).toEqual([[5, 0]]);
  });

  it('scales runs to a new length', () => {
    expect(scaleRuns([[2, 0], [2, 1]], 8)).toEqual([[4, 0], [4, 1]]);
  });
});

describe('diffText', () => {
  it('finds one edit and honours the caret hint for repeats', () => {
    expect(diffText('aa', 'aaa')).toEqual([{ at: 2, del: 0, ins: 'a' }]);
    expect(diffText('aa', 'aaa', 0)).toEqual([{ at: 0, del: 0, ins: 'a' }]);
    expect(diffText('hello world', 'hello brave world')).toEqual([{ at: 6, del: 0, ins: 'brave ' }]);
  });

  it('keeps untouched lines between two edits', () => {
    const before = 'one\ntwo\nthree\nfour\nfive\n';
    const after = 'one!\ntwo\nthree\nfour\nfive?\n';
    const edits = diffText(before, after);
    expect(edits).toHaveLength(2);
    expect(applyEdits(before, edits)).toBe(after);
  });

  it('round-trips random edits', () => {
    const words = ['alpha', 'beta', '\n', 'gamma', ' ', 'delta', 'eps\n'];
    let text = '';
    for (let i = 0; i < 200; i += 1) {
      const next = Array.from({ length: (i * 7) % 13 }, (_, j) => words[(i * 3 + j * 5) % words.length]).join('');
      expect(applyEdits(text, diffText(text, next))).toBe(next);
      text = next;
    }
  });
});

describe('AuthorshipEngine', () => {
  it('labels typed and pasted text and keeps formatting-free origins in place', () => {
    const c = clock();
    const engine = new AuthorshipEngine({ author: 'Ana', now: c.now });
    engine.reset('Intro.');
    c.tick(100);
    engine.update('Intro. Hi', { cause: 'type', origin: { kind: 'typed', author: 'Ana' } });
    c.tick(100);
    engine.update('Intro. Hi COPIED', { cause: 'paste', origin: { kind: 'pasted', author: 'Ana', source: 'google-docs' } });
    expect(engine.originAt(0)?.kind).toBe('existing');
    expect(engine.originAt(7)?.kind).toBe('typed');
    expect(engine.originAt(11)).toMatchObject({ kind: 'pasted', source: 'google-docs' });

    const report = buildReport(engine.serialize());
    expect(report.byKind.typed.chars).toBe(2);
    expect(report.byKind.pasted.chars).toBe(6);
    expect(report.pastes[0]).toMatchObject({ chars: 6, inserted: 7 });
  });

  it('merges keystrokes into bursts and replays them', () => {
    const c = clock();
    const engine = new AuthorshipEngine({ author: 'Ana', now: c.now });
    engine.reset('');
    let text = '';
    for (const char of 'Hello wrld') {
      c.tick(150);
      text += char;
      engine.update(text, { cause: 'type', origin: { kind: 'typed', author: 'Ana' } });
    }
    // Backspace three characters, retype.
    for (const next of ['Hello wr', 'Hello w', 'Hello wo', 'Hello wor', 'Hello worl', 'Hello world']) {
      c.tick(150);
      engine.update(next, { cause: 'type', origin: { kind: 'typed', author: 'Ana' } });
    }
    expect(engine.log!.events).toHaveLength(1);
    expect(engine.log!.events[0]).toMatchObject({ ins: 'Hello world', c: 'type' });

    const replay = createReplay(engine.log!);
    expect(replay.after(1).text).toBe('Hello world');
    const midway = replay.at(replay.start + (replay.end - replay.start) / 2);
    expect(midway.text.length).toBeGreaterThan(0);
    expect('Hello world'.startsWith(midway.text)).toBe(true);
  });

  it('starts a new typed origin after a long pause', () => {
    const c = clock();
    const engine = new AuthorshipEngine({ author: 'Ana', now: c.now, sessionGapMs: 1000 });
    engine.reset('');
    engine.update('a', { cause: 'type', origin: { kind: 'typed', author: 'Ana' } });
    c.tick(5000);
    engine.update('ab', { cause: 'type', origin: { kind: 'typed', author: 'Ana' } });
    expect(engine.originAt(0)?.session).toBe(1);
    expect(engine.originAt(1)?.session).toBe(2);
  });

  it('serializes and loads, marking text changed elsewhere as external', () => {
    const engine = new AuthorshipEngine({ author: 'Ana' });
    engine.reset('');
    engine.update('typed text', { cause: 'type', origin: { kind: 'typed', author: 'Ana' } });
    const state = JSON.parse(JSON.stringify(engine.serialize()));

    const same = new AuthorshipEngine();
    same.load(state, 'typed text');
    expect(same.runs).toEqual(engine.runs);

    const edited = new AuthorshipEngine();
    edited.load(state, 'typed EXTRA text');
    expect(edited.originAt(0)?.kind).toBe('typed');
    expect(edited.originAt(7)?.kind).toBe('external');
  });

  it('reuses origins from a fragment', () => {
    const source = new AuthorshipEngine({ author: 'Ana' });
    source.reset('');
    source.update('AI words', { cause: 'ai', origin: { kind: 'ai', model: 'gpt-oss:20b' } });
    const fragment = source.fragment(0, 8);

    const target = new AuthorshipEngine({ author: 'Bo' });
    target.reset('x');
    const runs = target.adoptFragment(fragment);
    target.update('xAI words', { cause: 'paste', assign: () => runs.map(([len, origin]) => ({ len, origin })) });
    expect(target.originAt(3)).toMatchObject({ kind: 'ai', model: 'gpt-oss:20b' });
  });
});

describe('hash chain', () => {
  async function recorded() {
    const c = clock(Date.now() - 60_000);
    const engine = new AuthorshipEngine({ author: 'Ana', now: c.now });
    engine.reset('Base.');
    engine.update('Base. One', { cause: 'type', origin: { kind: 'typed', author: 'Ana' } });
    const first = await sealBatch(engine.log!, subtle);
    c.tick(3000);
    engine.update('Base. One PASTE', { cause: 'paste', origin: { kind: 'pasted', source: 'web' } });
    const second = await sealBatch(engine.log!, subtle);
    first!.receipt = await signReceipt('s3cret', { doc: 'd1', seq: first!.seq, hash: first!.hash, time: Date.now() }, subtle);
    second!.receipt = await signReceipt('s3cret', { doc: 'd1', seq: second!.seq, hash: second!.hash, time: Date.now() }, subtle);
    return engine;
  }

  it('verifies an intact, witnessed log', async () => {
    const engine = await recorded();
    const result = await verifyAuthorship(engine.serialize(), { secret: 's3cret', doc: 'd1', subtle });
    expect(result.problems).toEqual([]);
    expect(result).toMatchObject({ ok: true, replayMatches: true, sealedEvents: 2, witnessedEvents: 2, totalEvents: 2 });
  });

  it('catches an edited event and a forged receipt', async () => {
    const engine = await recorded();
    const state = engine.serialize();
    state.log!.events[1].c = 'type';
    const edited = await verifyAuthorship(state, { secret: 's3cret', subtle });
    expect(edited.ok).toBe(false);
    expect(edited.problems.join(' ')).toMatch(/changed after it was sealed/);

    const forged = engine.serialize();
    forged.log!.batches![0].receipt!.time += 1;
    const result = await verifyAuthorship(forged, { secret: 's3cret', subtle });
    expect(result.problems.join(' ')).toMatch(/receipt is not valid/);
  });

  it('catches text that does not match the log', async () => {
    const engine = await recorded();
    const state = engine.serialize();
    state.text = 'Base. One TYPED';
    const result = await verifyAuthorship(state, { subtle });
    expect(result.replayMatches).toBe(false);
  });
});
