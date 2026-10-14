// Pure scheduling helpers for <ui-gantt>: roll-ups, cascades, link constraints and the critical path. Dates are
// local-midnight timestamps (ms), and every task's `end` is the boundary after its last day, as the chart draws it.
// Nothing here touches the DOM, so it can be tested on its own.

export type SchedTask = {
  id: string;
  start: number;
  end: number;
  parent?: string;
  type?: 'task' | 'summary' | 'milestone';
  readonly?: boolean;
  progress?: number;
};

export type LinkType = 'e2s' | 's2s' | 'e2e' | 's2e';

export type SchedLink = { id: string; source: string; target: string; type: LinkType; lag: number };

/** A date moved by whole calendar days (DST-safe, unlike adding 24 hours). */
export function shiftDays(ms: number, days: number): number {
  const date = new Date(ms);
  date.setDate(date.getDate() + days);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

/** Whole days between two local-midnight timestamps. */
export function daysBetween(from: number, to: number): number {
  return Math.round((to - from) / 86400000);
}

function childrenByParent(tasks: SchedTask[]): Map<string, SchedTask[]> {
  const ids = new Set(tasks.map((task) => task.id));
  const map = new Map<string, SchedTask[]>();
  for (const task of tasks) {
    if (!task.parent || !ids.has(task.parent) || task.parent === task.id) continue;
    const list = map.get(task.parent) || [];
    list.push(task);
    map.set(task.parent, list);
  }
  return map;
}

/** Every task under `id`, at any depth (a parent that points back into its own branch is not followed twice). */
export function descendantsOf(tasks: SchedTask[], id: string): SchedTask[] {
  const children = childrenByParent(tasks);
  const found: SchedTask[] = [];
  const seen = new Set<string>([id]);
  const queue = [id];
  while (queue.length) {
    for (const child of children.get(queue.shift() as string) || []) {
      if (seen.has(child.id)) continue;
      seen.add(child.id);
      found.push(child);
      queue.push(child.id);
    }
  }
  return found;
}

export type RolledUp = { start: number; end: number; progress?: number };

/**
 * What each parent's dates and progress are when they follow their children: the earliest start and the latest end
 * below it, and the progress of the children weighted by their length (only the children that have one). Computed
 * from the bottom up, so a parent of parents works. Tasks without children are not in the result.
 */
export function rollUp(tasks: SchedTask[]): Map<string, RolledUp> {
  const children = childrenByParent(tasks);
  const result = new Map<string, RolledUp>();
  const visiting = new Set<string>();
  const resolve = (task: SchedTask): RolledUp => {
    const known = result.get(task.id);
    if (known) return known;
    const own: RolledUp = { start: task.start, end: task.end, progress: task.progress };
    const kids = children.get(task.id);
    if (!kids?.length || visiting.has(task.id)) return own;
    visiting.add(task.id);
    let start = Infinity;
    let end = -Infinity;
    let weight = 0;
    let weighted = 0;
    for (const kid of kids) {
      const value = resolve(kid);
      start = Math.min(start, value.start);
      end = Math.max(end, value.end);
      if (value.progress != null) {
        const length = Math.max(1, daysBetween(value.start, value.end));
        weight += length;
        weighted += value.progress * length;
      }
    }
    visiting.delete(task.id);
    const rolled: RolledUp = { start, end, progress: weight ? weighted / weight : undefined };
    result.set(task.id, rolled);
    return rolled;
  };
  for (const task of tasks) resolve(task);
  return result;
}
