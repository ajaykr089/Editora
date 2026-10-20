import type { MediaItem } from '../../types/media';
import { icons } from './icons';

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, className?: string): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
};

/** A first-frame poster for a video whose server sent no thumbnail. */
const videoSrc = (src: string) => (src.startsWith('data:') || src.startsWith('blob:') || src.includes('#') ? src : `${src}#t=0.1`);

/** The picture inside a tile: the thumbnail, the image itself, a video's first frame, or an icon. */
export const thumbnail = (item: Pick<MediaItem, 'type' | 'src' | 'thumbnailUrl'>, previewUrl?: string): HTMLElement => {
  const poster = previewUrl ?? (item.type === 'image' ? item.thumbnailUrl || item.src : item.thumbnailUrl);
  if (poster) {
    const img = el('img');
    img.src = poster;
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.draggable = false;
    // Fade in when it has arrived; a picture that cannot be loaded leaves the placeholder icon showing.
    img.classList.add('rte-mp-fade');
    img.addEventListener('load', () => img.classList.add('is-loaded'));
    img.addEventListener('error', () => img.classList.add('is-broken'));
    return img;
  }
  if (item.type === 'video') {
    const video = el('video');
    video.src = videoSrc(previewUrl ?? item.src);
    video.preload = 'metadata';
    video.muted = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('aria-hidden', 'true');
    return video;
  }
  const holder = el('span', 'rte-mp-tile-icon');
  holder.innerHTML = icons.photo;
  return holder;
};

export const kindBadge = (): HTMLElement => {
  const badge = el('span', 'rte-mp-tile-kind');
  badge.innerHTML = icons.play;
  return badge;
};

export const checkBadge = (): HTMLElement => {
  const badge = el('span', 'rte-mp-tile-check');
  badge.innerHTML = icons.check;
  return badge;
};

export const nameOverlay = (name: string): HTMLElement => {
  const label = el('span', 'rte-mp-tile-name');
  label.textContent = name;
  return label;
};

/** A selectable tile of the library grid (an option of its listbox). */
export const createLibraryTile = (item: MediaItem): HTMLElement => {
  const tile = el('div', 'rte-mp-tile');
  tile.setAttribute('role', 'option');
  tile.setAttribute('aria-selected', 'false');
  tile.setAttribute('aria-label', item.type === 'video' ? `${item.name}, video` : item.name);
  tile.tabIndex = -1;
  tile.dataset.id = item.id;
  tile.append(thumbnail(item));
  if (item.type === 'video') tile.append(kindBadge());
  tile.append(nameOverlay(item.name), checkBadge());
  return tile;
};

export const formatBytes = (bytes: number): string => {
  if (!bytes) return '';
  if (bytes >= 1024 * 1024) return `${Math.round((bytes / (1024 * 1024)) * 10) / 10} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

export { el };
