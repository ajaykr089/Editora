export type PanelConstraint = {
  min: number;
  max: number;
  collapsedSize: number;
  collapsed?: boolean;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function normalizedBounds(constraint: PanelConstraint): { min: number; max: number } {
  if (constraint.collapsed) {
    const collapsed = clamp(constraint.collapsedSize, 0, 100);
    return { min: collapsed, max: collapsed };
  }

  const min = clamp(constraint.min, 0, 100);
  const max = clamp(Math.max(min, constraint.max), min, 100);
  return { min, max };
}

export function normalizePanelLayout(
  constraints: readonly PanelConstraint[],
  desiredSizes: readonly number[] = []
): number[] {
  if (!constraints.length) return [];

  const next = constraints.map((constraint, index) => {
    const explicit = desiredSizes[index];
    const { min, max } = normalizedBounds(constraint);
    if (Number.isFinite(explicit)) return clamp(Number(explicit), min, max);
    if (constraint.collapsed) return min;
    return NaN;
  });

  const pending = next.reduce<number[]>((acc, size, index) => {
    if (!Number.isFinite(size)) acc.push(index);
    return acc;
  }, []);

  const assignedTotal = next.reduce((sum, size) => sum + (Number.isFinite(size) ? size : 0), 0);
  const remaining = Math.max(0, 100 - assignedTotal);
  const share = pending.length ? remaining / pending.length : 0;

  pending.forEach((index) => {
    const { min, max } = normalizedBounds(constraints[index]);
    next[index] = clamp(share, min, max);
  });

  let total = next.reduce((sum, size) => sum + size, 0);
  let delta = round(100 - total);
  let guard = 0;

  while (Math.abs(delta) > 0.001 && guard < 30) {
    const candidates = constraints.reduce<number[]>((acc, constraint, index) => {
      const { min, max } = normalizedBounds(constraint);
      if (delta > 0 && next[index] < max - 0.001) acc.push(index);
      if (delta < 0 && next[index] > min + 0.001) acc.push(index);
      return acc;
    }, []);

    if (!candidates.length) break;

    const portion = delta / candidates.length;
    let applied = 0;

    candidates.forEach((index) => {
      const { min, max } = normalizedBounds(constraints[index]);
      const current = next[index];
      const value = clamp(current + portion, min, max);
      next[index] = round(value);
      applied += next[index] - current;
    });

    total = next.reduce((sum, size) => sum + size, 0);
    delta = round(100 - total);
    if (Math.abs(applied) < 0.001) break;
    guard += 1;
  }

  return next.map((size) => round(size));
}

export function resizePanelPair(
  sizes: readonly number[],
  constraints: readonly PanelConstraint[],
  splitterIndex: number,
  delta: number
): number[] {
  const leftIndex = splitterIndex;
  const rightIndex = splitterIndex + 1;
  if (leftIndex < 0 || rightIndex >= sizes.length) return [...sizes];

  const next = [...sizes];
  const left = next[leftIndex];
  const right = next[rightIndex];
  const leftBounds = normalizedBounds(constraints[leftIndex]);
  const rightBounds = normalizedBounds(constraints[rightIndex]);

  const minimumDelta = Math.max(leftBounds.min - left, right - rightBounds.max);
  const maximumDelta = Math.min(leftBounds.max - left, right - rightBounds.min);
  const applied = clamp(delta, minimumDelta, maximumDelta);

  next[leftIndex] = round(left + applied);
  next[rightIndex] = round(right - applied);
  return next;
}
