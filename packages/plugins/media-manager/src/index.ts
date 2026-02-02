// Plugin
export { MediaManagerPlugin } from './MediaManagerPlugin';
export { MediaProvider } from './MediaProvider';

// Configuration
export { setMediaManagerConfig, getMediaManagerConfig } from './constants';
export type { MediaManagerConfig, MediaItem, StorageProvider } from './types/media';

// Core Classes
export { MediaManager } from './MediaManager';
export { StorageFactory } from './storage/StorageFactory';

// Storage Providers
export { MemoryStorage } from './storage/providers/MemoryStorage';
export { IndexedDBStorage } from './storage/providers/IndexedDBStorage';
export { ApiStorage } from './storage/providers/ApiStorage';

// Utilities
export { MediaValidator } from './utils/MediaValidator';
export { ImageManipulator, type ImageTransformOptions } from './utils/ImageManipulator';

// Components
export { MediaModal } from './components/MediaModal';
export { ImageEditor } from './components/ImageEditor';
export { ImageFloatingToolbar } from './components/ImageFloatingToolbar';

