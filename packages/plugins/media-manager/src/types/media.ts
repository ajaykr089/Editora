/**
 * Core media item interface
 */
export interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'file';
  src: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
  mime: string;
  createdAt: number;
  metadata: Record<string, any>;
  thumbnailUrl?: string;
}

export interface MediaSource {
  url: string;
  type: 'image' | 'video' | 'audio';
  width?: number;
  height?: number;
  alt?: string;
  title?: string;
  caption?: string;
}

export interface ImageAttrs {
  src: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  caption?: string;
}

export interface VideoAttrs {
  src: string;
  poster?: string;
  width?: number;
  height?: number;
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  caption?: string;
}

export interface MediaUploadResponse {
  url: string;
  thumbnailUrl?: string;
  width: number;
  height: number;
  size: number;
  mimeType: string;
}

export interface MediaLibraryItem {
  id: string;
  url: string;
  thumbnailUrl: string;
  type: 'image' | 'video' | 'audio' | 'file';
  name: string;
  size: number;
  width: number;
  height: number;
  createdAt: string;
  folder_id?: string | null;
}

/**
 * Storage provider interface
 */
export interface StorageProvider {
  upload(file: File): Promise<MediaItem>;
  list(filter?: { type?: string; limit?: number }): Promise<MediaItem[]>;
  delete(id: string): Promise<void>;
  get(id: string): Promise<MediaItem | null>;
  update(id: string, updates: Partial<MediaItem>): Promise<MediaItem>;
}

/**
 * Complete MediaManagerConfig with professional features
 */
export interface MediaManagerConfig {
  mode?: 'local' | 'api' | 'hybrid';

  upload?: {
    enabled: boolean;
    maxFileSize?: number;
    allowedTypes?: string[];
    autoOptimize?: boolean;
    autoGenerateThumbnails?: boolean;
  };

  storage?: {
    type: 'memory' | 'indexeddb' | 'filesystem' | 'api';
    key?: string;
    apiUrl?: string;
    headers?: Record<string, string>;
  };

  /** Offline mode and custom server configuration */
  offline?: {
    enabled?: boolean; // If true, fallback to base64 when upload fails
    fallbackToBase64?: boolean; // Default true - insert as base64 if upload unavailable
    customUploadUrl?: string; // Custom server upload endpoint (e.g., "https://myserver.com/api/upload")
    customUploadHeaders?: Record<string, string>; // Custom headers for upload request
    useBase64Permanently?: boolean; // If true, always use base64 instead of uploading
  };

  library?: {
    enabled: boolean;
    searchable?: boolean;
    sortable?: boolean;
    pagination?: boolean;
    gridSize?: 'sm' | 'md' | 'lg';
    previewOnHover?: boolean;
  };

  manipulation?: {
    crop?: boolean;
    resize?: boolean;
    rotate?: boolean;
    flip?: boolean;
    compress?: boolean;
    formatConvert?: boolean;
    metadataEdit?: boolean;
  };

  metadata?: {
    altText?: boolean;
    title?: boolean;
    caption?: boolean;
    copyright?: boolean;
  };

  security?: {
    sanitizeFilenames?: boolean;
    validateMimeType?: boolean;
  };

  ui?: {
    darkMode?: boolean;
    doubleClickToEdit?: boolean;
    dragReorder?: boolean;
  };

  /** API endpoints (legacy support) */
  apiEndpoints?: {
    upload: string;
    library: string;
    delete: string;
  };

  /** Maximum file size in bytes (legacy support) */
  maxFileSize?: number;

  /** Allowed MIME types (legacy support) */
  allowedTypes?: string[];
}
