import { confirmAction } from '../../../../shared/confirmDialog';
import type { MediaItem, MediaPage, MediaProvider } from '../../types/media';
import { isAbort } from '../../providers';
import { icons } from './icons';
import { createLibraryTile, el } from './tile';
import { isPickable, type PickerContext } from './types';

const PAGE_SIZE = 24;
const SEARCH_DELAY = 300;

/** The searchable, paginated grid of what the provider holds. */
export class LibraryView {
  readonly element = el('div', 'rte-mp-view');
  private readonly scroll = el('div', 'rte-mp-scroll');
  private readonly content = el('div');
  private items: MediaItem[] = [];
  private total = 0;
  private page = 0;
  private loading = false;
  private failed: string | null = null;
  private loaded = false;
  private stale = false;
  private search = '';
  private controller: AbortController | null = null;
  private searchTimer: ReturnType<typeof setTimeout> | undefined;
  private observer: IntersectionObserver | null = null;
  private focusId: string | null = null;

  constructor(
    private readonly ctx: PickerContext,
    private readonly onUpload: () => void,
    /** The same grid over another source (a stock service): what lists, the words, and what the id of the panel is. */
    private readonly options: {
      id?: string;
      source?: Pick<MediaProvider, 'list'>;
      emptyTitle?: string;
      emptyHint?: string;
      /** Offer the Upload tab from the empty state (a library can be filled by uploading; a stock service cannot). */
      offerUpload?: boolean;
    } = {},
  ) {
    this.element.setAttribute('role', 'tabpanel');
    this.element.id = `rte-mp-panel-${options.id ?? 'library'}`;
    this.element.hidden = true;
    this.scroll.append(this.content);
    this.element.append(this.scroll);
    this.content.addEventListener('keydown', this.onKeyDown);
  }

  /** The panel became the visible one. Loads on first sight, and again when uploads or deletions made it stale. */
  activate(): void {
    if (!this.loaded || this.stale) void this.reload();
  }

  markStale(): void {
    this.stale = true;
  }

  setSearch(value: string): void {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      if (value === this.search) return;
      this.search = value;
      void this.reload();
    }, SEARCH_DELAY);
  }

  dispose(): void {
    clearTimeout(this.searchTimer);
    this.controller?.abort();
    this.observer?.disconnect();
  }

  /** Reflect the selection on the tiles without rebuilding them (which would lose the focus). */
  syncSelection(): void {
    this.content.querySelectorAll<HTMLElement>('.rte-mp-tile[data-id]').forEach((tile) => {
      tile.setAttribute('aria-selected', String(this.ctx.selection.has(tile.dataset.id!)));
    });
  }

  focusGrid(): void {
    const tile = this.tiles()[0];
    this.tiles().forEach((t) => (t.tabIndex = -1));
    const target = this.content.querySelector<HTMLElement>('.rte-mp-tile[aria-selected="true"]') ?? tile;
    if (target) {
      target.tabIndex = 0;
      target.focus({ preventScroll: true });
    }
  }

  async deleteItem(item: MediaItem): Promise<boolean> {
    const { provider } = this.ctx;
    if (!provider.delete) return false;
    const confirmed = await confirmAction(`Delete ${item.name} from the library? Documents that use it will lose the picture.`, {
      title: 'Delete from library',
      confirmText: 'Delete',
      danger: true,
      context: this.element,
    });
    if (!confirmed) return false;
    try {
      await provider.delete(item.id);
    } catch (error) {
      this.ctx.announce(error instanceof Error ? error.message : "Couldn't delete the file.");
      return false;
    }
    this.ctx.selection.remove(item.id);
    this.items = this.items.filter((entry) => entry.id !== item.id);
    this.total = Math.max(0, this.total - 1);
    this.render();
    this.ctx.announce(`Deleted ${item.name}`);
    return true;
  }

  private async reload(): Promise<void> {
    this.controller?.abort();
    this.items = [];
    this.total = 0;
    this.page = 0;
    this.failed = null;
    this.stale = false;
    await this.loadPage();
  }

  private async loadPage(): Promise<void> {
    const provider = this.options.source ?? this.ctx.provider;
    if (!provider.list) return;
    const controller = new AbortController();
    this.controller = controller;
    this.loading = true;
    this.render();

    try {
      const next: MediaPage = await provider.list(
        {
          page: this.page + 1,
          limit: PAGE_SIZE,
          search: this.search || undefined,
          type: this.ctx.kinds.length === 1 ? this.ctx.kinds[0] : undefined,
        },
        { signal: controller.signal },
      );
      if (controller !== this.controller) return;
      this.page += 1;
      this.total = next.total;
      const known = new Set(this.items.map((item) => item.id));
      this.items.push(...next.items.filter((item) => isPickable(item, this.ctx.kinds) && !known.has(item.id)));
      this.failed = null;
      this.loaded = true;
      this.ctx.announce(this.items.length ? `${this.total} item${this.total === 1 ? '' : 's'}` : 'No results');
    } catch (error) {
      if (controller !== this.controller || isAbort(error)) return;
      this.failed = error instanceof Error && error.message ? error.message : "Couldn't load your media.";
      this.loaded = true;
    } finally {
      if (controller === this.controller) {
        this.loading = false;
        this.render();
      }
    }
  }

  private tiles(): HTMLElement[] {
    return [...this.content.querySelectorAll<HTMLElement>('.rte-mp-tile[data-id]')];
  }

  private render(): void {
    this.observer?.disconnect();
    const focused = document.activeElement instanceof HTMLElement ? document.activeElement.dataset.id : undefined;
    this.focusId = focused && this.content.contains(document.activeElement) ? focused : null;
    this.content.replaceChildren();

    const hasItems = this.items.length > 0;
    if (this.failed && !hasItems) {
      this.content.append(this.errorBlock(this.failed));
      return;
    }
    if (!hasItems && this.loading) {
      const grid = el('div', 'rte-mp-grid');
      grid.setAttribute('aria-busy', 'true');
      for (let i = 0; i < 12; i++) grid.append(el('div', 'rte-mp-tile is-skeleton'));
      this.content.append(grid);
      return;
    }
    if (!hasItems) {
      this.content.append(this.emptyBlock());
      return;
    }

    const grid = el('div', 'rte-mp-grid');
    grid.setAttribute('role', 'listbox');
    grid.setAttribute('aria-label', 'Media library');
    if (this.ctx.selection.multiple) grid.setAttribute('aria-multiselectable', 'true');
    for (const item of this.items) {
      const tile = createLibraryTile(item);
      tile.addEventListener('click', (event) => this.onTileClick(event, item));
      tile.addEventListener('dblclick', () => this.ctx.commit([item]));
      grid.append(tile);
    }
    this.content.append(grid);

    if (this.failed) this.content.append(this.errorBlock(this.failed, true));
    if (this.items.length < this.total || this.loading) this.content.append(this.moreButton());

    // Keep one tile in the tab order, and put the focus back where it was after the rebuild.
    const tiles = this.tiles();
    const target = tiles.find((tile) => tile.dataset.id === this.focusId) ?? tiles.find((t) => t.getAttribute('aria-selected') === 'true') ?? tiles[0];
    if (target) target.tabIndex = 0;
    if (this.focusId && target) target.focus({ preventScroll: true });
    this.syncSelection();
  }

  private moreButton(): HTMLElement {
    const button = el('button', 'rte-media-btn rte-media-btn-secondary rte-mp-more');
    button.type = 'button';
    button.textContent = this.loading ? 'Loading…' : 'Load more';
    button.addEventListener('click', () => void this.loadPage());
    if (!this.loading && typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting) && !this.loading) void this.loadPage();
        },
        { root: this.scroll, rootMargin: '200px' },
      );
      this.observer.observe(button);
    }
    return button;
  }

  private emptyBlock(): HTMLElement {
    const box = el('div', 'rte-mp-empty');
    const searching = Boolean(this.search);
    box.innerHTML = `<span aria-hidden="true">${icons.photo}</span>`;
    const title = el('strong');
    title.textContent = searching ? `No results for “${this.search}”` : this.options.emptyTitle ?? 'Nothing in your library yet';
    const hint = el('span');
    hint.textContent = searching ? 'Try a different word.' : this.options.emptyHint ?? 'Upload files and they will show up here.';
    box.append(title, hint);
    if (!searching && this.options.offerUpload !== false) {
      const button = el('button', 'rte-media-btn rte-media-btn-primary');
      button.type = 'button';
      button.textContent = 'Upload files';
      button.addEventListener('click', this.onUpload);
      box.append(button);
    }
    return box;
  }

  private errorBlock(message: string, inline = false): HTMLElement {
    const box = el('div', 'rte-mp-error');
    box.setAttribute('role', 'alert');
    if (inline) box.style.minHeight = '0';
    box.innerHTML = `<span aria-hidden="true">${icons.alert}</span>`;
    const title = el('strong');
    title.textContent = message;
    const retry = el('button', 'rte-media-btn rte-media-btn-secondary');
    retry.type = 'button';
    retry.textContent = 'Try again';
    retry.addEventListener('click', () => void (this.items.length ? this.loadPage() : this.reload()));
    box.append(title, retry);
    return box;
  }

  private lastClicked: string | null = null;

  private onTileClick(event: MouseEvent, item: MediaItem): void {
    const { selection } = this.ctx;
    if (event.shiftKey && this.lastClicked && selection.multiple) {
      selection.range(this.items, this.lastClicked, item.id);
    } else {
      selection.toggle(item);
    }
    this.lastClicked = item.id;
    this.ctx.setActive(selection.has(item.id) ? item : selection.items.at(-1) ?? null);
    this.tiles().forEach((tile) => (tile.tabIndex = tile.dataset.id === item.id ? 0 : -1));
  }

  private columns(tiles: HTMLElement[]): number {
    if (tiles.length < 2) return 1;
    const top = tiles[0].offsetTop;
    const index = tiles.findIndex((tile) => tile.offsetTop !== top);
    return index === -1 ? tiles.length : Math.max(index, 1);
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    const tile = (event.target as HTMLElement).closest<HTMLElement>('.rte-mp-tile[data-id]');
    if (!tile) return;
    const tiles = this.tiles();
    const index = tiles.indexOf(tile);
    const columns = this.columns(tiles);
    const item = this.items.find((entry) => entry.id === tile.dataset.id)!;
    const { selection } = this.ctx;

    const move = (to: number) => {
      const next = tiles[Math.min(Math.max(to, 0), tiles.length - 1)];
      if (!next) return;
      tiles.forEach((t) => (t.tabIndex = -1));
      next.tabIndex = 0;
      next.focus();
      next.scrollIntoView?.({ block: 'nearest' });
      if (event.shiftKey && selection.multiple) {
        selection.range(this.items, this.lastClicked ?? tile.dataset.id!, next.dataset.id!);
      }
    };

    switch (event.key) {
      case 'ArrowRight': event.preventDefault(); move(index + 1); break;
      case 'ArrowLeft': event.preventDefault(); move(index - 1); break;
      case 'ArrowDown': event.preventDefault(); move(index + columns); break;
      case 'ArrowUp': event.preventDefault(); move(index - columns); break;
      case 'Home': event.preventDefault(); move(event.ctrlKey ? 0 : index - (index % columns)); break;
      case 'End': event.preventDefault(); move(event.ctrlKey ? tiles.length - 1 : index - (index % columns) + columns - 1); break;
      case ' ':
        event.preventDefault();
        selection.toggle(item);
        this.lastClicked = item.id;
        this.ctx.setActive(selection.has(item.id) ? item : selection.items.at(-1) ?? null);
        break;
      case 'Enter':
        event.preventDefault();
        this.ctx.commit(selection.size ? undefined : [item]);
        break;
      case 'a':
      case 'A':
        if (event.metaKey || event.ctrlKey) {
          event.preventDefault();
          selection.all(this.items);
          this.ctx.setActive(item);
        }
        break;
    }
  };
}
