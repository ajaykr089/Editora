export interface CollectionItem {
  label: string;
  disabled?: boolean;
}

export interface CollectionTypeaheadOptions<T> {
  startIndex?: number;
  getLabel?: (item: T) => string;
  getDisabled?: (item: T) => boolean;
}

export interface CollectionMoveOptions<T> {
  wrap?: boolean;
  getDisabled?: (item: T) => boolean;
}

function defaultGetLabel<T>(item: T): string {
  if (item && typeof item === 'object' && 'label' in (item as Record<string, unknown>)) {
    return String((item as Record<string, unknown>).label || '');
  }
  return String(item ?? '');
}

function defaultGetDisabled<T>(item: T): boolean {
  return !!(item && typeof item === 'object' && 'disabled' in (item as Record<string, unknown>) && (item as Record<string, unknown>).disabled);
}

export function normalizeCollectionText(value: string): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function findFirstEnabledIndex<T>(
  items: readonly T[],
  getDisabled: (item: T) => boolean = defaultGetDisabled
): number {
  return items.findIndex((item) => !getDisabled(item));
}

export function findLastEnabledIndex<T>(
  items: readonly T[],
  getDisabled: (item: T) => boolean = defaultGetDisabled
): number {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (!getDisabled(items[index])) return index;
  }
  return -1;
}

export function findIndexByValue<T>(
  items: readonly T[],
  value: string,
  getValue: (item: T) => string
): number {
  return items.findIndex((item) => getValue(item) === value);
}

export function findNextEnabledIndex<T>(
  items: readonly T[],
  startIndex: number,
  step: 1 | -1,
  options: CollectionMoveOptions<T> = {}
): number {
  if (!items.length) return -1;

  const getDisabled = options.getDisabled || defaultGetDisabled;
  const wrap = options.wrap !== false;
  let cursor = startIndex;

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

export function findTypeaheadMatch<T>(
  items: readonly T[],
  query: string,
  options: CollectionTypeaheadOptions<T> = {}
): number {
  const normalizedQuery = normalizeCollectionText(query);
  if (!normalizedQuery || !items.length) return -1;

  const getLabel = options.getLabel || defaultGetLabel;
  const getDisabled = options.getDisabled || defaultGetDisabled;
  const startIndex = typeof options.startIndex === 'number' ? options.startIndex : -1;

  for (let offset = 1; offset <= items.length; offset += 1) {
    const index = (startIndex + offset + items.length) % items.length;
    const item = items[index];
    if (getDisabled(item)) continue;

    const label = normalizeCollectionText(getLabel(item));
    if (label.startsWith(normalizedQuery)) return index;
  }

  return -1;
}
