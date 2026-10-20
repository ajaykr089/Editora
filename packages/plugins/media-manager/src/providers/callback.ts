import type { MediaItem, MediaProvider, MediaUploadHandler, UploadContext } from '../types/media';
import { MediaUploadError } from './errors';
import { mediaTypeOf, newMediaId } from './mediaType';

/** Wraps a plain `(file, { onProgress, signal }) => url` function into a provider. */
export const createCallbackProvider = (handler: MediaUploadHandler): MediaProvider => ({
  name: 'callback',

  async upload(file: File, context: UploadContext = {}): Promise<MediaItem> {
    if (context.signal?.aborted) throw new MediaUploadError('aborted', 'Upload cancelled');

    // A handler that ignores the signal still has to stop being waited for when the person cancels.
    const cancelled = new Promise<never>((_, reject) => {
      context.signal?.addEventListener('abort', () => reject(new MediaUploadError('aborted', 'Upload cancelled')), {
        once: true,
      });
    });

    let result: Awaited<ReturnType<MediaUploadHandler>>;
    try {
      result = await Promise.race([handler(file, context), cancelled]);
    } catch (error) {
      if (error instanceof MediaUploadError) throw error;
      throw new MediaUploadError(
        'server',
        error instanceof Error && error.message ? error.message : `Couldn't upload ${file.name || 'the file'}.`,
      );
    }

    const info = typeof result === 'string' ? { url: result } : result;
    if (!info || typeof info.url !== 'string' || !info.url) {
      throw new MediaUploadError('invalid-response', 'The upload finished, but the server sent back no URL.');
    }

    return {
      id: info.id ?? newMediaId(),
      name: info.name ?? file.name,
      type: mediaTypeOf(file.type),
      src: info.url,
      size: file.size,
      width: info.width,
      height: info.height,
      mime: file.type,
      createdAt: Date.now(),
      metadata: {},
      thumbnailUrl: info.thumbnailUrl,
    };
  },
});
