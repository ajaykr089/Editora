import type { MediaItem, MediaManagerConfig, MediaProvider } from '../../types/media';
import type { SelectionModel } from './selection';

export type PickerKind = 'image' | 'video' | 'audio';

const LABELS: Record<PickerKind, { one: string; many: string }> = {
  image: { one: 'image', many: 'images' },
  video: { one: 'video', many: 'videos' },
  audio: { one: 'audio file', many: 'audio files' },
};

/** What to call one or several of what the dialog is for: "image", "audio files". A mix is just "item". */
export const kindNoun = (kinds: PickerKind[], plural = false): string =>
  kinds.length === 1 ? LABELS[kinds[0]][plural ? 'many' : 'one'] : plural ? 'items' : 'item';

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
  (item.type === 'image' || item.type === 'video' || item.type === 'audio') && kinds.includes(item.type);
