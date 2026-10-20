import type { EmbedProvider } from '../embeds/providers';

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
  /** The description kept with the file in the library, offered as the alt text when it is inserted. */
  alt?: string;
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

/** What can be changed about a file that is already in the library. */
export interface MediaUpdate {
  name?: string;
  alt?: string;
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
  update?(id: string, updates: MediaUpdate): Promise<void>;
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

/** A photo from a stock service, as the picker shows it. */
export interface StockPhoto {
  id: string;
  /** A small picture for the grid. */
  thumbnailUrl: string;
  /** The picture to insert. */
  url: string;
  width?: number;
  height?: number;
  /** What it shows, offered as the alt text. */
  description?: string;
  author?: string;
  authorUrl?: string;
  /** The page of the photo at the service. */
  sourceUrl?: string;
}

/**
 * Photos from a service such as Unsplash or Pexels. The editor makes no request to any service itself: you write
 * `search` (calling your own backend, which holds the API key) and the picker shows a Stock tab.
 */
export interface StockProvider {
  /** The service's name, shown on the tab and in credits: "Unsplash". */
  name: string;
  /** An empty `search` means "show something" (popular, curated); a service that cannot may return nothing. */
  search(
    query: { search: string; page: number; limit: number },
    context: { signal?: AbortSignal },
  ): Promise<{ items: StockPhoto[]; total?: number }>;
  /**
   * The credit put under an inserted photo as its caption. By default "Photo by <author> on <name>" when the photo
   * has an author; return `null` for none, or pass `false` to never add one.
   */
  caption?: false | ((photo: StockPhoto) => string | null);
}

/** Describe a picture for people who cannot see it: your function calls whatever service you use. */
export type AltTextGenerator = (
  image: { src: string; name?: string },
  context: { signal?: AbortSignal },
) => Promise<string>;

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

  /**
   * Insert media as `<figure><img><figcaption>`, which can be aligned and captioned (default). `false` inserts the
   * bare `<img>` / `<video>` of earlier versions.
   */
  wrapInFigure?: boolean;
  /**
   * Put an Audio button in the toolbar next to Image and Video. Off by default so that existing toolbars do not
   * change; the `insertAudio` command (and `mediaSlashItems`) work either way.
   */
  audio?: boolean;
  /** More links that can be embedded as a player (YouTube and Vimeo are built in); see `EmbedProvider`. */
  embedProviders?: EmbedProvider[];
  /** Photos from a stock service: adds a Stock tab to the image picker. */
  stockProvider?: StockProvider;
  /**
   * Suggest alt text for an image: adds a Suggest button next to the alt text field. What it returns is put in
   * the field for the person to read and change, never inserted on its own.
   */
  generateAltText?: AltTextGenerator;

  /** Upload images, videos and audio that are pasted or dropped into the editor (default `true`). */
  uploadOnPaste?: boolean;

  /**
   * Scale down and re-encode large pictures before they are stored, so that a camera photo does not have to be
   * 12 MB. `true` for the defaults (wider than 2048px is scaled to it, quality 0.85), or `{ maxWidth, quality,
   * format }`. JPEG, PNG and WebP only; the file is left as it is when nothing is gained. Off by default.
   * The size limit is checked on the result, so a photo over `maxFileSize` can pass once it is smaller.
   */
  optimizeImages?: boolean | { maxWidth?: number; quality?: number; format?: 'keep' | 'webp' | 'jpeg' };

  /** Maximum file size in bytes. */
  maxFileSize?: number;
  /** Allowed MIME types; `image/*` style wildcards work. */
  allowedTypes?: string[];
}
