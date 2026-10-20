import type {
  MediaItem,
  MediaPage,
  MediaProvider,
  MediaQuery,
  MediaUpdate,
  UploadContext,
} from '../types/media';
import { MediaUploadError } from './errors';
import { mediaTypeOf, newMediaId } from './mediaType';

export interface RestProviderOptions {
  uploadUrl: string;
  /** Collection URL for listing (`GET`), updating (`PATCH <url>/<id>`) and deleting (`DELETE <url>/<id>`). */
  libraryUrl?: string;
  deleteUrl?: string;
  headers?: () => Record<string, string>;
  withCredentials?: boolean;
  fieldName?: string;
}

const asNumber = (value: unknown): number | undefined => {
  const n = typeof value === 'string' ? Number(value) : (value as number);
  return typeof n === 'number' && Number.isFinite(n) && n > 0 ? n : undefined;
};

/**
 * Reads what a media server answers with. Both servers in this repository answer
 * `{ url, thumbnailUrl, width, height, size, mimeType }`; `src` and TinyMCE's `location` are accepted for the url.
 */
export const mediaItemFromResponse = (raw: any, file?: File): MediaItem => {
  const url = raw?.url ?? raw?.src ?? raw?.location;
  if (typeof url !== 'string' || !url) {
    throw new MediaUploadError('invalid-response', 'The upload finished, but the server sent back no URL.');
  }
  const mime: string = raw.mimeType ?? raw.mime ?? raw.mime_type ?? file?.type ?? '';
  return {
    id: String(raw.id ?? newMediaId()),
    name: raw.name ?? raw.originalName ?? raw.original_filename ?? raw.filename ?? file?.name ?? '',
    // What was sent is known better than what a server says it stored (a server that knows only images and
    // videos files audio under one of them); a listing has no file, and goes by the server.
    type: file?.type
      ? mediaTypeOf(file.type)
      : raw.type === 'image' || raw.type === 'video' || raw.type === 'audio' || raw.type === 'file'
        ? raw.type
        : mediaTypeOf(mime),
    src: url,
    size: asNumber(raw.size) ?? file?.size ?? 0,
    width: asNumber(raw.width),
    height: asNumber(raw.height),
    duration: asNumber(raw.duration),
    mime,
    createdAt: raw.createdAt ? Date.parse(raw.createdAt) || Date.now() : Date.now(),
    metadata: raw.metadata && typeof raw.metadata === 'object' ? raw.metadata : {},
    thumbnailUrl: raw.thumbnailUrl ?? raw.thumbnail_url ?? undefined,
    alt: typeof (raw.alt ?? raw.alt_text) === 'string' ? raw.alt ?? raw.alt_text : undefined,
  };
};

const messageFrom = (xhr: Pick<XMLHttpRequest, 'status' | 'responseText'>): string => {
  try {
    const body = JSON.parse(xhr.responseText);
    const message = body?.error ?? body?.message;
    if (typeof message === 'string' && message) return message;
    if (message?.message) return String(message.message);
  } catch {
    /* not JSON: fall through */
  }
  if (xhr.status === 413) return 'The file is too large for the server.';
  if (xhr.status === 401 || xhr.status === 403) return "You're not allowed to upload here.";
  return `The server couldn't take the file (${xhr.status}).`;
};

/**
 * Talks to a REST media backend. Uploads go through `XMLHttpRequest` because it is the only browser API that
 * reports how much of a request body has been sent.
 */
export const createRestProvider = (options: RestProviderOptions): MediaProvider => {
  const headers = () => options.headers?.() ?? {};
  const itemUrl = (base: string, id: string) => `${base.replace(/\/$/, '')}/${encodeURIComponent(id)}`;

  const request = async (url: string, init: RequestInit & { signal?: AbortSignal }): Promise<Response> => {
    let response: Response;
    try {
      response = await fetch(url, {
        credentials: options.withCredentials ? 'include' : 'same-origin',
        ...init,
        headers: { ...headers(), ...(init.headers as Record<string, string> | undefined) },
      });
    } catch (error) {
      if ((error as Error)?.name === 'AbortError') throw new MediaUploadError('aborted', 'Request cancelled');
      throw new MediaUploadError('network', "Couldn't reach the media server.");
    }
    if (!response.ok) {
      throw new MediaUploadError('server', messageFrom({ status: response.status, responseText: await response.text() }), response.status);
    }
    return response;
  };

  const provider: MediaProvider = {
    name: 'rest',

    upload(file: File, { signal, onProgress }: UploadContext = {}): Promise<MediaItem> {
      return new Promise<MediaItem>((resolve, reject) => {
        if (signal?.aborted) {
          reject(new MediaUploadError('aborted', 'Upload cancelled'));
          return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open('POST', options.uploadUrl);
        xhr.withCredentials = Boolean(options.withCredentials);
        // Content-Type is left to the browser: it has to carry the multipart boundary.
        for (const [name, value] of Object.entries(headers())) {
          if (name.toLowerCase() !== 'content-type') xhr.setRequestHeader(name, value);
        }

        const onAbort = () => xhr.abort();
        signal?.addEventListener('abort', onAbort, { once: true });
        const done = () => signal?.removeEventListener('abort', onAbort);

        xhr.upload.onprogress = (event) => {
          if (!event.lengthComputable) return;
          onProgress?.({ loaded: event.loaded, total: event.total, fraction: event.total ? event.loaded / event.total : 0 });
        };
        xhr.onload = () => {
          done();
          if (xhr.status < 200 || xhr.status >= 300) {
            reject(new MediaUploadError('server', messageFrom(xhr), xhr.status));
            return;
          }
          try {
            const item = mediaItemFromResponse(JSON.parse(xhr.responseText), file);
            onProgress?.({ loaded: file.size, total: file.size, fraction: 1 });
            resolve(item);
          } catch (error) {
            reject(
              error instanceof MediaUploadError
                ? error
                : new MediaUploadError('invalid-response', 'The server answered, but not in a form the editor can read.'),
            );
          }
        };
        xhr.onerror = () => {
          done();
          reject(new MediaUploadError('network', "Couldn't reach the media server. Check your connection and try again."));
        };
        xhr.ontimeout = xhr.onerror;
        xhr.onabort = () => {
          done();
          reject(new MediaUploadError('aborted', 'Upload cancelled'));
        };

        const body = new FormData();
        body.append(options.fieldName || 'file', file, file.name);
        xhr.send(body);
      });
    },
  };

  if (options.libraryUrl) {
    const libraryUrl = options.libraryUrl;

    provider.list = async (query: MediaQuery = {}, context = {}): Promise<MediaPage> => {
      const params = new URLSearchParams();
      if (query.page) params.set('page', String(query.page));
      if (query.limit) params.set('limit', String(query.limit));
      if (query.search) params.set('q', query.search);
      if (query.type) params.set('type', query.type);
      if (query.folderId) params.set('folder_id', query.folderId);
      const url = params.toString() ? `${libraryUrl}${libraryUrl.includes('?') ? '&' : '?'}${params}` : libraryUrl;
      const body = await (await request(url, { signal: context.signal })).json();
      const rows: any[] = Array.isArray(body) ? body : body?.items ?? [];
      return { items: rows.map((row) => mediaItemFromResponse(row)), total: Number(body?.total ?? rows.length) };
    };

    // The field names are those of the repository's own API (`title`, `alt_text`).
    provider.update = async (id: string, updates: MediaUpdate) => {
      const body: Record<string, string> = {};
      if (updates.name !== undefined) body.title = updates.name;
      if (updates.alt !== undefined) body.alt_text = updates.alt;
      await request(itemUrl(libraryUrl, id), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    };

    const deleteUrl = options.deleteUrl || libraryUrl;
    provider.delete = async (id) => {
      await request(itemUrl(deleteUrl, id), { method: 'DELETE' });
    };
  }

  return provider;
};
