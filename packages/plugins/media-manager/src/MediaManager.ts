import { EditorAdapter } from './adapters/EditorAdapter';
import { MediaAPI } from './utils/MediaAPI';
import { MediaManagerConfig, ImageAttrs, VideoAttrs } from './types/media';

export class MediaManager {
  private adapter: EditorAdapter;
  private api: MediaAPI;
  private dialogOpen = false;

  constructor(adapter: EditorAdapter, config: MediaManagerConfig) {
    this.adapter = adapter;
    this.api = new MediaAPI(config);
  }

  openDialog(type: 'image' | 'video' = 'image'): void {
    if (!this.adapter.canInsert(type)) {
      throw new Error(`Cannot insert ${type} at current position`);
    }
    this.dialogOpen = true;
    // Dialog component will be mounted by React
  }

  closeDialog(): void {
    this.dialogOpen = false;
  }

  isDialogOpen(): boolean {
    return this.dialogOpen;
  }

  async uploadFile(file: File): Promise<string> {
    const result = await this.api.upload(file);
    return result.url;
  }

  insertImage(attrs: ImageAttrs): void {
    this.adapter.insertImage(attrs);
    this.closeDialog();
  }

  insertVideo(attrs: VideoAttrs): void {
    this.adapter.insertVideo(attrs);
    this.closeDialog();
  }

  async fetchLibrary(page = 1, limit = 20) {
    return this.api.fetchLibrary(page, limit);
  }

  async deleteMedia(id: string): Promise<void> {
    return this.api.delete(id);
  }
}
