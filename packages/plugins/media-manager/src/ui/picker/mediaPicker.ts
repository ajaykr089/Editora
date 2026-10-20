import { resolveMediaManagerConfig } from '../../constants';
import { resolveProvider } from '../../providers';
import type { MediaItem, MediaManagerConfig } from '../../types/media';
import { attachEscapeCloseHandler, createDialogOverlay, createDialogShell } from '../dialogKit';
import { DetailsPanel } from './detailsPanel';
import { EmbedView } from './embedView';
import { icons } from './icons';
import type { MediaSpec } from './insertMedia';
import { LibraryView } from './libraryView';
import { SelectionModel } from './selection';
import { stockAsList } from './stock';
import { el } from './tile';
import { kindNoun, type PickerContext, type PickerKind } from './types';
import { UploadView } from './uploadView';
import { UrlView } from './urlView';

type View = 'library' | 'stock' | 'upload' | 'url' | 'embed';

export interface PickerOptions {
  /** `insert` can take several files; `replace` takes one. */
  mode: 'insert' | 'replace';
  kinds: PickerKind[];
  title: string;
  contextElement?: HTMLElement | null;
  config?: Partial<MediaManagerConfig>;
  /** The address and alt text the URL tab starts with (replacing an image shows the current one). */
  initialUrl?: string;
  initialAlt?: string;
  /** Called once the dialog is closed, with what was chosen. `gallery`: the person asked for them as one gallery. */
  onPick: (specs: MediaSpec[], extra?: { gallery?: boolean }) => void;
}

const NAV: Record<View, { label: string; icon: string; className: string }> = {
  library: { label: 'Library', icon: icons.library, className: 'tab-library' },
  stock: { label: 'Stock', icon: icons.stock, className: 'tab-stock' },
  upload: { label: 'Upload', icon: icons.upload, className: 'tab-upload' },
  url: { label: 'URL', icon: icons.link, className: 'tab-url' },
  embed: { label: 'Embed', icon: icons.embed, className: 'tab-embed' },
};

/**
 * The media picker: a library to browse, stock photos, an upload queue, an address field and an embed field, with a
 * details panel for what is chosen. Built once and updated in place, never rebuilt, so the focus stays where it is.
 */
export const openMediaPicker = (options: PickerOptions): void => {
  const { mode, kinds } = options;
  const config = resolveMediaManagerConfig(options.config);
  const provider = resolveProvider(config);
  const stock = kinds.length === 1 && kinds[0] === 'image' && mode === 'insert' ? config.stockProvider : undefined;
  const canEmbed = mode === 'insert' && kinds.length === 1 && kinds[0] === 'video';
  const hasLibrary = typeof provider.list === 'function';
  const views: View[] = [
    ...(hasLibrary ? (['library'] as const) : []),
    ...(stock ? (['stock'] as const) : []),
    'upload',
    'url',
    ...(canEmbed ? (['embed'] as const) : []),
  ];
  // Replacing an image starts from the address it has now; inserting starts from what can be browsed or dropped.
  let view: View = mode === 'replace' && !hasLibrary ? 'url' : views[0];

  const overlay = createDialogOverlay(options.contextElement);
  const dialog = createDialogShell();
  dialog.classList.add('rte-mp', 'no-details');
  const live = el('div', 'rte-mp-sr');
  live.setAttribute('aria-live', 'polite');
  live.setAttribute('role', 'status');

  const selection = new SelectionModel<MediaItem>(mode === 'insert', () => onSelectionChange());
  let active: MediaItem | null = null;

  // ── context shared with the views ────────────────────────────────────────────────────────────
  const ctx: PickerContext = {
    kinds,
    config: options.config,
    provider,
    selection,
    setActive: (item) => {
      active = item;
      details.show(item);
      updateChrome();
    },
    commit: (items) => commit(items),
    announce: (message) => {
      live.textContent = '';
      // A change of text is what a live region announces; clearing first makes a repeat count as one.
      window.setTimeout(() => (live.textContent = message), 30);
    },
  };

  const library = hasLibrary ? new LibraryView(ctx, () => showView('upload')) : null;
  const stockView = stock
    ? new LibraryView(ctx, () => {}, {
        id: 'stock',
        source: stockAsList(stock),
        emptyTitle: `Search ${stock.name}`,
        emptyHint: `Photos from ${stock.name} will show up here.`,
        offerUpload: false,
      })
    : null;
  const searchable: Partial<Record<View, LibraryView | null>> = { library, stock: stockView };
  const upload = new UploadView(ctx, () => library?.markStale());
  const url = new UrlView(kinds, options.initialUrl ?? '', options.initialAlt, () => updateChrome(), () => commit());
  const embed = canEmbed ? new EmbedView(config.embedProviders ?? [], () => updateChrome(), () => commit()) : null;
  const details = new DetailsPanel(selection, {
    defaultAlt: options.initialAlt,
    config: options.config,
    // Only what is in the library can be deleted from it: not a stock photo, not a loose address.
    canDelete: (item) => Boolean(library && provider.delete && !item.metadata?.stock),
    onDelete: (item) =>
      void library?.deleteItem(item).then((deleted) => {
        if (!deleted) return;
        const entry = upload.queue.entries.find((candidate) => candidate.item?.id === item.id);
        if (entry) upload.queue.remove(entry.id);
        ctx.setActive(selection.items.at(-1) ?? null);
      }),
  });

  // ── layout ──────────────────────────────────────────────────────────────────────────────────
  const header = el('div', 'rte-mp-header');
  const title = el('h2', 'rte-media-title');
  title.textContent = options.title;

  const searchBox = el('label', 'rte-mp-search');
  const searchInput = el('input');
  searchInput.type = 'search';
  searchInput.id = 'mp-search';
  searchInput.placeholder = 'Search by name';
  searchInput.setAttribute('aria-label', 'Search the library');
  searchBox.insertAdjacentHTML('afterbegin', icons.search);
  searchBox.append(searchInput);
  searchBox.hidden = !(hasLibrary || stock);
  const searches: Partial<Record<View, string>> = {};

  const closeButton = el('button', 'close-btn rte-media-close-btn');
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.innerHTML = icons.close;
  header.append(title, searchBox, el('span', 'rte-mp-spacer'), closeButton);

  const nav = el('div', 'rte-mp-nav');
  nav.setAttribute('role', 'tablist');
  nav.setAttribute('aria-orientation', 'vertical');
  nav.setAttribute('aria-label', 'Where to get the media from');
  const navButtons = new Map<View, HTMLButtonElement>();
  for (const name of views) {
    const button = el('button', `rte-mp-nav-item rte-media-tab ${NAV[name].className}`);
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', `rte-mp-panel-${name}`);
    button.innerHTML = `${NAV[name].icon}<span></span>`;
    button.querySelector('span')!.textContent = name === 'stock' && stock ? stock.name : NAV[name].label;
    button.addEventListener('click', () => {
      showView(name);
      // Safari does not focus a button when it is clicked; the keyboard has to be left where the person chose.
      button.focus();
    });
    navButtons.set(name, button);
    nav.append(button);
  }
  nav.addEventListener('keydown', (event) => {
    const moves: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = views[(views.indexOf(view) + moves[event.key] + views.length) % views.length];
    showView(next);
    navButtons.get(next)?.focus();
  });

  const main = el('div', 'rte-mp-main');
  const panels: Record<View, HTMLElement | undefined> = {
    library: library?.element,
    stock: stockView?.element,
    upload: upload.element,
    url: url.element,
    embed: embed?.element,
  };
  main.append(...views.map((name) => panels[name]!));

  const body = el('div', 'rte-mp-body');
  body.append(nav, main, details.element);

  const footer = el('div', 'rte-mp-footer');
  const count = el('span', 'rte-mp-count');
  const cancelButton = el('button', 'cancel-btn rte-media-btn rte-media-btn-secondary');
  cancelButton.type = 'button';
  cancelButton.textContent = 'Cancel';
  const galleryButton = el('button', 'gallery-btn rte-media-btn rte-media-btn-secondary');
  galleryButton.type = 'button';
  galleryButton.innerHTML = `${icons.gallery}<span style="margin-left:6px">Insert as gallery</span>`;
  galleryButton.hidden = true;
  const insertButton = el('button', 'rte-media-btn rte-media-btn-primary');
  insertButton.type = 'button';
  insertButton.id = 'insert-btn';
  footer.append(count, cancelButton, galleryButton, insertButton);

  const veil = el('div', 'rte-mp-drop-veil');
  veil.setAttribute('aria-hidden', 'true');
  veil.textContent = 'Drop to upload';

  dialog.append(header, body, footer, veil, live);
  overlay.append(dialog);
  document.body.append(overlay);

  // ── behaviour ───────────────────────────────────────────────────────────────────────────────
  const isBrowse = () => view === 'library' || view === 'stock' || view === 'upload';

  function showView(next: View): void {
    searches[view] = searchInput.value;
    view = next;
    for (const name of views) {
      const on = name === next;
      panels[name]!.hidden = !on;
      const button = navButtons.get(name)!;
      button.setAttribute('aria-selected', String(on));
      button.tabIndex = on ? 0 : -1;
    }
    const searchable_ = searchable[next];
    searchBox.hidden = !searchable_;
    if (searchable_) {
      searchInput.value = searches[next] ?? '';
      searchInput.setAttribute('aria-label', next === 'stock' ? `Search ${stock!.name}` : 'Search the library');
      searchInput.placeholder = next === 'stock' ? `Search ${stock!.name}` : 'Search by name';
      searchable_.activate();
    }
    updateChrome();
  }

  function specsFor(items: MediaItem[]): MediaSpec[] {
    return items.map((item) => ({
      src: item.src,
      type: item.type,
      alt: details.altFor(item),
      caption: typeof item.metadata?.caption === 'string' ? item.metadata.caption : undefined,
    }));
  }

  function embedSpec(): MediaSpec | null {
    const found = embed?.spec;
    return found ? { src: found.src, type: 'video', embed: found, title: embed!.title || undefined } : null;
  }

  function commit(items?: MediaItem[], extra?: { gallery?: boolean }): void {
    let specs: MediaSpec[];
    if (view === 'url' && !items) specs = [url.spec()].filter((s): s is MediaSpec => Boolean(s));
    else if (view === 'embed' && !items) specs = [embedSpec()].filter((s): s is MediaSpec => Boolean(s));
    else specs = specsFor(items ?? selection.items);
    if (specs.length === 0) return;
    close();
    options.onPick(specs, extra);
  }

  function updateChrome(): void {
    const pickCount = view === 'url' ? (url.url ? 1 : 0) : view === 'embed' ? (embed?.spec ? 1 : 0) : selection.size;
    const noun = view === 'embed' ? 'video' : kindNoun(kinds);
    if (mode === 'replace') insertButton.textContent = 'Replace';
    else insertButton.textContent = pickCount > 1 ? `Insert ${pickCount} ${kindNoun(kinds, true)}` : pickCount === 1 ? `Insert ${noun}` : 'Insert';
    insertButton.disabled = pickCount === 0;

    // Several pictures can go in as one gallery.
    galleryButton.hidden = !(mode === 'insert' && kinds.length === 1 && kinds[0] === 'image' && isBrowse() && selection.size >= 2);

    if (view === 'url' || view === 'embed') count.textContent = '';
    else count.textContent = selection.size ? `${selection.size} selected` : mode === 'insert' ? `Select ${kinds.length === 1 ? kindNoun(kinds, true) : 'media'} to insert` : 'Select an image';

    const showDetails = isBrowse() && active !== null && selection.size > 0;
    dialog.classList.toggle('no-details', !showDetails);
    details.element.hidden = !showDetails;
  }

  function onSelectionChange(): void {
    if (selection.size === 0 && active) {
      active = null;
      details.show(null);
    }
    library?.syncSelection();
    stockView?.syncSelection();
    upload.syncSelection();
    updateChrome();
  }

  let cleanupEscape = () => {};
  function close(): void {
    cleanupEscape();
    library?.dispose();
    stockView?.dispose();
    upload.dispose();
    url.dispose();
    overlay.remove();
  }
  cleanupEscape = attachEscapeCloseHandler(overlay, close);

  closeButton.addEventListener('click', close);
  cancelButton.addEventListener('click', close);
  insertButton.addEventListener('click', () => commit());
  galleryButton.addEventListener('click', () => commit(undefined, { gallery: true }));
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });
  searchInput.addEventListener('input', () => searchable[view]?.setSearch(searchInput.value.trim()));

  // Files dropped anywhere on the dialog, or pasted into it, are uploads.
  let dragDepth = 0;
  const hasFiles = (event: DragEvent) => Array.from(event.dataTransfer?.types ?? []).includes('Files');
  dialog.addEventListener('dragenter', (event) => {
    if (!hasFiles(event)) return;
    dragDepth++;
    dialog.classList.add('is-dropping');
  });
  dialog.addEventListener('dragover', (event) => {
    if (hasFiles(event)) event.preventDefault();
  });
  dialog.addEventListener('dragleave', (event) => {
    if (!hasFiles(event)) return;
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) dialog.classList.remove('is-dropping');
  });
  dialog.addEventListener('drop', (event) => {
    dragDepth = 0;
    dialog.classList.remove('is-dropping');
    const files = Array.from(event.dataTransfer?.files ?? []);
    if (!files.length) return;
    event.preventDefault();
    showView('upload');
    upload.add(files);
  });
  dialog.addEventListener('paste', (event) => {
    const files = Array.from(event.clipboardData?.files ?? []);
    if (!files.length) return;
    event.preventDefault();
    showView('upload');
    upload.add(files);
  });

  showView(view);
  if (searchable[view]) searchInput.focus({ preventScroll: true });
  else if (view === 'upload') upload.focusDropzone();
  else if (view === 'embed') embed?.focus();
  else url.focus();
};
