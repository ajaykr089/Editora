import type { MediaItem, MediaManagerConfig } from './types/media';
import { MediaUploadError, isAbort } from './providers';
import { uploadMedia } from './uploadService';

export interface QueueEntry {
  id: string;
  file: File;
  status: 'queued' | 'uploading' | 'done' | 'error';
  fraction: number;
  /** The stored file, once `status` is `done`. */
  item?: MediaItem;
  error?: string;
  /** False when sending the same file again cannot help (too large, not an allowed type). */
  retryable?: boolean;
  /** A local preview of the file while it is uploading. Revoked when the entry goes away. */
  previewUrl?: string;
}

let nextId = 0;

const makePreview = (file: File): string | undefined => {
  if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') return undefined;
  if (!/^(image|video)\//.test(file.type)) return undefined;
  try {
    return URL.createObjectURL(file);
  } catch {
    return undefined;
  }
};

/**
 * Several files at once: a few upload at a time, each with its own progress, cancel and retry. A file that is
 * refused (too big, wrong type) becomes an entry with its reason rather than a message that replaces the others.
 */
export class UploadQueue {
  private readonly list: QueueEntry[] = [];
  private readonly controllers = new Map<string, AbortController>();

  constructor(
    private readonly options: {
      config?: Partial<MediaManagerConfig>;
      concurrency?: number;
      onChange: () => void;
    },
  ) {}

  get entries(): readonly QueueEntry[] {
    return this.list;
  }

  get active(): number {
    return this.list.filter((entry) => entry.status === 'queued' || entry.status === 'uploading').length;
  }

  add(files: Iterable<File>): QueueEntry[] {
    const added = [...files].map<QueueEntry>((file) => ({
      id: `upload-${++nextId}`,
      file,
      status: 'queued',
      fraction: 0,
      previewUrl: makePreview(file),
    }));
    this.list.push(...added);
    this.options.onChange();
    this.pump();
    return added;
  }

  retry(id: string): void {
    const entry = this.find(id);
    if (!entry || entry.status !== 'error') return;
    entry.status = 'queued';
    entry.error = undefined;
    entry.fraction = 0;
    this.options.onChange();
    this.pump();
  }

  /** Stop an upload and drop the entry; for one that has finished it just drops the entry. */
  remove(id: string): void {
    const index = this.list.findIndex((entry) => entry.id === id);
    if (index === -1) return;
    const [entry] = this.list.splice(index, 1);
    this.controllers.get(id)?.abort();
    this.controllers.delete(id);
    if (entry.previewUrl) URL.revokeObjectURL?.(entry.previewUrl);
    this.options.onChange();
    this.pump();
  }

  /** The dialog is closing: stop everything that is still going. */
  dispose(): void {
    this.controllers.forEach((controller) => controller.abort());
    this.controllers.clear();
    this.list.forEach((entry) => entry.previewUrl && URL.revokeObjectURL?.(entry.previewUrl));
    this.list.length = 0;
  }

  private find(id: string) {
    return this.list.find((entry) => entry.id === id);
  }

  private pump(): void {
    const limit = this.options.concurrency ?? 3;
    let running = this.list.filter((entry) => entry.status === 'uploading').length;
    for (const entry of this.list) {
      if (running >= limit) break;
      if (entry.status !== 'queued') continue;
      running++;
      void this.run(entry);
    }
  }

  private async run(entry: QueueEntry): Promise<void> {
    const controller = new AbortController();
    this.controllers.set(entry.id, controller);
    entry.status = 'uploading';
    entry.fraction = 0;
    this.options.onChange();

    try {
      const item = await uploadMedia(entry.file, {
        config: this.options.config,
        signal: controller.signal,
        onProgress: ({ fraction }) => {
          entry.fraction = fraction;
          this.options.onChange();
        },
      });
      if (!this.list.includes(entry)) return;
      entry.status = 'done';
      entry.fraction = 1;
      entry.item = item;
    } catch (error) {
      if (!this.list.includes(entry) || isAbort(error)) return;
      entry.status = 'error';
      entry.error = error instanceof Error && error.message ? error.message : `Couldn't upload ${entry.file.name}.`;
      entry.retryable = !(error instanceof MediaUploadError && (error.code === 'too-large' || error.code === 'type-not-allowed'));
    } finally {
      this.controllers.delete(entry.id);
      if (this.list.includes(entry)) this.options.onChange();
      this.pump();
    }
  }
}
