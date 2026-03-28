import { ElementBase } from '../ElementBase';

export type UISortableListOrientation = 'vertical' | 'horizontal';
export type UISortableSortMode = 'manual' | 'label';
export type UISortableDropMode = 'before' | 'inside';
export type UISortableChangeSource = 'pointer' | 'keyboard' | 'api' | 'restore';
export type UISortableOperation = 'reorder' | 'transfer' | 'nest' | 'clone';
export type UISortableDropIndicatorVisibility = 'active' | 'always';
export type UISortableDragHandleMode = 'handle' | 'item';
export type UISortableDropzoneStyle = 'indicator' | 'container';

export type UISortableList = {
  id: string;
  label: string;
  description?: string;
  emptyLabel?: string;
  orientation?: UISortableListOrientation;
  disabled?: boolean;
  cloneOnDrag?: boolean;
  accepts?: string[];
};

export type UISortableItem = {
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

export type UISortableSelectionChangeDetail = {
  selection: string[];
  previousSelection: string[];
};

export type UISortablePersistenceRecord = {
  id: string;
  listId: string;
  parentId: string | null;
  index: number;
};

export type UISortablePersistenceSnapshot = {
  version: 1;
  records: UISortablePersistenceRecord[];
};

export type UISortableChangeDetail = {
  items: UISortableItem[];
  lists: UISortableList[];
  selection: string[];
  previousSelection: string[];
  movedIds: string[];
  source: UISortableChangeSource;
  operation: UISortableOperation;
  persistence: UISortablePersistenceSnapshot;
};

export type UISortableMoveOptions = {
  targetListId: string;
  beforeId?: string | null;
  parentId?: string | null;
  mode?: UISortableDropMode;
  clone?: boolean;
  source?: UISortableChangeSource;
};

type NormalizedItem = {
  id: string;
  label: string;
  listId: string;
  parentId: string | null;
  description: string;
  order: number;
  disabled: boolean;
  dragDisabled: boolean;
  cloneOnDrag: boolean;
  hidden: boolean;
};

type NormalizedList = {
  id: string;
  label: string;
  description: string;
  emptyLabel: string;
  orientation: UISortableListOrientation;
  disabled: boolean;
  cloneOnDrag: boolean;
  accepts?: string[];
};

type RenderRecord = {
  id: string;
  disabled: boolean;
};

type DropTarget = {
  listId: string;
  parentId: string | null;
  beforeId: string | null;
  mode: UISortableDropMode;
};

type DragState = {
  snapshot: NormalizedItem[];
  movedRootIds: string[];
  originId: string;
  clone: boolean;
  keyboard: boolean;
  dropTarget: DropTarget | null;
  committed: boolean;
};

type PointerGestureState = {
  pointerId: number;
  pointerType: string;
  originId: string;
  movedRootIds: string[];
  clone: boolean;
  startX: number;
  startY: number;
  moved: boolean;
  captureTarget: HTMLElement | null;
};

type DragActivator = {
  element: HTMLElement;
  id: string;
  kind: 'handle' | 'item' | 'custom';
};

type DropTargetCandidate = {
  target: DropTarget | null;
  startedAt: number;
  announceLabel?: string;
};

type KeyboardDropTarget = DropTarget & {
  label: string;
};

type ProjectedMoveResult = {
  items: NormalizedItem[];
  insertedRootIds: string[];
};

const STORAGE_VERSION = 1;
const DROP_TARGET_SETTLE_MS = 44;
const DROP_TARGET_CLEAR_SETTLE_MS = 72;

const style = `
  :host {
    --ui-sortable-accent: var(--ui-color-primary, #2563eb);
    --ui-sortable-surface: var(--ui-color-surface, #ffffff);
    --ui-sortable-surface-muted: color-mix(in srgb, var(--ui-sortable-surface) 92%, #eff6ff);
    --ui-sortable-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 76%, transparent);
    --ui-sortable-text: var(--ui-color-text, #0f172a);
    --ui-sortable-muted: var(--ui-color-muted, #64748b);
    --ui-sortable-shadow:
      0 1px 3px rgba(15, 23, 42, 0.06),
      0 16px 34px rgba(15, 23, 42, 0.08);
    --ui-sortable-radius: 24px;
    --ui-sortable-panel-radius: 18px;
    --ui-sortable-item-radius: 16px;
    --ui-sortable-handle-radius: 12px;
    --ui-sortable-gap: 16px;
    --ui-sortable-list-gap: 8px;
    --ui-sortable-item-gap: 12px;
    --ui-sortable-dropzone-size: 10px;
    --ui-sortable-dropzone-inside-size: 16px;
    --ui-sortable-dropzone-container-min-block-size: 76px;
    --ui-sortable-dropzone-container-min-inline-size: 180px;
    --ui-sortable-indent: 22px;
    display: block;
    min-inline-size: 0;
    color: var(--ui-sortable-text);
    color-scheme: light dark;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    box-sizing: border-box;
  }

  :host([disabled]) {
    opacity: 0.72;
  }

  .root {
    display: grid;
    gap: 14px;
    min-inline-size: 0;
  }

  .toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px 16px;
    padding: 0 2px;
    color: var(--ui-sortable-muted);
    font-size: 13px;
    line-height: 1.5;
  }

  .helper {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-inline-size: 0;
  }

  .selection-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-inline-size: 28px;
    min-block-size: 24px;
    padding-inline: 8px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--ui-sortable-accent) 14%, transparent);
    color: color-mix(in srgb, var(--ui-sortable-accent) 84%, var(--ui-sortable-text));
    font-weight: 700;
  }

  .lists {
    display: grid;
    gap: var(--ui-sortable-gap);
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    min-inline-size: 0;
  }

  .list {
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 12px;
    min-inline-size: 0;
    padding: 16px;
    border: 1px solid var(--ui-sortable-border);
    border-radius: var(--ui-sortable-radius);
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-sortable-surface) 96%, transparent),
        color-mix(in srgb, var(--ui-sortable-accent) 4%, var(--ui-sortable-surface))
      );
    box-shadow: var(--ui-sortable-shadow);
  }

  .list[data-orientation="horizontal"] .items {
    display: flex;
    flex-wrap: nowrap;
    overflow: auto hidden;
    align-items: stretch;
  }

  .list[data-disabled="true"] {
    opacity: 0.68;
  }

  .list-header {
    display: grid;
    gap: 4px;
  }

  .list-custom-header:empty {
    display: none;
  }

  .list-custom-header:not(:empty) {
    display: block;
  }

  .list-custom-header:not(:empty) + .list-default-header {
    display: none;
  }

  .list-topline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .list-label {
    font-size: 14px;
    line-height: 1.4;
    font-weight: 700;
    color: var(--ui-sortable-text);
  }

  .list-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-inline-size: 28px;
    min-block-size: 24px;
    padding-inline: 8px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--ui-sortable-accent) 10%, transparent);
    color: var(--ui-sortable-muted);
    font-size: 12px;
    font-weight: 700;
  }

  .list-description,
  .list-helper,
  .empty {
    color: var(--ui-sortable-muted);
    font-size: 12px;
    line-height: 1.55;
  }

  .items {
    display: grid;
    align-content: start;
    gap: var(--ui-sortable-list-gap);
    min-block-size: 140px;
    min-inline-size: 0;
  }

  .tree {
    display: grid;
    gap: var(--ui-sortable-list-gap);
    min-inline-size: 0;
  }

  .list-custom-empty:empty {
    display: none;
  }

  .list-custom-empty:not(:empty) {
    display: block;
  }

  .list-custom-empty:not(:empty) + .empty {
    display: none;
  }

  .item-shell {
    display: grid;
    gap: 8px;
    min-inline-size: 0;
  }

  .item {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: start;
    gap: var(--ui-sortable-item-gap);
    min-inline-size: 0;
    padding: 12px;
    border: 1px solid color-mix(in srgb, var(--ui-sortable-border) 82%, transparent);
    border-radius: var(--ui-sortable-item-radius);
    background: var(--ui-sortable-surface-muted);
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
    will-change: transform, opacity, box-shadow, border-color, background;
    transition:
      transform 180ms ease,
      opacity 180ms ease,
      box-shadow 180ms ease,
      border-color 180ms ease,
      background 180ms ease;
  }

  .item[data-drag-handle-mode="item"],
  .item[data-drag-handle-mode="custom"] {
    grid-template-columns: minmax(0, 1fr);
  }

  .item[data-drag-handle-mode="item"] {
    cursor: grab;
  }

  .item[data-drag-handle-mode="item"][data-dragging="true"] {
    cursor: grabbing;
  }

  .item[data-selected="true"] {
    border-color: color-mix(in srgb, var(--ui-sortable-accent) 32%, var(--ui-sortable-border));
    background: color-mix(in srgb, var(--ui-sortable-accent) 11%, var(--ui-sortable-surface));
    box-shadow:
      0 0 0 1px color-mix(in srgb, var(--ui-sortable-accent) 10%, transparent),
      0 10px 24px rgba(15, 23, 42, 0.08);
  }

  .item[data-focused="true"] {
    border-color: color-mix(in srgb, var(--ui-sortable-accent) 42%, var(--ui-sortable-border));
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--ui-sortable-accent) 12%, transparent),
      0 10px 24px rgba(15, 23, 42, 0.08);
  }

  .item[data-drop-inside-active="true"] {
    border-color: color-mix(in srgb, var(--ui-sortable-accent) 48%, var(--ui-sortable-border));
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-sortable-accent) 14%, var(--ui-sortable-surface)),
        color-mix(in srgb, var(--ui-sortable-accent) 10%, var(--ui-sortable-surface-muted))
      );
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--ui-sortable-accent) 12%, transparent),
      0 14px 30px rgba(15, 23, 42, 0.1);
  }

  .item[data-dragging="true"] {
    opacity: 0.48;
    transform: scale(0.985);
    transition-duration: 0ms, 180ms, 180ms, 180ms, 180ms;
  }

  .item.item-placeholder {
    grid-template-columns: 1fr;
    border-style: dashed;
    border-color: color-mix(in srgb, var(--ui-sortable-accent) 50%, var(--ui-sortable-border));
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-sortable-accent) 10%, var(--ui-sortable-surface)),
        color-mix(in srgb, var(--ui-sortable-accent) 6%, var(--ui-sortable-surface-muted))
      );
    box-shadow:
      inset 0 0 0 1px color-mix(in srgb, var(--ui-sortable-accent) 18%, transparent),
      0 12px 26px rgba(15, 23, 42, 0.08);
  }

  .placeholder-content {
    display: grid;
    gap: 6px;
    min-inline-size: 0;
  }

  .placeholder-kicker {
    font-size: 11px;
    line-height: 1.4;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--ui-sortable-accent) 72%, var(--ui-sortable-text));
  }

  .placeholder-title {
    font-size: 14px;
    line-height: 1.4;
    font-weight: 700;
    color: var(--ui-sortable-text);
  }

  .placeholder-description {
    color: var(--ui-sortable-muted);
    font-size: 12px;
    line-height: 1.55;
  }

  .drag-preview-overlay {
    position: fixed;
    inset: auto auto auto auto;
    top: -9999px;
    left: -9999px;
    z-index: 2147483646;
    box-sizing: border-box;
    inline-size: min(320px, calc(100vw - 32px));
    padding: 12px;
    border: 1px dashed color-mix(in srgb, var(--ui-sortable-accent) 50%, var(--ui-sortable-border));
    border-radius: var(--ui-sortable-item-radius);
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-sortable-accent) 10%, var(--ui-sortable-surface)),
        color-mix(in srgb, var(--ui-sortable-accent) 6%, var(--ui-sortable-surface-muted))
      );
    box-shadow:
      inset 0 0 0 1px color-mix(in srgb, var(--ui-sortable-accent) 18%, transparent),
      0 18px 40px rgba(15, 23, 42, 0.12);
    pointer-events: none;
    opacity: 0;
    transition: opacity 120ms ease;
  }

  .drag-preview-overlay[data-visible="true"] {
    opacity: 1;
  }

  .drag-preview-overlay .placeholder-description {
    display: inline-block;
    max-inline-size: 190px;
    padding: 4px 8px;
    border-radius: 10px;
    background: color-mix(in srgb, var(--ui-sortable-surface) 94%, white 6%);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ui-sortable-border) 72%, transparent);
    color: color-mix(in srgb, var(--ui-sortable-text) 84%, var(--ui-sortable-accent));
    font-weight: 500;
  }

  .item[data-disabled="true"] {
    opacity: 0.58;
  }

  .item-content {
    display: grid;
    gap: 4px;
    min-inline-size: 0;
  }

  :host([custom-item-rendering][custom-item-rendering-pending]) {
    visibility: hidden;
  }

  :host([custom-item-rendering][custom-item-rendering-ready]) .item-custom-content {
    display: block;
    min-inline-size: 0;
  }

  :host([custom-item-rendering][custom-item-rendering-ready]) .item-default-content {
    display: none;
  }

  .item-custom-content:empty {
    display: none;
  }

  .item-custom-content:not(:empty) {
    display: block;
    min-inline-size: 0;
  }

  .item-custom-content:not(:empty) + .item-default-content {
    display: none;
  }

  .item-title {
    font-size: 14px;
    line-height: 1.4;
    font-weight: 700;
    color: var(--ui-sortable-text);
    overflow-wrap: anywhere;
  }

  .item-description {
    color: var(--ui-sortable-muted);
    font-size: 12px;
    line-height: 1.55;
    overflow-wrap: anywhere;
  }

  .item-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .item-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--ui-sortable-accent) 10%, transparent);
    color: var(--ui-sortable-muted);
    font-size: 11px;
    font-weight: 600;
  }

  .item-badge[hidden] {
    display: none;
  }

  .item[data-drop-inside-active="true"] .item-badge.drop-badge {
    background: color-mix(in srgb, var(--ui-sortable-accent) 18%, var(--ui-sortable-surface));
    color: color-mix(in srgb, var(--ui-sortable-accent) 78%, var(--ui-sortable-text));
  }

  .item-badge.drop-badge {
    display: none;
  }

  .item[data-drop-inside-active="true"] .item-badge.drop-badge {
    display: inline-flex;
  }

  .handle {
    display: inline-grid;
    place-items: center;
    inline-size: 34px;
    block-size: 34px;
    margin: 0;
    padding: 0;
    border: 1px solid color-mix(in srgb, var(--ui-sortable-border) 86%, transparent);
    border-radius: var(--ui-sortable-handle-radius);
    background: color-mix(in srgb, var(--ui-sortable-surface) 92%, transparent);
    color: var(--ui-sortable-muted);
    cursor: grab;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    transition:
      transform 160ms ease,
      color 160ms ease,
      border-color 160ms ease,
      background 160ms ease;
  }

  .handle:hover {
    color: color-mix(in srgb, var(--ui-sortable-accent) 80%, var(--ui-sortable-text));
    border-color: color-mix(in srgb, var(--ui-sortable-accent) 26%, var(--ui-sortable-border));
    background: color-mix(in srgb, var(--ui-sortable-accent) 8%, var(--ui-sortable-surface));
  }

  .handle:active {
    cursor: grabbing;
    transform: scale(0.96);
  }

  .handle[disabled] {
    cursor: not-allowed;
    opacity: 0.48;
  }

  .handle svg {
    inline-size: 16px;
    block-size: 16px;
  }

  .children {
    display: grid;
    gap: var(--ui-sortable-list-gap);
    padding-inline-start: var(--ui-sortable-indent);
    min-inline-size: 0;
  }

  .dropzone {
    position: relative;
    display: block;
    min-block-size: var(--ui-sortable-dropzone-size);
    min-inline-size: 0;
    border-radius: 999px;
    will-change: opacity, background;
    transition: opacity 140ms ease, background 140ms ease;
  }

  .root[data-dropzone-style="container"] .dropzone {
    display: grid;
    place-items: center;
    min-block-size: var(--ui-sortable-dropzone-match-block-size, var(--ui-sortable-dropzone-container-min-block-size));
    inline-size: min(100%, var(--ui-sortable-dropzone-match-inline-size, 100%));
    max-inline-size: var(--ui-sortable-dropzone-container-max-inline-size, none);
    padding: 12px;
    border: 1px dashed color-mix(in srgb, var(--ui-sortable-accent) 40%, var(--ui-sortable-border));
    border-radius: var(--ui-sortable-item-radius);
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-sortable-accent) 9%, var(--ui-sortable-surface)),
        color-mix(in srgb, var(--ui-sortable-accent) 5%, var(--ui-sortable-surface-muted))
      );
    box-shadow:
      inset 0 0 0 1px color-mix(in srgb, var(--ui-sortable-accent) 12%, transparent),
      0 8px 18px rgba(15, 23, 42, 0.05);
    opacity: 0.82;
    overflow: hidden;
  }

  .list[data-orientation="horizontal"] .dropzone {
    min-block-size: auto;
    min-inline-size: 16px;
    align-self: stretch;
  }

  .root[data-dropzone-style="container"] .list[data-orientation="horizontal"] .dropzone {
    min-block-size: var(--ui-sortable-dropzone-match-block-size, var(--ui-sortable-dropzone-container-min-block-size));
    min-inline-size: var(--ui-sortable-dropzone-match-inline-size, var(--ui-sortable-dropzone-container-min-inline-size));
    inline-size: auto;
    align-self: stretch;
  }

  .dropzone::before {
    content: '';
    position: absolute;
    inset-block-start: 50%;
    inset-inline: 0;
    block-size: 2px;
    transform: translateY(-50%) scaleX(0.42);
    transform-origin: center;
    border-radius: 999px;
    background: color-mix(in srgb, var(--ui-sortable-accent) 22%, transparent);
    transition: transform 160ms ease, background 160ms ease;
  }

  .list[data-orientation="horizontal"] .dropzone::before {
    inset-block: 0;
    inset-inline-start: 50%;
    inset-inline-end: auto;
    inline-size: 2px;
    block-size: 100%;
    transform: translateX(-50%) scaleY(0.24);
  }

  .dropzone[data-active="true"] {
    opacity: 1;
  }

  .root[data-dropzone-style="container"] .dropzone[data-active="true"] {
    border-color: color-mix(in srgb, var(--ui-sortable-accent) 56%, var(--ui-sortable-border));
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-sortable-accent) 14%, var(--ui-sortable-surface)),
        color-mix(in srgb, var(--ui-sortable-accent) 10%, var(--ui-sortable-surface-muted))
      );
    box-shadow:
      inset 0 0 0 1px color-mix(in srgb, var(--ui-sortable-accent) 16%, transparent),
      0 12px 24px rgba(15, 23, 42, 0.08);
  }

  .list[data-orientation="horizontal"] .dropzone[data-active="true"] {
    opacity: 1;
  }

  .dropzone[data-active="true"]::before {
    transform: translateY(-50%) scaleX(1);
    background: color-mix(in srgb, var(--ui-sortable-accent) 86%, var(--ui-sortable-text));
  }

  .list[data-orientation="horizontal"] .dropzone[data-active="true"]::before {
    transform: translateX(-50%) scaleY(1);
  }

  .dropzone[data-mode="inside"] {
    min-block-size: var(--ui-sortable-dropzone-inside-size);
    margin-block-start: -2px;
    padding-inline-start: 6px;
  }

  .root[data-dropzone-style="container"] .dropzone[data-mode="inside"] {
    min-block-size: max(
      calc(var(--ui-sortable-dropzone-match-block-size, var(--ui-sortable-dropzone-container-min-block-size)) * 0.78),
      var(--ui-sortable-dropzone-container-min-block-size)
    );
    margin-block-start: 0;
    padding-inline-start: 12px;
  }

  .dropzone[data-mode="inside"]::before {
    inset-inline-start: 8px;
    inset-inline-end: auto;
    inline-size: 42px;
  }

  .dropzone-label {
    position: absolute;
    inset-block-start: 50%;
    inset-inline-start: 50%;
    inset-inline-end: auto;
    transform: translate(-50%, -50%) scale(0.98);
    padding: 2px 8px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--ui-sortable-surface) 84%, transparent);
    color: var(--ui-sortable-muted);
    font-size: 11px;
    opacity: 0;
    transition: opacity 120ms ease, transform 120ms ease;
    pointer-events: none;
  }

  .root[data-dropzone-style="container"] .dropzone::before {
    display: none;
  }

  .root[data-dropzone-style="container"] .dropzone-label {
    position: static;
    inset: auto;
    transform: none;
    padding: 0;
    border-radius: 0;
    background: transparent;
    color: color-mix(in srgb, var(--ui-sortable-accent) 76%, var(--ui-sortable-text));
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.02em;
    opacity: 1;
    white-space: nowrap;
  }

  .dropzone[data-active="true"] .dropzone-label {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  .root[data-drag-preview="true"] .dropzone-label {
    opacity: 0;
  }

  .root[data-dropzone-style="container"][data-drag-preview="true"] .dropzone-label {
    opacity: 1;
  }

  .root[data-drop-indicator-visibility="active"] .dropzone {
    opacity: 0;
  }

  .root[data-dropzone-style="container"][data-drop-indicator-visibility="active"] .dropzone {
    display: none;
    opacity: 0;
  }

  .root[data-dropzone-style="container"][data-drop-indicator-visibility="active"] .dropzone[data-active="true"] {
    display: grid;
    opacity: 1;
  }

  .root[data-drop-indicator-visibility="active"] .dropzone::before {
    background: transparent;
    transform: translateY(-50%) scaleX(0.16);
  }

  .root[data-drop-indicator-visibility="active"] .list[data-orientation="horizontal"] .dropzone::before {
    transform: translateX(-50%) scaleY(0.16);
  }

  .root[data-drop-indicator-visibility="active"] .dropzone[data-active="true"] {
    opacity: 1;
  }

  .root[data-drop-indicator-visibility="active"] .dropzone[data-active="true"]::before {
    transform: translateY(-50%) scaleX(1);
    background: color-mix(in srgb, var(--ui-sortable-accent) 86%, var(--ui-sortable-text));
  }

  .root[data-drop-indicator-visibility="active"] .list[data-orientation="horizontal"] .dropzone[data-active="true"]::before {
    transform: translateX(-50%) scaleY(1);
  }

  .root[data-drop-indicator-visibility="active"] .dropzone[data-active="true"] .dropzone-label {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  .sr-only {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .item,
    .handle,
    .dropzone,
    .dropzone::before,
    .dropzone-label {
      transition: none;
    }
  }

  @media (forced-colors: active) {
    .list,
    .item,
    .handle {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
    }

    .dropzone::before {
      background: Highlight;
    }
  }
`;

function parseJsonArray<T>(value: string | null): T[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function keyForGroup(listId: string, parentId: string | null): string {
  return `${listId}::${parentId ?? '__root__'}`;
}

function dropTargetKey(target: DropTarget | null): string {
  if (!target) return '';
  return [target.listId, target.parentId ?? '', target.beforeId ?? '', target.mode].join('::');
}

function sameDropTarget(left: DropTarget | null, right: DropTarget | null): boolean {
  return dropTargetKey(left) === dropTargetKey(right);
}

function readScaleFromTransform(transform: string): { x: number; y: number } {
  if (!transform || transform === 'none') {
    return { x: 1, y: 1 };
  }

  const matrix3d = transform.match(/^matrix3d\((.+)\)$/);
  if (matrix3d) {
    const values = matrix3d[1].split(',').map((value) => Number.parseFloat(value.trim()));
    if (values.length === 16 && values.every((value) => Number.isFinite(value))) {
      return {
        x: values[0] || 1,
        y: values[5] || 1,
      };
    }
  }

  const matrix = transform.match(/^matrix\((.+)\)$/);
  if (matrix) {
    const values = matrix[1].split(',').map((value) => Number.parseFloat(value.trim()));
    if (values.length === 6 && values.every((value) => Number.isFinite(value))) {
      const [a, b, c, d] = values;
      return {
        x: Math.sqrt((a * a) + (b * b)) || 1,
        y: Math.sqrt((c * c) + (d * d)) || 1,
      };
    }
  }

  return { x: 1, y: 1 };
}

function parseDragHandleMode(value: string | null): UISortableDragHandleMode {
  return value === 'item' ? 'item' : 'handle';
}

function cloneItem(item: NormalizedItem): NormalizedItem {
  return { ...item };
}

function projectMoveItems(
  items: NormalizedItem[],
  lists: NormalizedList[],
  target: DropTarget,
  movedRootIds: string[],
  clone: boolean,
  cloneFactory: (item: NormalizedItem, orderedMovingIds: string[]) => NormalizedItem
): ProjectedMoveResult {
  const itemMap = buildItemMap(items);
  const groups = buildChildrenMap(items);
  const movingSet = new Set<string>();
  const orderedMovingIds: string[] = [];

  const collect = (id: string) => {
    const item = itemMap.get(id);
    if (!item || movingSet.has(id)) return;
    movingSet.add(id);
    orderedMovingIds.push(id);
    (groups.get(keyForGroup(item.listId, id)) || []).forEach(collect);
  };
  movedRootIds.forEach(collect);

  const orderedItems = items.map(cloneItem);
  const movingItems = orderedItems.filter((item) => movingSet.has(item.id));
  const remainingItems = clone
    ? orderedItems.map(cloneItem)
    : orderedItems.filter((item) => !movingSet.has(item.id));
  const nextItems = clone ? movingItems.map((item) => cloneFactory(item, orderedMovingIds)) : movingItems.map(cloneItem);
  const idMap = new Map<string, string>();
  const cloneSourceById = new Map<string, string>();

  if (clone) {
    movingItems.forEach((item, index) => {
      idMap.set(item.id, nextItems[index].id);
      cloneSourceById.set(nextItems[index].id, item.id);
    });
  }

  nextItems.forEach((item) => {
    const originalId = clone ? cloneSourceById.get(item.id) : item.id;
    const original = originalId ? itemMap.get(originalId) : null;
    if (!original) return;
    if (clone) {
      item.parentId = original.parentId && idMap.has(original.parentId) ? idMap.get(original.parentId) || null : null;
    }
    item.listId = target.listId;
  });

  const rootIdsForInsert = movedRootIds.map((id) => idMap.get(id) || id);
  const combinedItems = [...remainingItems, ...nextItems];
  const groupOrders = buildChildrenMap(remainingItems);
  const insertedGroupKey = keyForGroup(target.listId, target.parentId);
  const targetGroup = [...(groupOrders.get(insertedGroupKey) || [])];
  const insertionIndex = target.beforeId ? targetGroup.indexOf(target.beforeId) : targetGroup.length;
  const safeIndex = insertionIndex >= 0 ? insertionIndex : targetGroup.length;
  targetGroup.splice(safeIndex, 0, ...rootIdsForInsert);
  groupOrders.set(insertedGroupKey, targetGroup);

  const movingGroups = buildChildrenMap(nextItems);
  movingGroups.forEach((ids, key) => {
    const [, parentToken] = key.split('::');
    if ((parentToken || '') === '__root__') return;
    groupOrders.set(key, [...ids]);
  });

  const combinedMap = buildItemMap(combinedItems);
  rootIdsForInsert.forEach((rootId) => {
    const rootItem = combinedMap.get(rootId);
    if (!rootItem) return;
    rootItem.parentId = target.parentId;
    rootItem.listId = target.listId;
  });

  const ordered: NormalizedItem[] = [];
  const visited = new Set<string>();
  const walk = (listId: string, parentId: string | null) => {
    const ids = groupOrders.get(keyForGroup(listId, parentId)) || [];
    ids.forEach((id, index) => {
      const item = combinedMap.get(id);
      if (!item || visited.has(id)) return;
      visited.add(id);
      item.listId = listId;
      item.parentId = parentId;
      item.order = index;
      ordered.push(item);
      walk(listId, id);
    });
  };

  lists.forEach((list) => walk(list.id, null));
  combinedItems.forEach((item) => {
    if (visited.has(item.id)) return;
    item.parentId = null;
    ordered.push(item);
  });

  return {
    items: ordered.map(cloneItem),
    insertedRootIds: rootIdsForInsert,
  };
}

function buildChildrenMap(items: NormalizedItem[]): Map<string, string[]> {
  const groups = new Map<string, string[]>();
  items.forEach((item) => {
    const key = keyForGroup(item.listId, item.parentId);
    const bucket = groups.get(key);
    if (bucket) bucket.push(item.id);
    else groups.set(key, [item.id]);
  });
  return groups;
}

function buildItemMap(items: NormalizedItem[]): Map<string, NormalizedItem> {
  return new Map(items.map((item) => [item.id, item]));
}

function canonicalizeLists(rawLists: UISortableList[]): NormalizedList[] {
  const seen = new Set<string>();
  const normalized: NormalizedList[] = [];

  rawLists.forEach((list, index) => {
    const id = typeof list?.id === 'string' && list.id.trim() ? list.id.trim() : `list-${index + 1}`;
    if (seen.has(id)) return;
    seen.add(id);
    normalized.push({
      id,
      label: typeof list?.label === 'string' && list.label.trim() ? list.label.trim() : `List ${index + 1}`,
      description: typeof list?.description === 'string' ? list.description : '',
      emptyLabel: typeof list?.emptyLabel === 'string' && list.emptyLabel.trim()
        ? list.emptyLabel.trim()
        : 'Drop items here.',
      orientation: list?.orientation === 'horizontal' ? 'horizontal' : 'vertical',
      disabled: !!list?.disabled,
      cloneOnDrag: !!list?.cloneOnDrag,
      accepts: Array.isArray(list?.accepts)
        ? list.accepts.filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
        : undefined,
    });
  });

  if (normalized.length) return normalized;

  return [{
    id: 'default',
    label: 'Items',
    description: '',
    emptyLabel: 'Drop items here.',
    orientation: 'vertical',
    disabled: false,
    cloneOnDrag: false,
  }];
}

function normalizeItems(lists: NormalizedList[], rawItems: UISortableItem[]): NormalizedItem[] {
  const listIds = new Set(lists.map((list) => list.id));
  const normalized: NormalizedItem[] = [];

  rawItems.forEach((item, index) => {
    const id = typeof item?.id === 'string' && item.id.trim() ? item.id.trim() : '';
    const label = typeof item?.label === 'string' && item.label.trim() ? item.label.trim() : '';
    if (!id || !label) return;
    const listId = typeof item?.listId === 'string' && listIds.has(item.listId) ? item.listId : lists[0].id;
    normalized.push({
      id,
      label,
      listId,
      parentId: typeof item?.parentId === 'string' && item.parentId.trim() ? item.parentId.trim() : null,
      description: typeof item?.description === 'string' ? item.description : '',
      order: Number.isFinite(item?.order) ? Number(item.order) : index,
      disabled: !!item?.disabled,
      dragDisabled: !!item?.dragDisabled,
      cloneOnDrag: !!item?.cloneOnDrag,
      hidden: !!item?.hidden,
    });
  });

  const itemMap = new Map(normalized.map((item) => [item.id, item]));
  normalized.forEach((item) => {
    if (!item.parentId) return;
    const parent = itemMap.get(item.parentId);
    if (!parent || parent.id === item.id || parent.listId !== item.listId) {
      item.parentId = null;
    }
  });

  const groups = new Map<string, NormalizedItem[]>();
  normalized.forEach((item) => {
    const key = keyForGroup(item.listId, item.parentId);
    const bucket = groups.get(key);
    if (bucket) bucket.push(item);
    else groups.set(key, [item]);
  });
  groups.forEach((bucket) => bucket.sort((a, b) => a.order - b.order || a.label.localeCompare(b.label)));

  const ordered: NormalizedItem[] = [];
  const visited = new Set<string>();

  const walk = (listId: string, parentId: string | null) => {
    const bucket = groups.get(keyForGroup(listId, parentId)) || [];
    bucket.forEach((item, index) => {
      if (visited.has(item.id)) return;
      visited.add(item.id);
      item.order = index;
      ordered.push(item);
      walk(listId, item.id);
    });
  };

  lists.forEach((list) => walk(list.id, null));

  normalized.forEach((item) => {
    if (visited.has(item.id)) return;
    item.parentId = null;
    ordered.push(item);
  });

  return ordered.map(cloneItem);
}

function serializeItems(items: NormalizedItem[]): string {
  return JSON.stringify(items.map((item) => ({
    id: item.id,
    label: item.label,
    listId: item.listId,
    parentId: item.parentId,
    description: item.description,
    order: item.order,
    disabled: item.disabled,
    dragDisabled: item.dragDisabled,
    cloneOnDrag: item.cloneOnDrag,
    hidden: item.hidden,
  })));
}

function serializeLists(lists: NormalizedList[]): string {
  return JSON.stringify(lists.map((list) => ({
    id: list.id,
    label: list.label,
    description: list.description,
    emptyLabel: list.emptyLabel,
    orientation: list.orientation,
    disabled: list.disabled,
    cloneOnDrag: list.cloneOnDrag,
    accepts: list.accepts,
  })));
}

function serializeSelection(selection: string[]): string {
  return JSON.stringify(selection);
}

function getPersistenceSnapshot(items: NormalizedItem[]): UISortablePersistenceSnapshot {
  const groups = new Map<string, number>();
  const records = items.map((item) => {
    const key = keyForGroup(item.listId, item.parentId);
    const index = groups.get(key) ?? 0;
    groups.set(key, index + 1);
    return {
      id: item.id,
      listId: item.listId,
      parentId: item.parentId,
      index,
    };
  });

  return {
    version: STORAGE_VERSION,
    records,
  };
}

function matchesFilter(item: NormalizedItem, query: string): boolean {
  if (!query) return true;
  const text = `${item.label} ${item.description}`.toLowerCase();
  return text.includes(query.toLowerCase());
}

function buildRenderRecords(
  items: NormalizedItem[],
  selection: Set<string>,
  dragging: Set<string>,
  filterQuery: string,
  sortMode: UISortableSortMode
): Map<string, RenderRecord[]> {
  const itemMap = buildItemMap(items);
  const groups = buildChildrenMap(items);
  const records = new Map<string, RenderRecord[]>();

  const sortedChildren = (listId: string, parentId: string | null): string[] => {
    const ids = [...(groups.get(keyForGroup(listId, parentId)) || [])];
    if (sortMode === 'label') {
      ids.sort((leftId, rightId) => {
        const left = itemMap.get(leftId);
        const right = itemMap.get(rightId);
        if (!left || !right) return 0;
        return left.label.localeCompare(right.label);
      });
    }
    return ids;
  };

  const walk = (listId: string, parentId: string | null, depth: number): RenderRecord[] => {
    const bucket: RenderRecord[] = [];
    sortedChildren(listId, parentId).forEach((id) => {
      const item = itemMap.get(id);
      if (!item || item.hidden) return;
      const childRecords = walk(listId, item.id, depth + 1);
      const visibleSelf = matchesFilter(item, filterQuery);
      if (!visibleSelf && childRecords.length === 0) return;
      bucket.push({
        id: item.id,
        disabled: item.disabled,
      });
      if (childRecords.length) bucket.push(...childRecords);
    });
    return bucket;
  };

  const listIds = Array.from(new Set(items.map((item) => item.listId)));
  listIds.forEach((listId) => {
    records.set(listId, walk(listId, null, 0));
  });

  return records;
}
export class UISortable extends ElementBase {
  static get observedAttributes() {
    return [
      'lists',
      'items',
      'selection',
      'filter-query',
      'sort',
      'persist-key',
      'allow-filtered-drag',
      'allow-nesting',
      'drop-indicator-visibility',
      'dropzone-style',
      'drag-preview-size',
      'drag-handle-mode',
      'drag-handle-selector',
      'custom-item-rendering',
      'show-selection-badge',
      'disabled',
    ];
  }

  private _lists: NormalizedList[] = canonicalizeLists([]);
  private _items: NormalizedItem[] = [];
  private _selection: string[] = [];
  private _focusedId: string | null = null;
  private _rangeAnchorId: string | null = null;
  private _dragState: DragState | null = null;
  private _liveMessage = 'Sortable list ready.';
  private _lastListsAttr: string | null = null;
  private _lastItemsAttr: string | null = null;
  private _lastSelectionAttr: string | null = null;
  private _hydratedPersistKey: string | null = null;
  private _cloneSeed = 1;
  private _dragImage: HTMLElement | null = null;
  private _dragPreviewOverlay: HTMLElement | null = null;
  private _pendingFocusId: string | null = null;
  private _pointerGesture: PointerGestureState | null = null;
  private _pendingDropTarget: DropTargetCandidate | null = null;
  private _suppressAttributeRender = false;

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onDragStart = this._onDragStart.bind(this);
    this._onDragOver = this._onDragOver.bind(this);
    this._onDrop = this._onDrop.bind(this);
    this._onDragEnd = this._onDragEnd.bind(this);
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);
    this._onPointerCancel = this._onPointerCancel.bind(this);
    this._onFocusIn = this._onFocusIn.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  }

  protected override shouldRenderOnAttributeChange(
    name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    if (!this._suppressAttributeRender) return true;
    return !['lists', 'items', 'selection'].includes(name);
  }

  override attributeChangedCallback(name?: string, oldValue?: string | null, newValue?: string | null): void {
    if (oldValue === newValue) return;
    if (!this.isConnected) return;

    if (name === 'selection' && !this._suppressAttributeRender && this._canSyncInteractiveStateInPlace()) {
      this._syncSelectionFromAttribute(newValue ?? null);
      this._syncSelectionVisualState();
      return;
    }

    if (name === 'show-selection-badge' && this._canSyncInteractiveStateInPlace()) {
      this._syncSelectionVisualState();
      return;
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('click', this._onClick);
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);
    this.root.addEventListener('dragstart', this._onDragStart as EventListener);
    this.root.addEventListener('dragover', this._onDragOver as EventListener);
    this.root.addEventListener('drop', this._onDrop as EventListener);
    this.root.addEventListener('dragend', this._onDragEnd as EventListener);
    this.root.addEventListener('pointerdown', this._onPointerDown as EventListener);
    this.root.addEventListener('focusin', this._onFocusIn);
    this.ownerDocument?.addEventListener('keydown', this._onDocumentKeyDown as EventListener, true);
    this.ownerDocument?.addEventListener('pointermove', this._onPointerMove as EventListener, true);
    this.ownerDocument?.addEventListener('pointerup', this._onPointerUp as EventListener, true);
    this.ownerDocument?.addEventListener('pointercancel', this._onPointerCancel as EventListener, true);
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onClick);
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    this.root.removeEventListener('dragstart', this._onDragStart as EventListener);
    this.root.removeEventListener('dragover', this._onDragOver as EventListener);
    this.root.removeEventListener('drop', this._onDrop as EventListener);
    this.root.removeEventListener('dragend', this._onDragEnd as EventListener);
    this.root.removeEventListener('pointerdown', this._onPointerDown as EventListener);
    this.root.removeEventListener('focusin', this._onFocusIn);
    this.ownerDocument?.removeEventListener('keydown', this._onDocumentKeyDown as EventListener, true);
    this.ownerDocument?.removeEventListener('pointermove', this._onPointerMove as EventListener, true);
    this.ownerDocument?.removeEventListener('pointerup', this._onPointerUp as EventListener, true);
    this.ownerDocument?.removeEventListener('pointercancel', this._onPointerCancel as EventListener, true);
    this._removeDragPreviewOverlay();
    this._removeDragImage();
    super.disconnectedCallback();
  }

  get lists(): UISortableList[] {
    return this._lists.map((list) => ({ ...list }));
  }

  set lists(next: UISortableList[]) {
    this.setAttribute('lists', JSON.stringify(next ?? []));
  }

  get items(): UISortableItem[] {
    return this._items.map((item) => ({ ...item }));
  }

  set items(next: UISortableItem[]) {
    this.setAttribute('items', JSON.stringify(next ?? []));
  }

  get selection(): string[] {
    return [...this._selection];
  }

  set selection(next: string[]) {
    this.setAttribute('selection', JSON.stringify(next ?? []));
  }

  get sort(): UISortableSortMode {
    return this.getAttribute('sort') === 'label' ? 'label' : 'manual';
  }

  set sort(next: UISortableSortMode) {
    if (!next || next === 'manual') this.removeAttribute('sort');
    else this.setAttribute('sort', next);
  }

  get filterQuery(): string {
    return this.getAttribute('filter-query') || '';
  }

  set filterQuery(next: string) {
    if (!next) this.removeAttribute('filter-query');
    else this.setAttribute('filter-query', next);
  }

  select(ids: string[]): void {
    this._setSelection(ids, 'api');
  }

  clearSelection(): void {
    this._setSelection([], 'api');
  }

  cancelDrag(): void {
    this._cancelDrag(true);
  }

  focusItem(id: string): void {
    if (!this._items.some((item) => item.id === id)) return;
    this._focusedId = id;
    this._pendingFocusId = id;
    if (this._applyInteractiveStateInPlace({ restoreFocus: true })) return;
    this.requestRender();
  }

  moveSelection(options: UISortableMoveOptions): void {
    const movedRootIds = this._selectedRootIds();
    if (!movedRootIds.length) return;
    this._commitMove({
      listId: options.targetListId,
      parentId: options.parentId ?? null,
      beforeId: options.beforeId ?? null,
      mode: options.mode ?? (options.parentId ? 'inside' : 'before'),
    }, movedRootIds, !!options.clone, options.source ?? 'api');
  }

  getPersistenceSnapshot(): UISortablePersistenceSnapshot {
    return getPersistenceSnapshot(this._items);
  }

  protected override render(): void {
    this._syncStateFromAttributes();
    const previousRects = this._measureItemShellRects();

    const draggingIds = new Set(this._draggingIds());
    const selection = new Set(this._selection);
    const useProjectedPreview = !!this._dragState?.keyboard;
    const projectedMove = useProjectedPreview ? this._projectedMoveResult() : null;
    const renderItems = projectedMove?.items || this._items;
    const placeholderIds = new Set(projectedMove?.insertedRootIds || []);
    const pointerPreviewActive = !!this._dragState && !this._dragState.keyboard && !!this._dragState.dropTarget;
    const recordsByList = buildRenderRecords(renderItems, selection, draggingIds, this.filterQuery, this.sort);
    const focusedId = this._resolvedFocusedId(recordsByList);
    const dragLocked = this._isDragLocked();
    const selectionCount = this._selection.length;
    const allowNesting = this.getAttribute('allow-nesting') !== 'false';
    const dropIndicatorVisibility = this.getAttribute('drop-indicator-visibility') === 'always' ? 'always' : 'active';
    const dropzoneStyle = this._dropzoneStyle();
    const showSelectionBadge = this.getAttribute('show-selection-badge') !== 'false';
    const dragHandleMode = this._dragHandleMode();
    const usesCustomHandleSelector = this._usesCustomHandleSelector();

    const helper = dragLocked
      ? this.sort === 'label'
        ? 'Dragging is paused while alphabetical sorting is active.'
        : this.filterQuery && !this.hasAttribute('allow-filtered-drag')
          ? 'Dragging is paused while the list is filtered.'
          : 'Dragging is currently disabled.'
      : this._dragState?.keyboard
        ? 'Keyboard drag active. Use arrow keys to choose a drop target, Space or Enter to drop, and Escape to cancel.'
        : dragHandleMode === 'item'
          ? 'Drag from anywhere on an item, or press Space on a focused item to start keyboard reordering.'
          : usesCustomHandleSelector
            ? 'Use your custom drag handle element, or press Space on a focused item to start keyboard reordering.'
            : 'Use the handle to drag, or press Space on a focused item to start keyboard reordering.';

    const html = `
      <style>${style}</style>
      <div
        class="root"
        part="root"
        data-drag-locked="${dragLocked}"
        data-drag-preview="${placeholderIds.size || pointerPreviewActive ? 'true' : 'false'}"
        data-drop-indicator-visibility="${dropIndicatorVisibility}"
        data-dropzone-style="${dropzoneStyle}"
      >
        <div class="toolbar" part="toolbar">
          <div class="helper">${escapeHtml(helper)}</div>
          <div class="helper selection-summary">
            <span class="selection-pill" part="selection-count">${selectionCount}</span>
            <span class="selection-text">${selectionCount === 1 ? 'item selected' : 'items selected'}</span>
          </div>
        </div>
        <div class="lists" part="lists">
          ${this._lists.map((list) => {
            const records = recordsByList.get(list.id) || [];
            const content = records.length
              ? this._renderListTree(renderItems, list, focusedId, draggingIds, allowNesting, placeholderIds, showSelectionBadge)
              : '';
            const helperText = list.disabled
              ? 'This list is read-only.'
              : list.cloneOnDrag
                ? 'Dragging from this list creates a copy.'
                : list.accepts?.length
                  ? `Accepts drops from: ${list.accepts.join(', ')}`
                  : '';
            return `
              <section
                class="list"
                part="list"
                data-list-id="${escapeHtml(list.id)}"
                data-orientation="${list.orientation}"
                data-disabled="${list.disabled}"
                aria-label="${escapeHtml(list.label)}"
              >
                <header class="list-header">
                  <div class="list-custom-header" part="list-custom-header" data-list-header-target="${escapeHtml(list.id)}"></div>
                  <div class="list-default-header">
                    <div class="list-topline">
                      <div class="list-label">${escapeHtml(list.label)}</div>
                      <span class="list-count">${records.length}</span>
                    </div>
                    ${list.description ? `<div class="list-description">${escapeHtml(list.description)}</div>` : ''}
                    ${helperText ? `<div class="list-helper">${escapeHtml(helperText)}</div>` : ''}
                  </div>
                </header>
                <div class="items" role="listbox" aria-multiselectable="true">
                  ${content || `<div class="list-custom-empty" part="list-custom-empty" data-list-empty-target="${escapeHtml(list.id)}"></div><div class="empty">${escapeHtml(list.emptyLabel)}</div>${this._renderDropzone({
                    listId: list.id,
                    parentId: null,
                    beforeId: null,
                    mode: 'before',
                  }, 'Drop here')}`}
                </div>
              </section>
            `;
          }).join('')}
        </div>
        <div class="sr-only" aria-live="polite" aria-atomic="true">${escapeHtml(this._liveMessage)}</div>
      </div>
    `;

    this.setContent(html);
    queueMicrotask(() => {
      this._restorePendingFocus();
      this._applyCurrentDropTargetVisualState();
      this._applyLiveMessage();
      this._updatePointerDragPreview();
      this._animateItemShellReflow(previousRects);
    });
  }

  private _syncStateFromAttributes(): void {
    const listsAttr = this.getAttribute('lists');
    if (listsAttr !== this._lastListsAttr) {
      this._lastListsAttr = listsAttr;
      this._lists = canonicalizeLists(parseJsonArray<UISortableList>(listsAttr));
    }

    const itemsAttr = this.getAttribute('items');
    if (itemsAttr !== this._lastItemsAttr) {
      this._lastItemsAttr = itemsAttr;
      this._items = normalizeItems(this._lists, parseJsonArray<UISortableItem>(itemsAttr));
      const persistKey = this.getAttribute('persist-key');
      if (persistKey && this._hydratedPersistKey !== persistKey) {
        this._items = this._restorePersistedItems(persistKey, this._items);
        this._hydratedPersistKey = persistKey;
      }
    }

    const selectionAttr = this.getAttribute('selection');
    if (selectionAttr !== this._lastSelectionAttr) {
      this._syncSelectionFromAttribute(selectionAttr);
    }

    if (!this._focusedId) {
      this._focusedId = this._items.find((item) => !item.hidden)?.id || null;
    }
  }

  private _restorePersistedItems(persistKey: string, items: NormalizedItem[]): NormalizedItem[] {
    try {
      const raw = window.localStorage.getItem(persistKey);
      if (!raw) return items;
      const parsed = JSON.parse(raw) as UISortablePersistenceSnapshot | null;
      if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.records)) return items;
      const recordMap = new Map(parsed.records.map((record) => [record.id, record]));
      const merged = items.map((item, index) => {
        const persisted = recordMap.get(item.id);
        if (!persisted) return { ...item, order: index };
        return {
          ...item,
          listId: this._lists.some((list) => list.id === persisted.listId) ? persisted.listId : item.listId,
          parentId: typeof persisted.parentId === 'string' ? persisted.parentId : null,
          order: Number.isFinite(persisted.index) ? persisted.index : index,
        };
      });
      return normalizeItems(this._lists, merged);
    } catch {
      return items;
    }
  }

  private _resolvedFocusedId(recordsByList: Map<string, RenderRecord[]>): string | null {
    const visibleIds = new Set(Array.from(recordsByList.values()).flat().map((record) => record.id));
    if (this._focusedId && visibleIds.has(this._focusedId)) return this._focusedId;
    const first = Array.from(recordsByList.values()).flat().find((record) => !record.disabled);
    return first?.id || null;
  }

  private _restorePendingFocus(): void {
    const id = this._pendingFocusId || this._focusedId;
    if (!id) return;
    const escapeSelector = typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
      ? CSS.escape(id)
      : id.replace(/"/g, '\\"');
    const target = this.root.querySelector<HTMLElement>(`.item[data-id="${escapeSelector}"]`);
    if (!target) return;
    if (document.activeElement !== target) {
      target.focus({ preventScroll: true });
    }
    this._pendingFocusId = null;
  }

  private _escapeSelectorValue(value: string): string {
    if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
      return CSS.escape(value);
    }
    return value.replace(/"/g, '\\"');
  }

  private _findDropzone(target: DropTarget): HTMLElement | null {
    const listId = this._escapeSelectorValue(target.listId);
    const parentId = this._escapeSelectorValue(target.parentId ?? '');
    const beforeId = this._escapeSelectorValue(target.beforeId ?? '');
    const mode = this._escapeSelectorValue(target.mode);
    return this.root.querySelector<HTMLElement>(
      `.dropzone[data-list-id="${listId}"][data-parent-id="${parentId}"][data-before-id="${beforeId}"][data-mode="${mode}"]`
    );
  }

  private _findItemElement(id: string): HTMLElement | null {
    const escaped = this._escapeSelectorValue(id);
    return this.root.querySelector<HTMLElement>(`.item[data-id="${escaped}"]`);
  }

  private _dragHandleMode(): UISortableDragHandleMode {
    return parseDragHandleMode(this.getAttribute('drag-handle-mode'));
  }

  private _dropzoneStyle(): UISortableDropzoneStyle {
    return this.getAttribute('dropzone-style') === 'container' ? 'container' : 'indicator';
  }

  private _usesCustomHandleSelector(): boolean {
    return !!this.getAttribute('drag-handle-selector')?.trim();
  }

  private _dragActivatorFromPath(pathLike: EventTarget[]): DragActivator | null {
    const activator = pathLike.find((node): node is HTMLElement => (
      node instanceof HTMLElement && !!node.getAttribute('data-drag-trigger')
    ));
    if (!activator) return null;

    const kindAttr = activator.getAttribute('data-drag-trigger');
    const kind = kindAttr === 'item' ? 'item' : kindAttr === 'custom' ? 'custom' : 'handle';
    const id = activator.getAttribute('data-id')
      || activator.closest<HTMLElement>('.item[data-id]')?.getAttribute('data-id');

    if (!id) return null;

    return { element: activator, id, kind };
  }

  private _setDropTargetVisualState(target: DropTarget | null, active: boolean): void {
    if (!target) return;
    const zone = this._findDropzone(target);
    if (zone) {
      zone.setAttribute('data-active', active ? 'true' : 'false');
      if (active) this._syncDropzoneContainerSize(zone, target);
      else this._clearDropzoneContainerSize(zone);
    }
    if (target.mode === 'inside' && target.parentId) {
      this._findItemElement(target.parentId)?.setAttribute('data-drop-inside-active', active ? 'true' : 'false');
    }
  }

  private _applyCurrentDropTargetVisualState(previousTarget?: DropTarget | null): void {
    this._setDropTargetVisualState(previousTarget ?? null, false);
    this._setDropTargetVisualState(this._dragState?.dropTarget ?? null, true);
  }

  private _applyLiveMessage(): void {
    const live = this.root.querySelector<HTMLElement>('.sr-only[aria-live]');
    if (live) live.textContent = this._liveMessage;
  }

  private _canSyncInteractiveStateInPlace(): boolean {
    return !!this.root.querySelector('.root') && !this._dragState;
  }

  private _applyInteractiveStateInPlace(options?: { restoreFocus?: boolean }): boolean {
    if (!this._canSyncInteractiveStateInPlace()) return false;
    this._syncSelectionVisualState();
    if (options?.restoreFocus) this._restorePendingFocus();
    this._applyLiveMessage();
    return true;
  }

  private _hasCustomItemRendering(): boolean {
    return this.hasAttribute('custom-item-rendering');
  }

  private _syncSelectionFromAttribute(selectionAttr: string | null): void {
    this._lastSelectionAttr = selectionAttr;
    const availableIds = new Set(this._items.map((item) => item.id));
    this._selection = parseJsonArray<string>(selectionAttr).filter((id) => availableIds.has(id));
    if (!this._selection.length && this._focusedId && !availableIds.has(this._focusedId)) {
      this._focusedId = null;
    }
  }

  private _syncSelectionVisualState(): void {
    const selectedIds = new Set(this._selection);
    const showSelectionBadge = this.getAttribute('show-selection-badge') !== 'false';
    this.root.querySelectorAll<HTMLElement>('.item[data-id]').forEach((itemEl) => {
      const id = itemEl.getAttribute('data-id');
      if (!id) return;
      const selected = selectedIds.has(id);
      const focused = this._focusedId === id;
      itemEl.setAttribute('data-selected', selected ? 'true' : 'false');
      itemEl.setAttribute('aria-selected', selected ? 'true' : 'false');
      itemEl.setAttribute('data-focused', focused ? 'true' : 'false');
      itemEl.setAttribute('tabindex', focused ? '0' : '-1');
      const selectionBadge = itemEl.querySelector<HTMLElement>('[data-selection-badge="true"]');
      if (selectionBadge) {
        const visible = selected && showSelectionBadge;
        selectionBadge.hidden = !visible;
        selectionBadge.textContent = visible ? 'Selected' : '';
      }
    });

    const selectionPill = this.root.querySelector<HTMLElement>('.selection-pill');
    if (selectionPill) selectionPill.textContent = String(this._selection.length);

    const selectionText = this.root.querySelector<HTMLElement>('.selection-text');
    if (selectionText) {
      selectionText.textContent = this._selection.length === 1 ? 'item selected' : 'items selected';
    }
  }

  private _clearDropzoneContainerSize(zone: HTMLElement): void {
    zone.style.removeProperty('--ui-sortable-dropzone-match-block-size');
    zone.style.removeProperty('--ui-sortable-dropzone-match-inline-size');
  }

  private _dropzoneReferenceElement(target: DropTarget, zone: HTMLElement): HTMLElement | null {
    if (target.mode === 'inside' && target.parentId) return this._findItemElement(target.parentId);

    let next = zone.nextElementSibling;
    while (next) {
      if (next instanceof HTMLElement && next.classList.contains('item-shell')) {
        return next.querySelector<HTMLElement>('.item[data-id]');
      }
      next = next.nextElementSibling;
    }

    let previous = zone.previousElementSibling;
    while (previous) {
      if (previous instanceof HTMLElement && previous.classList.contains('item-shell')) {
        return previous.querySelector<HTMLElement>('.item[data-id]');
      }
      previous = previous.previousElementSibling;
    }

    const listId = this._escapeSelectorValue(target.listId);
    const listItems = this.root.querySelector<HTMLElement>(`.list[data-list-id="${listId}"] .items`);
    const firstItem = listItems?.querySelector<HTMLElement>('.item[data-id]');
    if (firstItem) return firstItem;

    return listItems || null;
  }

  private _syncDropzoneContainerSize(zone: HTMLElement, target: DropTarget): void {
    this._clearDropzoneContainerSize(zone);
    if (this._dropzoneStyle() !== 'container') return;

    const reference = this._dropzoneReferenceElement(target, zone);
    if (!reference) return;
    const rect = reference.getBoundingClientRect();
    zone.style.setProperty('--ui-sortable-dropzone-match-block-size', `${Math.max(76, Math.round(rect.height))}px`);
    zone.style.setProperty('--ui-sortable-dropzone-match-inline-size', `${Math.max(180, Math.round(rect.width))}px`);
  }

  private _ensureDragPreviewOverlay(): HTMLElement {
    if (this._dragPreviewOverlay && this._dragPreviewOverlay.isConnected) return this._dragPreviewOverlay;
    const overlay = document.createElement('div');
    overlay.className = 'drag-preview-overlay';
    overlay.setAttribute('data-visible', 'false');
    this.root.appendChild(overlay);
    this._dragPreviewOverlay = overlay;
    return overlay;
  }

  private _clearPointerDragPreview(): void {
    this._dragPreviewOverlay?.setAttribute('data-visible', 'false');
    this._dragPreviewOverlay?.style.setProperty('left', '-9999px');
    this._dragPreviewOverlay?.style.setProperty('top', '-9999px');
    const rootEl = this.root.querySelector<HTMLElement>('.root');
    if (rootEl && !this._dragState?.keyboard) {
      rootEl.setAttribute('data-drag-preview', 'false');
    }
  }

  private _pointerPreviewContent(): { kicker: string; title: string; description: string } | null {
    if (!this._dragState || this._dragState.keyboard) return null;
    const firstMovedId = this._dragState.movedRootIds[0];
    const item = this._items.find((entry) => entry.id === firstMovedId);
    if (!item) return null;
    return {
      kicker: this._dragState.clone ? 'Copy preview' : 'Drop preview',
      title: this._dragState.clone ? `${item.label} copy` : item.label,
      description: this._dragState.clone
        ? 'Release to add a copy here.'
        : this._dragState.movedRootIds.length > 1
          ? 'Release to place this selection here.'
        : 'Release to place this item here.',
    };
  }

  private _pointerPreviewSize(): { width: number; height: number } | null {
    if (this.getAttribute('drag-preview-size') === 'compact') return null;
    if (!this._dragState || this._dragState.keyboard) return null;
    const firstMovedId = this._dragState.movedRootIds[0];
    const itemEl = firstMovedId ? this._findItemElement(firstMovedId) : null;
    if (!itemEl) return null;
    const computedStyle = window.getComputedStyle(itemEl);
    const scale = readScaleFromTransform(computedStyle.transform);
    return {
      width: itemEl.offsetWidth * scale.x,
      height: itemEl.offsetHeight * scale.y,
    };
  }

  private _updatePointerDragPreview(): void {
    if (!this._dragState || this._dragState.keyboard) {
      this._clearPointerDragPreview();
      return;
    }

    const preview = this._pointerPreviewContent();
    if (!preview) {
      this._clearPointerDragPreview();
      return;
    }

    const rootEl = this.root.querySelector<HTMLElement>('.root');
    const overlay = this._dragPreviewOverlay;
    const overlayVisible = overlay?.getAttribute('data-visible') === 'true';
    const previewSize = this._pointerPreviewSize();

    if (!this._dragState.dropTarget) {
      if (overlayVisible && rootEl) rootEl.setAttribute('data-drag-preview', 'true');
      return;
    }

    const targetEl = this._findDropzone(this._dragState.dropTarget);
    if (!targetEl) {
      if (overlayVisible && rootEl) rootEl.setAttribute('data-drag-preview', 'true');
      return;
    }

    const nextOverlay = this._ensureDragPreviewOverlay();
    nextOverlay.innerHTML = `
      <div class="placeholder-content">
        <div class="placeholder-kicker">${escapeHtml(preview.kicker)}</div>
        <div class="placeholder-title">${escapeHtml(preview.title)}</div>
        <div class="placeholder-description">${escapeHtml(preview.description)}</div>
      </div>
    `;

    const targetRect = targetEl.getBoundingClientRect();
    if (rootEl) rootEl.setAttribute('data-drag-preview', 'true');

    nextOverlay.style.setProperty('left', '-9999px');
    nextOverlay.style.setProperty('top', '-9999px');
    if (previewSize) {
      nextOverlay.style.setProperty('inline-size', `${previewSize.width}px`);
      nextOverlay.style.setProperty('block-size', `${previewSize.height}px`);
    } else {
      nextOverlay.style.removeProperty('inline-size');
      nextOverlay.style.removeProperty('block-size');
    }
    nextOverlay.setAttribute('data-visible', 'true');
    const overlayRect = nextOverlay.getBoundingClientRect();
    const overlayWidth = previewSize?.width ?? overlayRect.width;
    const overlayHeight = previewSize?.height ?? overlayRect.height;
    const left = Math.max(16, Math.min(targetRect.left, window.innerWidth - overlayWidth - 16));
    const top = Math.max(
      16,
      Math.min(
        targetRect.top + (targetRect.height - overlayHeight) / 2,
        window.innerHeight - overlayHeight - 16
      )
    );
    nextOverlay.style.setProperty('left', `${Math.round(left)}px`);
    nextOverlay.style.setProperty('top', `${Math.round(top)}px`);
  }

  private _setDraggingVisualState(ids: string[], active: boolean): void {
    ids.forEach((id) => {
      const el = this._findItemElement(id);
      if (!el) return;
      el.setAttribute('data-dragging', active ? 'true' : 'false');
      el.setAttribute('aria-grabbed', active ? 'true' : 'false');
      if (active) {
        // Force layout so subsequent preview measurements see the post-drag transform state.
        el.getBoundingClientRect();
      }
    });
  }

  private _setDropTarget(target: DropTarget | null, options?: { announceLabel?: string }): void {
    const previous = this._dragState?.dropTarget ?? null;
    if (!this._dragState || sameDropTarget(previous, target)) return;
    this._pendingDropTarget = null;
    this._dragState.dropTarget = target;
    this._applyCurrentDropTargetVisualState(previous);
    if (options?.announceLabel) this._announce(options.announceLabel);
    if (this._dragState.keyboard) {
      this.requestRender();
      return;
    }
    this._updatePointerDragPreview();
  }

  private _queueDropTarget(target: DropTarget | null, timestamp?: number, options?: { announceLabel?: string }): void {
    if (!this._dragState) return;
    const current = this._dragState.dropTarget ?? null;
    if (sameDropTarget(current, target)) {
      this._pendingDropTarget = null;
      return;
    }
    if (!current && target) {
      this._setDropTarget(target, options);
      return;
    }

    const now = typeof timestamp === 'number' && Number.isFinite(timestamp) ? timestamp : performance.now();
    const pending = this._pendingDropTarget;
    if (pending && sameDropTarget(pending.target, target)) {
      const settleMs = target ? DROP_TARGET_SETTLE_MS : DROP_TARGET_CLEAR_SETTLE_MS;
      if (now - pending.startedAt >= settleMs) {
        this._setDropTarget(target, pending.announceLabel ? { announceLabel: pending.announceLabel } : options);
      }
      return;
    }

    this._pendingDropTarget = {
      target,
      startedAt: now,
      announceLabel: options?.announceLabel,
    };
  }

  private _releaseDropTarget(clientX: number, clientY: number): DropTarget | null {
    if (!this._dragState) return null;
    if (Number.isFinite(clientX) && Number.isFinite(clientY)) {
      const direct = this._dropTargetFromPoint(clientX, clientY);
      if (direct && this._canDrop(direct, this._dragState.movedRootIds)) {
        this._pendingDropTarget = null;
        return direct;
      }
    }
    const pending = this._pendingDropTarget?.target ?? null;
    this._pendingDropTarget = null;
    if (pending && this._canDrop(pending, this._dragState.movedRootIds)) return pending;
    const current = this._dragState.dropTarget ?? null;
    if (current && this._canDrop(current, this._dragState.movedRootIds)) return current;
    return null;
  }

  private _pathFromPoint(clientX: number, clientY: number): HTMLElement[] {
    const path: HTMLElement[] = [];
    const shadowRoot = this.root as ShadowRoot & { elementFromPoint?: (x: number, y: number) => Element | null };
    let current: Node | null = typeof shadowRoot.elementFromPoint === 'function'
      ? shadowRoot.elementFromPoint(clientX, clientY)
      : this.ownerDocument?.elementFromPoint(clientX, clientY) ?? null;

    while (current) {
      if (current instanceof HTMLElement) path.push(current);
      if (current === this) break;
      if (current instanceof ShadowRoot) {
        current = current.host;
        continue;
      }
      current = current.parentNode;
      if (!current && path[path.length - 1]?.getRootNode() instanceof ShadowRoot) {
        current = (path[path.length - 1].getRootNode() as ShadowRoot).host;
      }
    }

    return path;
  }

  private _measureItemShellRects(): Map<string, { top: number; left: number }> {
    const rects = new Map<string, { top: number; left: number }>();
    this.root.querySelectorAll<HTMLElement>('.item-shell[data-item-shell]').forEach((shell) => {
      const id = shell.getAttribute('data-item-shell');
      if (!id) return;
      const rect = shell.getBoundingClientRect();
      rects.set(id, { top: rect.top, left: rect.left });
    });
    return rects;
  }

  private _animateItemShellReflow(previousRects: Map<string, { top: number; left: number }>): void {
    if (!previousRects.size) return;
    const draggingIds = new Set(this._draggingIds());
    this.root.querySelectorAll<HTMLElement>('.item-shell[data-item-shell]').forEach((shell) => {
      const id = shell.getAttribute('data-item-shell');
      if (!id || draggingIds.has(id)) return;
      const previous = previousRects.get(id);
      if (!previous) return;
      const next = shell.getBoundingClientRect();
      const deltaX = previous.left - next.left;
      const deltaY = previous.top - next.top;
      if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) return;

      shell.style.transition = 'none';
      shell.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      shell.style.willChange = 'transform';
      shell.getBoundingClientRect();

      requestAnimationFrame(() => {
        shell.style.transition = 'transform 180ms ease';
        shell.style.transform = '';
        const cleanup = () => {
          shell.style.transition = '';
          shell.style.willChange = '';
          shell.removeEventListener('transitionend', cleanup);
        };
        shell.addEventListener('transitionend', cleanup);
        window.setTimeout(cleanup, 220);
      });
    });
  }

  private _previewCloneSubtreeItem(item: NormalizedItem, orderedMovingIds: string[]): NormalizedItem {
    const baseId = item.id.includes('--copy-') ? item.id.split('--copy-')[0] : item.id;
    return {
      ...item,
      id: `${baseId}--preview`,
      label: orderedMovingIds[0] === item.id ? `${item.label} copy` : item.label,
    };
  }

  private _projectedMoveResult(): ProjectedMoveResult | null {
    if (!this._dragState?.dropTarget || !this._canDrop(this._dragState.dropTarget, this._dragState.movedRootIds)) {
      return null;
    }
    return projectMoveItems(
      this._items,
      this._lists,
      this._dragState.dropTarget,
      this._dragState.movedRootIds,
      this._dragState.clone,
      (item, orderedMovingIds) => this._previewCloneSubtreeItem(item, orderedMovingIds)
    );
  }

  private _renderListTree(
    items: NormalizedItem[],
    list: NormalizedList,
    focusedId: string | null,
    draggingIds: Set<string>,
    allowNesting: boolean,
    placeholderIds: Set<string>,
    showSelectionBadge: boolean
  ): string {
    const itemMap = buildItemMap(items);
    const groups = buildChildrenMap(items);

    const renderChildren = (parentId: string | null): string => {
      const ids = groups.get(keyForGroup(list.id, parentId)) || [];
      const orderedIds = this.sort === 'label'
        ? [...ids].sort((leftId, rightId) => {
          const left = itemMap.get(leftId);
          const right = itemMap.get(rightId);
          if (!left || !right) return 0;
          return left.label.localeCompare(right.label);
        })
        : ids;

      let html = '';
      orderedIds.forEach((id) => {
        const item = itemMap.get(id);
        if (!item || item.hidden) return;
        const descendants = this._renderChildBranch(
          item,
          focusedId,
          draggingIds,
          renderChildren,
          allowNesting,
          placeholderIds,
          showSelectionBadge
        );
        if (!matchesFilter(item, this.filterQuery) && !descendants.includes('class="item"')) return;
        html += this._renderDropzone({
          listId: list.id,
          parentId,
          beforeId: id,
          mode: 'before',
        }, 'Drop here');
        html += descendants;
      });
      html += this._renderDropzone({
        listId: list.id,
        parentId,
        beforeId: null,
        mode: 'before',
      }, 'Drop here');
      return html;
    };

    return `<div class="tree">${renderChildren(null)}</div>`;
  }

  private _renderChildBranch(
    item: NormalizedItem,
    focusedId: string | null,
    draggingIds: Set<string>,
    renderChildren: (parentId: string | null) => string,
    allowNesting: boolean,
    placeholderIds: Set<string>,
    showSelectionBadge: boolean
  ): string {
    const itemId = escapeHtml(item.id);
    const placeholder = placeholderIds.has(item.id);
    const childrenHtml = placeholder ? '' : renderChildren(item.id);
    const hasVisibleChildren = childrenHtml.includes('class="item"');
    const selected = placeholder ? false : this._selection.includes(item.id);
    const dragging = placeholder ? false : draggingIds.has(item.id);
    const disabled = item.disabled;
    const handleDisabled = disabled || item.dragDisabled || this._isDragLocked();
    const dropInsideActive = this._dragState?.dropTarget?.mode === 'inside' && this._dragState.dropTarget.parentId === item.id;
    const placeholderKicker = this._dragState?.clone ? 'Copy preview' : 'Drop preview';
    const placeholderDescription = this._dragState?.clone
      ? 'Release to add a copy here.'
      : this._dragState && this._dragState.movedRootIds.length > 1
        ? 'Release to place this selection here.'
        : 'Release to place this item here.';
    const dragHandleMode = this._dragHandleMode();
    const usesCustomHandleSelector = this._usesCustomHandleSelector();
    const effectiveDragHandleMode = usesCustomHandleSelector ? 'custom' : dragHandleMode;
    const renderBuiltInHandle = !usesCustomHandleSelector && dragHandleMode === 'handle';

    return `
      <div class="item-shell" data-item-shell="${itemId}">
        <article
          class="item${placeholder ? ' item-placeholder' : ''}"
          part="item"
          data-id="${itemId}"
          data-drag-handle-mode="${effectiveDragHandleMode}"
          ${!placeholder && effectiveDragHandleMode === 'item' ? 'data-drag-trigger="item"' : ''}
          data-selected="${selected}"
          data-focused="${placeholder ? 'false' : focusedId === item.id}"
          data-dragging="${dragging}"
          data-disabled="${disabled}"
          data-drop-inside-active="${dropInsideActive ? 'true' : 'false'}"
          role="${placeholder ? 'presentation' : 'option'}"
          aria-selected="${placeholder ? 'false' : selected}"
          aria-disabled="${disabled}"
          aria-grabbed="${placeholder ? 'false' : dragging}"
          aria-hidden="${placeholder ? 'true' : 'false'}"
          tabindex="${placeholder ? '-1' : focusedId === item.id ? '0' : '-1'}"
        >
          ${placeholder
            ? `
              <div class="placeholder-content">
                <div class="placeholder-kicker">${escapeHtml(placeholderKicker)}</div>
                <div class="placeholder-title">${escapeHtml(item.label)}</div>
                <div class="placeholder-description">${escapeHtml(placeholderDescription)}</div>
              </div>
            `
            : `
              ${renderBuiltInHandle
                ? `
                  <button
                    class="handle"
                    part="handle"
                    type="button"
                    data-action="handle"
                    data-drag-trigger="handle"
                    data-id="${itemId}"
                    draggable="false"
                    ${handleDisabled ? 'disabled' : ''}
                    aria-label="Drag ${escapeHtml(item.label)}"
                  >
                    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                      <circle cx="5" cy="4" r="1.25"></circle>
                      <circle cx="11" cy="4" r="1.25"></circle>
                      <circle cx="5" cy="8" r="1.25"></circle>
                      <circle cx="11" cy="8" r="1.25"></circle>
                      <circle cx="5" cy="12" r="1.25"></circle>
                      <circle cx="11" cy="12" r="1.25"></circle>
                    </svg>
                  </button>
                `
                : ''}
              <div class="item-content" data-action="select" data-id="${itemId}">
                <div class="item-custom-content" part="item-custom-content" data-item-content-target="${itemId}"></div>
                <div class="item-default-content">
                  <div class="item-title">${escapeHtml(item.label)}</div>
                  ${item.description ? `<div class="item-description">${escapeHtml(item.description)}</div>` : ''}
                  <div class="item-meta">
                    <span class="item-badge selection-badge" data-selection-badge="true" ${selected && showSelectionBadge ? '' : 'hidden'}>${selected && showSelectionBadge ? 'Selected' : ''}</span>
                    ${item.cloneOnDrag ? '<span class="item-badge">Clone on drag</span>' : ''}
                    ${item.dragDisabled ? '<span class="item-badge">Pinned</span>' : ''}
                    ${allowNesting ? '<span class="item-badge drop-badge">Nest here</span>' : ''}
                  </div>
                </div>
              </div>
            `
          }
        </article>
        ${allowNesting && !placeholder
          ? this._renderDropzone({
            listId: item.listId,
            parentId: item.id,
            beforeId: null,
            mode: 'inside',
          }, 'Nest here')
          : ''}
        ${hasVisibleChildren ? `<div class="children">${childrenHtml}</div>` : ''}
      </div>
    `;
  }

  private _renderDropzone(target: DropTarget, label: string): string {
    const active = this._dragState?.dropTarget
      && this._dragState.dropTarget.listId === target.listId
      && this._dragState.dropTarget.parentId === target.parentId
      && this._dragState.dropTarget.beforeId === target.beforeId
      && this._dragState.dropTarget.mode === target.mode;

    return `
      <div
        class="dropzone"
        part="dropzone"
        data-list-id="${escapeHtml(target.listId)}"
        data-parent-id="${escapeHtml(target.parentId ?? '')}"
        data-before-id="${escapeHtml(target.beforeId ?? '')}"
        data-mode="${target.mode}"
        data-active="${active ? 'true' : 'false'}"
        aria-hidden="true"
      >
        <span class="dropzone-label">${escapeHtml(label)}</span>
      </div>
    `;
  }

  private _onClick(event: Event): void {
    const path = event.composedPath();
    const clearSelectionHit = path.find((node) => node instanceof HTMLElement && node.classList?.contains('toolbar'));
    const dragActivator = this._dragActivatorFromPath(path);
    const item = path.find((node): node is HTMLElement => node instanceof HTMLElement && node.classList.contains('item'));

    if (dragActivator && dragActivator.kind !== 'item') return;
    if (!item) {
      if (clearSelectionHit && !(event.target instanceof HTMLButtonElement)) return;
      return;
    }

    const id = item.getAttribute('data-id');
    if (!id) return;
    const itemRecord = this._items.find((entry) => entry.id === id);
    if (!itemRecord || itemRecord.disabled) return;

    const mouseEvent = event as MouseEvent;
    if (mouseEvent.shiftKey) {
      this._selectRangeTo(id);
    } else if (mouseEvent.metaKey || mouseEvent.ctrlKey) {
      this._toggleSelection(id);
    } else {
      this._setSelection([id], 'pointer');
    }

    this._focusedId = id;
    this._rangeAnchorId = id;
    this._pendingFocusId = id;
    if (this._hasCustomItemRendering()) {
      this._syncSelectionVisualState();
      this._restorePendingFocus();
      return;
    }
    this.requestRender();
  }

  private _onFocusIn(event: Event): void {
    const target = event.composedPath().find((node): node is HTMLElement => node instanceof HTMLElement && node.classList.contains('item'));
    const id = target?.getAttribute('data-id');
    if (!id) return;
    this._focusedId = id;
    this._syncSelectionVisualState();
  }

  private _onKeyDown(event: KeyboardEvent): void {
    const visibleIds = this._visibleItemIds();
    if (!visibleIds.length) return;

    const currentId = this._focusedId && visibleIds.includes(this._focusedId) ? this._focusedId : visibleIds[0];
    const currentIndex = visibleIds.indexOf(currentId);
    const currentItem = this._items.find((item) => item.id === currentId);
    const list = currentItem ? this._lists.find((entry) => entry.id === currentItem.listId) : null;
    const isHorizontal = list?.orientation === 'horizontal';

    if (!this._dragState?.keyboard) {
      if ((event.key === 'ArrowDown' && !isHorizontal) || (event.key === 'ArrowRight' && isHorizontal)) {
        event.preventDefault();
        this._moveFocusBy(visibleIds, currentIndex, 1);
        return;
      }
      if ((event.key === 'ArrowUp' && !isHorizontal) || (event.key === 'ArrowLeft' && isHorizontal)) {
        event.preventDefault();
        this._moveFocusBy(visibleIds, currentIndex, -1);
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        this._setSelection(visibleIds, 'keyboard');
        this._announce(`${visibleIds.length} items selected.`);
        return;
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        this._setSelection([currentId], 'keyboard');
        return;
      }
      if (event.key === ' ' || event.code === 'Space') {
        event.preventDefault();
        if (this._isDragLocked()) {
          this._announce('Dragging is disabled right now.');
          return;
        }
        const movedRootIds = this._selectedRootIds(currentId);
        if (!movedRootIds.length) return;
        const clone = this._itemClonesOnDrag(currentId);
        this._dragState = {
          snapshot: this._items.map(cloneItem),
          movedRootIds,
          originId: currentId,
          clone,
          keyboard: true,
          dropTarget: this._initialKeyboardDropTarget(currentId),
          committed: false,
        };
        const label = movedRootIds.length === 1 ? `Lifted ${currentItem?.label || 'item'}.` : `Lifted ${movedRootIds.length} items.`;
        this._announce(`${label} Use arrow keys to choose a destination.`);
        this.requestRender();
        return;
      }
      if (event.key === 'Escape') {
        this._setSelection([], 'keyboard');
        return;
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this._cancelDrag(true);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ' || event.code === 'Space') {
      event.preventDefault();
      const target = this._dragState.dropTarget;
      if (!target) return;
      this._commitMove(target, this._dragState.movedRootIds, this._dragState.clone, 'keyboard');
      return;
    }

    if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
      this._moveKeyboardDropTarget(direction);
    }
  }

  private _moveFocusBy(visibleIds: string[], currentIndex: number, direction: 1 | -1): void {
    const nextIndex = Math.max(0, Math.min(visibleIds.length - 1, currentIndex + direction));
    const nextId = visibleIds[nextIndex];
    this._focusedId = nextId;
    this._pendingFocusId = nextId;
    if (this._applyInteractiveStateInPlace({ restoreFocus: true })) return;
    this.requestRender();
  }

  private _onDragStart(event: DragEvent): void {
    const activator = this._dragActivatorFromPath(event.composedPath());
    const id = activator?.id;
    if (!activator || !id) {
      event.preventDefault();
      return;
    }

    if (this._isDragLocked()) {
      event.preventDefault();
      this._announce('Dragging is disabled right now.');
      return;
    }

    const item = this._items.find((entry) => entry.id === id);
    if (!item || item.disabled || item.dragDisabled) {
      event.preventDefault();
      return;
    }

    const selectedIds = this._selection.includes(id) ? this._selectedRootIds(id) : [id];
    if (!this._selection.includes(id)) this._setSelection([id], 'pointer');

    const clone = this._itemClonesOnDrag(id);
    this._dragState = {
      snapshot: this._items.map(cloneItem),
      movedRootIds: selectedIds,
      originId: id,
      clone,
      keyboard: false,
      dropTarget: null,
      committed: false,
    };

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = clone ? 'copyMove' : 'move';
      event.dataTransfer.setData('text/plain', selectedIds.join(','));
      this._applyDragImage(event.dataTransfer, selectedIds.length);
    }

    this._announce(
      clone
        ? `Dragging ${selectedIds.length === 1 ? item.label : `${selectedIds.length} items`} as a copy.`
        : `Dragging ${selectedIds.length === 1 ? item.label : `${selectedIds.length} items`}.`
    );
    this.requestRender();
  }

  private _onDragOver(event: DragEvent): void {
    if (!this._dragState || this._dragState.keyboard) return;
    const target = this._dropTargetFromEvent(event);
    if (!target || !this._canDrop(target, this._dragState.movedRootIds)) {
      this._queueDropTarget(null, event.timeStamp);
      return;
    }
    event.preventDefault();
    this._queueDropTarget(target, event.timeStamp);
    if (event.dataTransfer) event.dataTransfer.dropEffect = this._dragState.clone ? 'copy' : 'move';
  }

  private _onDrop(event: DragEvent): void {
    if (!this._dragState || this._dragState.keyboard) return;
    const target = this._dropTargetFromEvent(event);
    if (!target || !this._canDrop(target, this._dragState.movedRootIds)) return;
    event.preventDefault();
    this._commitMove(target, this._dragState.movedRootIds, this._dragState.clone, 'pointer');
  }

  private _onDocumentKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;
    if (!this._dragState || this._dragState.keyboard) return;
    event.preventDefault();
    this._cancelDrag(true);
  }

  private _onDragEnd(): void {
    if (!this._dragState || this._dragState.keyboard) return;
    if (!this._dragState.committed) {
      this._pendingDropTarget = null;
      this._setDropTargetVisualState(this._dragState.dropTarget, false);
      this._clearPointerDragPreview();
      this._dragState = null;
      this._removeDragImage();
      this._announce('Drag cancelled.');
      this.requestRender();
    }
  }

  private _dropTargetFromEvent(event: DragEvent): DropTarget | null {
    return this._dropTargetFromPath(event.composedPath(), event.clientX, event.clientY);
  }

  private _dropTargetFromPath(pathLike: EventTarget[], clientX: number, clientY: number): DropTarget | null {
    const zone = pathLike.find((node): node is HTMLElement => node instanceof HTMLElement && node.classList.contains('dropzone'));
    if (zone) {
      const explicitTarget: DropTarget = {
        listId: zone.getAttribute('data-list-id') || '',
        parentId: zone.getAttribute('data-parent-id') || null,
        beforeId: zone.getAttribute('data-before-id') || null,
        mode: zone.getAttribute('data-mode') === 'inside' ? 'inside' : 'before',
      };
      if (explicitTarget.listId) return explicitTarget;
    }

    const itemElement = pathLike.find((node): node is HTMLElement => node instanceof HTMLElement && node.classList.contains('item'));
    if (!itemElement) return null;

    const itemId = itemElement.getAttribute('data-id');
    if (!itemId) return null;
    const item = this._items.find((entry) => entry.id === itemId);
    if (!item) return null;

    const list = this._lists.find((entry) => entry.id === item.listId);
    const rect = itemElement.getBoundingClientRect();
    const isHorizontal = list?.orientation === 'horizontal';
    const start = isHorizontal ? rect.left : rect.top;
    const end = isHorizontal ? rect.right : rect.bottom;
    const pointer = isHorizontal ? clientX : clientY;
    const size = Math.max(1, end - start);
    const ratio = (pointer - start) / size;
    const allowNesting = this.getAttribute('allow-nesting') !== 'false' && !item.disabled;

    if (ratio <= 0.34) {
      return {
        listId: item.listId,
        parentId: item.parentId,
        beforeId: item.id,
        mode: 'before',
      };
    }

    if (allowNesting && ratio >= 0.34 && ratio <= 0.74) {
      return {
        listId: item.listId,
        parentId: item.id,
        beforeId: null,
        mode: 'inside',
      };
    }

    const groups = buildChildrenMap(this._items);
    const siblings = groups.get(keyForGroup(item.listId, item.parentId)) || [];
    const index = siblings.indexOf(item.id);
    const nextSiblingId = index >= 0 ? siblings[index + 1] || null : null;
    return {
      listId: item.listId,
      parentId: item.parentId,
      beforeId: nextSiblingId,
      mode: 'before',
    };
  }

  private _dropTargetFromPoint(clientX: number, clientY: number): DropTarget | null {
    return this._dropTargetFromPath(this._pathFromPoint(clientX, clientY), clientX, clientY);
  }

  private _beginPointerDrag(clientX: number, clientY: number): void {
    if (!this._pointerGesture || this._dragState) return;
    const item = this._items.find((entry) => entry.id === this._pointerGesture?.originId);
    if (!item) return;

    this._dragState = {
      snapshot: this._items.map(cloneItem),
      movedRootIds: [...this._pointerGesture.movedRootIds],
      originId: this._pointerGesture.originId,
      clone: this._pointerGesture.clone,
      keyboard: false,
      dropTarget: null,
      committed: false,
    };
    this._pendingDropTarget = null;

    this._applyPointerPreview(
      clientX,
      clientY,
      this._dragState.movedRootIds.length,
      this._dragState.clone
    );
    this._setDraggingVisualState(this._draggingIds(), true);
    this._announce(
      this._dragState.clone
        ? `Dragging ${this._dragState.movedRootIds.length === 1 ? item.label : `${this._dragState.movedRootIds.length} items`} as a copy.`
        : `Dragging ${this._dragState.movedRootIds.length === 1 ? item.label : `${this._dragState.movedRootIds.length} items`}.`
    );
  }

  private _onPointerDown(event: PointerEvent): void {
    const activator = this._dragActivatorFromPath(event.composedPath());
    const id = activator?.id;
    if (!activator || !id) return;
    if (this._isDragLocked()) {
      event.preventDefault();
      this._announce('Dragging is disabled right now.');
      return;
    }

    const item = this._items.find((entry) => entry.id === id);
    if (!item || item.disabled || item.dragDisabled) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    try {
      activator.element.setPointerCapture?.(event.pointerId);
    } catch {
      // Synthetic or browser-managed pointer streams may not always expose capture.
    }

    const selectedIds = this._selection.includes(id) ? this._selectedRootIds(id) : [id];
    this._pointerGesture = {
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      originId: id,
      movedRootIds: selectedIds,
      clone: this._itemClonesOnDrag(id),
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
      captureTarget: activator.element,
    };
  }

  private _onPointerMove(event: PointerEvent): void {
    if (!this._pointerGesture || event.pointerId !== this._pointerGesture.pointerId) return;
    event.preventDefault();
    if (!this._pointerGesture.moved) {
      const distance = Math.hypot(event.clientX - this._pointerGesture.startX, event.clientY - this._pointerGesture.startY);
      if (distance < 6) return;
      this._pointerGesture.moved = true;
      this._beginPointerDrag(event.clientX, event.clientY);
    }

    if (!this._dragState || this._dragState.keyboard) return;
    this._movePointerPreview(event.clientX, event.clientY);
    if (!this._dragState.committed) {
      const target = this._dropTargetFromPoint(event.clientX, event.clientY);
      if (!target || !this._canDrop(target, this._dragState.movedRootIds)) {
        this._queueDropTarget(null, event.timeStamp);
        return;
      }
      this._queueDropTarget(target, event.timeStamp);
    }
  }

  private _onPointerUp(event: PointerEvent): void {
    if (!this._pointerGesture || event.pointerId !== this._pointerGesture.pointerId) return;
    event.preventDefault();
    try {
      this._pointerGesture.captureTarget?.releasePointerCapture?.(event.pointerId);
    } catch {
      // Ignore missing capture state on synthetic pointer releases.
    }

    const gesture = this._pointerGesture;
    this._pointerGesture = null;
    if (!this._dragState || this._dragState.keyboard) return;
    const releaseTarget = gesture.moved ? this._releaseDropTarget(event.clientX, event.clientY) : null;
    if (gesture.moved && releaseTarget) {
      this._commitMove(releaseTarget, this._dragState.movedRootIds, this._dragState.clone, 'pointer');
      return;
    }

    if (gesture.moved) {
      this._cancelDrag(true);
    } else {
      this._setDropTargetVisualState(this._dragState.dropTarget, false);
      this._clearPointerDragPreview();
      this._dragState = null;
      this._removeDragImage();
      this.requestRender();
    }
  }

  private _onPointerCancel(event: PointerEvent): void {
    if (!this._pointerGesture || event.pointerId !== this._pointerGesture.pointerId) return;
    this._pointerGesture = null;
    if (!this._dragState) return;
    this._cancelDrag(true);
  }

  private _setSelection(ids: string[], source: UISortableChangeSource): void {
    const availableIds = new Set(this._items.map((item) => item.id));
    const next = Array.from(new Set(ids.filter((id) => availableIds.has(id))));
    const previous = [...this._selection];
    this._selection = next;
    this._rangeAnchorId = next[next.length - 1] || null;
    this._focusedId = next[next.length - 1] || this._focusedId;
    const serialized = serializeSelection(next);
    if (this.getAttribute('selection') !== serialized) {
      this._lastSelectionAttr = serialized;
      this._suppressAttributeRender = true;
      try {
        if (next.length) this.setAttribute('selection', serialized);
        else this.removeAttribute('selection');
      } finally {
        this._suppressAttributeRender = false;
      }
    }

    this.dispatchEvent(new CustomEvent<UISortableSelectionChangeDetail>('selection-change', {
      detail: {
        selection: [...next],
        previousSelection: previous,
      },
      bubbles: true,
      composed: true,
    }));

    if (source !== 'restore') {
      if (this._applyInteractiveStateInPlace({ restoreFocus: true })) return;
      this.requestRender();
    }
  }

  private _toggleSelection(id: string): void {
    const next = this._selection.includes(id)
      ? this._selection.filter((entry) => entry !== id)
      : [...this._selection, id];
    this._setSelection(next, 'pointer');
    this._announce(`${next.length} items selected.`);
  }

  private _selectRangeTo(id: string): void {
    const visibleIds = this._visibleItemIds();
    const startId = this._rangeAnchorId || this._focusedId || id;
    const startIndex = visibleIds.indexOf(startId);
    const endIndex = visibleIds.indexOf(id);
    if (startIndex < 0 || endIndex < 0) {
      this._setSelection([id], 'pointer');
      return;
    }
    const [from, to] = startIndex <= endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
    this._setSelection(visibleIds.slice(from, to + 1), 'pointer');
    this._announce(`${to - from + 1} items selected.`);
  }

  private _visibleItemIds(): string[] {
    const records = buildRenderRecords(this._items, new Set(this._selection), new Set(this._draggingIds()), this.filterQuery, this.sort);
    return Array.from(records.values()).flat().filter((record) => !record.disabled).map((record) => record.id);
  }

  private _selectedRootIds(fallbackId?: string): string[] {
    const selected = this._selection.length ? [...this._selection] : fallbackId ? [fallbackId] : [];
    const itemMap = buildItemMap(this._items);
    const selectedSet = new Set(selected);
    return selected.filter((id) => {
      const item = itemMap.get(id);
      if (!item) return false;
      let parentId = item.parentId;
      while (parentId) {
        if (selectedSet.has(parentId)) return false;
        parentId = itemMap.get(parentId)?.parentId ?? null;
      }
      return !item.disabled;
    });
  }

  private _draggingIds(): string[] {
    if (!this._dragState) return [];
    const itemMap = buildItemMap(this._items);
    const groups = buildChildrenMap(this._items);
    const ids: string[] = [];

    const visit = (id: string) => {
      ids.push(id);
      const item = itemMap.get(id);
      if (!item) return;
      const children = groups.get(keyForGroup(item.listId, id)) || [];
      children.forEach(visit);
    };

    this._dragState.movedRootIds.forEach(visit);
    return ids;
  }

  private _itemClonesOnDrag(id: string): boolean {
    const item = this._items.find((entry) => entry.id === id);
    if (!item) return false;
    if (item.cloneOnDrag) return true;
    const list = this._lists.find((entry) => entry.id === item.listId);
    return !!list?.cloneOnDrag;
  }

  private _isDragLocked(): boolean {
    if (this.hasAttribute('disabled')) return true;
    if (this.sort !== 'manual') return true;
    if (this.filterQuery && !this.hasAttribute('allow-filtered-drag')) return true;
    return false;
  }

  private _canDrop(target: DropTarget, movedRootIds: string[]): boolean {
    if (this._isDragLocked()) return false;
    const targetList = this._lists.find((list) => list.id === target.listId);
    if (!targetList || targetList.disabled) return false;

    const itemMap = buildItemMap(this._items);
    const movingSet = new Set<string>();
    const groups = buildChildrenMap(this._items);

    const collect = (id: string) => {
      movingSet.add(id);
      const item = itemMap.get(id);
      if (!item) return;
      (groups.get(keyForGroup(item.listId, id)) || []).forEach(collect);
    };
    movedRootIds.forEach(collect);

    if (target.parentId && movingSet.has(target.parentId)) return false;
    if (target.beforeId && movingSet.has(target.beforeId)) return false;

    const sourceLists = Array.from(new Set(movedRootIds.map((id) => itemMap.get(id)?.listId).filter(Boolean))) as string[];
    if (targetList.accepts?.length && sourceLists.some((listId) => !targetList.accepts?.includes(listId))) return false;

    if (target.mode === 'inside' && this.getAttribute('allow-nesting') === 'false') return false;

    return true;
  }

  private _commitMove(
    target: DropTarget,
    movedRootIds: string[],
    clone: boolean,
    source: UISortableChangeSource
  ): void {
    if (!this._canDrop(target, movedRootIds)) return;

    const itemMap = buildItemMap(this._items);
    const groups = buildChildrenMap(this._items);
    const movingSet = new Set<string>();
    const orderedMovingIds: string[] = [];

    const collect = (id: string) => {
      const item = itemMap.get(id);
      if (!item || movingSet.has(id)) return;
      movingSet.add(id);
      orderedMovingIds.push(id);
      (groups.get(keyForGroup(item.listId, id)) || []).forEach(collect);
    };
    movedRootIds.forEach(collect);

    const orderedItems = this._items.map(cloneItem);
    const movingItems = orderedItems.filter((item) => movingSet.has(item.id));
    const remainingItems = clone
      ? orderedItems.map(cloneItem)
      : orderedItems.filter((item) => !movingSet.has(item.id));
    const nextItems = clone ? movingItems.map((item) => this._cloneSubtreeItem(item, orderedMovingIds)) : movingItems.map(cloneItem);
    const idMap = new Map<string, string>();
    const cloneSourceById = new Map<string, string>();

    if (clone) {
      movingItems.forEach((item, index) => {
        idMap.set(item.id, nextItems[index].id);
        cloneSourceById.set(nextItems[index].id, item.id);
      });
    }

    nextItems.forEach((item) => {
      const originalId = clone ? cloneSourceById.get(item.id) : item.id;
      const original = originalId ? itemMap.get(originalId) : null;
      if (!original) return;
      if (clone) {
        item.parentId = original.parentId && idMap.has(original.parentId) ? idMap.get(original.parentId) || null : null;
      }
      item.listId = target.listId;
    });

    const rootIdsForInsert = movedRootIds.map((id) => idMap.get(id) || id);
    const combinedItems = [...remainingItems, ...nextItems];
    const groupOrders = buildChildrenMap(remainingItems);
    const insertedGroupKey = keyForGroup(target.listId, target.parentId);
    const targetGroup = [...(groupOrders.get(insertedGroupKey) || [])];
    const insertionIndex = target.beforeId ? targetGroup.indexOf(target.beforeId) : targetGroup.length;
    const safeIndex = insertionIndex >= 0 ? insertionIndex : targetGroup.length;
    targetGroup.splice(safeIndex, 0, ...rootIdsForInsert);
    groupOrders.set(insertedGroupKey, targetGroup);

    const movingGroups = buildChildrenMap(nextItems);
    movingGroups.forEach((ids, key) => {
      const [, parentToken] = key.split('::');
      if ((parentToken || '') === '__root__') return;
      groupOrders.set(key, [...ids]);
    });

    const combinedMap = buildItemMap(combinedItems);
    rootIdsForInsert.forEach((rootId) => {
      const rootItem = combinedMap.get(rootId);
      if (!rootItem) return;
      rootItem.parentId = target.parentId;
      rootItem.listId = target.listId;
    });

    const ordered: NormalizedItem[] = [];
    const visited = new Set<string>();
    const walk = (listId: string, parentId: string | null) => {
      const ids = groupOrders.get(keyForGroup(listId, parentId)) || [];
      ids.forEach((id, index) => {
        const item = combinedMap.get(id);
        if (!item || visited.has(id)) return;
        visited.add(id);
        item.listId = listId;
        item.parentId = parentId;
        item.order = index;
        ordered.push(item);
        walk(listId, id);
      });
    };

    this._lists.forEach((list) => walk(list.id, null));
    combinedItems.forEach((item) => {
      if (visited.has(item.id)) return;
      item.parentId = null;
      ordered.push(item);
    });

    if (this._dragState) this._dragState.committed = true;
    this._items = ordered.map(cloneItem);
    this._clearPointerDragPreview();
    this._dragState = null;
    this._removeDragImage();

    const nextSelection = [...rootIdsForInsert];
    const previousSelection = [...this._selection];
    this._selection = nextSelection;
    this._focusedId = nextSelection[0] || null;
    this._pendingFocusId = this._focusedId;
    this._syncAttributesFromState();

    const snapshot = getPersistenceSnapshot(this._items);
    this._persistSnapshot(snapshot);

    const originalRoots = movedRootIds
      .map((id) => itemMap.get(id))
      .filter((item): item is NormalizedItem => !!item);
    const operation: UISortableOperation = clone
      ? 'clone'
      : target.mode === 'inside'
        ? 'nest'
        : originalRoots.some((item) => item.listId !== target.listId)
          ? 'transfer'
          : 'reorder';

    const detail: UISortableChangeDetail = {
      items: this.items,
      lists: this.lists,
      selection: [...nextSelection],
      previousSelection,
      movedIds: [...rootIdsForInsert],
      source,
      operation,
      persistence: snapshot,
    };

    this.dispatchEvent(new CustomEvent<UISortableChangeDetail>('change', {
      detail,
      bubbles: true,
      composed: true,
    }));

    this.dispatchEvent(new CustomEvent<UISortableChangeDetail>('persist-request', {
      detail,
      bubbles: true,
      composed: true,
    }));
    this._announce(this._messageForMove(operation, rootIdsForInsert.length, target));
    this.requestRender();
  }

  private _syncAttributesFromState(): void {
    const lists = serializeLists(this._lists);
    const items = serializeItems(this._items);
    const selection = serializeSelection(this._selection);

    this._lastListsAttr = lists;
    this._lastItemsAttr = items;
    this._lastSelectionAttr = selection;

    this._suppressAttributeRender = true;
    try {
      this.setAttribute('lists', lists);
      this.setAttribute('items', items);
      if (this._selection.length) this.setAttribute('selection', selection);
      else this.removeAttribute('selection');
    } finally {
      this._suppressAttributeRender = false;
    }
  }

  private _cloneSubtreeItem(item: NormalizedItem, orderedMovingIds: string[]): NormalizedItem {
    const seed = this._cloneSeed++;
    const suffix = `copy-${seed}`;
    const baseId = item.id.includes('--copy-') ? item.id.split('--copy-')[0] : item.id;
    const clonedId = `${baseId}--${suffix}`;
    return {
      ...item,
      id: clonedId,
      label: orderedMovingIds[0] === item.id ? `${item.label} copy` : item.label,
    };
  }

  private _messageForMove(operation: UISortableOperation, count: number, target: DropTarget): string {
    const list = this._lists.find((entry) => entry.id === target.listId);
    const destination = list?.label || target.listId;
    if (operation === 'clone') return `${count === 1 ? 'Item copied' : `${count} items copied`} into ${destination}.`;
    if (operation === 'nest') return `${count === 1 ? 'Item nested' : `${count} items nested`} in ${destination}.`;
    if (operation === 'transfer') return `${count === 1 ? 'Item moved' : `${count} items moved`} to ${destination}.`;
    return `${count === 1 ? 'Item reordered' : `${count} items reordered`} in ${destination}.`;
  }

  private _persistSnapshot(snapshot: UISortablePersistenceSnapshot): void {
    const persistKey = this.getAttribute('persist-key');
    if (!persistKey) return;
    try {
      window.localStorage.setItem(persistKey, JSON.stringify(snapshot));
    } catch {
      // ignore storage failures
    }
  }

  private _announce(message: string): void {
    this._liveMessage = message;
    this._applyLiveMessage();
  }

  private _cancelDrag(announce: boolean): void {
    if (!this._dragState) return;
    this._pendingDropTarget = null;
    this._setDropTargetVisualState(this._dragState.dropTarget, false);
    this._clearPointerDragPreview();
    this._items = this._dragState.snapshot.map(cloneItem);
    this._dragState = null;
    this._pointerGesture = null;
    this._removeDragImage();
    if (announce) this._announce('Drag cancelled.');
    this._syncAttributesFromState();
    this.requestRender();
  }

  private _applyDragImage(dataTransfer: DataTransfer, count: number): void {
    this._removeDragImage();
    const ghost = document.createElement('div');
    ghost.textContent = count === 1 ? 'Dragging item' : `Dragging ${count} items`;
    ghost.style.position = 'fixed';
    ghost.style.top = '-999px';
    ghost.style.left = '-999px';
    ghost.style.padding = '8px 12px';
    ghost.style.borderRadius = '999px';
    ghost.style.background = 'rgba(15, 23, 42, 0.92)';
    ghost.style.color = '#f8fafc';
    ghost.style.font = '600 12px/1 Inter, sans-serif';
    ghost.style.pointerEvents = 'none';
    document.body.appendChild(ghost);
    dataTransfer.setDragImage(ghost, 12, 12);
    this._dragImage = ghost;
  }

  private _removeDragImage(): void {
    this._dragImage?.remove();
    this._dragImage = null;
  }

  private _removeDragPreviewOverlay(): void {
    this._dragPreviewOverlay?.remove();
    this._dragPreviewOverlay = null;
  }

  private _applyPointerPreview(clientX: number, clientY: number, count: number, clone: boolean): void {
    this._removeDragImage();
    const ghost = document.createElement('div');
    ghost.textContent = clone
      ? count === 1 ? 'Copying item' : `Copying ${count} items`
      : count === 1 ? 'Moving item' : `Moving ${count} items`;
    ghost.style.position = 'fixed';
    ghost.style.top = '0';
    ghost.style.left = '0';
    ghost.style.zIndex = '2147483647';
    ghost.style.padding = '8px 12px';
    ghost.style.borderRadius = '999px';
    ghost.style.background = 'rgba(15, 23, 42, 0.92)';
    ghost.style.color = '#f8fafc';
    ghost.style.font = '600 12px/1 Inter, sans-serif';
    ghost.style.pointerEvents = 'none';
    ghost.style.boxShadow = '0 12px 28px rgba(15, 23, 42, 0.22)';
    document.body.appendChild(ghost);
    this._dragImage = ghost;
    this._movePointerPreview(clientX, clientY);
  }

  private _movePointerPreview(clientX: number, clientY: number): void {
    if (!this._dragImage) return;
    this._dragImage.style.transform = `translate(${Math.round(clientX + 14)}px, ${Math.round(clientY + 14)}px)`;
  }

  private _keyboardDropTargets(): KeyboardDropTarget[] {
    const itemMap = buildItemMap(this._items);
    const groups = buildChildrenMap(this._items);
    const targets: KeyboardDropTarget[] = [];

    const walk = (listId: string, parentId: string | null) => {
      const ids = groups.get(keyForGroup(listId, parentId)) || [];
      ids.forEach((id) => {
        const item = itemMap.get(id);
        if (!item || item.hidden) return;
        targets.push({
          listId,
          parentId,
          beforeId: id,
          mode: 'before',
          label: `Before ${item.label}`,
        });
        if (this.getAttribute('allow-nesting') !== 'false') {
          targets.push({
            listId,
            parentId: id,
            beforeId: null,
            mode: 'inside',
            label: `Nest inside ${item.label}`,
          });
        }
        walk(listId, id);
      });
      targets.push({
        listId,
        parentId,
        beforeId: null,
        mode: 'before',
        label: parentId ? 'After children' : `End of ${this._lists.find((list) => list.id === listId)?.label || listId}`,
      });
    };

    this._lists.forEach((list) => walk(list.id, null));
    return targets.filter((target) => this._canDrop(target, this._dragState?.movedRootIds || []));
  }

  private _initialKeyboardDropTarget(originId: string): DropTarget | null {
    const item = this._items.find((entry) => entry.id === originId);
    if (!item) return null;
    return {
      listId: item.listId,
      parentId: item.parentId,
      beforeId: originId,
      mode: 'before',
    };
  }

  private _moveKeyboardDropTarget(direction: 1 | -1): void {
    if (!this._dragState) return;
    const targets = this._keyboardDropTargets();
    if (!targets.length) return;
    const currentIndex = Math.max(0, targets.findIndex((target) =>
      target.listId === this._dragState?.dropTarget?.listId
      && target.parentId === this._dragState?.dropTarget?.parentId
      && target.beforeId === this._dragState?.dropTarget?.beforeId
      && target.mode === this._dragState?.dropTarget?.mode
    ));
    const nextIndex = Math.max(0, Math.min(targets.length - 1, currentIndex + direction));
    this._setDropTarget(targets[nextIndex], { announceLabel: targets[nextIndex].label });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-sortable': UISortable;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-sortable')) {
  customElements.define('ui-sortable', UISortable);
}
