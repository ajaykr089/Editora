import {
  findFirstEnabledIndex,
  findLastEnabledIndex,
  findNextEnabledIndex,
  findTypeaheadMatch,
  type CollectionMoveOptions,
  type CollectionTypeaheadOptions
} from './collection';

export interface ListboxResolveOptions<T> {
  activeIndex?: number;
  selectedIndex?: number;
  getDisabled?: (item: T) => boolean;
}

export interface ListboxMoveOptions<T> extends CollectionMoveOptions<T> {
  fallbackIndex?: number;
}

function defaultGetDisabled<T>(item: T): boolean {
  return !!(item && typeof item === 'object' && 'disabled' in (item as Record<string, unknown>) && (item as Record<string, unknown>).disabled);
}

export function getListboxBoundaryIndex<T>(
  items: readonly T[],
  edge: 'first' | 'last',
  getDisabled: (item: T) => boolean = defaultGetDisabled
): number {
  return edge === 'first' ? findFirstEnabledIndex(items, getDisabled) : findLastEnabledIndex(items, getDisabled);
}

export function resolveListboxActiveIndex<T>(
  items: readonly T[],
  options: ListboxResolveOptions<T> = {}
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

  return findFirstEnabledIndex(items, getDisabled);
}

export function moveListboxActiveIndex<T>(
  items: readonly T[],
  currentIndex: number,
  step: 1 | -1,
  options: ListboxMoveOptions<T> = {}
): number {
  const fallbackIndex = typeof options.fallbackIndex === 'number' ? options.fallbackIndex : currentIndex;
  return findNextEnabledIndex(items, currentIndex >= 0 ? currentIndex : fallbackIndex, step, options);
}

export function findListboxTypeaheadIndex<T>(
  items: readonly T[],
  query: string,
  options: CollectionTypeaheadOptions<T> = {}
): number {
  return findTypeaheadMatch(items, query, options);
}

export function scrollListboxItemIntoView(
  item: HTMLElement | null,
  options: ScrollIntoViewOptions = { block: 'nearest', inline: 'nearest' }
): void {
  if (!item) return;

  const doc = item.ownerDocument;
  const win = doc?.defaultView;
  if (!doc || !win) return;

  const isScrollable = (element: HTMLElement, axis: 'x' | 'y'): boolean => {
    const style = win.getComputedStyle(element);
    const overflow = axis === 'y' ? style.overflowY || style.overflow : style.overflowX || style.overflow;
    return /(auto|scroll|overlay)/.test(overflow);
  };

  let container: HTMLElement | null = item.parentElement;
  while (container) {
    const canScrollY = isScrollable(container, 'y') && container.scrollHeight > container.clientHeight;
    const canScrollX = isScrollable(container, 'x') && container.scrollWidth > container.clientWidth;
    if (canScrollX || canScrollY) break;
    container = container.parentElement;
  }

  if (!container) return;

  const itemRect = item.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const itemTop = itemRect.top - containerRect.top + container.scrollTop;
  const itemBottom = itemTop + itemRect.height;
  const itemLeft = itemRect.left - containerRect.left + container.scrollLeft;
  const itemRight = itemLeft + itemRect.width;

  const resolveAxis = (
    current: number,
    start: number,
    end: number,
    viewportSize: number,
    mode: ScrollLogicalPosition | undefined
  ): number => {
    const align = mode || 'nearest';
    const itemSize = end - start;

    if (align === 'start') return start;
    if (align === 'end') return end - viewportSize;
    if (align === 'center') return start - (viewportSize - itemSize) / 2;

    if (itemSize >= viewportSize) return start;
    if (start < current) return start;
    if (end > current + viewportSize) return end - viewportSize;
    return current;
  };

  const nextTop = resolveAxis(container.scrollTop, itemTop, itemBottom, container.clientHeight, options.block);
  const nextLeft = resolveAxis(container.scrollLeft, itemLeft, itemRight, container.clientWidth, options.inline);

  const maxTop = Math.max(0, container.scrollHeight - container.clientHeight);
  const maxLeft = Math.max(0, container.scrollWidth - container.clientWidth);
  const clampedTop = Math.max(0, Math.min(maxTop, nextTop));
  const clampedLeft = Math.max(0, Math.min(maxLeft, nextLeft));

  if (Math.abs(container.scrollTop - clampedTop) > 0.5) {
    container.scrollTop = clampedTop;
  }
  if (Math.abs(container.scrollLeft - clampedLeft) > 0.5) {
    container.scrollLeft = clampedLeft;
  }
}

export function syncActiveDescendant(owner: HTMLElement | null, itemId?: string | null): void {
  if (!owner) return;
  if (itemId) owner.setAttribute('aria-activedescendant', itemId);
  else owner.removeAttribute('aria-activedescendant');
}
