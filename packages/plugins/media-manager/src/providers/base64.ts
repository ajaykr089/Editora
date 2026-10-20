import type { MediaItem, MediaProvider, UploadContext } from '../types/media';
import { MediaUploadError } from './errors';
import { mediaTypeOf, newMediaId } from './mediaType';

/**
 * The provider that needs no backend: the file becomes a data URL and stays in the document. Reading a file
 * is local, but it does report progress and can be cancelled, so it behaves like every other provider.
 */
export const createBase64Provider = (): MediaProvider => ({
  name: 'base64',

  upload(file: File, { signal, onProgress }: UploadContext = {}): Promise<MediaItem> {
    return new Promise<MediaItem>((resolve, reject) => {
      if (signal?.aborted) {
        reject(new MediaUploadError('aborted', 'Upload cancelled'));
        return;
      }

      const reader = new FileReader();
      const onAbort = () => reader.abort();
      signal?.addEventListener('abort', onAbort, { once: true });
      const done = () => signal?.removeEventListener('abort', onAbort);

      reader.onprogress = (event) => {
        if (!event.lengthComputable) return;
        onProgress?.({ loaded: event.loaded, total: event.total, fraction: event.loaded / event.total });
      };
      reader.onload = () => {
        done();
        onProgress?.({ loaded: file.size, total: file.size, fraction: 1 });
        resolve({
          id: newMediaId(),
          name: file.name,
          type: mediaTypeOf(file.type),
          src: reader.result as string,
          size: file.size,
          mime: file.type,
          createdAt: Date.now(),
          metadata: {},
        });
      };
      reader.onerror = () => {
        done();
        reject(new MediaUploadError('network', `Couldn't read ${file.name || 'the file'}.`));
      };
      reader.onabort = () => {
        done();
        reject(new MediaUploadError('aborted', 'Upload cancelled'));
      };

      reader.readAsDataURL(file);
    });
  },
});
