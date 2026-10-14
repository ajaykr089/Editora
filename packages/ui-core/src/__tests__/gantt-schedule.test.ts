import { describe, expect, it } from 'vitest';
import { constraintBound, criticalPath, daysBetween, descendantsOf, linkSatisfied, pushSuccessors, rollUp, shiftDays, violatedLinks, type LinkType, type SchedLink, type SchedTask } from '../components/gantt-schedule';

const day = (m: number, d: number) => new Date(2026, m - 1, d).getTime();
const task = (id: string, start: [number, number], end: [number, number], extra: Partial<SchedTask> = {}): SchedTask => ({ id, start: day(...start), end: day(...end), ...extra });

describe('shiftDays and daysBetween', () => {
  it('move by calendar days across a daylight-saving change', () => {
    // 2026-03-08 is the US spring-forward day and 2026-03-29 the European one: whole days, not 24 hours
    for (const [from, days] of [[day(3, 7), 3], [day(3, 28), 3], [day(10, 24), 14], [day(11, 1), -2]] as const) {
      const moved = shiftDays(from, days);
      const date = new Date(moved);
      expect([date.getHours(), date.getMinutes()]).toEqual([0, 0]);
      expect(daysBetween(from, moved)).toBe(days);
    }
  });
});

describe('descendantsOf', () => {
  const tasks = [
    task('p', [3, 2], [3, 30]),
    task('q', [3, 2], [3, 20], { parent: 'p' }),
    task('a', [3, 2], [3, 9], { parent: 'q' }),
    task('b', [3, 10], [3, 15], { parent: 'p' }),
    task('z', [3, 16], [3, 25]),
  ];

  it('lists everything below a task, at any depth, and nothing else', () => {
    expect(descendantsOf(tasks, 'p').map((t) => t.id).sort()).toEqual(['a', 'b', 'q']);
    expect(descendantsOf(tasks, 'q').map((t) => t.id)).toEqual(['a']);
    expect(descendantsOf(tasks, 'a')).toEqual([]);
    expect(descendantsOf(tasks, 'nope')).toEqual([]);
  });

  it('survives a parent that points back into its own branch', () => {
    const loop = [task('x', [3, 2], [3, 5], { parent: 'y' }), task('y', [3, 2], [3, 5], { parent: 'x' })];

    expect(descendantsOf(loop, 'x').map((t) => t.id)).toEqual(['y']);
  });
});

describe('rollUp', () => {
  it('takes the earliest start and the latest end of the children', () => {
    const tasks = [
      task('p', [3, 1], [3, 2], { type: 'summary' }), // its own dates are ignored
      task('a', [3, 4], [3, 9], { parent: 'p' }),
      task('b', [3, 2], [3, 6], { parent: 'p' }),
      task('c', [3, 12], [3, 20], { parent: 'p' }),
    ];

    expect(rollUp(tasks).get('p')).toMatchObject({ start: day(3, 2), end: day(3, 20) });
  });

  it('works up through parents of parents, and leaves tasks without children out', () => {
    const tasks = [
      task('p', [1, 1], [1, 2]),
      task('q', [1, 1], [1, 2], { parent: 'p' }),
      task('a', [3, 3], [3, 8], { parent: 'q' }),
      task('b', [3, 20], [3, 25], { parent: 'p' }),
    ];
    const result = rollUp(tasks);

    expect(result.get('q')).toMatchObject({ start: day(3, 3), end: day(3, 8) });
    expect(result.get('p')).toMatchObject({ start: day(3, 3), end: day(3, 25) });
    expect(result.has('a')).toBe(false);
    expect(result.has('b')).toBe(false);
  });

  it('weights the progress of the children by their length, and skips children without one', () => {
    const tasks = [
      task('p', [3, 1], [3, 2]),
      task('a', [3, 2], [3, 4], { parent: 'p', progress: 100 }), // 2 days
      task('b', [3, 4], [3, 10], { parent: 'p', progress: 0 }), // 6 days
      task('c', [3, 10], [3, 20], { parent: 'p' }), // no progress: not counted
    ];

    expect(rollUp(tasks).get('p')!.progress).toBeCloseTo(25, 5); // (100*2 + 0*6) / 8
  });

  it('has no progress when no child has one', () => {
    const tasks = [task('p', [3, 1], [3, 2]), task('a', [3, 2], [3, 4], { parent: 'p' })];

    expect(rollUp(tasks).get('p')!.progress).toBeUndefined();
  });

  it('counts a milestone as a day of length for the weights, and its date for the range', () => {
    const tasks = [
      task('p', [3, 1], [3, 2]),
      task('m', [3, 9], [3, 9], { parent: 'p', progress: 100 }),
      task('a', [3, 2], [3, 6], { parent: 'p', progress: 0 }),
    ];
    const rolled = rollUp(tasks).get('p')!;

    expect(rolled.start).toBe(day(3, 2));
    expect(rolled.end).toBe(day(3, 9));
    expect(rolled.progress).toBeCloseTo(20, 5); // (100*1 + 0*4) / 5
  });

  it('ignores a parent that does not exist, and a task that is its own parent', () => {
    const tasks = [task('a', [3, 2], [3, 4], { parent: 'ghost' }), task('b', [3, 2], [3, 4], { parent: 'b' })];

    expect(rollUp(tasks).size).toBe(0);
  });

  it('does not loop on a cycle', () => {
    const loop = [task('x', [3, 2], [3, 5], { parent: 'y' }), task('y', [3, 4], [3, 9], { parent: 'x' })];

    expect(() => rollUp(loop)).not.toThrow();
  });
});

const link = (id: string, source: string, target: string, type: LinkType = 'e2s', lag = 0): SchedLink => ({ id, source, target, type, lag });

describe('constraintBound and linkSatisfied', () => {
  const a = { start: day(3, 2), end: day(3, 6) };

  it('says how early the target may start or end for each type of link', () => {
    expect(constraintBound(link('l', 'a', 'b', 'e2s'), a)).toEqual({ side: 'start', min: day(3, 6) });
    expect(constraintBound(link('l', 'a', 'b', 's2s'), a)).toEqual({ side: 'start', min: day(3, 2) });
    expect(constraintBound(link('l', 'a', 'b', 'e2e'), a)).toEqual({ side: 'end', min: day(3, 6) });
    expect(constraintBound(link('l', 'a', 'b', 's2e'), a)).toEqual({ side: 'end', min: day(3, 2) });
  });

  it('adds the lag, which may be negative', () => {
    expect(constraintBound(link('l', 'a', 'b', 'e2s', 3), a).min).toBe(day(3, 9));
    expect(constraintBound(link('l', 'a', 'b', 'e2s', -2), a).min).toBe(day(3, 4));
  });

  it('is satisfied from the bound on, and not before it', () => {
    const l = link('l', 'a', 'b', 'e2s');
    expect(linkSatisfied(l, a, { start: day(3, 6), end: day(3, 9) })).toBe(true);
    expect(linkSatisfied(l, a, { start: day(3, 9), end: day(3, 12) })).toBe(true);
    expect(linkSatisfied(l, a, { start: day(3, 5), end: day(3, 9) })).toBe(false);
    expect(linkSatisfied(link('l', 'a', 'b', 'e2e'), a, { start: day(3, 1), end: day(3, 6) })).toBe(true);
    expect(linkSatisfied(link('l', 'a', 'b', 'e2e'), a, { start: day(3, 1), end: day(3, 5) })).toBe(false);
  });
});

describe('violatedLinks', () => {
  const tasks = [task('a', [3, 2], [3, 6]), task('b', [3, 4], [3, 8]), task('c', [3, 9], [3, 12])];

  it('lists the links whose target is too early, and skips links to tasks that are not there', () => {
    const links = [link('ab', 'a', 'b'), link('bc', 'b', 'c'), link('ax', 'a', 'ghost'), link('xa', 'ghost', 'a')];

    expect([...violatedLinks(tasks, links)]).toEqual(['ab']);
  });
});

describe('pushSuccessors', () => {
  const moves = (list: ReturnType<typeof pushSuccessors>) => list.map((m) => `${m.id}:${new Date(m.start).getDate()}-${new Date(m.end).getDate()}`).sort();

  it('pushes a successor later, keeping its length, and its successor after it', () => {
    const tasks = [task('a', [3, 2], [3, 6]), task('b', [3, 6], [3, 9]), task('c', [3, 9], [3, 12])];
    const links = [link('ab', 'a', 'b'), link('bc', 'b', 'c')];

    // a moves three days later: b must start on the 9th, so c on the 12th
    const result = pushSuccessors(tasks, links, new Map([['a', { start: day(3, 5), end: day(3, 9) }]]));

    expect(moves(result)).toEqual(['b:9-12', 'c:12-15']);
  });

  it('never pulls a task earlier', () => {
    const tasks = [task('a', [3, 2], [3, 6]), task('b', [3, 20], [3, 24])];

    expect(pushSuccessors(tasks, [link('ab', 'a', 'b')], new Map([['a', { start: day(3, 1), end: day(3, 5) }]]))).toEqual([]);
  });

  it('does nothing when the move still satisfies every link', () => {
    const tasks = [task('a', [3, 2], [3, 6]), task('b', [3, 10], [3, 12])];

    expect(pushSuccessors(tasks, [link('ab', 'a', 'b')], new Map([['a', { start: day(3, 3), end: day(3, 7) }]]))).toEqual([]);
  });

  it('honours every type of link and the lag', () => {
    const tasks = [task('a', [3, 2], [3, 6]), task('s', [3, 2], [3, 5]), task('e', [3, 2], [3, 5]), task('x', [3, 2], [3, 5]), task('g', [3, 6], [3, 8])];
    const links = [link('l1', 'a', 's', 's2s'), link('l2', 'a', 'e', 'e2e'), link('l3', 'a', 'x', 's2e'), link('l4', 'a', 'g', 'e2s', 2)];
    const result = pushSuccessors(tasks, links, new Map([['a', { start: day(3, 10), end: day(3, 14) }]]));

    expect(moves(result)).toEqual(['e:11-14', 'g:16-18', 's:10-13', 'x:7-10'].sort());
  });

  it('leaves a read-only task alone (its link stays violated) and keeps pushing past it', () => {
    const tasks = [task('a', [3, 2], [3, 6]), task('r', [3, 6], [3, 9], { readonly: true }), task('c', [3, 9], [3, 12])];
    const links = [link('ar', 'a', 'r'), link('rc', 'r', 'c'), link('ac', 'a', 'c')];
    const result = pushSuccessors(tasks, links, new Map([['a', { start: day(3, 8), end: day(3, 12) }]]));

    expect(moves(result)).toEqual(['c:12-15']); // c is pushed by a's own link; r stays
  });

  it('takes the children of a pushed parent with it, only with cascade', () => {
    const tasks = [task('a', [3, 2], [3, 6]), task('p', [3, 6], [3, 12], { type: 'summary' }), task('k', [3, 6], [3, 9], { parent: 'p' }), task('m', [3, 9], [3, 12], { parent: 'p' })];
    const links = [link('ap', 'a', 'p')];
    const moved = new Map([['a', { start: day(3, 4), end: day(3, 8) }]]);

    expect(moves(pushSuccessors(tasks, links, moved, false))).toEqual(['p:8-14']);
    expect(moves(pushSuccessors(tasks, links, moved, true))).toEqual(['k:8-11', 'm:11-14', 'p:8-14']);
  });

  it('pushes a task that already moved, when a link needs it further', () => {
    const tasks = [task('a', [3, 2], [3, 6]), task('b', [3, 6], [3, 9])];
    // b was moved a day later by a cascade, but a's move needs it three days later
    const result = pushSuccessors(tasks, [link('ab', 'a', 'b')], new Map([['a', { start: day(3, 5), end: day(3, 9) }], ['b', { start: day(3, 7), end: day(3, 10) }]]));

    expect(moves(result)).toEqual(['b:9-12']);
  });

  it('stops on a cycle of links', () => {
    const tasks = [task('a', [3, 2], [3, 6]), task('b', [3, 6], [3, 9])];
    const links = [link('ab', 'a', 'b'), link('ba', 'b', 'a')];

    expect(() => pushSuccessors(tasks, links, new Map([['a', { start: day(3, 5), end: day(3, 9) }]]))).not.toThrow();
  });

  it('ignores links to or from tasks that are not there', () => {
    const tasks = [task('a', [3, 2], [3, 6])];

    expect(pushSuccessors(tasks, [link('x', 'a', 'ghost'), link('y', 'ghost', 'a')], new Map([['a', { start: day(3, 8), end: day(3, 12) }]]))).toEqual([]);
  });
});

describe('criticalPath', () => {
  const ids = (set: Set<string>) => [...set].sort();

  it('marks the longest chain of tight links, and not a shorter one beside it', () => {
    const tasks = [
      task('a', [3, 2], [3, 6]),
      task('b', [3, 6], [3, 10]),
      task('c', [3, 10], [3, 16]), // the project ends on the 16th
      task('x', [3, 2], [3, 5]),
      task('y', [3, 5], [3, 8]), // a short chain: 8 days of slack
    ];
    const links = [link('ab', 'a', 'b'), link('bc', 'b', 'c'), link('xy', 'x', 'y')];

    expect(ids(criticalPath(tasks, links))).toEqual(['a', 'b', 'c']);
  });

  it('is not critical when a gap in the chain gives it room', () => {
    // b starts three days after a ends: a could end three days later, and b is not tight against anything
    const tasks = [task('a', [3, 2], [3, 6]), task('b', [3, 9], [3, 14]), task('z', [3, 2], [3, 14])];

    expect(ids(criticalPath(tasks, [link('ab', 'a', 'b')]))).toEqual([]);
  });

  it('counts a lag as part of the chain', () => {
    const tasks = [task('a', [3, 2], [3, 6]), task('b', [3, 8], [3, 12])];

    expect(ids(criticalPath(tasks, [link('ab', 'a', 'b', 'e2s', 2)]))).toEqual(['a', 'b']);
    expect(ids(criticalPath(tasks, [link('ab', 'a', 'b', 'e2s', 1)]))).toEqual([]); // one day of room
  });

  it('handles every type of link', () => {
    const tasks = [task('a', [3, 2], [3, 6]), task('b', [3, 2], [3, 9])];

    // b starts exactly when a starts and ends the project: a cannot start any later without moving b, so both have no slack
    expect(ids(criticalPath(tasks, [link('l', 'a', 'b', 's2s')]))).toEqual(['a', 'b']);
    // ...but with a day of room on the start it is no longer tight
    expect(ids(criticalPath(tasks, [link('l', 'a', 'b', 's2s', -1)]))).toEqual([]);
    const tight = [task('p', [3, 2], [3, 6]), task('q', [3, 4], [3, 9])];
    expect(ids(criticalPath(tight, [link('l', 'p', 'q', 'e2e', 3)]))).toEqual(['p', 'q']); // q ends 3 days after p ends
    expect(ids(criticalPath([task('p', [3, 2], [3, 6]), task('q', [3, 4], [3, 8])], [link('l', 'p', 'q', 's2e', 6)]))).toEqual(['p', 'q']); // q ends 6 days after p starts
  });

  it('never marks a task without links, even one that ends last', () => {
    const tasks = [task('a', [3, 2], [3, 6]), task('b', [3, 6], [3, 9]), task('lone', [3, 2], [3, 20])];

    expect(ids(criticalPath(tasks, [link('ab', 'a', 'b')]))).toEqual([]); // b ends on the 9th, the project on the 20th
  });

  it('counts a milestone at the end of a tight chain', () => {
    const tasks = [task('a', [3, 2], [3, 6]), task('m', [3, 6], [3, 6], { type: 'milestone' })];

    expect(ids(criticalPath(tasks, [link('am', 'a', 'm')]))).toEqual(['a', 'm']);
  });

  it('leaves parents out and ignores links that touch them', () => {
    const tasks = [task('p', [3, 2], [3, 12]), task('a', [3, 2], [3, 6], { parent: 'p' }), task('b', [3, 6], [3, 12], { parent: 'p' })];

    expect(ids(criticalPath(tasks, [link('ab', 'a', 'b'), link('pa', 'p', 'a')]))).toEqual(['a', 'b']);
  });

  it('has none without usable links, and does not loop on a cycle', () => {
    const tasks = [task('a', [3, 2], [3, 6]), task('b', [3, 6], [3, 9])];

    expect(criticalPath(tasks, []).size).toBe(0);
    expect(criticalPath(tasks, [link('x', 'a', 'ghost')]).size).toBe(0);
    expect(() => criticalPath(tasks, [link('ab', 'a', 'b'), link('ba', 'b', 'a')])).not.toThrow();
    expect(criticalPath(tasks, [link('ab', 'a', 'b'), link('ba', 'b', 'a')]).size).toBe(0);
  });
});
