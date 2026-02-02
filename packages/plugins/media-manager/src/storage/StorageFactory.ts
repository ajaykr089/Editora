import { StorageProvider, MediaItem, MediaManagerConfig } from '../types/media';
import { MemoryStorage } from './providers/MemoryStorage';
import { IndexedDBStorage } from './providers/IndexedDBStorage';
import { ApiStorage } from './providers/ApiStorage';

/**
 * Storage factory for creating the appropriate storage provider
 */
export class StorageFactory {
  static create(config: MediaManagerConfig): StorageProvider {
    const storageType = config.storage?.type || 'memory';

    switch (storageType) {
      case 'indexeddb':
        return new IndexedDBStorage(config.storage?.key || 'media-manager');
      
      case 'api':
        return new ApiStorage(config);
      
      case 'memory':
      default:
        return new MemoryStorage();
    }
  }
}
