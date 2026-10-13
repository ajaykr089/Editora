import { ElementBase } from '../ElementBase';
import { edgeScrollDelta, findScrollParent } from '../primitives/auto-scroll';

export type UISortableListOrientation = 'vertical' | 'horizontal';
export type UISortableSortMode = 'manual' | 'label';
export type UISortableDropMode = 'before' | 'inside';
export type UISortableChangeSource = 'pointer' | 'keyboard' | 'api' | 'restore';
export type UISortableOperation = 'reorder' | 'transfer' | 'nest' | 'clone';
export type UISortableDropIndicatorVisibility = 'active' | 'always';
export type UISortableDragHandleMode = 'handle' | 'item';
export type UISortableDropzoneStyle = 'indicator' | 'container';
/**
 * What it takes to drop a card *inside* another one (nest it) with the pointer:
 * `gutter` (default) holding Alt, or dropping on the far side of the card; `modifier` holding Alt;
 * `area` dropping on the middle of any card (the old behaviour, where a plain drag could nest by accident).
 * Without that, the top half of a card is "before it" and the bottom half is "after it".
 */
export type UISortableNestTrigger = 'gutter' | 'modifier' | 'area';

/** Every piece of text the component shows or announces. Pass any of them as `labels` to translate or reword. */
export type UISortableLabels = { [K in keyof typeof DEFAULT_LABELS]: string };

export type UISortableList = {
  id: string;
  label: string;
  description?: string;
  emptyLabel?: string;
  orientation?: UISortableListOrientation;
  disabled?: boolean;
  cloneOnDrag?: boolean;
  accepts?: string[];
  /** The most items the list can hold, at every nesting level. A move or copy that would go past it is refused. */
  maxItems?: number;
  /** The tallest the list's cards can be before the list scrolls on its own (a number of px, or a CSS length such as "20rem"). Overrides `list-max-height`. */
  maxHeight?: number | string;
  /** Anything of yours that is JSON-serialisable (an id, a record, a colour). It travels with the list and comes back in every event. */
  data?: unknown;
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
  /** Anything of yours that is JSON-serialisable (a record, a price, a status). It travels with the item through moves and copies, and comes back in every event. */
  data?: unknown;
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

/** Set on the `change` of both elements when items go from one `<ui-sortable>` to another: which way, and the other one. */
export type UISortableExternalMove = {
  /** `in` on the element the items arrived in, `out` on the one they left. */
  direction: 'in' | 'out';
  peer: UISortable;
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
  /** Only when the items crossed between two elements (see `group`). */
  external?: UISortableExternalMove;
};

/** What a `renderItem` function is told about the card it is drawing. */
export type UISortableRenderItemContext = {
  selected: boolean;
  disabled: boolean;
  dragDisabled: boolean;
  cloneOnDrag: boolean;
  list?: UISortableList;
};

export type UISortableRenderListHeaderContext = {
  itemCount: number;
  dragLocked: boolean;
};

export type UISortableRenderEmptyStateContext = {
  itemCount: number;
  dragLocked: boolean;
  filterQuery: string;
};

/**
 * What a render function returns: a DOM node, or a string of HTML (escape anything that came from a user),
 * or nothing to keep the built-in markup.
 */
export type UISortableRenderResult = Node | string | null | undefined | void;

/** What `canDrop` is asked: can these items go there? */
export type UISortableDropInfo = {
  /** The items being moved (not their children), as they are now. */
  items: UISortableItem[];
  movedIds: string[];
  targetListId: string;
  parentId: string | null;
  beforeId: string | null;
  mode: UISortableDropMode;
  /** True when the items are copied rather than moved. */
  clone: boolean;
  /** The other `<ui-sortable>` the items come from, when they are dropped across elements (see `group`). */
  from?: UISortable;
};

/** The detail of `before-change`: what `change` will report, plus where the items are going. */
export type UISortableBeforeChangeDetail = UISortableChangeDetail & {
  target: { listId: string; parentId: string | null; beforeId: string | null; mode: UISortableDropMode };
  clone: boolean;
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
  data?: unknown;
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
  maxItems?: number;
  maxHeight?: string;
  data?: unknown;
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
  // Another `<ui-sortable>` of the same group the held card is over, and the place in it.
  external?: { peer: UISortable; target: DropTarget } | null;
  session?: ExternalSession;
};

// What leaves one element when its items are dropped into another: the held items with all their children.
type ExternalSession = {
  source: UISortable;
  rootIds: string[];
  items: NormalizedItem[];
  clone: boolean;
  sourceListIds: string[];
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
  // A finger on a card (not on its handle) is a scroll until it has been held still: the drag starts when
  // the hold timer fires, and a finger that moves first was scrolling.
  hold: boolean;
  holdTimer: ReturnType<typeof setTimeout> | null;
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

// A move worked out but not yet applied: what the items will be, and enough to describe it.
type MovePlan = {
  items: NormalizedItem[];
  movedIds: string[];
  nextSelection: string[];
  operation: UISortableOperation;
  target: DropTarget;
  clone: boolean;
  source: UISortableChangeSource;
  external?: UISortableExternalMove;
  // The name of the list the items went to, when it is not one of this element's own.
  destination?: string;
};

type ProjectedMoveResult = {
  items: NormalizedItem[];
  insertedRootIds: string[];
};

const STORAGE_VERSION = 1;

// {name} placeholders are filled in by the component (a label, a count, a list name).
const DEFAULT_LABELS = {
  hintHandle: 'Use the handle to drag, or press Space on a focused item to start keyboard reordering.',
  hintItem: 'Drag from anywhere on an item, or press Space on a focused item to start keyboard reordering.',
  hintCustom: 'Use your custom drag handle element, or press Space on a focused item to start keyboard reordering.',
  hintKeyboard: 'Keyboard drag active. Use arrow keys to choose a drop target, Space or Enter to drop, and Escape to cancel.',
  hintNestGutter: 'To nest an item, hold Alt or drop it on the far side of another.',
  hintNestModifier: 'To nest an item, hold Alt while you drop it on another.',
  hintNestArea: 'To nest an item, drop it on the middle of another.',
  hintPausedSort: 'Dragging is paused while alphabetical sorting is active.',
  hintPausedFilter: 'Dragging is paused while the list is filtered.',
  hintDisabled: 'Dragging is currently disabled.',
  selectedOne: 'item selected',
  selectedMany: 'items selected',
  listReadOnly: 'This list is read-only.',
  listClone: 'Dragging from this list creates a copy.',
  listAccepts: 'Accepts drops from: {lists}',
  listFull: 'This list is full ({max} items).',
  emptyList: 'Drop items here.',
  dropHere: 'Drop here',
  nestHere: 'Nest here',
  badgeSelected: 'Selected',
  badgeClone: 'Clone on drag',
  badgePinned: 'Pinned',
  dropPreview: 'Drop preview',
  copyPreview: 'Copy preview',
  releaseMove: 'Release to place this item here.',
  releaseMoveMany: 'Release to place this selection here.',
  releaseCopy: 'Release to add a copy here.',
  movingOne: 'Moving item',
  movingMany: 'Moving {count} items',
  copyingOne: 'Copying item',
  copyingMany: 'Copying {count} items',
  announceSelectedMany: '{count} items selected.',
  announceDragDisabled: 'Dragging is disabled right now.',
  announceDragging: 'Dragging {label}.',
  announceDraggingMany: 'Dragging {count} items.',
  announceDraggingCopy: 'Dragging {label} as a copy.',
  announceDraggingCopyMany: 'Dragging {count} items as a copy.',
  announceCancelled: 'Drag cancelled.',
  announceRejected: 'That move is not allowed.',
  announceLifted: 'Lifted {label}.',
  announceLiftedMany: 'Lifted {count} items.',
  announceLiftedHelp: 'Use arrow keys to choose a destination.',
  announceCopiedOne: 'Item copied into {list}.',
  announceCopiedMany: '{count} items copied into {list}.',
  announceNestedOne: 'Item nested in {list}.',
  announceNestedMany: '{count} items nested in {list}.',
  announceMovedOne: 'Item moved to {list}.',
  announceMovedMany: '{count} items moved to {list}.',
  announceReorderedOne: 'Item reordered in {list}.',
  announceReorderedMany: '{count} items reordered in {list}.',
  targetBefore: 'Before {label}',
  targetInside: 'Nest inside {label}',
  targetEnd: 'End of {list}',
  targetAfterChildren: 'After children',
};
const DROP_TARGET_SETTLE_MS = 44;
const DROP_TARGET_CLEAR_SETTLE_MS = 72;
const TOUCH_HOLD_MS = 350;
const TOUCH_HOLD_SLOP_PX = 10;

const style = `
  :host {
    --ui-sortable-accent: var(--ui-color-primary, #2563eb);
    --ui-sortable-surface: var(--ui-color-surface, #ffffff);
    --ui-sortable-text: var(--ui-color-text, #0f172a);
    --ui-sortable-muted: var(--ui-color-muted, #5b6778);
    --ui-sortable-lane: color-mix(in srgb, var(--ui-sortable-text) 3.5%, var(--ui-sortable-surface));
    --ui-sortable-card: var(--ui-sortable-surface);
    --ui-sortable-surface-muted: var(--ui-sortable-lane);
    --ui-sortable-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 62%, transparent);
    --ui-sortable-border-strong: color-mix(in srgb, var(--ui-sortable-text) 24%, var(--ui-sortable-surface));
    --ui-sortable-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
    --ui-sortable-card-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
    --ui-sortable-card-shadow-hover: 0 3px 10px rgba(15, 23, 42, 0.1);
    --ui-sortable-lift-shadow:
      0 22px 44px -10px rgba(15, 23, 42, 0.32),
      0 8px 16px rgba(15, 23, 42, 0.14);
    --ui-sortable-radius: 14px;
    --ui-sortable-panel-radius: 14px;
    --ui-sortable-item-radius: 10px;
    --ui-sortable-handle-radius: 6px;
    --ui-sortable-gap: 12px;
    --ui-sortable-list-gap: 6px;
    --ui-sortable-item-gap: 6px;
    --ui-sortable-list-min-size: 260px;
    --ui-sortable-dropzone-size: 0px;
    --ui-sortable-dropzone-hit-size: 7px;
    --ui-sortable-dropzone-inside-size: 0px;
    --ui-sortable-dropzone-container-min-block-size: 56px;
    --ui-sortable-dropzone-container-min-inline-size: 180px;
    --ui-sortable-indent: 16px;
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
    gap: 10px;
    min-inline-size: 0;
  }

  .toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 6px 16px;
    padding: 0 2px;
    color: var(--ui-sortable-muted);
    font-size: 12px;
    line-height: 1.5;
  }

  /* hide-toolbar: the hint is still what the lists are described by, so it is hidden from sight only. */
  .toolbar[data-hidden="true"] {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
  }

  .helper {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-inline-size: 0;
  }

  .selection-summary[data-count="0"] {
    display: none;
  }

  .selection-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-inline-size: 22px;
    min-block-size: 20px;
    padding-inline: 7px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--ui-sortable-accent) 14%, transparent);
    color: color-mix(in srgb, var(--ui-sortable-accent) 84%, var(--ui-sortable-text));
    font-size: 11.5px;
    font-weight: 700;
  }

  /* Lists sit side by side and scroll sideways when they do not fit (a board), instead of wrapping onto
     rows. One list fills the width. The padding gives card shadows and focus rings room inside the
     scroller; the negative margin hands that room back to the layout. */
  .lists {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(min(var(--ui-sortable-list-min-size), 100%), 1fr);
    gap: var(--ui-sortable-gap);
    min-inline-size: 0;
    padding: 4px;
    margin: -4px;
    overflow: auto hidden;
    overscroll-behavior-x: contain;
  }

  .lists,
  .items {
    scrollbar-width: thin;
    scrollbar-color: color-mix(in srgb, var(--ui-sortable-text) 28%, transparent) transparent;
  }

  .list {
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 10px;
    min-inline-size: 0;
    padding: 12px;
    border: 1px solid var(--ui-sortable-border);
    border-radius: var(--ui-sortable-radius);
    background: var(--ui-sortable-lane);
    box-shadow: var(--ui-sortable-shadow);
  }

  .list[data-orientation="horizontal"] .items {
    display: flex;
    flex-wrap: nowrap;
    overflow: auto hidden;
    align-items: stretch;
    min-block-size: 0;
  }

  /* The cards live inside one root .tree wrapper, which is a vertical grid. Without this the
     lane was a flex row holding a single column, so a "horizontal" list rendered vertically. */
  .list[data-orientation="horizontal"] .items > .tree {
    display: flex;
    flex-wrap: nowrap;
    align-items: stretch;
    min-inline-size: min-content;
    margin-block: 0;
    margin-inline: calc(var(--ui-sortable-list-gap) / -2);
  }

  .list[data-orientation="horizontal"] .items > .tree > .item-shell {
    flex: 0 0 auto;
    min-inline-size: min(220px, 70vw);
    align-content: start;
    padding-block: 0;
    padding-inline: calc(var(--ui-sortable-list-gap) / 2);
  }

  .list[data-disabled="true"] {
    opacity: 0.62;
  }

  .list-header {
    display: grid;
    gap: 2px;
    padding: 2px 4px 0;
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
    font-size: 13px;
    line-height: 1.4;
    font-weight: 650;
    letter-spacing: 0.005em;
    color: var(--ui-sortable-text);
  }

  .list-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-inline-size: 22px;
    min-block-size: 20px;
    padding-inline: 7px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--ui-sortable-text) 7%, transparent);
    color: var(--ui-sortable-muted);
    font-size: 11.5px;
    font-weight: 650;
    font-variant-numeric: tabular-nums;
  }

  /* A list at its maxItems takes nothing more: the count turns to a warning colour. */
  .list[data-full="true"] .list-count {
    background: color-mix(in srgb, var(--ui-sortable-warning, #d97706) 16%, transparent);
    color: color-mix(in srgb, var(--ui-sortable-warning, #d97706) 80%, var(--ui-sortable-text));
  }

  .list-description,
  .list-helper {
    color: var(--ui-sortable-muted);
    font-size: 12px;
    line-height: 1.5;
  }

  .list-helper {
    font-size: 11.5px;
    opacity: 0.85;
  }

  .empty {
    display: grid;
    place-items: center;
    min-block-size: 64px;
    margin-block: calc(var(--ui-sortable-list-gap) / 2);
    padding: 14px;
    border: 1px dashed var(--ui-sortable-border-strong);
    border-radius: var(--ui-sortable-item-radius);
    color: var(--ui-sortable-muted);
    font-size: 12.5px;
    line-height: 1.5;
    text-align: center;
    transition: border-color 140ms ease, background 140ms ease, color 140ms ease;
  }

  .empty:has(+ .dropzone[data-active="true"]) {
    border-color: var(--ui-sortable-accent);
    background: color-mix(in srgb, var(--ui-sortable-accent) 7%, transparent);
    color: color-mix(in srgb, var(--ui-sortable-accent) 80%, var(--ui-sortable-text));
  }

  .items {
    display: grid;
    align-content: start;
    gap: 0;
    min-block-size: 88px;
    min-inline-size: 0;
  }

  /* A list with a height of its own scrolls by itself. The padding (and the cards' own spacing) gives shadows and
     focus rings room inside the scroller; the negative margin hands that room back to the layout. The wrapper's
     negative margin is dropped here: inside a scroller it would count as overflow, and a list whose cards all fit
     would still scroll by a few pixels. */
  .items[data-scroll="true"] {
    max-block-size: var(--ui-sortable-list-max-block-size);
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 1px 4px;
    margin: -4px;
  }

  .items[data-scroll="true"] > .tree {
    margin-block: 0;
  }

  .tree {
    display: grid;
    gap: 0;
    min-inline-size: 0;
    margin-block: calc(var(--ui-sortable-list-gap) / -2);
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

  /* The cards are spaced by the shell's padding, not by a grid gap: the drop rails between them take
     no height, so the list is as tall as its cards. */
  .item-shell {
    display: grid;
    gap: 0;
    min-inline-size: 0;
    padding-block: calc(var(--ui-sortable-list-gap) / 2);
  }

  .item {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: var(--ui-sortable-item-gap);
    min-inline-size: 0;
    padding: 9px 12px 9px 6px;
    border: 1px solid var(--ui-sortable-border);
    border-radius: var(--ui-sortable-item-radius);
    background: var(--ui-sortable-card);
    box-shadow: var(--ui-sortable-card-shadow);
    transition:
      opacity 160ms ease,
      box-shadow 160ms ease,
      border-color 160ms ease,
      background 160ms ease;
  }

  .item:hover {
    border-color: var(--ui-sortable-border-strong);
    box-shadow: var(--ui-sortable-card-shadow-hover);
  }

  .item:focus {
    outline: none;
  }

  .item:focus-visible {
    outline: 2px solid var(--ui-sortable-accent);
    outline-offset: 2px;
  }

  .item[data-drag-handle-mode="item"],
  .item[data-drag-handle-mode="custom"] {
    grid-template-columns: minmax(0, 1fr);
    padding-inline-start: 12px;
  }

  .item[data-drag-handle-mode="item"] {
    cursor: grab;
  }

  /* A card that is dragged by its body is held to lift on touch: no text selection or callout while holding. */
  .item[data-drag-handle-mode="item"],
  .item[data-drag-handle-mode="custom"] {
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
  }

  .item[data-drag-handle-mode="item"][data-dragging="true"] {
    cursor: grabbing;
  }

  .item[data-selected="true"] {
    border-color: color-mix(in srgb, var(--ui-sortable-accent) 60%, var(--ui-sortable-border));
    background: color-mix(in srgb, var(--ui-sortable-accent) 7%, var(--ui-sortable-card));
    box-shadow:
      0 0 0 1px color-mix(in srgb, var(--ui-sortable-accent) 28%, transparent),
      var(--ui-sortable-card-shadow);
  }

  .item[data-drop-inside-active="true"] {
    border-color: var(--ui-sortable-accent);
    background: color-mix(in srgb, var(--ui-sortable-accent) 10%, var(--ui-sortable-card));
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--ui-sortable-accent) 20%, transparent),
      var(--ui-sortable-card-shadow);
  }

  /* While a card is being dragged its place in the list stays as an empty slot, so the list does not
     jump; the card itself is the ghost that follows the pointer. */
  .item[data-dragging="true"] {
    border-style: dashed;
    border-color: color-mix(in srgb, var(--ui-sortable-accent) 45%, var(--ui-sortable-border));
    background: color-mix(in srgb, var(--ui-sortable-accent) 5%, var(--ui-sortable-card));
    box-shadow: none;
  }

  .item[data-dragging="true"] > * {
    visibility: hidden;
  }

  /* The keyboard drag shows the card at its destination as a quiet dashed card. */
  .item.item-placeholder {
    grid-template-columns: 1fr;
    padding-inline-start: 12px;
    border-style: dashed;
    border-color: color-mix(in srgb, var(--ui-sortable-accent) 55%, var(--ui-sortable-border));
    background: color-mix(in srgb, var(--ui-sortable-accent) 7%, var(--ui-sortable-card));
    box-shadow: none;
  }

  .placeholder-content {
    display: grid;
    gap: 3px;
    min-inline-size: 0;
  }

  .placeholder-kicker {
    font-size: 10.5px;
    line-height: 1.4;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--ui-sortable-accent) 78%, var(--ui-sortable-text));
  }

  .placeholder-title {
    font-size: 13.5px;
    line-height: 1.4;
    font-weight: 600;
    color: var(--ui-sortable-text);
  }

  .placeholder-description {
    color: var(--ui-sortable-muted);
    font-size: 12px;
    line-height: 1.5;
  }

  /* The card that follows the pointer: a copy of the real card, lifted. */
  .item.item-ghost {
    position: fixed;
    inset: 0 auto auto 0;
    z-index: 2147483647;
    box-sizing: border-box;
    max-inline-size: calc(100vw - 16px);
    margin: 0;
    pointer-events: none;
    cursor: grabbing;
    border-color: color-mix(in srgb, var(--ui-sortable-accent) 55%, var(--ui-sortable-border));
    background: var(--ui-sortable-card);
    box-shadow: var(--ui-sortable-lift-shadow);
    rotate: 1.2deg;
    scale: 1.025;
    transition: none;
    will-change: transform;
    animation: ui-sortable-lift 150ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
  }

  .item.item-ghost[data-count="stack"] {
    box-shadow:
      5px 5px 0 -1px var(--ui-sortable-card),
      5px 5px 0 0 var(--ui-sortable-border-strong),
      10px 10px 0 -2px var(--ui-sortable-card),
      10px 10px 0 -1px var(--ui-sortable-border-strong),
      var(--ui-sortable-lift-shadow);
  }

  .item.item-ghost[data-refused] {
    border-color: var(--ui-sortable-danger, #dc2626);
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--ui-sortable-danger, #dc2626) 22%, transparent),
      var(--ui-sortable-lift-shadow);
  }

  .item.item-ghost[data-refused] .handle {
    color: var(--ui-sortable-danger, #dc2626);
  }

  .item.item-ghost .handle {
    opacity: 1;
    color: var(--ui-sortable-accent);
    cursor: grabbing;
  }

  .item.item-ghost[data-compact="true"] .item-description,
  .item.item-ghost[data-compact="true"] .item-meta {
    display: none;
  }

  .ghost-badge {
    position: absolute;
    inset-block-start: -9px;
    inset-inline-end: -9px;
    min-inline-size: 22px;
    block-size: 22px;
    padding-inline: 6px;
    box-sizing: border-box;
    border-radius: 999px;
    background: var(--ui-sortable-accent);
    color: var(--ui-sortable-accent-contrast, #ffffff);
    font-size: 11px;
    font-weight: 700;
    line-height: 22px;
    text-align: center;
    box-shadow: 0 0 0 2px var(--ui-sortable-card);
  }

  /* Fallback when the dragged card cannot be copied. */
  .drag-pill {
    position: fixed;
    inset: 0 auto auto 0;
    z-index: 2147483647;
    padding: 8px 12px;
    border-radius: 999px;
    background: var(--ui-sortable-text);
    color: var(--ui-sortable-surface);
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    pointer-events: none;
    box-shadow: var(--ui-sortable-lift-shadow);
  }

  @keyframes ui-sortable-lift {
    from {
      rotate: 0deg;
      scale: 1;
    }
  }

  .item[data-disabled="true"] {
    opacity: 0.55;
  }

  .item-content {
    display: grid;
    gap: 2px;
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
    font-size: 13.5px;
    line-height: 1.4;
    font-weight: 600;
    color: var(--ui-sortable-text);
    overflow-wrap: anywhere;
  }

  .item-description {
    color: var(--ui-sortable-muted);
    font-size: 12px;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }

  .item-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .item-meta:has(.item-badge:not([hidden]):not(.drop-badge)),
  .item[data-drop-inside-active="true"] .item-meta {
    margin-block-start: 4px;
  }

  .item-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 1px 7px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--ui-sortable-text) 6%, transparent);
    color: var(--ui-sortable-muted);
    font-size: 10.5px;
    font-weight: 600;
    line-height: 1.6;
  }

  .item-badge.selection-badge {
    background: color-mix(in srgb, var(--ui-sortable-accent) 14%, transparent);
    color: color-mix(in srgb, var(--ui-sortable-accent) 82%, var(--ui-sortable-text));
  }

  .item-badge[hidden] {
    display: none;
  }

  .item-badge.drop-badge {
    display: none;
  }

  .item[data-drop-inside-active="true"] .item-badge.drop-badge {
    display: inline-flex;
    background: color-mix(in srgb, var(--ui-sortable-accent) 18%, var(--ui-sortable-card));
    color: color-mix(in srgb, var(--ui-sortable-accent) 80%, var(--ui-sortable-text));
  }

  /* A quiet grip: faint until the card is hovered, focused, selected or dragged. */
  .handle {
    display: inline-grid;
    place-items: center;
    inline-size: 22px;
    block-size: 28px;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: var(--ui-sortable-handle-radius);
    background: transparent;
    color: var(--ui-sortable-muted);
    opacity: 0.4;
    cursor: grab;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    transition:
      opacity 140ms ease,
      color 140ms ease,
      background 140ms ease;
  }

  .item:hover .handle,
  .item:focus-visible .handle,
  .item[data-selected="true"] .handle {
    opacity: 1;
  }

  .handle:hover {
    color: var(--ui-sortable-text);
    background: color-mix(in srgb, var(--ui-sortable-text) 8%, transparent);
  }

  .handle:active {
    cursor: grabbing;
  }

  .handle[disabled] {
    cursor: not-allowed;
    opacity: 0.25;
  }

  .handle svg {
    inline-size: 14px;
    block-size: 14px;
    fill: currentColor;
  }

  /* Nested cards hang off a guide line under their parent. */
  .children {
    display: grid;
    gap: 0;
    min-inline-size: 0;
    margin-inline-start: 11px;
    padding-block-start: calc(var(--ui-sortable-list-gap) / 2);
    padding-inline-start: var(--ui-sortable-indent);
    border-inline-start: 1px solid var(--ui-sortable-border-strong);
  }

  /* Drop rails take no height: they are the thin lines between cards, with an invisible hit area
     around them. The line shows only on the rail the pointer is over. */
  .dropzone {
    position: relative;
    display: block;
    block-size: var(--ui-sortable-dropzone-size);
    min-block-size: var(--ui-sortable-dropzone-size);
    min-inline-size: 0;
  }

  .dropzone::before {
    content: '';
    position: absolute;
    inset-block-start: 0;
    inset-inline: 0;
    block-size: 2px;
    margin-block-start: -1px;
    border-radius: 999px;
    background: var(--ui-sortable-accent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-sortable-accent) 20%, transparent);
    opacity: 0;
    transform: scaleX(0.35);
    transform-origin: center;
    transition: opacity 120ms ease, transform 160ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .dropzone::after {
    content: '';
    position: absolute;
    inset-inline: 0;
    inset-block: calc(var(--ui-sortable-dropzone-hit-size) * -1);
  }

  /* The last rail of a group only reaches up: below the last card the list body is already a drop area, and a
     hit area hanging out of the bottom would count as overflow in a list that scrolls. */
  .dropzone:last-child::after {
    inset-block-end: 0;
  }

  .dropzone[data-active="true"]::before {
    opacity: 1;
    transform: scaleX(1);
  }

  .root[data-drop-indicator-visibility="always"] .dropzone::before {
    opacity: 1;
    transform: scaleX(1);
    background: color-mix(in srgb, var(--ui-sortable-accent) 22%, transparent);
    box-shadow: none;
  }

  .root[data-drop-indicator-visibility="always"] .dropzone[data-active="true"]::before {
    background: var(--ui-sortable-accent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-sortable-accent) 20%, transparent);
  }

  /* A card shows "drop inside" by highlighting itself, so its inside rail draws nothing. */
  .root[data-dropzone-style="indicator"] .dropzone[data-mode="inside"]::before,
  .root[data-dropzone-style="indicator"] .dropzone[data-mode="inside"]::after {
    display: none;
  }

  .list[data-orientation="horizontal"] .dropzone {
    align-self: stretch;
    block-size: auto;
    min-block-size: 0;
    inline-size: var(--ui-sortable-dropzone-size);
    min-inline-size: var(--ui-sortable-dropzone-size);
  }

  .list[data-orientation="horizontal"] .dropzone::before {
    inset-block: 0;
    inset-inline: auto;
    inset-inline-start: 0;
    inline-size: 2px;
    block-size: auto;
    margin-block-start: 0;
    margin-inline-start: -1px;
    transform: scaleY(0.35);
  }

  .list[data-orientation="horizontal"] .dropzone::after {
    inset-block: 0;
    inset-inline: calc(var(--ui-sortable-dropzone-hit-size) * -1);
  }

  .list[data-orientation="horizontal"] .dropzone[data-active="true"]::before,
  .root[data-drop-indicator-visibility="always"] .list[data-orientation="horizontal"] .dropzone::before {
    transform: scaleY(1);
  }

  .dropzone-label {
    display: none;
  }

  /* dropzone-style="container": the target is drawn as a whole dashed card in place. */
  .root[data-dropzone-style="container"] .dropzone {
    display: grid;
    place-items: center;
    block-size: auto;
    min-block-size: var(--ui-sortable-dropzone-match-block-size, var(--ui-sortable-dropzone-container-min-block-size));
    inline-size: min(100%, var(--ui-sortable-dropzone-match-inline-size, 100%));
    max-inline-size: var(--ui-sortable-dropzone-container-max-inline-size, none);
    padding: 10px;
    border: 1px dashed color-mix(in srgb, var(--ui-sortable-accent) 45%, var(--ui-sortable-border));
    border-radius: var(--ui-sortable-item-radius);
    background: color-mix(in srgb, var(--ui-sortable-accent) 5%, var(--ui-sortable-card));
    opacity: 0.85;
    overflow: hidden;
  }

  .root[data-dropzone-style="container"] .list[data-orientation="horizontal"] .dropzone {
    min-block-size: var(--ui-sortable-dropzone-match-block-size, var(--ui-sortable-dropzone-container-min-block-size));
    min-inline-size: var(--ui-sortable-dropzone-match-inline-size, var(--ui-sortable-dropzone-container-min-inline-size));
    inline-size: auto;
  }

  .root[data-dropzone-style="container"] .dropzone::before,
  .root[data-dropzone-style="container"] .dropzone::after {
    display: none;
  }

  .root[data-dropzone-style="container"] .dropzone[data-active="true"] {
    opacity: 1;
    border-color: var(--ui-sortable-accent);
    background: color-mix(in srgb, var(--ui-sortable-accent) 10%, var(--ui-sortable-card));
  }

  .root[data-dropzone-style="container"] .dropzone[data-mode="inside"] {
    min-block-size: max(
      calc(var(--ui-sortable-dropzone-match-block-size, var(--ui-sortable-dropzone-container-min-block-size)) * 0.78),
      var(--ui-sortable-dropzone-container-min-block-size)
    );
  }

  .root[data-dropzone-style="container"] .dropzone-label {
    display: block;
    color: color-mix(in srgb, var(--ui-sortable-accent) 80%, var(--ui-sortable-text));
    font-size: 12px;
    font-weight: 650;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }

  .root[data-dropzone-style="container"][data-drop-indicator-visibility="active"] .dropzone {
    display: none;
  }

  .root[data-dropzone-style="container"][data-drop-indicator-visibility="active"] .dropzone[data-active="true"] {
    display: grid;
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

  /* Touch screens have no hover: keep the grip clearly visible. */
  @media (hover: none) {
    .handle {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .item,
    .handle,
    .empty,
    .dropzone::before {
      transition: none;
    }

    .item.item-ghost {
      animation: none;
      rotate: 0deg;
      scale: 1;
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

    .item[data-selected="true"],
    .item:focus-visible {
      outline: 2px solid Highlight;
    }

    .dropzone::before {
      background: Highlight;
      box-shadow: none;
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

// A short fingerprint of an item's or list's `data`. It is written into the markup while a render function is set,
// so a change to the data (which is not otherwise drawn) makes the card be drawn again.
function dataRevision(data: unknown): string {
  if (data === undefined) return '';
  let json: string;
  try {
    json = JSON.stringify(data) ?? '';
  } catch {
    return '';
  }
  let hash = 5381;
  for (let i = 0; i < json.length; i += 1) hash = ((hash << 5) + hash + json.charCodeAt(i)) | 0;
  return (hash >>> 0).toString(36);
}

function parseLabels(value: string | null): Partial<UISortableLabels> {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const labels: Partial<UISortableLabels> = {};
    (Object.keys(DEFAULT_LABELS) as Array<keyof UISortableLabels>).forEach((key) => {
      if (typeof parsed[key] === 'string') labels[key] = parsed[key];
    });
    return labels;
  } catch {
    return {};
  }
}

// A height for a list: a number is px; a string must be a plain length (no calc, no declarations), because
// it ends up in a style attribute.
function normalizeLength(value: unknown): string | undefined {
  if (typeof value === 'number') return Number.isFinite(value) && value > 0 ? `${value}px` : undefined;
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return /^(?:\d+\.?\d*|\.\d+)(?:px|rem|em|ch|vh|svh|dvh|vw|%)$/.test(trimmed) ? trimmed : undefined;
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

// `data` is the app's own: what leaves the component (events, getters, callbacks) is a copy, so changing it
// there cannot change what the component holds, and a copied card does not share its data with the original.
function copyData<T>(data: T): T {
  if (data === undefined || data === null || typeof data !== 'object') return data;
  try {
    return JSON.parse(JSON.stringify(data)) as T;
  } catch {
    return data;
  }
}

function publicItem(item: NormalizedItem): UISortableItem {
  const copy: UISortableItem = { ...item };
  if (item.data !== undefined) copy.data = copyData(item.data);
  return copy;
}

function publicList(list: NormalizedList): UISortableList {
  const copy: UISortableList = { ...list };
  if (list.data !== undefined) copy.data = copyData(list.data);
  return copy;
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
        : '',
      orientation: list?.orientation === 'horizontal' ? 'horizontal' : 'vertical',
      disabled: !!list?.disabled,
      cloneOnDrag: !!list?.cloneOnDrag,
      accepts: Array.isArray(list?.accepts)
        ? list.accepts.filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
        : undefined,
      maxItems: Number.isFinite(list?.maxItems) && Number(list.maxItems) >= 0 ? Math.floor(Number(list.maxItems)) : undefined,
      maxHeight: normalizeLength(list?.maxHeight),
      ...(list?.data !== undefined ? { data: list.data } : {}),
    });
  });

  if (normalized.length) return normalized;

  return [{
    id: 'default',
    label: 'Items',
    description: '',
    emptyLabel: '',
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
      ...(item?.data !== undefined ? { data: item.data } : {}),
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
    data: item.data,
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
    maxItems: list.maxItems,
    maxHeight: list.maxHeight,
    data: list.data,
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

// True when rendered branch markup holds at least one card. The keyboard-drag placeholder is a card too
// (class "item item-placeholder"), so a bare substring match on class="item" missed it.
function hasItemMarkup(html: string): boolean {
  return /class="item[\s"]/.test(html);
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
      'nest-trigger',
      'touch-hold-delay',
      'list-max-height',
      'group',
      'labels',
      'hide-toolbar',
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
  private _lastLabelsAttr: string | null = null;
  private _canDropCallback: ((info: UISortableDropInfo) => boolean) | null = null;
  private _renderItemFn: ((item: UISortableItem, context: UISortableRenderItemContext) => UISortableRenderResult) | null = null;
  private _renderListHeaderFn: ((list: UISortableList, context: UISortableRenderListHeaderContext) => UISortableRenderResult) | null = null;
  private _renderEmptyStateFn: ((list: UISortableList, context: UISortableRenderEmptyStateContext) => UISortableRenderResult) | null = null;
  private _labels: Partial<UISortableLabels> = {};
  private _hydratedPersistKey: string | null = null;
  private _cloneSeed = 1;
  private _dragImage: HTMLElement | null = null;
  private _dragImageOffset = { x: -14, y: -14 };
  private _pendingFocusId: string | null = null;
  private _pointerGesture: PointerGestureState | null = null;
  private _pendingDropTarget: DropTargetCandidate | null = null;
  private _pendingTimer: ReturnType<typeof setTimeout> | null = null;
  private _focusWasInside = false;
  private _revealPending = false;
  // The place in this element that a card held over it from another element (same group) would land.
  private _externalTarget: DropTarget | null = null;
  private static _instances = new Set<UISortable>();
  // Alt held during a pointer drag: it is what asks to nest instead of reorder (see UISortableNestTrigger).
  private _nestModifier = false;
  private _lastPointer: { x: number; y: number } | null = null;
  private _suppressAttributeRender = false;

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onDragStart = this._onDragStart.bind(this);
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);
    this._onPointerCancel = this._onPointerCancel.bind(this);
    this._onFocusIn = this._onFocusIn.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onContextMenu = this._onContextMenu.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onDocumentKeyUp = this._onDocumentKeyUp.bind(this);
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
    UISortable._instances.add(this);
    this.root.addEventListener('click', this._onClick);
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);
    this.root.addEventListener('dragstart', this._onDragStart as EventListener);
    this.root.addEventListener('pointerdown', this._onPointerDown as EventListener);
    this.root.addEventListener('focusin', this._onFocusIn);
    // Not passive: a held card has to stop the page from scrolling under the finger.
    this.root.addEventListener('touchmove', this._onTouchMove as EventListener, { passive: false });
    this.root.addEventListener('contextmenu', this._onContextMenu as EventListener);
    this.ownerDocument?.addEventListener('keydown', this._onDocumentKeyDown as EventListener, true);
    this.ownerDocument?.addEventListener('keyup', this._onDocumentKeyUp as EventListener, true);
    this.ownerDocument?.addEventListener('pointermove', this._onPointerMove as EventListener, true);
    this.ownerDocument?.addEventListener('pointerup', this._onPointerUp as EventListener, true);
    this.ownerDocument?.addEventListener('pointercancel', this._onPointerCancel as EventListener, true);
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onClick);
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    this.root.removeEventListener('dragstart', this._onDragStart as EventListener);
    this.root.removeEventListener('pointerdown', this._onPointerDown as EventListener);
    this.root.removeEventListener('focusin', this._onFocusIn);
    this.root.removeEventListener('touchmove', this._onTouchMove as EventListener);
    this.root.removeEventListener('contextmenu', this._onContextMenu as EventListener);
    this._clearHoldTimer();
    this.ownerDocument?.removeEventListener('keydown', this._onDocumentKeyDown as EventListener, true);
    this.ownerDocument?.removeEventListener('keyup', this._onDocumentKeyUp as EventListener, true);
    this.ownerDocument?.removeEventListener('pointermove', this._onPointerMove as EventListener, true);
    this.ownerDocument?.removeEventListener('pointerup', this._onPointerUp as EventListener, true);
    this.ownerDocument?.removeEventListener('pointercancel', this._onPointerCancel as EventListener, true);
    this._stopAutoScroll();
    this._removeDragImage();
    if (this._pendingTimer) clearTimeout(this._pendingTimer);
    this._pendingTimer = null;
    UISortable._instances.delete(this);
    this._setExternal(null);
    this._showExternalTarget(null);
    super.disconnectedCallback();
  }

  get lists(): UISortableList[] {
    return this._lists.map(publicList);
  }

  set lists(next: UISortableList[]) {
    this.setAttribute('lists', JSON.stringify(next ?? []));
  }

  get items(): UISortableItem[] {
    return this._items.map(publicItem);
  }

  set items(next: UISortableItem[]) {
    this.setAttribute('items', JSON.stringify(next ?? []));
  }

  /**
   * Decides whether items may go somewhere. It is asked wherever a place is considered: a refused place is not
   * highlighted, the keyboard skips it, a drop on it does nothing, and `moveSelection` returns false. Return
   * true to allow. It runs on every pointer move: keep it quick.
   */
  get canDrop(): ((info: UISortableDropInfo) => boolean) | null {
    return this._canDropCallback;
  }

  set canDrop(next: ((info: UISortableDropInfo) => boolean) | null | undefined) {
    this._canDropCallback = typeof next === 'function' ? next : null;
  }

  /**
   * Draws the inside of a card yourself, in plain JavaScript (React has `renderItem` on the wrapper). Return a
   * fresh DOM node, or a string of HTML; return nothing to keep the built-in card. It is called again whenever
   * the card is drawn anew, when its `data` changes, and when it is selected or deselected.
   */
  get renderItem(): ((item: UISortableItem, context: UISortableRenderItemContext) => UISortableRenderResult) | null {
    return this._renderItemFn;
  }

  set renderItem(next: ((item: UISortableItem, context: UISortableRenderItemContext) => UISortableRenderResult) | null | undefined) {
    this._renderItemFn = typeof next === 'function' ? next : null;
    this.requestRender();
  }

  /** Draws a list's header yourself. Return a fresh DOM node or a string of HTML; nothing keeps the built-in header. */
  get renderListHeader(): ((list: UISortableList, context: UISortableRenderListHeaderContext) => UISortableRenderResult) | null {
    return this._renderListHeaderFn;
  }

  set renderListHeader(next: ((list: UISortableList, context: UISortableRenderListHeaderContext) => UISortableRenderResult) | null | undefined) {
    this._renderListHeaderFn = typeof next === 'function' ? next : null;
    this.requestRender();
  }

  /** Draws what an empty list shows. Return a fresh DOM node or a string of HTML; nothing keeps the built-in message. */
  get renderEmptyState(): ((list: UISortableList, context: UISortableRenderEmptyStateContext) => UISortableRenderResult) | null {
    return this._renderEmptyStateFn;
  }

  set renderEmptyState(next: ((list: UISortableList, context: UISortableRenderEmptyStateContext) => UISortableRenderResult) | null | undefined) {
    this._renderEmptyStateFn = typeof next === 'function' ? next : null;
    this.requestRender();
  }

  /**
   * Elements with the same non-empty `group` can exchange items: a card held over another of them can be
   * dropped there, and both report it (`change`, with `external`). Ids must be unique across the group.
   */
  get group(): string {
    return this._group();
  }

  set group(next: string | null | undefined) {
    if (!next) this.removeAttribute('group');
    else this.setAttribute('group', next);
  }

  private _group(): string {
    return this.getAttribute('group')?.trim() || '';
  }

  /** The text the component shows, with any `labels` you set applied over the English defaults. */
  get labels(): UISortableLabels {
    return { ...DEFAULT_LABELS, ...this._labels };
  }

  set labels(next: Partial<UISortableLabels> | null | undefined) {
    if (!next || !Object.keys(next).length) this.removeAttribute('labels');
    else this.setAttribute('labels', JSON.stringify(next));
  }

  private _t(key: keyof UISortableLabels, vars?: Record<string, string | number>): string {
    const template = this._labels[key] ?? DEFAULT_LABELS[key];
    return template.replace(/\{(\w+)\}/g, (_match, name: string) => String(vars?.[name] ?? ''));
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
    this._revealPending = true;
    if (this._applyInteractiveStateInPlace({ restoreFocus: true })) return;
    this.requestRender();
  }

  /** Moves (or copies) the selected items. Returns false when nothing moved: no selection, a place that is not allowed, or `before-change` cancelled. */
  moveSelection(options: UISortableMoveOptions): boolean {
    this._syncSelectionFromAttribute(this.getAttribute('selection'));
    const movedRootIds = this._selectedRootIds();
    if (!movedRootIds.length) return false;
    return this._commitMove({
      listId: options.targetListId,
      parentId: options.parentId ?? null,
      beforeId: options.beforeId ?? null,
      mode: options.mode ?? (options.parentId ? 'inside' : 'before'),
    }, movedRootIds, !!options.clone, options.source ?? 'api');
  }

  /**
   * Moves (or, with `clone`, copies) the selected items into another `<ui-sortable>`: the same as dragging them
   * there, for code and for keyboard users. `options` is the place in `peer`. Returns false when nothing moved.
   */
  moveSelectionTo(peer: UISortable, options: UISortableMoveOptions): boolean {
    if (!peer || !(peer instanceof UISortable)) return false;
    if (peer === this) return this.moveSelection(options);
    this._syncSelectionFromAttribute(this.getAttribute('selection'));
    const rootIds = this._selectedRootIds();
    if (!rootIds.length) return false;
    return this._transferTo(peer, {
      listId: options.targetListId,
      parentId: options.parentId ?? null,
      beforeId: options.beforeId ?? null,
      mode: options.mode ?? (options.parentId ? 'inside' : 'before'),
    }, rootIds, !!options.clone, options.source ?? 'api');
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
        ? this._t('hintPausedSort')
        : this.filterQuery && !this.hasAttribute('allow-filtered-drag')
          ? this._t('hintPausedFilter')
          : this._t('hintDisabled')
      : this._dragState?.keyboard
        ? this._t('hintKeyboard')
        : dragHandleMode === 'item'
          ? this._t('hintItem')
          : usesCustomHandleSelector
            ? this._t('hintCustom')
            : this._t('hintHandle');
    const hideToolbar = this.hasAttribute('hide-toolbar');
    const nestHint = allowNesting && !dragLocked && !this._dragState?.keyboard
      ? this._t(this._nestTrigger() === 'area' ? 'hintNestArea' : this._nestTrigger() === 'modifier' ? 'hintNestModifier' : 'hintNestGutter')
      : '';

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
        <div class="toolbar" part="toolbar"${hideToolbar ? ' data-hidden="true"' : ''}>
          <div class="helper" id="ui-sortable-helper">${escapeHtml(nestHint ? `${helper} ${nestHint}` : helper)}</div>
          <div class="helper selection-summary" data-count="${selectionCount}">
            <span class="selection-pill" part="selection-count">${selectionCount}</span>
            <span class="selection-text">${escapeHtml(selectionCount === 1 ? this._t('selectedOne') : this._t('selectedMany'))}</span>
          </div>
        </div>
        <div class="lists" part="lists">
          ${this._lists.map((list) => {
            const records = recordsByList.get(list.id) || [];
            const content = records.length
              ? this._renderListTree(renderItems, list, focusedId, draggingIds, allowNesting, placeholderIds, showSelectionBadge)
              : '';
            const maxHeight = list.orientation === 'horizontal' ? undefined : list.maxHeight ?? normalizeLength(this.getAttribute('list-max-height'));
            const total = this._items.filter((item) => item.listId === list.id).length;
            const full = list.maxItems !== undefined && total >= list.maxItems;
            const helperText = list.disabled
              ? this._t('listReadOnly')
              : full
                ? this._t('listFull', { max: list.maxItems ?? 0 })
              : list.cloneOnDrag
                ? this._t('listClone')
                : list.accepts?.length
                  ? this._t('listAccepts', { lists: list.accepts.join(', ') })
                  : '';
            return `
              <section
                class="list"
                part="list"
                data-list-id="${escapeHtml(list.id)}"
                data-orientation="${list.orientation}"
                data-disabled="${list.disabled}"
                data-full="${full}"
                ${this._renderListHeaderFn || this._renderEmptyStateFn ? `data-rev="${dataRevision(list.data)}"` : ''}
                aria-label="${escapeHtml(list.label)}"
              >
                <header class="list-header">
                  <div class="list-custom-header" part="list-custom-header" data-list-header-target="${escapeHtml(list.id)}"></div>
                  <div class="list-default-header">
                    <div class="list-topline">
                      <div class="list-label">${escapeHtml(list.label)}</div>
                      <span class="list-count">${list.maxItems !== undefined ? `${total}/${list.maxItems}` : records.length}</span>
                    </div>
                    ${list.description ? `<div class="list-description">${escapeHtml(list.description)}</div>` : ''}
                    ${helperText ? `<div class="list-helper">${escapeHtml(helperText)}</div>` : ''}
                  </div>
                </header>
                <div class="items" part="items"${maxHeight ? ` data-scroll="true" style="--ui-sortable-list-max-block-size: ${maxHeight}"` : ''} role="${records.length ? 'listbox' : 'group'}" ${records.length ? 'aria-multiselectable="true"' : ''} aria-label="${escapeHtml(list.label)}" aria-describedby="ui-sortable-helper">
                  ${content || `<div class="list-custom-empty" part="list-custom-empty" data-list-empty-target="${escapeHtml(list.id)}"></div><div class="empty">${escapeHtml(list.emptyLabel || this._t('emptyList'))}</div>${this._renderDropzone({
                    listId: list.id,
                    parentId: null,
                    beforeId: null,
                    mode: 'before',
                  }, this._t('dropHere'))}`}
                </div>
              </section>
            `;
          }).join('')}
        </div>
        <div class="sr-only" aria-live="polite" aria-atomic="true">${escapeHtml(this._liveMessage)}</div>
      </div>
    `;

    const scroll = this._captureScroll();
    // A render replaces the cards, which drops the focus that was on one. Put it back, but only if it was ours:
    // a board that re-renders while someone types in a search box next to it must not take their focus.
    this._focusWasInside = !!this.root.activeElement;
    this.setContent(html);
    this._restoreScroll(scroll);
    this._fillCustomTargets();
    queueMicrotask(() => {
      this._restorePendingFocus();
      // A keyboard drag moves a placeholder card to the chosen place: keep it in sight.
      if (this._dragState?.keyboard) {
        this.root.querySelector<HTMLElement>('.item-placeholder')?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
      }
      this._applyCurrentDropTargetVisualState();
      this._applyLiveMessage();
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
      // The selection is kept only for ids that exist, so a selection that was set before the items (the order of a
      // React render, or of a script that assigns `selection` first) was emptied. Read it again against these items.
      this._lastSelectionAttr = null;
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

    const labelsAttr = this.getAttribute('labels');
    if (labelsAttr !== this._lastLabelsAttr) {
      this._lastLabelsAttr = labelsAttr;
      this._labels = parseLabels(labelsAttr);
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
    const id = this._pendingFocusId || (this._focusWasInside ? this._focusedId : null);
    this._focusWasInside = false;
    if (!id) return;
    const escapeSelector = typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
      ? CSS.escape(id)
      : id.replace(/"/g, '\\"');
    const target = this.root.querySelector<HTMLElement>(`.item[data-id="${escapeSelector}"]`);
    if (!target) return;
    if (document.activeElement !== target) {
      target.focus({ preventScroll: true });
    }
    if (this._revealPending) {
      // The keyboard moved the focus: show the card wherever it is, in its list, in the board or on the page.
      this._revealPending = false;
      target.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
    } else {
      this._revealInBoard(target);
    }
    this._pendingFocusId = null;
  }

  // Every render replaces the shadow content, which would send the board (and any list with its own
  // scrollbar) back to the start.
  private _captureScroll(): { board: number; lists: Map<string, { left: number; top: number }> } | null {
    const board = this.root.querySelector<HTMLElement>('.lists');
    if (!board) return null;
    const lists = new Map<string, { left: number; top: number }>();
    this.root.querySelectorAll<HTMLElement>('.list[data-list-id]').forEach((list) => {
      const items = list.querySelector<HTMLElement>('.items');
      const id = list.getAttribute('data-list-id');
      if (items && id && (items.scrollLeft || items.scrollTop)) lists.set(id, { left: items.scrollLeft, top: items.scrollTop });
    });
    return { board: board.scrollLeft, lists };
  }

  private _restoreScroll(state: { board: number; lists: Map<string, { left: number; top: number }> } | null): void {
    if (!state) return;
    const board = this.root.querySelector<HTMLElement>('.lists');
    if (board && state.board) board.scrollLeft = state.board;
    if (!state.lists.size) return;
    this.root.querySelectorAll<HTMLElement>('.list[data-list-id]').forEach((list) => {
      const saved = state.lists.get(list.getAttribute('data-list-id') || '');
      const items = list.querySelector<HTMLElement>('.items');
      if (!saved || !items) return;
      items.scrollLeft = saved.left;
      items.scrollTop = saved.top;
    });
  }

  // A board that scrolls sideways can hold the focused card off screen (after a drop into a far list,
  // or when the keyboard moves into one): bring that list into view.
  private _revealInBoard(target: HTMLElement): void {
    const board = this.root.querySelector<HTMLElement>('.lists');
    const list = target.closest<HTMLElement>('.list');
    if (!board || !list || board.scrollWidth <= board.clientWidth + 1) return;
    const boardRect = board.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    if (listRect.left < boardRect.left) {
      board.scrollLeft -= boardRect.left - listRect.left + 4;
    } else if (listRect.right > boardRect.right) {
      board.scrollLeft += Math.min(listRect.right - boardRect.right + 4, listRect.left - boardRect.left);
    }
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

  private _nestTrigger(): UISortableNestTrigger {
    const value = this.getAttribute('nest-trigger');
    return value === 'modifier' || value === 'area' ? value : 'gutter';
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

  // Fills the places the markup leaves for custom content (the inside of a card, a list header, an empty state)
  // from the render functions. Fresh markup has them empty; `itemIds` redraws just those cards.
  private _fillCustomTargets(only?: { itemIds: Set<string> }): void {
    if (!this._renderItemFn && !this._renderListHeaderFn && !this._renderEmptyStateFn) return;
    const dragLocked = this._isDragLocked();
    const listById = new Map(this._lists.map((list) => [list.id, list]));
    const apply = (target: HTMLElement, make: () => UISortableRenderResult) => {
      let result: UISortableRenderResult;
      try {
        result = make();
      } catch (error) {
        console.error('ui-sortable: a render function threw; the built-in markup is shown.', error);
        return;
      }
      if (typeof result === 'string') target.innerHTML = result;
      else if (result && typeof (result as Node).nodeType === 'number') target.replaceChildren(result as Node);
    };

    const renderItem = this._renderItemFn;
    if (renderItem) {
      const itemById = new Map(this._items.map((item) => [item.id, item]));
      const selected = new Set(this._selection);
      const handleSelector = this.getAttribute('drag-handle-selector')?.trim() || '';
      this.root.querySelectorAll<HTMLElement>('.item-custom-content[data-item-content-target]').forEach((target) => {
        const id = target.getAttribute('data-item-content-target') || '';
        if (only ? !only.itemIds.has(id) : target.hasChildNodes()) return;
        const item = itemById.get(id);
        if (!item) return;
        if (only) target.replaceChildren();
        const list = listById.get(item.listId);
        apply(target, () => renderItem(publicItem(item), {
          selected: selected.has(id),
          disabled: item.disabled,
          dragDisabled: item.dragDisabled,
          cloneOnDrag: item.cloneOnDrag || !!list?.cloneOnDrag,
          list: list ? publicList(list) : undefined,
        }));
        if (handleSelector) this._markCustomHandles(target, id, handleSelector);
      });
    }

    if (only) return;
    const renderHeader = this._renderListHeaderFn;
    if (renderHeader) {
      this.root.querySelectorAll<HTMLElement>('.list-custom-header[data-list-header-target]').forEach((target) => {
        if (target.hasChildNodes()) return;
        const list = listById.get(target.getAttribute('data-list-header-target') || '');
        if (!list) return;
        const itemCount = this._items.filter((item) => item.listId === list.id).length;
        apply(target, () => renderHeader(publicList(list), { itemCount, dragLocked }));
      });
    }

    const renderEmpty = this._renderEmptyStateFn;
    if (renderEmpty) {
      this.root.querySelectorAll<HTMLElement>('.list-custom-empty[data-list-empty-target]').forEach((target) => {
        if (target.hasChildNodes()) return;
        const list = listById.get(target.getAttribute('data-list-empty-target') || '');
        if (!list) return;
        const itemCount = this._items.filter((item) => item.listId === list.id).length;
        apply(target, () => renderEmpty(publicList(list), { itemCount, dragLocked, filterQuery: this.filterQuery }));
      });
    }
  }

  // The parts of a custom card that match `drag-handle-selector` start a drag, the way the built-in grip does.
  private _markCustomHandles(card: HTMLElement, id: string, selector: string): void {
    let handles: NodeListOf<HTMLElement>;
    try {
      handles = card.querySelectorAll<HTMLElement>(selector);
    } catch {
      return;
    }
    handles.forEach((handle) => {
      handle.setAttribute('data-sortable-custom-handle', '');
      handle.setAttribute('data-drag-trigger', 'custom');
      handle.setAttribute('data-id', id);
      if (!handle.hasAttribute('tabindex')) handle.setAttribute('tabindex', '-1');
    });
  }

  private _hasCustomItemRendering(): boolean {
    return this.hasAttribute('custom-item-rendering') || !!this._renderItemFn;
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
    const reselected = new Set<string>();
    this.root.querySelectorAll<HTMLElement>('.item[data-id]').forEach((itemEl) => {
      const id = itemEl.getAttribute('data-id');
      if (!id) return;
      const selected = selectedIds.has(id);
      if (itemEl.getAttribute('data-selected') === 'true' !== selected) reselected.add(id);
      const focused = this._focusedId === id;
      itemEl.setAttribute('data-selected', selected ? 'true' : 'false');
      itemEl.setAttribute('aria-selected', selected ? 'true' : 'false');
      itemEl.setAttribute('data-focused', focused ? 'true' : 'false');
      itemEl.setAttribute('tabindex', focused ? '0' : '-1');
      const selectionBadge = itemEl.querySelector<HTMLElement>('[data-selection-badge="true"]');
      if (selectionBadge) {
        const visible = selected && showSelectionBadge;
        selectionBadge.hidden = !visible;
        selectionBadge.textContent = visible ? this._t('badgeSelected') : '';
      }
    });

    // A card drawn by a render function is told whether it is selected, so it is drawn again when that changes.
    if (reselected.size && this._renderItemFn) this._fillCustomTargets({ itemIds: reselected });

    this.root.querySelector<HTMLElement>('.selection-summary')?.setAttribute('data-count', String(this._selection.length));
    const selectionPill = this.root.querySelector<HTMLElement>('.selection-pill');
    if (selectionPill) selectionPill.textContent = String(this._selection.length);

    const selectionText = this.root.querySelector<HTMLElement>('.selection-text');
    if (selectionText) {
      selectionText.textContent = this._selection.length === 1 ? this._t('selectedOne') : this._t('selectedMany');
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

  private _clearPointerDragPreview(): void {
    const rootEl = this.root.querySelector<HTMLElement>('.root');
    if (rootEl && !this._dragState?.keyboard) {
      rootEl.setAttribute('data-drag-preview', 'false');
    }
  }

  private _setDraggingVisualState(ids: string[], active: boolean): void {
    // A copy leaves the original where it is, so there is no empty slot to show.
    if (active && this._dragState?.clone && !this._dragState.keyboard) return;
    ids.forEach((id) => {
      const el = this._findItemElement(id);
      if (!el) return;
      el.setAttribute('data-dragging', active ? 'true' : 'false');
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
    // `data-drag-preview` is a styling hook: true while a pointer drag has a place to land.
    this.root.querySelector<HTMLElement>('.root')?.setAttribute('data-drag-preview', target ? 'true' : 'false');
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
    this._schedulePendingFlush(target ? DROP_TARGET_SETTLE_MS : DROP_TARGET_CLEAR_SETTLE_MS);
  }

  // The settle delay is judged on the next pointer event, so a pointer that has stopped (over a place that
  // refuses the drop, say) would leave the old highlight on. This applies the change once the delay is up.
  private _schedulePendingFlush(delay: number): void {
    if (this._pendingTimer) clearTimeout(this._pendingTimer);
    this._pendingTimer = setTimeout(() => {
      this._pendingTimer = null;
      const pending = this._pendingDropTarget;
      if (!pending || !this._dragState || this._dragState.committed || this._dragState.keyboard) return;
      this._setDropTarget(pending.target, pending.announceLabel ? { announceLabel: pending.announceLabel } : undefined);
    }, delay + 8);
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
    // Falling back to the last target forgives a release that lands in a gap between cards, but
    // only while the pointer is still over that target's list. Otherwise a release over another
    // list (or outside the board) committed a list the pointer had already left.
    const stillOverList = (target: DropTarget) => this._pointerIsOverList(target.listId, clientX, clientY);
    if (pending && this._canDrop(pending, this._dragState.movedRootIds) && stillOverList(pending)) return pending;
    const current = this._dragState.dropTarget ?? null;
    if (current && this._canDrop(current, this._dragState.movedRootIds) && stillOverList(current)) return current;
    return null;
  }

  private _pointerIsOverList(listId: string, clientX: number, clientY: number): boolean {
    if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) return true;
    const lists = Array.from(this.root.querySelectorAll<HTMLElement>('.list[data-list-id]'));
    const listElement = lists.find((element) => element.getAttribute('data-list-id') === listId);
    if (!listElement) return true;
    const rect = listElement.getBoundingClientRect();
    return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
  }

  private _pathFromPoint(clientX: number, clientY: number): HTMLElement[] {
    const path: HTMLElement[] = [];
    const shadowRoot = this.root as ShadowRoot & { elementFromPoint?: (x: number, y: number) => Element | null };
    let current: Node | null = typeof shadowRoot.elementFromPoint === 'function'
      ? shadowRoot.elementFromPoint(clientX, clientY)
      : this.ownerDocument?.elementFromPoint?.(clientX, clientY) ?? null;

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
        if (!matchesFilter(item, this.filterQuery) && !hasItemMarkup(descendants)) return;
        html += this._renderDropzone({
          listId: list.id,
          parentId,
          beforeId: id,
          mode: 'before',
        }, this._t('dropHere'));
        html += descendants;
      });
      html += this._renderDropzone({
        listId: list.id,
        parentId,
        beforeId: null,
        mode: 'before',
      }, this._t('dropHere'));
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
    const hasVisibleChildren = hasItemMarkup(childrenHtml);
    const selected = placeholder ? false : this._selection.includes(item.id);
    const dragging = placeholder ? false : draggingIds.has(item.id);
    const disabled = item.disabled;
    const handleDisabled = disabled || item.dragDisabled || this._isDragLocked();
    const dropInsideActive = this._dragState?.dropTarget?.mode === 'inside' && this._dragState.dropTarget.parentId === item.id;
    const placeholderKicker = this._t(this._dragState?.clone ? 'copyPreview' : 'dropPreview');
    const placeholderDescription = this._t(
      this._dragState?.clone
        ? 'releaseCopy'
        : this._dragState && this._dragState.movedRootIds.length > 1
          ? 'releaseMoveMany'
          : 'releaseMove'
    );
    const dragHandleMode = this._dragHandleMode();
    const usesCustomHandleSelector = this._usesCustomHandleSelector();
    const effectiveDragHandleMode = usesCustomHandleSelector ? 'custom' : dragHandleMode;
    const renderBuiltInHandle = !usesCustomHandleSelector && dragHandleMode === 'handle';

    return `
      <div class="item-shell" data-item-shell="${itemId}">
        <div
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
          ${this._renderItemFn && !placeholder ? `data-rev="${dataRevision(item.data)}"` : ''}
          role="${placeholder ? 'presentation' : 'option'}"
          aria-selected="${placeholder ? 'false' : selected}"
          aria-disabled="${disabled}"
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
                  <span
                    class="handle"
                    part="handle"
                    role="presentation"
                    aria-hidden="true"
                    data-action="handle"
                    data-drag-trigger="handle"
                    data-id="${itemId}"
                    draggable="false"
                    ${handleDisabled ? 'disabled' : ''}
                  >
                    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                      <circle cx="5" cy="4" r="1.25"></circle>
                      <circle cx="11" cy="4" r="1.25"></circle>
                      <circle cx="5" cy="8" r="1.25"></circle>
                      <circle cx="11" cy="8" r="1.25"></circle>
                      <circle cx="5" cy="12" r="1.25"></circle>
                      <circle cx="11" cy="12" r="1.25"></circle>
                    </svg>
                  </span>
                `
                : ''}
              <div class="item-content" data-action="select" data-id="${itemId}">
                <div class="item-custom-content" part="item-custom-content" data-item-content-target="${itemId}"></div>
                <div class="item-default-content">
                  <div class="item-title">${escapeHtml(item.label)}</div>
                  ${item.description ? `<div class="item-description">${escapeHtml(item.description)}</div>` : ''}
                  <div class="item-meta">
                    <span class="item-badge selection-badge" data-selection-badge="true" ${selected && showSelectionBadge ? '' : 'hidden'}>${selected && showSelectionBadge ? escapeHtml(this._t('badgeSelected')) : ''}</span>
                    ${item.cloneOnDrag ? `<span class="item-badge">${escapeHtml(this._t('badgeClone'))}</span>` : ''}
                    ${item.dragDisabled ? `<span class="item-badge">${escapeHtml(this._t('badgePinned'))}</span>` : ''}
                    ${allowNesting ? `<span class="item-badge drop-badge">${escapeHtml(this._t('nestHere'))}</span>` : ''}
                  </div>
                </div>
              </div>
            `
          }
        </div>
        ${allowNesting && !placeholder
          ? this._renderDropzone({
            listId: item.listId,
            parentId: item.id,
            beforeId: null,
            mode: 'inside',
          }, this._t('nestHere'))
          : ''}
        ${hasVisibleChildren ? `<div class="children">${childrenHtml}</div>` : ''}
      </div>
    `;
  }

  private _renderDropzone(target: DropTarget, label: string): string {
    const current = this._dragState?.dropTarget ?? this._externalTarget;
    const active = current
      && current.listId === target.listId
      && current.parentId === target.parentId
      && current.beforeId === target.beforeId
      && current.mode === target.mode;

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

  // Keys typed into a control that lives inside an item (an <input> or <button> in a custom card)
  // belong to that control: swallowing Space/Enter/arrows there made it impossible to type a space
  // or press the button from the keyboard. The drag handle is part of the item, not a foreign control.
  private _isForeignControl(event: KeyboardEvent): boolean {
    const origin = event.composedPath()[0];
    if (!(origin instanceof HTMLElement)) return false;
    if (origin.classList.contains('handle') || origin.classList.contains('item')) return false;
    return (
      origin.isContentEditable ||
      origin.matches('input, textarea, select, button, summary, a[href], [role="button"], [role="textbox"], [role="combobox"]')
    );
  }

  private _onKeyDown(event: KeyboardEvent): void {
    if (this._isForeignControl(event)) return;
    const visibleIds = this._visibleItemIds();
    if (!visibleIds.length) return;

    const currentId = this._focusedId && visibleIds.includes(this._focusedId) ? this._focusedId : visibleIds[0];
    const currentIndex = visibleIds.indexOf(currentId);
    const currentItem = this._items.find((item) => item.id === currentId);
    const list = currentItem ? this._lists.find((entry) => entry.id === currentItem.listId) : null;
    const isHorizontal = list?.orientation === 'horizontal';
    // In a right-to-left lane the next item is on the left, so the arrows swap.
    const rtl = this._isRtl();
    const forwardKey = isHorizontal ? (rtl ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown';
    const backwardKey = isHorizontal ? (rtl ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp';

    if (!this._dragState?.keyboard) {
      if (event.key === forwardKey) {
        event.preventDefault();
        this._moveFocusBy(visibleIds, currentIndex, 1);
        return;
      }
      if (event.key === backwardKey) {
        event.preventDefault();
        this._moveFocusBy(visibleIds, currentIndex, -1);
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        this._setSelection(visibleIds, 'keyboard');
        this._announce(this._t('announceSelectedMany', { count: visibleIds.length }));
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
          this._announce(this._t('announceDragDisabled'));
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
        const label = movedRootIds.length === 1
          ? this._t('announceLifted', { label: currentItem?.label || 'item' })
          : this._t('announceLiftedMany', { count: movedRootIds.length });
        this._announce(`${label} ${this._t('announceLiftedHelp')}`);
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
      const forwardArrow = rtl ? 'ArrowLeft' : 'ArrowRight';
      const direction = event.key === 'ArrowDown' || event.key === forwardArrow ? 1 : -1;
      this._moveKeyboardDropTarget(direction);
    }
  }

  private _isRtl(): boolean {
    const computed = this.ownerDocument?.defaultView?.getComputedStyle(this).direction;
    if (computed) return computed === 'rtl';
    return this.closest('[dir]')?.getAttribute('dir') === 'rtl';
  }

  private _moveFocusBy(visibleIds: string[], currentIndex: number, direction: 1 | -1): void {
    const nextIndex = Math.max(0, Math.min(visibleIds.length - 1, currentIndex + direction));
    const nextId = visibleIds[nextIndex];
    this._focusedId = nextId;
    this._pendingFocusId = nextId;
    this._revealPending = true;
    if (this._applyInteractiveStateInPlace({ restoreFocus: true })) return;
    this.requestRender();
  }

  // The browser must not start a native drag while a card is being dragged with the pointer (an image or a
  // link inside a card would): the pointer drag is the only drag.
  private _onDragStart(event: DragEvent): void {
    if (this._pointerGesture || (this._dragState && !this._dragState.keyboard)) event.preventDefault();
  }

  private _onDocumentKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Alt') {
      this._setNestModifier(true);
      return;
    }
    if (event.key !== 'Escape') return;
    if (!this._dragState || this._dragState.keyboard) return;
    event.preventDefault();
    this._cancelDrag(true);
  }

  private _onDocumentKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Alt') this._setNestModifier(false);
  }

  // Pressing or releasing Alt changes where a card would land without the pointer moving, so the target is
  // worked out again straight away.
  private _setNestModifier(held: boolean): void {
    if (this._nestModifier === held) return;
    this._nestModifier = held;
    if (!this._dragState || this._dragState.keyboard || this._dragState.committed || !this._lastPointer) return;
    this._retarget(this._lastPointer.x, this._lastPointer.y, { immediate: true });
  }

  // Works out where the held card would land at (x, y): in this element, or, when it is over another element of the
  // same group, in that one. `immediate` skips the short delay that stops the highlight flickering.
  private _retarget(x: number, y: number, how: { immediate?: boolean; timestamp?: number }): void {
    const drag = this._dragState;
    if (!drag || drag.keyboard || drag.committed) return;

    const over = this._externalAt(x, y);
    if (over) {
      // Over another element this one has no place of its own.
      if (drag.dropTarget) this._setDropTarget(null);
      this._pendingDropTarget = null;
      this._noteRefusal(!!over.target && !over.usable);
      this._setExternal(over.usable && over.target ? { peer: over.peer, target: over.target } : null);
      return;
    }
    this._setExternal(null);

    const target = this._dropTargetFromPoint(x, y);
    const usable = target && this._canDrop(target, drag.movedRootIds) ? target : null;
    this._noteRefusal(!!target && !usable);
    if (how.immediate) this._setDropTarget(usable);
    else this._queueDropTarget(usable, how.timestamp ?? performance.now());
  }

  // The other element of the same group under the pointer (this one wins where they overlap), and whether it
  // takes the held items at the place it found.
  private _peerUnder(x: number, y: number): UISortable | null {
    const group = this._group();
    if (!group) return null;
    const inside = (el: UISortable) => {
      const rect = el.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom && rect.width > 0 && rect.height > 0;
    };
    if (inside(this)) return null;
    for (const peer of UISortable._instances) {
      if (peer === this || peer._group() !== group || !peer.isConnected || peer.ownerDocument !== this.ownerDocument) continue;
      if (inside(peer)) return peer;
    }
    return null;
  }

  private _externalAt(x: number, y: number): { peer: UISortable; target: DropTarget | null; usable: boolean } | null {
    if (!this._dragState || this._dragState.keyboard) return null;
    const peer = this._peerUnder(x, y);
    if (!peer) return null;
    const session = this._sessionFor(this._dragState.movedRootIds, this._dragState.clone);
    peer._nestModifier = this._nestModifier;
    const target = peer._dropTargetFromPoint(x, y);
    const usable = !!target && peer._canDrop(target, session.rootIds, session.clone, session);
    return { peer, target, usable };
  }

  private _setExternal(next: { peer: UISortable; target: DropTarget } | null): void {
    const drag = this._dragState;
    if (!drag) return;
    const previous = drag.external ?? null;
    if (previous && next && previous.peer === next.peer && sameDropTarget(previous.target, next.target)) return;
    if (!previous && !next) {
      drag.external = null;
      return;
    }
    previous?.peer._showExternalTarget(null);
    drag.external = next;
    next?.peer._showExternalTarget(next.target);
  }

  // Marks the place in this element where a card held over it from another element would land.
  private _showExternalTarget(target: DropTarget | null): void {
    if (sameDropTarget(this._externalTarget, target)) return;
    this._setDropTargetVisualState(this._externalTarget, false);
    this._externalTarget = target;
    this._setDropTargetVisualState(target, true);
  }

  // The held items, with all their children, as they leave this element.
  private _sessionFor(rootIds: string[], clone: boolean): ExternalSession {
    const cached = this._dragState?.session;
    if (cached && cached.clone === clone && cached.rootIds.join() === rootIds.join()) return cached;
    const itemMap = buildItemMap(this._items);
    const groups = buildChildrenMap(this._items);
    const seen = new Set<string>();
    const items: NormalizedItem[] = [];
    const collect = (id: string) => {
      const item = itemMap.get(id);
      if (!item || seen.has(id)) return;
      seen.add(id);
      items.push(cloneItem(item));
      (groups.get(keyForGroup(item.listId, id)) || []).forEach(collect);
    };
    rootIds.forEach(collect);
    const session: ExternalSession = {
      source: this,
      rootIds: [...rootIds],
      items,
      clone,
      sourceListIds: Array.from(new Set(rootIds.map((id) => itemMap.get(id)?.listId).filter((id): id is string => !!id))),
    };
    if (this._dragState) this._dragState.session = session;
    return session;
  }

  // Moves (or copies) items into another element: both report it, and either can cancel it first.
  private _transferTo(
    peer: UISortable,
    target: DropTarget,
    rootIds: string[],
    clone: boolean,
    source: UISortableChangeSource
  ): boolean {
    const reject = () => {
      if (this._dragState) this._cancelDrag(false);
      this._announce(this._t('announceRejected'));
      return false;
    };
    const session = this._sessionFor(rootIds, clone);
    if (!peer._canDrop(target, session.rootIds, session.clone, session)) return reject();

    // What arrives: the items themselves, or copies with ids that are free there.
    const taken = new Set(peer._items.map((item) => item.id));
    const idMap = new Map<string, string>();
    session.items.forEach((item) => {
      if (!clone) {
        idMap.set(item.id, item.id);
        return;
      }
      const base = item.id.includes('--copy-') ? item.id.split('--copy-')[0] : item.id;
      let candidate = '';
      do candidate = `${base}--copy-${this._cloneSeed++}`;
      while (taken.has(candidate));
      taken.add(candidate);
      idMap.set(item.id, candidate);
    });
    const incoming = session.items.map((item) => {
      const rootIndex = session.rootIds.indexOf(item.id);
      return {
        ...cloneItem(item),
        id: idMap.get(item.id) || item.id,
        parentId: item.parentId && idMap.has(item.parentId) ? idMap.get(item.parentId) || null : null,
        listId: target.listId,
        label: clone && rootIndex === 0 ? `${item.label} copy` : item.label,
        ...(item.data !== undefined ? { data: copyData(item.data) } : {}),
      };
    });
    const incomingRootIds = session.rootIds.map((id) => idMap.get(id) || id);
    const projected = projectMoveItems(
      [...peer._items, ...incoming],
      peer._lists,
      target,
      incomingRootIds,
      false,
      (item) => item
    );

    const peerList = peer._lists.find((list) => list.id === target.listId);
    const peerPlan: MovePlan = {
      items: projected.items,
      movedIds: incomingRootIds,
      nextSelection: [...incomingRootIds],
      operation: clone ? 'clone' : target.mode === 'inside' ? 'nest' : 'transfer',
      target,
      clone,
      source,
      external: { direction: 'in', peer: this },
    };

    // This element only changes when the items leave it.
    let ownPlan: MovePlan | null = null;
    if (!clone) {
      const moving = new Set(session.items.map((item) => item.id));
      ownPlan = {
        items: normalizeItems(this._lists, this._items.filter((item) => !moving.has(item.id)).map(cloneItem)),
        movedIds: [...session.rootIds],
        nextSelection: this._selection.filter((id) => !moving.has(id)),
        operation: 'transfer',
        target,
        clone: false,
        source,
        external: { direction: 'out', peer },
        destination: peerList?.label || target.listId,
      };
    }

    if (!peer._askBeforeChange(peerPlan)) return reject();
    if (ownPlan && !this._askBeforeChange(ownPlan)) return reject();

    this._setExternal(null);
    peer._showExternalTarget(null);
    if (ownPlan) {
      this._applyPlan(ownPlan);
    } else {
      // A copy leaves this element as it was: the held card just lets go.
      if (this._dragState) this._dragState.committed = true;
      this._stopAutoScroll();
      this._clearPointerDragPreview();
      this._dragState = null;
      this._removeDragImage();
      this.requestRender();
    }
    peer._applyPlan(peerPlan);
    return true;
  }

  // Over a place that exists but will not take the drop (a full list, a read-only one, canDrop said no) the
  // lifted card says so.
  private _noteRefusal(refused: boolean): void {
    if (this._dragImage?.toggleAttribute) this._dragImage.toggleAttribute('data-refused', refused);
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
    if (!itemElement) {
      // Neither a rail nor a card, but still inside a list: the empty body of an empty list, the
      // space under the last card, or the header. A list reads as one drop area, so append to it
      // rather than ignoring the drop (the only other hot spots are thin rails between cards).
      const listElement = pathLike.find(
        (node): node is HTMLElement => node instanceof HTMLElement && node.classList.contains('list') && node.hasAttribute('data-list-id')
      );
      const listId = listElement?.getAttribute('data-list-id');
      if (!listId) return null;
      return { listId, parentId: null, beforeId: null, mode: 'before' };
    }

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
    const fromStart = (pointer - start) / size;
    // In a right-to-left lane the leading edge of a card is its right edge, so "before" is the
    // right third and "after" the left third; measuring from the left mirrored both.
    const ratio = isHorizontal && this._isRtl() ? 1 - fromStart : fromStart;
    const allowNesting = this.getAttribute('allow-nesting') !== 'false' && !item.disabled;
    const trigger = this._nestTrigger();

    // 'area' keeps the old rule: the middle of a card nests. Otherwise a plain drag always reorders (the
    // top half is "before", the bottom half "after") and nesting has to be asked for.
    const nest = allowNesting && (
      trigger === 'area'
        ? ratio > 0.34 && ratio <= 0.74
        : ratio >= 0.25 && ratio <= 0.75 && (
          this._nestModifier || (trigger === 'gutter' && this._inNestGutter(rect, clientX, clientY, isHorizontal))
        )
    );
    const before = trigger === 'area' ? ratio <= 0.34 : ratio < 0.5;

    if (nest) {
      return {
        listId: item.listId,
        parentId: item.id,
        beforeId: null,
        mode: 'inside',
      };
    }

    if (before) {
      return {
        listId: item.listId,
        parentId: item.parentId,
        beforeId: item.id,
        mode: 'before',
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

  // The far side of a card (its right in a left-to-right list, the bottom of a card in a horizontal lane):
  // somewhere a pointer only goes on purpose, and the only way to nest without a keyboard.
  private _inNestGutter(rect: DOMRect, clientX: number, clientY: number, isHorizontal: boolean): boolean {
    if (isHorizontal) {
      const size = rect.bottom - rect.top;
      return clientY >= rect.bottom - Math.max(24, Math.min(70, size * 0.3));
    }
    const size = rect.right - rect.left;
    const width = Math.max(48, Math.min(140, size * 0.3));
    return this._isRtl() ? clientX <= rect.left + width : clientX >= rect.right - width;
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
      this._dragState.clone,
      { x: this._pointerGesture.startX, y: this._pointerGesture.startY }
    );
    this._setDraggingVisualState(this._draggingIds(), true);
    this._announceDragging(item.label, this._dragState.movedRootIds.length, this._dragState.clone);
  }

  private _onPointerDown(event: PointerEvent): void {
    const activator = this._dragActivatorFromPath(event.composedPath());
    const id = activator?.id;
    if (!activator || !id) return;
    if (this._isDragLocked()) {
      event.preventDefault();
      this._announce(this._t('announceDragDisabled'));
      return;
    }

    const item = this._items.find((entry) => entry.id === id);
    if (!item || item.disabled || item.dragDisabled) {
      event.preventDefault();
      return;
    }

    // A finger on the card itself must still be able to scroll the page, so it is not claimed until held.
    const hold = event.pointerType === 'touch' && activator.kind !== 'handle' && this._touchHoldDelay() > 0;
    if (!hold) event.preventDefault();
    try {
      activator.element.setPointerCapture?.(event.pointerId);
    } catch {
      // Synthetic or browser-managed pointer streams may not always expose capture.
    }

    this._clearHoldTimer();
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
      hold,
      holdTimer: null,
    };

    if (hold) {
      const gesture = this._pointerGesture;
      gesture.holdTimer = setTimeout(() => {
        gesture.holdTimer = null;
        if (this._pointerGesture !== gesture || gesture.moved) return;
        gesture.hold = false;
        gesture.moved = true;
        this._beginPointerDrag(gesture.startX, gesture.startY);
        this._lastPointer = { x: gesture.startX, y: gesture.startY };
        // A short buzz says "lifted" where there is no hover to say it.
        try {
          (this.ownerDocument?.defaultView?.navigator as Navigator | undefined)?.vibrate?.(8);
        } catch {
          // Haptics are optional.
        }
      }, this._touchHoldDelay());
    }
  }

  private _touchHoldDelay(): number {
    const raw = this.getAttribute('touch-hold-delay');
    if (raw === null || raw.trim() === '') return TOUCH_HOLD_MS;
    const value = Number(raw);
    return Number.isFinite(value) ? Math.min(2000, Math.max(0, value)) : TOUCH_HOLD_MS;
  }

  private _clearHoldTimer(): void {
    if (this._pointerGesture?.holdTimer) clearTimeout(this._pointerGesture.holdTimer);
    if (this._pointerGesture) this._pointerGesture.holdTimer = null;
  }

  // While a card is lifted (or about to be) the finger must drag it, not scroll the page.
  private _onTouchMove(event: TouchEvent): void {
    const lifted = !!this._dragState && !this._dragState.keyboard;
    if (lifted && event.cancelable) event.preventDefault();
  }

  // A long press raises the system's context menu (copy, save image): not while a card is held.
  private _onContextMenu(event: Event): void {
    if (this._pointerGesture?.pointerType === 'touch' || (this._dragState && !this._dragState.keyboard)) event.preventDefault();
  }

  private _onPointerMove(event: PointerEvent): void {
    if (!this._pointerGesture || event.pointerId !== this._pointerGesture.pointerId) return;
    if (this._pointerGesture.hold) {
      // Not held long enough yet: a finger that travels now was scrolling, not dragging.
      const travelled = Math.hypot(event.clientX - this._pointerGesture.startX, event.clientY - this._pointerGesture.startY);
      if (travelled > TOUCH_HOLD_SLOP_PX) {
        this._clearHoldTimer();
        this._pointerGesture = null;
      }
      return;
    }
    event.preventDefault();
    if (!this._pointerGesture.moved) {
      const distance = Math.hypot(event.clientX - this._pointerGesture.startX, event.clientY - this._pointerGesture.startY);
      if (distance < 6) return;
      this._pointerGesture.moved = true;
      this._beginPointerDrag(event.clientX, event.clientY);
    }

    if (!this._dragState || this._dragState.keyboard) return;
    this._nestModifier = !!event.altKey;
    this._lastPointer = { x: event.clientX, y: event.clientY };
    this._movePointerPreview(event.clientX, event.clientY);
    this._updateAutoScroll(event.clientX, event.clientY);
    this._retarget(event.clientX, event.clientY, { timestamp: event.timeStamp });
  }

  private _autoScrollFrame = 0;
  private _autoScrollPoint: { x: number; y: number } | null = null;

  // Holding a dragged card near an edge scrolls what is under it: the board sideways, the list under
  // the pointer when it has its own scrollbar, and the page (or the nearest scrolling container) up
  // and down, so lists and positions that are off screen can be reached with the pointer.
  private _updateAutoScroll(x: number, y: number): void {
    this._autoScrollPoint = { x, y };
    if (!this._autoScrollFrame && typeof requestAnimationFrame === 'function') {
      this._autoScrollFrame = requestAnimationFrame(this._autoScrollTick);
    }
  }

  private _stopAutoScroll(): void {
    if (this._autoScrollFrame && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(this._autoScrollFrame);
    this._autoScrollFrame = 0;
    this._autoScrollPoint = null;
  }

  private _autoScrollTick = (): void => {
    this._autoScrollFrame = 0;
    const point = this._autoScrollPoint;
    if (!point || !this._dragState || this._dragState.keyboard) return;

    const view = this.ownerDocument?.defaultView;
    let scrolled = this._scrollOwn(point.x, point.y);
    // A board of another element under the pointer scrolls as well.
    const peer = this._peerUnder(point.x, point.y);
    if (peer && peer._scrollOwn(point.x, point.y)) scrolled = true;

    const scroller = findScrollParent(this);
    const bounds = scroller ? scroller.getBoundingClientRect() : null;
    const top = Math.max(0, bounds ? bounds.top : 0);
    const bottom = Math.min(view?.innerHeight ?? 0, bounds ? bounds.bottom : Infinity);
    const delta = edgeScrollDelta(point.y, top, bottom);
    if (delta) {
      if (scroller) scroller.scrollTop += delta;
      else view?.scrollBy(0, delta);
      scrolled = true;
    }

    if (!scrolled) return;

    // The content moved under a stationary pointer, so the target under it has changed.
    this._retarget(point.x, point.y, { timestamp: performance.now() });
    this._autoScrollFrame = requestAnimationFrame(this._autoScrollTick);
  };

  // Scrolls this element's own board sideways, and the list under (x, y) when it has a scrollbar of its own, if the
  // pointer is at their edge. True when something moved.
  private _scrollOwn(x: number, y: number): boolean {
    const view = this.ownerDocument?.defaultView;
    let scrolled = false;

    const board = this.root.querySelector<HTMLElement>('.lists');
    if (board && board.scrollWidth > board.clientWidth + 1) {
      const bounds = board.getBoundingClientRect();
      const dx = edgeScrollDelta(x, Math.max(0, bounds.left), Math.min(view?.innerWidth ?? Infinity, bounds.right));
      if (dx) {
        board.scrollLeft += dx;
        scrolled = true;
      }
    }

    const list = this._pathFromPoint(x, y).find((node) => node.classList?.contains('items'));
    if (list && list.scrollHeight > list.clientHeight + 1 && view?.getComputedStyle(list).overflowY !== 'visible') {
      const bounds = list.getBoundingClientRect();
      const dy = edgeScrollDelta(y, bounds.top, bounds.bottom);
      if (dy) {
        list.scrollTop += dy;
        scrolled = true;
      }
    }
    return scrolled;
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
    this._clearHoldTimer();
    this._pointerGesture = null;
    this._stopAutoScroll();
    if (!this._dragState || this._dragState.keyboard) return;
    this._nestModifier = !!event.altKey;

    // Released over another element of the group: the items go there, or, if it will not take them, nowhere.
    const over = gesture.moved ? this._externalAt(event.clientX, event.clientY) : null;
    if (over) {
      if (over.usable && over.target) {
        this._transferTo(over.peer, over.target, this._dragState.movedRootIds, this._dragState.clone, 'pointer');
      } else {
        this._cancelDrag(true);
      }
      return;
    }

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
    this._clearHoldTimer();
    this._pointerGesture = null;
    this._stopAutoScroll();
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
    this._announce(this._t('announceSelectedMany', { count: next.length }));
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
    this._announce(this._t('announceSelectedMany', { count: to - from + 1 }));
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

  // `incoming` is set when the items come from another element: they are not in this one yet, so the checks
  // that refer to them (they cannot be dropped inside themselves) are replaced by the ones that matter for
  // newcomers (their ids must be free here).
  private _canDrop(
    target: DropTarget,
    movedRootIds: string[],
    clone = this._dragState?.clone ?? false,
    incoming?: ExternalSession
  ): boolean {
    if (this._isDragLocked()) return false;
    const targetList = this._lists.find((list) => list.id === target.listId);
    if (!targetList || targetList.disabled) return false;

    const itemMap = buildItemMap(this._items);
    const movingSet = new Set<string>();
    const groups = buildChildrenMap(this._items);

    if (incoming) {
      incoming.items.forEach((item) => movingSet.add(item.id));
    } else {
      const collect = (id: string) => {
        movingSet.add(id);
        const item = itemMap.get(id);
        if (!item) return;
        (groups.get(keyForGroup(item.listId, id)) || []).forEach(collect);
      };
      movedRootIds.forEach(collect);

      if (target.parentId && movingSet.has(target.parentId)) return false;
      if (target.beforeId && movingSet.has(target.beforeId)) return false;
    }

    // A copy gets fresh ids; a move keeps its own, so they must not clash with what is already here.
    if (incoming && !incoming.clone && incoming.items.some((item) => itemMap.has(item.id))) return false;

    const sourceLists = incoming
      ? incoming.sourceListIds
      : Array.from(new Set(movedRootIds.map((id) => itemMap.get(id)?.listId).filter(Boolean))) as string[];
    if (targetList.accepts?.length && sourceLists.some((listId) => !targetList.accepts?.includes(listId))) return false;

    if (target.mode === 'inside' && this.getAttribute('allow-nesting') === 'false') return false;

    if (targetList.maxItems !== undefined) {
      // What the list would hold afterwards: its items now, plus what comes in from elsewhere (a copy brings all
      // of its items). A reorder inside the list adds nothing, so a list that is already over the limit can still
      // be reordered and emptied.
      const inList = this._items.filter((item) => item.listId === target.listId);
      const brought = incoming
        ? incoming.items.length
        : clone
          ? movingSet.size
          : Array.from(movingSet).filter((id) => itemMap.get(id)?.listId !== target.listId).length;
      if (brought > 0 && inList.length + brought > targetList.maxItems) return false;
    }

    const callback = this._canDropCallback;
    if (callback) {
      try {
        const roots = incoming
          ? incoming.items.filter((item) => incoming.rootIds.includes(item.id))
          : movedRootIds.map((id) => itemMap.get(id)).filter((item): item is NormalizedItem => !!item);
        const allowed = callback({
          items: roots.map(publicItem),
          movedIds: [...movedRootIds],
          targetListId: target.listId,
          parentId: target.parentId,
          beforeId: target.beforeId,
          mode: target.mode,
          clone,
          ...(incoming ? { from: incoming.source } : {}),
        });
        if (!allowed) return false;
      } catch (error) {
        // A predicate that throws cannot be trusted to have said yes.
        console.error('ui-sortable: canDrop threw; the drop is refused.', error);
        return false;
      }
    }

    return true;
  }

  private _commitMove(
    target: DropTarget,
    movedRootIds: string[],
    clone: boolean,
    source: UISortableChangeSource
  ): boolean {
    if (!this._canDrop(target, movedRootIds, clone)) return false;

    const itemMap = buildItemMap(this._items);
    const projected = projectMoveItems(
      this._items,
      this._lists,
      target,
      movedRootIds,
      clone,
      (item, orderedMovingIds) => this._cloneSubtreeItem(item, orderedMovingIds)
    );

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

    const plan: MovePlan = {
      items: projected.items,
      movedIds: projected.insertedRootIds,
      nextSelection: [...projected.insertedRootIds],
      operation,
      target,
      clone,
      source,
    };
    if (!this._askBeforeChange(plan)) {
      // Put the card back where it came from and say so.
      if (this._dragState) this._cancelDrag(false);
      this._announce(this._t('announceRejected'));
      return false;
    }
    this._applyPlan(plan);
    return true;
  }

  // The last word before anything changes: a listener of `before-change` can cancel the move.
  private _askBeforeChange(plan: MovePlan): boolean {
    return this.dispatchEvent(new CustomEvent<UISortableBeforeChangeDetail>('before-change', {
      detail: {
        items: plan.items.map(publicItem),
        lists: this.lists,
        selection: [...plan.nextSelection],
        previousSelection: [...this._selection],
        movedIds: [...plan.movedIds],
        source: plan.source,
        operation: plan.operation,
        persistence: getPersistenceSnapshot(plan.items),
        target: { listId: plan.target.listId, parentId: plan.target.parentId, beforeId: plan.target.beforeId, mode: plan.target.mode },
        clone: plan.clone,
        ...(plan.external ? { external: plan.external } : {}),
      },
      bubbles: true,
      composed: true,
      cancelable: true,
    }));
  }

  // Makes a move that was accepted real: the items, the selection, the attributes, the saved positions, the
  // events and the announcement.
  private _applyPlan(plan: MovePlan): void {
    const previousSelection = [...this._selection];
    if (this._dragState) this._dragState.committed = true;
    this._items = plan.items.map(cloneItem);
    this._clearPointerDragPreview();
    this._dragState = null;
    this._removeDragImage();

    this._selection = [...plan.nextSelection];
    this._focusedId = plan.nextSelection[0] || null;
    this._pendingFocusId = this._focusedId;
    this._syncAttributesFromState();

    const snapshot = getPersistenceSnapshot(this._items);
    this._persistSnapshot(snapshot);

    const detail: UISortableChangeDetail = {
      items: this.items,
      lists: this.lists,
      selection: [...plan.nextSelection],
      previousSelection,
      movedIds: [...plan.movedIds],
      source: plan.source,
      operation: plan.operation,
      persistence: snapshot,
      ...(plan.external ? { external: plan.external } : {}),
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
    this._announce(this._messageForMove(plan.operation, plan.movedIds.length, plan.target, plan.destination));
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
      data: copyData(item.data),
    };
  }

  private _messageForMove(operation: UISortableOperation, count: number, target: DropTarget, named?: string): string {
    const list = this._lists.find((entry) => entry.id === target.listId);
    const destination = named || list?.label || target.listId;
    const vars = { count, list: destination };
    if (operation === 'clone') return this._t(count === 1 ? 'announceCopiedOne' : 'announceCopiedMany', vars);
    if (operation === 'nest') return this._t(count === 1 ? 'announceNestedOne' : 'announceNestedMany', vars);
    if (operation === 'transfer') return this._t(count === 1 ? 'announceMovedOne' : 'announceMovedMany', vars);
    return this._t(count === 1 ? 'announceReorderedOne' : 'announceReorderedMany', vars);
  }

  private _announceDragging(label: string, count: number, clone: boolean): void {
    if (count === 1) this._announce(this._t(clone ? 'announceDraggingCopy' : 'announceDragging', { label }));
    else this._announce(this._t(clone ? 'announceDraggingCopyMany' : 'announceDraggingMany', { count }));
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
    this._stopAutoScroll();
    if (!this._dragState) return;
    // Un-mark the cards first: the re-render below does not always replace them (the restored
    // snapshot equals what is already on screen), which left a card faded as "being dragged".
    this._setDraggingVisualState(this._draggingIds(), false);
    this._pendingDropTarget = null;
    this._setExternal(null);
    this._setDropTargetVisualState(this._dragState.dropTarget, false);
    this._clearPointerDragPreview();
    this._items = this._dragState.snapshot.map(cloneItem);
    this._dragState = null;
    this._clearHoldTimer();
    this._pointerGesture = null;
    this._removeDragImage();
    if (announce) this._announce(this._t('announceCancelled'));
    this._syncAttributesFromState();
    this.requestRender();
  }

  private _removeDragImage(): void {
    this._dragImage?.remove();
    this._dragImage = null;
  }

  private _applyPointerPreview(
    clientX: number,
    clientY: number,
    count: number,
    clone: boolean,
    grab?: { x: number; y: number }
  ): void {
    this._removeDragImage();
    const source = this._dragState ? this._findItemElement(this._dragState.originId) : null;
    const ghost = source ? this._buildDragGhost(source, count, clone, grab) : null;

    if (ghost) {
      this.root.appendChild(ghost);
      this._dragImage = ghost;
    } else {
      const pill = document.createElement('div');
      pill.className = 'drag-pill';
      pill.textContent = clone
        ? count === 1 ? this._t('copyingOne') : this._t('copyingMany', { count })
        : count === 1 ? this._t('movingOne') : this._t('movingMany', { count });
      this.root.appendChild(pill);
      this._dragImage = pill;
      this._dragImageOffset = { x: -14, y: -14 };
    }
    this._movePointerPreview(clientX, clientY);
  }

  // The ghost is a copy of the card being dragged, so it looks like the thing you picked up. It is
  // inert and carries no ids, so nothing that looks cards up by id can find it.
  private _buildDragGhost(
    source: HTMLElement,
    count: number,
    clone: boolean,
    grab?: { x: number; y: number }
  ): HTMLElement {
    const rect = source.getBoundingClientRect();
    const ghost = source.cloneNode(true) as HTMLElement;
    ghost.classList.add('item-ghost');
    ['id', 'data-id', 'data-drag-trigger', 'tabindex', 'role', 'aria-selected', 'aria-disabled'].forEach((name) => {
      ghost.removeAttribute(name);
    });
    ghost.querySelectorAll('[id], [data-id], [data-drag-trigger], [tabindex]').forEach((node) => {
      ['id', 'data-id', 'data-drag-trigger', 'tabindex'].forEach((name) => node.removeAttribute(name));
    });
    ghost.setAttribute('part', 'drag-ghost');
    ghost.setAttribute('aria-hidden', 'true');
    ghost.setAttribute('inert', '');
    ghost.setAttribute('data-dragging', 'false');
    ghost.setAttribute('data-focused', 'false');
    ghost.setAttribute('data-drop-inside-active', 'false');
    if (count > 1) ghost.setAttribute('data-count', 'stack');
    if (count > 1 || clone) {
      const badge = document.createElement('span');
      badge.className = 'ghost-badge';
      badge.textContent = count > 1 ? String(count) : '+';
      ghost.appendChild(badge);
    }
    // drag-preview-size="compact" carries a narrower card with just its title.
    const compact = this.getAttribute('drag-preview-size') === 'compact';
    if (compact) ghost.setAttribute('data-compact', 'true');
    const width = compact ? Math.min(rect.width, 240) : rect.width;
    ghost.style.inlineSize = `${Math.round(width)}px`;

    const hasGrab = !!grab && Number.isFinite(grab.x) && Number.isFinite(grab.y);
    this._dragImageOffset = {
      x: hasGrab ? Math.min(Math.max(grab!.x - rect.left, 0), width) : width / 2,
      y: hasGrab ? Math.min(Math.max(grab!.y - rect.top, 0), rect.height) : rect.height / 2,
    };
    return ghost;
  }

  private _movePointerPreview(clientX: number, clientY: number): void {
    const image = this._dragImage;
    if (!image) return;
    // A render replaces the shadow content, which drops the ghost: put it back.
    if (!image.isConnected) this.root.appendChild(image);
    image.style.transform = `translate(${Math.round(clientX - this._dragImageOffset.x)}px, ${Math.round(clientY - this._dragImageOffset.y)}px)`;
  }

  private _keyboardDropTargets(): KeyboardDropTarget[] {
    const itemMap = buildItemMap(this._items);
    const groups = buildChildrenMap(this._items);
    const targets: KeyboardDropTarget[] = [];

    const allowNesting = this.getAttribute('allow-nesting') !== 'false';
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
          label: this._t('targetBefore', { label: item.label }),
        });
        if (allowNesting) {
          targets.push({
            listId,
            parentId: id,
            beforeId: null,
            mode: 'inside',
            label: this._t('targetInside', { label: item.label }),
          });
        }
        walk(listId, id);
      });
      // The end of a list is always a destination (it is how an empty list is reached). The end of
      // an item's children only is one when it has children and nesting is allowed: a childless
      // item already has "Nest inside", and with nesting off it is not a position at all (it used
      // to be offered anyway, so ArrowDown stalled on it and Enter nested the item).
      if (!parentId) {
        targets.push({
          listId,
          parentId,
          beforeId: null,
          mode: 'before',
          label: this._t('targetEnd', { list: this._lists.find((list) => list.id === listId)?.label || listId }),
        });
      } else if (allowNesting && ids.length > 0) {
        targets.push({
          listId,
          parentId,
          beforeId: null,
          mode: 'before',
          label: this._t('targetAfterChildren'),
        });
      }
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
