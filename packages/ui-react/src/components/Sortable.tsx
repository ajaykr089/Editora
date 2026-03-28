import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  getCustomEventDetail,
  syncBooleanAttribute,
  syncJsonAttribute,
  syncStringAttribute,
  useElementAttributes,
  useElementEventListeners,
  useForwardedHostRef,
  useIsomorphicLayoutEffect,
  warnIfElementNotRegistered,
} from './_internals';

export type SortableListOrientation = 'vertical' | 'horizontal';
export type SortableSortMode = 'manual' | 'label';
export type SortableDropMode = 'before' | 'inside';
export type SortableChangeSource = 'pointer' | 'keyboard' | 'api' | 'restore';
export type SortableOperation = 'reorder' | 'transfer' | 'nest' | 'clone';
export type SortableDropIndicatorVisibility = 'active' | 'always';
export type SortableDragPreviewSize = 'match-item' | 'compact';
export type SortableDragHandleMode = 'handle' | 'item';
export type SortableRadiusPreset = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type SortableRadius = SortableRadiusPreset | number | string;
export type SortableSpacePreset = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SortableSpace = SortableSpacePreset | number | string;

export type SortableList = {
  id: string;
  label: string;
  description?: string;
  emptyLabel?: string;
  orientation?: SortableListOrientation;
  disabled?: boolean;
  cloneOnDrag?: boolean;
  accepts?: string[];
};

export type SortableItem = {
  id: string;
  label: string;
  listId: string;
  parentId?: string | null;
  description?: string;
  order?: number;
  disabled?: boolean;
  dragDisabled?: boolean;
  cloneOnDrag?: boolean;
  hidden?: boolean;
};

export type SortableSelectionChangeDetail = {
  selection: string[];
  previousSelection: string[];
};

export type SortablePersistenceRecord = {
  id: string;
  listId: string;
  parentId: string | null;
  index: number;
};

export type SortablePersistenceSnapshot = {
  version: 1;
  records: SortablePersistenceRecord[];
};

export type SortableChangeDetail = {
  items: SortableItem[];
  lists: SortableList[];
  selection: string[];
  previousSelection: string[];
  movedIds: string[];
  source: SortableChangeSource;
  operation: SortableOperation;
  persistence: SortablePersistenceSnapshot;
};

export type SortableRenderItemContext = {
  selected: boolean;
  disabled: boolean;
  dragDisabled: boolean;
  cloneOnDrag: boolean;
  list?: SortableList;
};

export type SortableRenderListHeaderContext = {
  itemCount: number;
  dragLocked: boolean;
};

export type SortableRenderEmptyStateContext = {
  itemCount: number;
  dragLocked: boolean;
  filterQuery: string;
};

export type SortableMoveOptions = {
  targetListId: string;
  beforeId?: string | null;
  parentId?: string | null;
  mode?: SortableDropMode;
  clone?: boolean;
  source?: SortableChangeSource;
};

export type SortableElement = HTMLElement & {
  lists: SortableList[];
  items: SortableItem[];
  selection: string[];
  sort: SortableSortMode;
  filterQuery: string;
  select(ids: string[]): void;
  clearSelection(): void;
  cancelDrag(): void;
  focusItem(id: string): void;
  moveSelection(options: SortableMoveOptions): void;
  getPersistenceSnapshot(): SortablePersistenceSnapshot;
};

export type SortableProps = Omit<React.HTMLAttributes<SortableElement>, 'onChange'> & {
  lists: SortableList[];
  items: SortableItem[];
  selection?: string[];
  filterQuery?: string;
  sort?: SortableSortMode;
  persistKey?: string;
  allowFilteredDrag?: boolean;
  allowNesting?: boolean;
  dropIndicatorVisibility?: SortableDropIndicatorVisibility;
  dragPreviewSize?: SortableDragPreviewSize;
  dragHandleMode?: SortableDragHandleMode;
  dragHandleSelector?: string;
  itemRadius?: SortableRadius;
  handleRadius?: SortableRadius;
  listGap?: SortableSpace;
  itemSpacing?: SortableSpace;
  showSelectionBadge?: boolean;
  disabled?: boolean;
  renderItem?: (item: SortableItem, context: SortableRenderItemContext) => React.ReactNode;
  renderListHeader?: (list: SortableList, context: SortableRenderListHeaderContext) => React.ReactNode;
  renderEmptyState?: (list: SortableList, context: SortableRenderEmptyStateContext) => React.ReactNode;
  onChange?: (detail: SortableChangeDetail) => void;
  onItemsChange?: (items: SortableItem[]) => void;
  onSelectionChange?: (detail: SortableSelectionChangeDetail) => void;
  onPersistRequest?: (detail: SortableChangeDetail) => void;
};

function escapeSelectorValue(value: string): string {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(value);
  }
  return value.replace(/"/g, '\\"');
}

function resolveRadiusValue(value: SortableRadius | undefined): string | null {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value === 'number') return `${value}px`;
  switch (value) {
    case 'none':
      return '0px';
    case 'sm':
      return '10px';
    case 'md':
      return '16px';
    case 'lg':
      return '20px';
    case 'xl':
      return '28px';
    case 'full':
      return '999px';
    default:
      return value;
  }
}

function resolveSpaceValue(value: SortableSpace | undefined): string | null {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value === 'number') return `${value}px`;
  switch (value) {
    case 'xs':
      return '6px';
    case 'sm':
      return '8px';
    case 'md':
      return '10px';
    case 'lg':
      return '14px';
    case 'xl':
      return '18px';
    default:
      return value;
  }
}

export const Sortable = React.forwardRef<SortableElement, SortableProps>(function Sortable(
  {
    lists,
    items,
    selection,
    filterQuery,
    sort,
    persistKey,
    allowFilteredDrag,
    allowNesting,
    dropIndicatorVisibility,
    dragPreviewSize,
    dragHandleMode,
    dragHandleSelector,
    itemRadius,
    handleRadius,
    listGap,
    itemSpacing,
    showSelectionBadge,
    disabled,
    renderItem,
    renderListHeader,
    renderEmptyState,
    onChange,
    onItemsChange,
    onSelectionChange,
    onPersistRequest,
    children,
    ...rest
  },
  forwardedRef
) {
  const ref = useForwardedHostRef<SortableElement>(forwardedRef);
  const [portalVersion, setPortalVersion] = React.useState(0);
  const hasCustomRendering = !!(renderItem || renderListHeader || renderEmptyState);

  useEffect(() => {
    warnIfElementNotRegistered('ui-sortable', 'Sortable');
  }, []);

  useElementEventListeners(
    ref,
    [
      {
        type: 'change',
        listener: onChange || onItemsChange
          ? ((event: Event) => {
            const detail = getCustomEventDetail<SortableChangeDetail>(event);
            if (!detail) return;
            onChange?.(detail);
            onItemsChange?.(detail.items);
          }) as EventListener
          : undefined,
      },
      {
        type: 'selection-change',
        listener: onSelectionChange
          ? ((event: Event) => {
            const detail = getCustomEventDetail<SortableSelectionChangeDetail>(event);
            if (detail) onSelectionChange(detail);
          }) as EventListener
          : undefined,
      },
      {
        type: 'persist-request',
        listener: onPersistRequest
          ? ((event: Event) => {
            const detail = getCustomEventDetail<SortableChangeDetail>(event);
            if (detail) onPersistRequest(detail);
          }) as EventListener
          : undefined,
      },
    ],
    [onChange, onItemsChange, onSelectionChange, onPersistRequest]
  );

  useElementAttributes(
    ref,
    (element) => {
      syncJsonAttribute(element, 'lists', lists);
      syncJsonAttribute(element, 'items', items);
      syncJsonAttribute(element, 'selection', selection ?? null);
      syncStringAttribute(element, 'filter-query', filterQuery ?? null);
      syncStringAttribute(element, 'sort', sort && sort !== 'manual' ? sort : null);
      syncStringAttribute(element, 'persist-key', persistKey ?? null);
      syncBooleanAttribute(element, 'allow-filtered-drag', allowFilteredDrag);

      if (allowNesting === false) element.setAttribute('allow-nesting', 'false');
      else element.removeAttribute('allow-nesting');

      if (dropIndicatorVisibility === 'always') element.setAttribute('drop-indicator-visibility', 'always');
      else element.removeAttribute('drop-indicator-visibility');

      if (dragPreviewSize === 'compact') element.setAttribute('drag-preview-size', 'compact');
      else element.removeAttribute('drag-preview-size');

      if (dragHandleMode === 'item') element.setAttribute('drag-handle-mode', 'item');
      else element.removeAttribute('drag-handle-mode');

      syncStringAttribute(element, 'drag-handle-selector', dragHandleSelector ?? null);

      const resolvedItemRadius = resolveRadiusValue(itemRadius);
      if (resolvedItemRadius) element.style.setProperty('--ui-sortable-item-radius', resolvedItemRadius);
      else element.style.removeProperty('--ui-sortable-item-radius');

      const resolvedHandleRadius = resolveRadiusValue(handleRadius);
      if (resolvedHandleRadius) element.style.setProperty('--ui-sortable-handle-radius', resolvedHandleRadius);
      else element.style.removeProperty('--ui-sortable-handle-radius');

      const resolvedListGap = resolveSpaceValue(listGap ?? itemSpacing);
      if (resolvedListGap) element.style.setProperty('--ui-sortable-list-gap', resolvedListGap);
      else element.style.removeProperty('--ui-sortable-list-gap');

      if (renderItem) element.setAttribute('custom-item-rendering', 'true');
      else element.removeAttribute('custom-item-rendering');

      if (showSelectionBadge === false) element.setAttribute('show-selection-badge', 'false');
      else element.removeAttribute('show-selection-badge');

      syncBooleanAttribute(element, 'disabled', disabled);
    },
    [lists, items, selection, filterQuery, sort, persistKey, allowFilteredDrag, allowNesting, dropIndicatorVisibility, dragPreviewSize, dragHandleMode, dragHandleSelector, itemRadius, handleRadius, listGap, itemSpacing, renderItem, showSelectionBadge, disabled]
  );

  useIsomorphicLayoutEffect(() => {
    if (!hasCustomRendering) return;
    const host = ref.current;
    const view = host?.ownerDocument?.defaultView;
    if (!host || !view) return;

    let disposed = false;
    let refreshQueued = false;
    let frameId: number | null = null;
    let observer: MutationObserver | null = null;

    const targetSelector = [
      renderItem && items.length > 0 ? '.item-custom-content[data-item-content-target]' : null,
      renderListHeader && lists.length > 0 ? '.list-custom-header[data-list-header-target]' : null,
      renderEmptyState && lists.length > 0 ? '.list-custom-empty[data-list-empty-target]' : null,
    ]
      .filter(Boolean)
      .join(', ');

    const refresh = () => {
      if (disposed || refreshQueued) return;
      refreshQueued = true;
      queueMicrotask(() => {
        refreshQueued = false;
        if (disposed) return;
        setPortalVersion((version) => version + 1);
      });
    };

    const ensureObserver = () => {
      const shadowRoot = ref.current?.shadowRoot;
      if (!shadowRoot) return false;
      if (!observer) {
        observer = new MutationObserver(() => refresh());
        observer.observe(shadowRoot, { childList: true, subtree: true });
      }
      return true;
    };

    const syncPortalTargets = () => {
      if (disposed) return;
      const shadowRoot = ref.current?.shadowRoot;
      const hasTargets = !targetSelector || !!shadowRoot?.querySelector(targetSelector);

      if (ensureObserver() && hasTargets) {
        refresh();
        return;
      }

      frameId = view.requestAnimationFrame(syncPortalTargets);
    };

    syncPortalTargets();

    return () => {
      disposed = true;
      if (frameId !== null) view.cancelAnimationFrame(frameId);
      observer?.disconnect();
    };
  }, [
    ref,
    hasCustomRendering,
    items,
    lists,
    selection,
    filterQuery,
    sort,
    persistKey,
    allowFilteredDrag,
    allowNesting,
    dropIndicatorVisibility,
    dragPreviewSize,
    dragHandleMode,
    dragHandleSelector,
    showSelectionBadge,
    disabled,
    renderItem,
    renderListHeader,
    renderEmptyState,
  ]);

  useIsomorphicLayoutEffect(() => {
    const host = ref.current;
    const shadowRoot = host?.shadowRoot;

    if (!host) return;

    if (!renderItem || !shadowRoot) {
      host.removeAttribute('custom-item-rendering-ready');
      host.removeAttribute('custom-item-rendering-pending');
      return;
    }

    const customItemTargets = shadowRoot.querySelectorAll('.item-custom-content[data-item-content-target]');
    const mountedCustomItems = shadowRoot.querySelectorAll('[data-sortable-custom-item]');
    const isReady =
      customItemTargets.length > 0 &&
      mountedCustomItems.length >= customItemTargets.length;

    if (isReady) {
      host.setAttribute('custom-item-rendering-ready', 'true');
      host.removeAttribute('custom-item-rendering-pending');
    } else {
      host.removeAttribute('custom-item-rendering-ready');
      host.setAttribute('custom-item-rendering-pending', 'true');
    }
  }, [ref, renderItem, portalVersion, items, selection, filterQuery, sort, disabled]);

  useIsomorphicLayoutEffect(() => {
    const shadowRoot = ref.current?.shadowRoot;
    if (!shadowRoot) return;

    shadowRoot.querySelectorAll<HTMLElement>('[data-sortable-custom-handle]').forEach((element) => {
      element.removeAttribute('data-sortable-custom-handle');
      element.removeAttribute('data-drag-trigger');
      element.removeAttribute('data-id');
      element.removeAttribute('draggable');
    });

    if (!renderItem || !dragHandleSelector || dragHandleMode === 'item') return;

    shadowRoot.querySelectorAll<HTMLElement>('[data-sortable-custom-item][data-sortable-item-id]').forEach((container) => {
      const id = container.getAttribute('data-sortable-item-id');
      if (!id) return;
      container.querySelectorAll<HTMLElement>(dragHandleSelector).forEach((handle) => {
        handle.setAttribute('data-sortable-custom-handle', '');
        handle.setAttribute('data-drag-trigger', 'custom');
        handle.setAttribute('data-id', id);
        handle.setAttribute('draggable', 'true');
      });
    });
  }, [ref, renderItem, dragHandleSelector, dragHandleMode, portalVersion, items, selection, filterQuery, sort, disabled]);

  const listById = new Map(lists.map((list) => [list.id, list]));
  const itemCountByList = new Map(lists.map((list) => [list.id, items.filter((item) => item.listId === list.id).length]));
  const dragLocked = !!disabled || sort === 'label' || (!!filterQuery && !allowFilteredDrag);

  const itemPortals = renderItem
    ? items.map((item) => {
      const target = ref.current?.shadowRoot?.querySelector<HTMLElement>(
        `.item-custom-content[data-item-content-target="${escapeSelectorValue(item.id)}"]`
      );
      if (!target) return null;

      return createPortal(
        <div
          data-sortable-custom-item=""
          data-sortable-item-id={item.id}
          data-selected={selection?.includes(item.id) ? 'true' : 'false'}
          data-disabled={item.disabled ? 'true' : 'false'}
          data-drag-disabled={item.dragDisabled ? 'true' : 'false'}
        >
          {renderItem(item, {
            selected: selection?.includes(item.id) ?? false,
            disabled: !!item.disabled,
            dragDisabled: !!item.dragDisabled,
            cloneOnDrag: !!item.cloneOnDrag || !!listById.get(item.listId)?.cloneOnDrag,
            list: listById.get(item.listId),
          })}
        </div>,
        target,
        item.id
      );
    })
    : null;

  const headerPortals = renderListHeader
    ? lists.map((list) => {
      const target = ref.current?.shadowRoot?.querySelector<HTMLElement>(
        `.list-custom-header[data-list-header-target="${escapeSelectorValue(list.id)}"]`
      );
      if (!target) return null;

      return createPortal(
        <div data-sortable-custom-list-header="" data-sortable-list-id={list.id}>
          {renderListHeader(list, {
            itemCount: itemCountByList.get(list.id) ?? 0,
            dragLocked,
          })}
        </div>,
        target,
        `header-${list.id}`
      );
    })
    : null;

  const emptyStatePortals = renderEmptyState
    ? lists.map((list) => {
      const target = ref.current?.shadowRoot?.querySelector<HTMLElement>(
        `.list-custom-empty[data-list-empty-target="${escapeSelectorValue(list.id)}"]`
      );
      if (!target) return null;

      return createPortal(
        <div data-sortable-custom-empty="" data-sortable-list-id={list.id}>
          {renderEmptyState(list, {
            itemCount: itemCountByList.get(list.id) ?? 0,
            dragLocked,
            filterQuery: filterQuery ?? '',
          })}
        </div>,
        target,
        `empty-${list.id}`
      );
    })
    : null;

  const hostProps: Record<string, unknown> = { ref, ...rest };
  if (renderItem) hostProps['custom-item-rendering'] = '';

  return (
    <>
      {React.createElement('ui-sortable', hostProps, children)}
      {portalVersion >= 0 ? itemPortals : null}
      {portalVersion >= 0 ? headerPortals : null}
      {portalVersion >= 0 ? emptyStatePortals : null}
    </>
  );
});

Sortable.displayName = 'Sortable';

export default Sortable;
