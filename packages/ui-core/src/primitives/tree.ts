import { normalizeCollectionText } from './collection';

export interface TreeFlattenOptions<T> {
  getId: (item: T) => string;
  getLabel: (item: T) => string;
  getChildren: (item: T) => readonly T[];
  getExpanded?: (item: T) => boolean;
  getDisabled?: (item: T) => boolean;
}

export interface TreeRecord<T> {
  item: T;
  id: string;
  label: string;
  level: number;
  parentId: string | null;
  disabled: boolean;
  expanded: boolean;
  hasChildren: boolean;
}

export function flattenTree<T>(roots: readonly T[], options: TreeFlattenOptions<T>): TreeRecord<T>[] {
  const records: TreeRecord<T>[] = [];
  const getExpanded = options.getExpanded || (() => false);
  const getDisabled = options.getDisabled || (() => false);

  const walk = (items: readonly T[], level: number, parentId: string | null) => {
    items.forEach((item) => {
      const children = options.getChildren(item) || [];
      const record: TreeRecord<T> = {
        item,
        id: options.getId(item),
        label: options.getLabel(item),
        level,
        parentId,
        disabled: getDisabled(item),
        expanded: getExpanded(item),
        hasChildren: children.length > 0
      };
      records.push(record);
      walk(children, level + 1, record.id);
    });
  };

  walk(roots, 1, null);
  return records;
}

export function flattenVisibleTree<T>(roots: readonly T[], options: TreeFlattenOptions<T>): TreeRecord<T>[] {
  const records: TreeRecord<T>[] = [];
  const getExpanded = options.getExpanded || (() => false);
  const getDisabled = options.getDisabled || (() => false);

  const walk = (items: readonly T[], level: number, parentId: string | null) => {
    items.forEach((item) => {
      const children = options.getChildren(item) || [];
      const expanded = getExpanded(item);
      const record: TreeRecord<T> = {
        item,
        id: options.getId(item),
        label: options.getLabel(item),
        level,
        parentId,
        disabled: getDisabled(item),
        expanded,
        hasChildren: children.length > 0
      };
      records.push(record);
      if (record.hasChildren && expanded) walk(children, level + 1, record.id);
    });
  };

  walk(roots, 1, null);
  return records;
}

export function findTreeRecordIndexById<T>(records: readonly TreeRecord<T>[], id: string): number {
  return records.findIndex((record) => record.id === id);
}

export function findParentTreeRecordIndex<T>(records: readonly TreeRecord<T>[], index: number): number {
  const record = records[index];
  if (!record?.parentId) return -1;
  return records.findIndex((candidate) => candidate.id === record.parentId);
}

export function findTreeTypeaheadMatch<T>(
  records: readonly TreeRecord<T>[],
  query: string,
  startIndex = -1
): number {
  const normalizedQuery = normalizeCollectionText(query);
  if (!normalizedQuery) return -1;

  for (let offset = 1; offset <= records.length; offset += 1) {
    const index = (startIndex + offset + records.length) % records.length;
    const record = records[index];
    if (record.disabled) continue;
    if (normalizeCollectionText(record.label).startsWith(normalizedQuery)) return index;
  }

  return -1;
}
