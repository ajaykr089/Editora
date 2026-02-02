import { StorageProvider, MediaItem } from '../../types/media';

/**
 * In-memory storage provider - perfect for local-only mode
 */
export class MemoryStorage implements StorageProvider {
  private items = new Map<string, MediaItem>();
  private idCounter = 0;

  async upload(file: File): Promise<MediaItem> {
    const id = `local-${++this.idCounter}`;
    const blob = new Blob([file], { type: file.type });
    const src = URL.createObjectURL(blob);

    const item: MediaItem = {
      id,
      name: file.name,
      type: this.getMediaType(file.type),
      src,
      size: file.size,
      mime: file.type,
      createdAt: Date.now(),
      metadata: {
        fileName: file.name,
        lastModified: file.lastModified
      }
    };

    // Extract dimensions for images
    if (item.type === 'image') {
      const { width, height } = await this.getImageDimensions(src);
      item.width = width;
      item.height = height;
    }

    this.items.set(id, item);
    return item;
  }

  async list(filter?: { type?: string; limit?: number }): Promise<MediaItem[]> {
    let items = Array.from(this.items.values());

    if (filter?.type) {
      items = items.filter(item => item.type === filter.type);
    }

    if (filter?.limit) {
      items = items.slice(0, filter.limit);
    }

    return items;
  }

  async delete(id: string): Promise<void> {
    const item = this.items.get(id);
    if (item && item.src.startsWith('blob:')) {
      URL.revokeObjectURL(item.src);
    }
    this.items.delete(id);
  }

  async get(id: string): Promise<MediaItem | null> {
    return this.items.get(id) || null;
  }

  async update(id: string, updates: Partial<MediaItem>): Promise<MediaItem> {
    const item = this.items.get(id);
    if (!item) throw new Error(`Media not found: ${id}`);

    const updated = { ...item, ...updates, id, createdAt: item.createdAt };
    this.items.set(id, updated);
    return updated;
  }

  private getMediaType(mimeType: string): 'image' | 'video' | 'audio' | 'file' {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'file';
  }

  private getImageDimensions(src: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = src;
    });
  }
}
