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
  UISortableListOrientation
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
  dropIndicatorVisibility?: SortableDropIndicatorVisibility;
  dropzoneStyle?: SortableDropzoneStyle;
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

export declare const Sortable: React.ForwardRefExoticComponent<
  SortableProps & React.RefAttributes<SortableElement>
>;

export default Sortable;
