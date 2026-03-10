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
  if (!item || typeof item.scrollIntoView !== 'function') return;
  item.scrollIntoView(options);
}

export function syncActiveDescendant(owner: HTMLElement | null, itemId?: string | null): void {
  if (!owner) return;
  if (itemId) owner.setAttribute('aria-activedescendant', itemId);
  else owner.removeAttribute('aria-activedescendant');
}
