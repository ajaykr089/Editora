import { resolveMediaManagerConfig } from './constants';
import { MediaUploadError, createBase64Provider, isAbort, resolveProvider } from './providers';
import { isOptimizable, optimizeImageFile, resolveOptimize } from './imaging/optimize';
import type { MediaItem, MediaManagerConfig, UploadProgress } from './types/media';

export interface UploadOptions {
  signal?: AbortSignal;
  onProgress?: (progress: UploadProgress) => void;
  /** Per-plugin settings, laid over the global ones. */
  config?: Partial<MediaManagerConfig>;
}

const formatSize = (bytes: number): string => {
  if (bytes >= 1024 * 1024) return `${Math.round((bytes / (1024 * 1024)) * 10) / 10} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

export const describeLimit = (bytes: number): string => formatSize(bytes);

/** `image/*` style wildcards and exact types, case-insensitive. */
export const isTypeAllowed = (mime: string, allowed: string[] | undefined): boolean => {
  if (!allowed || allowed.length === 0) return true;
  const type = mime.toLowerCase();
  return allowed.some((pattern) => {
    const p = pattern.toLowerCase();
    return p === '*/*' || p === type || (p.endsWith('/*') && type.startsWith(p.slice(0, -1)));
  });
};

/** The value for an `<input type="file" accept>`: what the settings allow, narrowed to images or videos. */
export const acceptFor = (kind: 'image' | 'video' | 'audio', config?: Partial<MediaManagerConfig>): string => {
  const allowed = resolveMediaManagerConfig(config).allowedTypes ?? [];
  const matching = allowed.filter((type) => type.startsWith(`${kind}/`) || type === '*/*');
  return matching.length ? matching.join(',') : `${kind}/*`;
};

/** Throws when the file is over the size limit. */
export const assertSize = (file: File, config: MediaManagerConfig): void => {
  if (config.maxFileSize && file.size > config.maxFileSize) {
    throw new MediaUploadError(
      'too-large',
      `${file.name || 'This file'} is ${formatSize(file.size)}. The limit is ${formatSize(config.maxFileSize)}.`,
    );
  }
};

/**
 * Throws a MediaUploadError for a file the settings do not allow. A picture that is going to be made smaller
 * (`optimizeImages`) is not held to the size limit yet: a 12 MB photo may be 600 KB once it has been.
 */
export const validateFile = (file: File, config: MediaManagerConfig): void => {
  if (config.allowedTypes && !isTypeAllowed(file.type, config.allowedTypes)) {
    throw new MediaUploadError('type-not-allowed', `${file.name || 'This file'} isn't a type that can be uploaded here.`);
  }
  if (!(resolveOptimize(config.optimizeImages) && isOptimizable(file.type))) assertSize(file, config);
};

/**
 * Checks the file against the settings and sends it to the provider in force, with progress and cancellation.
 * Rejects with a MediaUploadError (code `aborted` when the person cancelled).
 */
export const uploadMedia = async (original: File, options: UploadOptions = {}): Promise<MediaItem> => {
  const config = resolveMediaManagerConfig(options.config);
  validateFile(original, config);

  const optimize = resolveOptimize(config.optimizeImages);
  const file = optimize ? await optimizeImageFile(original, optimize) : original;
  // Whatever it is now, it has to fit.
  assertSize(file, config);

  const context = { signal: options.signal, onProgress: options.onProgress };
  try {
    return await resolveProvider(config).upload(file, context);
  } catch (error) {
    if (isAbort(error) || !config.fallbackToBase64) throw error;
    return createBase64Provider().upload(file, context);
  }
};
