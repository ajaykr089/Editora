import { describe, expect, it } from 'vitest';
import { daysBetween, descendantsOf, rollUp, shiftDays, type SchedTask } from '../components/gantt-schedule';

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
