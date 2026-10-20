import type { Plugin } from "@editora/core";

/** What an upload reports while it runs. `fraction` is 0..1. */
export interface UploadProgress {
  loaded: number;
  total: number;
  fraction: number;
}

export interface UploadContext {
  /** Aborted when the person cancels or closes the dialog; stop, and reject with an AbortError. */
  signal?: AbortSignal;
  onProgress?: (progress: UploadProgress) => void;
}

export interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'file';
  /** The address the document will point at: an https URL, or a data URL when nothing is configured. */
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

/** What can be changed about a file that is already in the library. */
export interface MediaUpdate {
  name?: string;
  alt?: string;
}

/**
 * Where media goes and where the library comes from. Only `upload` is required; with `list` the picker has a library.
 */
export interface MediaProvider {
  readonly name?: string;
  upload(file: File, context: UploadContext): Promise<MediaItem>;
  list?(query?: MediaQuery, context?: { signal?: AbortSignal }): Promise<MediaPage>;
  update?(id: string, updates: MediaUpdate): Promise<void>;
  delete?(id: string): Promise<void>;
}

/** The shortest way to plug in a backend: receive the file, report progress, resolve with the URL. */
export type MediaUploadHandler = (
  file: File,
  context: UploadContext,
) => Promise<string | { url: string; thumbnailUrl?: string; width?: number; height?: number; id?: string; name?: string }>;

/** A photo from a stock service, as the picker shows it. */
export interface StockPhoto {
  id: string;
  thumbnailUrl: string;
  url: string;
  width?: number;
  height?: number;
  /** What it shows, offered as the alt text. */
  description?: string;
  author?: string;
  authorUrl?: string;
  sourceUrl?: string;
}

/** Photos from a service such as Unsplash: you write `search` (calling your own backend); the picker shows a Stock tab. */
export interface StockProvider {
  name: string;
  search(
    query: { search: string; page: number; limit: number },
    context: { signal?: AbortSignal },
  ): Promise<{ items: StockPhoto[]; total?: number }>;
  /** The credit put under an inserted photo; by default "Photo by <author> on <name>". `false` for none. */
  caption?: false | ((photo: StockPhoto) => string | null);
}

/** Describe a picture for people who cannot see it. The result fills the alt text field; it is never inserted on its own. */
export type AltTextGenerator = (
  image: { src: string; name?: string },
  context: { signal?: AbortSignal },
) => Promise<string>;

/** What a link embeds as a player. */
export interface EmbedSpec {
  provider: string;
  label: string;
  /** Always https. */
  src: string;
  /** Width over height. */
  aspectRatio: number;
  id: string;
}

/** A service whose links can be embedded (YouTube and Vimeo are built in). `parse` must return an https address. */
export interface EmbedProvider {
  id: string;
  label: string;
  parse(url: URL): { src: string; id: string; aspectRatio?: number } | null;
}

export interface MediaManagerConfig {
  /** A complete provider. Wins over everything below. */
  provider?: MediaProvider;
  /** Upload callback; wrapped into a provider. Wins over `apiUrl`. */
  uploadHandler?: MediaUploadHandler;
  /** Base URL of a REST backend. Without it, and without a provider, files become data URLs. */
  apiUrl?: string;
  apiEndpoints?: { upload: string; library: string; delete: string };
  /** Extra request headers (authentication). */
  headers?: Record<string, string>;
  /** Send cookies with the upload request. */
  withCredentials?: boolean;
  /** Name of the multipart field that carries the file. Default `file`. */
  uploadFieldName?: string;
  /** Insert a data URL when an upload fails, instead of showing the error. Off by default. */
  fallbackToBase64?: boolean;
  /** More links that can be embedded as a player. */
  embedProviders?: EmbedProvider[];
  /** Photos from a stock service: adds a Stock tab to the image picker. */
  stockProvider?: StockProvider;
  /** Adds a Suggest button next to the alt text field. */
  generateAltText?: AltTextGenerator;
  /** Insert media as `<figure>` that can be aligned and captioned (default). `false` inserts a bare `<img>`/`<video>`. */
  wrapInFigure?: boolean;
  /** Put an Audio button in the toolbar. Off by default. */
  audio?: boolean;
  /** Upload images, videos and audio that are pasted or dropped into the editor (default `true`). */
  uploadOnPaste?: boolean;
  /** Scale down and re-encode large JPEG, PNG and WebP files before they are stored. Off by default. */
  optimizeImages?: boolean | { maxWidth?: number; quality?: number; format?: 'keep' | 'webp' | 'jpeg' };
  /** Maximum file size in bytes (checked on the result when `optimizeImages` is on). */
  maxFileSize?: number;
  /** Allowed MIME types; `image/*` style wildcards work. */
  allowedTypes?: string[];
}

export class MediaUploadError extends Error {
  readonly code: 'too-large' | 'type-not-allowed' | 'aborted' | 'network' | 'server' | 'invalid-response';
  readonly status?: number;
  constructor(code: MediaUploadError['code'], message: string, status?: number);
}

export function createBase64Provider(): MediaProvider;
export function createCallbackProvider(handler: MediaUploadHandler): MediaProvider;
export function createRestProvider(options: {
  uploadUrl: string;
  libraryUrl?: string;
  deleteUrl?: string;
  headers?: () => Record<string, string>;
  withCredentials?: boolean;
  fieldName?: string;
}): MediaProvider;

/** What a pasted link or iframe snippet embeds, or `null` when no provider knows it. */
export function parseEmbedUrl(input: string, extra?: EmbedProvider[]): EmbedSpec | null;

/** Entries for `SlashCommandsPlugin({ items })`: `/image`, `/audio`, `/video`. */
export const mediaSlashItems: Array<{ id: string; label: string; description?: string; command: string; keywords?: string[] }>;

export function MediaManagerPlugin(config?: Partial<MediaManagerConfig>): Plugin;
export function setMediaManagerConfig(config: Partial<MediaManagerConfig>): void;
export function getMediaManagerConfig(): MediaManagerConfig;
