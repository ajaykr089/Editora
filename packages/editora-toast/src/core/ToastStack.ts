// ToastStack - positions the toasts of one container.
//
// Every toast is absolutely placed against the container's edge and moved with the individual `translate` and
// `scale` properties, so the enter, exit and swipe animations (which use `transform`) keep working on top of it.
// The newest toast is always the one nearest the screen edge. Two layouts share this code:
//   - expanded: a list, each toast at its own height with a gap between;
//   - collapsed: a deck, the newest toast in full and the older ones as thin edges behind it. Hovering or
//     focusing the container opens the deck.

export interface StackSettings {
  stack: boolean;
  expand: boolean;
  gap: number;
}

const PEEK = 12; // px of each older toast that sticks out behind the one in front
const SCALE_STEP = 0.05;
const DECK_DEPTH = 3; // toasts shown in a collapsed deck; further ones are hidden behind

const naturalHeights = new WeakMap<HTMLElement, number>();

function measure(element: HTMLElement): number {
  const inline = element.style.height;
  element.style.height = 'auto';
  const height = element.offsetHeight;
  element.style.height = inline;
  naturalHeights.set(element, height);
  return height;
}

// Forget the stored height of a toast whose content changed, so the next layout measures it again.
export function invalidateHeight(element: HTMLElement): void {
  naturalHeights.delete(element);
}

export function isExpanded(container: HTMLElement, settings: StackSettings): boolean {
  return !settings.stack || settings.expand || container.dataset.open === 'true';
}

export function layoutStack(container: HTMLElement, settings: StackSettings, remeasureAll = false): void {
  const bottom = container.dataset.edge === 'bottom';
  const direction = bottom ? -1 : 1;
  const all = Array.from(container.querySelectorAll<HTMLElement>('.editora-toast'));
  // Toasts on their way out leave the layout at once, so the others close the gap while the exit animation runs.
  const live = all.filter((element) => !element.classList.contains('hiding') && element.dataset.leaving !== 'true');
  // Newest first.
  const ordered = live.slice().reverse();
  const expanded = isExpanded(container, settings);

  ordered.forEach((element) => {
    if (remeasureAll || !naturalHeights.has(element)) measure(element);
  });

  const heights = ordered.map((element) => naturalHeights.get(element) || 0);
  const frontHeight = heights[0] || 0;
  let offset = 0;

  ordered.forEach((element, index) => {
    const natural = heights[index];
    const scale = expanded ? 1 : Math.max(1 - index * SCALE_STEP, 0.8);
    const height = expanded ? natural : frontHeight;
    const y = expanded ? offset : index * PEEK + frontHeight * (1 - scale);

    element.style.setProperty('--et-y', `${direction * y}px`);
    element.style.setProperty('--et-s', String(scale));
    element.style.setProperty('--et-index', String(index));
    element.style.height = `${height}px`;
    element.style.zIndex = String(ordered.length - index);
    element.dataset.index = String(index);
    element.dataset.front = String(index === 0);
    element.dataset.collapsed = String(!expanded && index > 0);
    element.dataset.hidden = String(!expanded && index >= DECK_DEPTH);
    offset += natural + settings.gap;
  });

  all.forEach((element) => {
    if (!live.includes(element)) element.dataset.front = 'false';
  });

  const count = ordered.length;
  const total = expanded
    ? heights.reduce((sum, height) => sum + height, 0) + Math.max(count - 1, 0) * settings.gap
    : frontHeight + (Math.min(count, DECK_DEPTH) - 1 > 0 ? (Math.min(count, DECK_DEPTH) - 1) * PEEK : 0);
  container.style.height = count > 0 ? `${total}px` : '0px';
  container.dataset.count = String(count);
  container.dataset.expanded = String(expanded);
}
