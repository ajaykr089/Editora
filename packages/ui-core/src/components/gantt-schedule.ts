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

/**
 * The earliest the target may start (for `e2s` and `s2s`) or end (for `e2e` and `s2e`) given where the source is: the
 * source's end or start, plus the link's lag in days (which may be negative).
 */
export function constraintBound(link: SchedLink, source: { start: number; end: number }): { side: 'start' | 'end'; min: number } {
  const from = link.type === 'e2s' || link.type === 'e2e' ? source.end : source.start;
  return { side: link.type === 'e2s' || link.type === 's2s' ? 'start' : 'end', min: shiftDays(from, link.lag) };
}

export function linkSatisfied(link: SchedLink, source: { start: number; end: number }, target: { start: number; end: number }): boolean {
  const bound = constraintBound(link, source);
  return (bound.side === 'start' ? target.start : target.end) >= bound.min;
}

/** The ids of the links whose target starts or ends earlier than its source allows. A link to a missing task is not one. */
export function violatedLinks(tasks: SchedTask[], links: SchedLink[]): Set<string> {
  const byId = new Map(tasks.map((task) => [task.id, task]));
  const bad = new Set<string>();
  for (const link of links) {
    const source = byId.get(link.source);
    const target = byId.get(link.target);
    if (source && target && !linkSatisfied(link, source, target)) bad.add(link.id);
  }
  return bad;
}

export type TaskMove = { id: string; start: number; end: number };

/**
 * After some tasks have moved (`moved`: id to their new dates), push the tasks that follow them later until every link holds
 * again, keeping each pushed task's length. Only forward: a task is never pulled earlier. A read-only task is not pushed (its
 * link stays violated), and with `cascade` the tasks under a pushed parent go with it. Returns the tasks that changed beyond
 * `moved`, with their final dates, and gives up on a task after as many pushes as there are tasks (a cycle of links).
 */
export function pushSuccessors(tasks: SchedTask[], links: SchedLink[], moved: Map<string, { start: number; end: number }>, cascade = false): TaskMove[] {
  const current = new Map<string, { start: number; end: number }>(tasks.map((task) => [task.id, { start: task.start, end: task.end }]));
  for (const [id, dates] of moved) if (current.has(id)) current.set(id, { ...dates });
  const byId = new Map(tasks.map((task) => [task.id, task]));
  const outgoing = new Map<string, SchedLink[]>();
  for (const link of links) {
    const list = outgoing.get(link.source) || [];
    list.push(link);
    outgoing.set(link.source, list);
  }
  const changed = new Set<string>();
  const pushes = new Map<string, number>();
  const queue = [...moved.keys()];
  const shiftTask = (id: string, days: number) => {
    const dates = current.get(id);
    if (!dates) return;
    current.set(id, { start: shiftDays(dates.start, days), end: shiftDays(dates.end, days) });
    changed.add(id);
  };
  while (queue.length) {
    const sourceId = queue.shift() as string;
    const source = current.get(sourceId);
    if (!source) continue;
    for (const link of outgoing.get(sourceId) || []) {
      const target = byId.get(link.target);
      const dates = current.get(link.target);
      if (!target || !dates || target.readonly) continue;
      const bound = constraintBound(link, source);
      const have = bound.side === 'start' ? dates.start : dates.end;
      if (have >= bound.min) continue;
      const count = (pushes.get(link.target) || 0) + 1;
      if (count > tasks.length) continue; // a cycle: it would push forever
      pushes.set(link.target, count);
      const days = daysBetween(have, bound.min);
      shiftTask(link.target, days);
      queue.push(link.target);
      if (cascade) {
        for (const below of descendantsOf(tasks, link.target)) {
          if (below.readonly) continue;
          shiftTask(below.id, days);
          queue.push(below.id);
        }
      }
    }
  }
  const moves: TaskMove[] = [];
  for (const id of changed) {
    const dates = current.get(id) as { start: number; end: number };
    const before = moved.get(id);
    if (!before || before.start !== dates.start || before.end !== dates.end) moves.push({ id, ...dates });
  }
  return moves;
}
