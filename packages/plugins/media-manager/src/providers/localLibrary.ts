import type { MediaItem, MediaPage, MediaProvider, MediaQuery, MediaUpdate } from '../types/media';

/**
 * A library for providers that cannot list: what was uploaded from this browser, kept in IndexedDB (in memory
 * where that is not available), so the picker's Library tab, search and details panel work with no backend at all.
 *
 * It keeps the items, not the files: a data URL is the file, and a URL from an `uploadHandler` points at it.
 */

const DB_NAME = 'editora-media-library';
const STORE = 'items';
/** The oldest are dropped past this many, and anything bigger than `MAX_ITEM_CHARS` of data URL is not kept. */
const MAX_ITEMS = 60;
const MAX_ITEM_CHARS = 8 * 1024 * 1024;
const THUMBNAIL_EDGE = 240;

interface Store {
  all(): Promise<MediaItem[]>;
  put(item: MediaItem): Promise<void>;
  remove(id: string): Promise<void>;
}

const memoryStore = (): Store => {
  const items = new Map<string, MediaItem>();
  return {
    all: async () => [...items.values()],
    put: async (item) => void items.set(item.id, item),
    remove: async (id) => void items.delete(id),
  };
};

const request = <T>(req: IDBRequest<T>): Promise<T> =>
  new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

const indexedDbStore = (): Store | null => {
  if (typeof indexedDB === 'undefined') return null;
  let opened: Promise<IDBDatabase> | null = null;
  const open = () =>
    (opened ??= new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' });
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
      req.onblocked = () => reject(new Error('blocked'));
    }));
  const run = async <T>(mode: IDBTransactionMode, work: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> => {
    const db = await open();
    return request(work(db.transaction(STORE, mode).objectStore(STORE)));
  };
  return {
    all: () => run('readonly', (s) => s.getAll() as IDBRequest<MediaItem[]>),
    put: async (item) => void (await run('readwrite', (s) => s.put(item))),
    remove: async (id) => void (await run('readwrite', (s) => s.delete(id))),
  };
};

/** IndexedDB when it works; if it fails (private windows, blocked storage) the page keeps a list in memory. */
const createStore = (): Store => {
  const persistent = indexedDbStore();
  const fallback = memoryStore();
  if (!persistent) return fallback;
  let broken = false;
  const guard = async <T>(work: (store: Store) => Promise<T>): Promise<T> => {
    if (!broken) {
      try {
        return await work(persistent);
      } catch {
        broken = true;
      }
    }
    return work(fallback);
  };
  return {
    all: () => guard((s) => s.all()),
    put: (item) => guard((s) => s.put(item)),
    remove: (id) => guard((s) => s.remove(id)),
  };
};

let shared: Store | null = null;
const store = (): Store => (shared ??= createStore());

/** Test hook: forget the shared store so the next use starts empty. */
export const resetLocalLibrary = (): void => {
  shared = null;
};

/** A small copy of a picture for the grid, so a library of photos does not load every one at full size. */
const makeThumbnail = (src: string): Promise<string | null> =>
  new Promise((resolve) => {
    if (typeof document === 'undefined' || typeof Image === 'undefined') return resolve(null);
    const image = new Image();
    const timer = window.setTimeout(() => resolve(null), 4000);
    image.onload = () => {
      window.clearTimeout(timer);
      try {
        const scale = Math.min(1, THUMBNAIL_EDGE / Math.max(image.naturalWidth, image.naturalHeight, 1));
        if (scale >= 1) return resolve(null);
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext('2d');
        if (!context) return resolve(null);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      } catch {
        resolve(null);
      }
    };
    image.onerror = () => {
      window.clearTimeout(timer);
      resolve(null);
    };
    image.src = src;
  });

const remember = async (item: MediaItem): Promise<void> => {
  if (item.src.length > MAX_ITEM_CHARS || item.type === 'file') return;
  const kept: MediaItem = { ...item, metadata: { ...item.metadata, local: true } };
  try {
    await store().put(kept);
    const all = await store().all();
    if (all.length > MAX_ITEMS) {
      const oldest = all.sort((a, b) => a.createdAt - b.createdAt).slice(0, all.length - MAX_ITEMS);
      await Promise.all(oldest.map((old) => store().remove(old.id)));
    }
    if (item.type === 'image' && !item.thumbnailUrl) {
      void makeThumbnail(item.src).then((thumbnailUrl) => (thumbnailUrl ? store().put({ ...kept, thumbnailUrl }) : undefined)).catch(() => {});
    }
  } catch {
    // The library is a convenience: an upload that worked must not fail because it could not be remembered.
  }
};

const LOCAL = Symbol('editora.localLibrary');

/** Whether a provider's library is the one kept in this browser (it starts empty, so the picker opens elsewhere). */
export const isLocalLibrary = (provider: MediaProvider): boolean => (provider as MediaProvider & { [LOCAL]?: true })[LOCAL] === true;

/** `inner` with a library of what went through it. A provider that can list is returned as it is. */
export const withLocalLibrary = (inner: MediaProvider): MediaProvider => {
  if (typeof inner.list === 'function') return inner;
  const provider: MediaProvider & { [LOCAL]: true } = {
    [LOCAL]: true,
    name: inner.name,
    upload: async (file, context) => {
      const item = await inner.upload(file, context);
      await remember(item);
      return item;
    },
    async list(query: MediaQuery = {}): Promise<MediaPage> {
      const search = (query.search ?? '').trim().toLowerCase();
      const matching = (await store().all())
        .filter((item) => (!query.type || item.type === query.type) && (!search || `${item.name} ${item.alt ?? ''}`.toLowerCase().includes(search)))
        .sort((a, b) => (query.sort === 'oldest' ? a.createdAt - b.createdAt : query.sort === 'name' ? a.name.localeCompare(b.name) : b.createdAt - a.createdAt));
      const limit = query.limit ?? 24;
      const page = query.page ?? 1;
      return { items: matching.slice((page - 1) * limit, page * limit), total: matching.length };
    },
    async update(id: string, updates: MediaUpdate): Promise<void> {
      const item = (await store().all()).find((candidate) => candidate.id === id);
      if (item) await store().put({ ...item, ...(updates.name !== undefined ? { name: updates.name } : {}), ...(updates.alt !== undefined ? { alt: updates.alt } : {}) });
    },
    delete: (id: string) => store().remove(id),
  };
  return provider;
};
