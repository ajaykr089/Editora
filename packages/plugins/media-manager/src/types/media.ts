/**
 * Core media item interface
 */
export interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'file';
  /** The address the document will point at: an https URL from a server, or a data URL when nothing is configured. */
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

/** How far an upload has got. `fraction` is 0..1, and stays 0 when the transport cannot say how big the whole is. */
export interface UploadProgress {
  loaded: number;
  total: number;
  fraction: number;
}

export interface UploadContext {
  /** Aborted when the person cancels or closes the dialog; a provider has to stop and reject with an AbortError. */
  signal?: AbortSignal;
  onProgress?: (progress: UploadProgress) => void;
}

export interface MediaQuery {
  page?: number;
  limit?: number;
  /** Free-text search over names and alt text. */
  search?: string;
  type?: MediaItem['type'];
  folderId?: string | null;
}

export interface MediaPage {
  items: MediaItem[];
  total: number;
}

/**
 * Where media goes and where the library comes from. Only `upload` is required: a provider that cannot list
 * (a plain "put this file somewhere" endpoint) still works for inserting.
 */
export interface MediaProvider {
  readonly name?: string;
  upload(file: File, context: UploadContext): Promise<MediaItem>;
  list?(query?: MediaQuery, context?: { signal?: AbortSignal }): Promise<MediaPage>;
  update?(id: string, updates: Partial<Pick<MediaItem, 'name' | 'metadata'>>): Promise<MediaItem>;
  delete?(id: string): Promise<void>;
}

/**
 * The shortest way to plug in a backend: receive the file, report progress, resolve with the URL (or with
 * `{ url, width, height, ... }`). The same shape as the upload callbacks of other editors.
 */
export type MediaUploadHandler = (
  file: File,
  context: UploadContext,
) => Promise<string | { url: string; thumbnailUrl?: string; width?: number; height?: number; id?: string; name?: string }>;

export interface MediaManagerConfig {
  /** A complete provider. Wins over everything below. */
  provider?: MediaProvider;
  /** Upload callback; wrapped into a provider. Wins over `apiUrl`. */
  uploadHandler?: MediaUploadHandler;

  /** Base URL of a REST backend (see `apiEndpoints`). Without it, and without a provider, files become data URLs. */
  apiUrl?: string;
  apiEndpoints?: {
    upload: string;
    library: string;
    delete: string;
  };
  /** Extra request headers (authentication). Added to the global API headers. */
  headers?: Record<string, string>;
  /** Send cookies with the upload request (cross-origin session auth). */
  withCredentials?: boolean;
  /** Name of the multipart field that carries the file. Default `file`. */
  uploadFieldName?: string;
  /**
   * When the upload fails, insert the file as a data URL instead of showing the error. Off by default: a
   * failed upload that silently turns into a megabyte of base64 in the document is worse than a message.
   */
  fallbackToBase64?: boolean;

  /** Maximum file size in bytes. */
  maxFileSize?: number;
  /** Allowed MIME types; `image/*` style wildcards work. */
  allowedTypes?: string[];
}
