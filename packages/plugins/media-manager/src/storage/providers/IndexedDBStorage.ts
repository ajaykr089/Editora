import { StorageProvider, MediaItem } from '../../types/media';

/**
 * IndexedDB storage provider - persistent local storage
 */
export class IndexedDBStorage implements StorageProvider {
  private dbName: string;
  private storeName = 'media-items';
  private db: IDBDatabase | null = null;

  constructor(dbName: string) {
    this.dbName = dbName;
    this.initDb();
  }

  private async initDb(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  async upload(file: File): Promise<MediaItem> {
    const db = await this.initDb();
    const blob = new Blob([file], { type: file.type });
    const src = URL.createObjectURL(blob);

    const item: MediaItem = {
      id: this.generateId(),
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

    if (item.type === 'image') {
      const { width, height } = await this.getImageDimensions(src);
      item.width = width;
      item.height = height;
    }

    await this.saveToDb(db, item);
    return item;
  }

  async list(filter?: { type?: string; limit?: number }): Promise<MediaItem[]> {
    const db = await this.initDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        let items = request.result;

        if (filter?.type) {
          items = items.filter(item => item.type === filter.type);
        }

        if (filter?.limit) {
          items = items.slice(0, filter.limit);
        }

        resolve(items);
      };
    });
  }

  async delete(id: string): Promise<void> {
    const db = await this.initDb();
    const item = await this.get(id);
    
    if (item && item.src.startsWith('blob:')) {
      URL.revokeObjectURL(item.src);
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async get(id: string): Promise<MediaItem | null> {
    const db = await this.initDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async update(id: string, updates: Partial<MediaItem>): Promise<MediaItem> {
    const db = await this.initDb();
    const item = await this.get(id);
    
    if (!item) throw new Error(`Media not found: ${id}`);

    const updated = { ...item, ...updates, id, createdAt: item.createdAt };
    await this.saveToDb(db, updated);
    return updated;
  }

  private saveToDb(db: IDBDatabase, item: MediaItem): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(item);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  private generateId(): string {
    return `idb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
