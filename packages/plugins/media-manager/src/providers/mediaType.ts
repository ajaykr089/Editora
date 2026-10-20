import type { MediaItem } from '../types/media';

export const mediaTypeOf = (mime: string): MediaItem['type'] => {
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('audio/')) return 'audio';
  return 'file';
};

let counter = 0;
export const newMediaId = (): string => `media-${Date.now().toString(36)}-${(counter++).toString(36)}`;
