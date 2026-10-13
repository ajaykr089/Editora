import * as React from 'react';
import type {
  UISortable,
  UISortableList,
  UISortableItem,
  UISortableMoveOptions,
  UISortableDropMode,
  UISortableSortMode,
  UISortableChangeSource,
  UISortableOperation,
  UISortableSelectionChangeDetail,
  UISortablePersistenceRecord,
  UISortablePersistenceSnapshot,
  UISortableChangeDetail,
  UISortableDropIndicatorVisibility,
  UISortableDropzoneStyle,
  UISortableDragHandleMode,
  UISortableListOrientation,
  UISortableLabels,
  UISortableNestTrigger,
  UISortableDropInfo,
  UISortableBeforeChangeDetail,
  UISortableExternalMove
} from '@editora/ui-core/sortable';

export type SortableListOrientation = UISortableListOrientation;
export type SortableSortMode = UISortableSortMode;
export type SortableDropMode = UISortableDropMode;
export type SortableChangeSource = UISortableChangeSource;
export type SortableOperation = UISortableOperation;
export type SortableDropIndicatorVisibility = UISortableDropIndicatorVisibility;
export type SortableDropzoneStyle = UISortableDropzoneStyle;
export type SortableDragPreviewSize = 'match-item' | 'compact';
export type SortableDragHandleMode = UISortableDragHandleMode;
export type SortableLabels = Partial<UISortableLabels>;
export type SortableNestTrigger = UISortableNestTrigger;
export type SortableRadiusPreset = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type SortableRadius = SortableRadiusPreset | number | string;
export type SortableSpacePreset = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SortableSpace = SortableSpacePreset | number | string;

export type SortableList = UISortableList;
export type SortableItem = UISortableItem;
export type SortableSelectionChangeDetail = UISortableSelectionChangeDetail;
export type SortablePersistenceRecord = UISortablePersistenceRecord;
export type SortablePersistenceSnapshot = UISortablePersistenceSnapshot;
export type SortableChangeDetail = UISortableChangeDetail;
export type SortableBeforeChangeDetail = UISortableBeforeChangeDetail;
export type SortableDropInfo = UISortableDropInfo;
export type SortableExternalMove = UISortableExternalMove;
export type SortableMoveOptions = UISortableMoveOptions;
export type SortableElement = UISortable;

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

export type SortableProps = Omit<React.HTMLAttributes<SortableElement>, 'onChange'> & {
  lists: SortableList[];
  items: SortableItem[];
  selection?: string[];
  filterQuery?: string;
  sort?: SortableSortMode;
  persistKey?: string;
  allowFilteredDrag?: boolean;
  allowNesting?: boolean;
  nestTrigger?: SortableNestTrigger;
  /** Sortables with the same group can exchange items: drop a card on another one and both report it (`change`'s `external`). Ids must be unique across the group. */
  group?: string;
  /** Milliseconds a finger must rest on a card before it lifts (touch, dragging by the card). 0 lifts at once. Default 350. */
  touchHoldDelay?: number;
  /** The tallest the cards of a list can be before the list scrolls on its own: a number of px or a CSS length such as "20rem". A list's own `maxHeight` overrides it. */
  listMaxHeight?: number | string;
  dropIndicatorVisibility?: SortableDropIndicatorVisibility;
  dropzoneStyle?: SortableDropzoneStyle;
  dragPreviewSize?: SortableDragPreviewSize;
  dragHandleMode?: SortableDragHandleMode;
  dragHandleSelector?: string;
  itemRadius?: SortableRadius;
  handleRadius?: SortableRadius;
  listGap?: SortableSpace;
  itemSpacing?: SortableSpace;
  /** Decides whether items may go somewhere; return false to refuse. Asked on every pointer move, so keep it quick. */
  canDrop?: (info: SortableDropInfo) => boolean;
  showSelectionBadge?: boolean;
  labels?: SortableLabels;
  hideToolbar?: boolean;
  disabled?: boolean;
  renderItem?: (item: SortableItem, context: SortableRenderItemContext) => React.ReactNode;
  renderListHeader?: (list: SortableList, context: SortableRenderListHeaderContext) => React.ReactNode;
  renderEmptyState?: (list: SortableList, context: SortableRenderEmptyStateContext) => React.ReactNode;
  /**
   * Called just before a move is applied, with the result it would have. Return `false` (or call
   * `event.preventDefault()`) to cancel it: nothing changes and `onChange` does not fire.
   */
  onBeforeChange?: (detail: SortableBeforeChangeDetail, event: Event) => boolean | void;
  onChange?: (detail: SortableChangeDetail) => void;
  onItemsChange?: (items: SortableItem[]) => void;
  onSelectionChange?: (detail: SortableSelectionChangeDetail) => void;
  onPersistRequest?: (detail: SortableChangeDetail) => void;
};

export declare const Sortable: React.ForwardRefExoticComponent<
  SortableProps & React.RefAttributes<SortableElement>
>;

export default Sortable;
