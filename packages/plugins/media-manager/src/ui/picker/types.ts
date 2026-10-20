import type { MediaItem, MediaManagerConfig, MediaProvider } from '../../types/media';
import type { SelectionModel } from './selection';

export type PickerKind = 'image' | 'video';

/** What every view of the picker can see and ask for. */
export interface PickerContext {
  readonly kinds: PickerKind[];
  readonly config?: Partial<MediaManagerConfig>;
  readonly provider: MediaProvider;
  readonly selection: SelectionModel<MediaItem>;
  /** The item the details panel is showing. */
  setActive(item: MediaItem | null): void;
  /** Choose and insert right away (double-click, Enter). */
  commit(items?: MediaItem[]): void;
  announce(message: string): void;
}

export const isPickable = (item: MediaItem, kinds: PickerKind[]): boolean =>
  (item.type === 'image' || item.type === 'video') && kinds.includes(item.type);
