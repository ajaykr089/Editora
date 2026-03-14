export interface RovingFocusResolveOptions<T> {
  activeIndex?: number;
  selectedIndex?: number;
  getDisabled?: (item: T) => boolean;
}

export interface RovingFocusMoveOptions<T> {
  wrap?: boolean;
  fallbackIndex?: number;
  getDisabled?: (item: T) => boolean;
}

export interface SyncRovingTabStopsOptions {
  activeAttribute?: string | null;
}

function defaultGetDisabled<T>(item: T): boolean {
  return !!(item && typeof item === 'object' && 'disabled' in (item as Record<string, unknown>) && (item as Record<string, unknown>).disabled);
}

export function getRovingFocusBoundaryIndex<T>(
  items: readonly T[],
  edge: 'first' | 'last',
  getDisabled: (item: T) => boolean = defaultGetDisabled
): number {
  if (edge === 'first') {
    return items.findIndex((item) => !getDisabled(item));
  }
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (!getDisabled(items[index])) return index;
  }
  return -1;
}

export function resolveRovingFocusIndex<T>(
  items: readonly T[],
  options: RovingFocusResolveOptions<T> = {}
): number {
  const getDisabled = options.getDisabled || defaultGetDisabled;
  const activeIndex = options.activeIndex ?? -1;
  const selectedIndex = options.selectedIndex ?? -1;

  if (activeIndex >= 0 && activeIndex < items.length && !getDisabled(items[activeIndex])) {
    return activeIndex;
  }

  if (selectedIndex >= 0 && selectedIndex < items.length && !getDisabled(items[selectedIndex])) {
    return selectedIndex;
  }

  return getRovingFocusBoundaryIndex(items, 'first', getDisabled);
}

export function moveRovingFocusIndex<T>(
  items: readonly T[],
  currentIndex: number,
  step: 1 | -1,
  options: RovingFocusMoveOptions<T> = {}
): number {
  if (!items.length) return -1;

  const getDisabled = options.getDisabled || defaultGetDisabled;
  const wrap = options.wrap !== false;
  let cursor = typeof options.fallbackIndex === 'number' ? options.fallbackIndex : currentIndex;

  for (let attempts = 0; attempts < items.length; attempts += 1) {
    cursor += step;

    if (!wrap && (cursor < 0 || cursor >= items.length)) {
      return -1;
    }

    if (cursor < 0) cursor = items.length - 1;
    if (cursor >= items.length) cursor = 0;

    if (!getDisabled(items[cursor])) return cursor;
  }

  return -1;
}

export function syncRovingTabStops(
  items: readonly HTMLElement[],
  activeItem: HTMLElement | null,
  options: SyncRovingTabStopsOptions = {}
): void {
  const activeAttribute = options.activeAttribute === undefined ? 'data-active' : options.activeAttribute;
  items.forEach((item) => {
    const isActive = item === activeItem;
    item.setAttribute('tabindex', isActive ? '0' : '-1');
    if (activeAttribute) {
      if (isActive) item.setAttribute(activeAttribute, 'true');
      else item.removeAttribute(activeAttribute);
    }
  });
}

export function focusRovingItem(
  item: HTMLElement | null,
  options: FocusOptions = { preventScroll: true }
): void {
  if (!item) return;
  try {
    item.focus(options);
  } catch {
    item.focus();
  }
}
