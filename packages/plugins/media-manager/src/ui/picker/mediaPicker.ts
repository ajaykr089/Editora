import { resolveMediaManagerConfig } from '../../constants';
import { isLocalLibrary, resolveProvider } from '../../providers';
import type { MediaItem, MediaManagerConfig } from '../../types/media';
import { attachEscapeCloseHandler, createDialogOverlay, createDialogShell } from '../dialogKit';
import { openImageEditor } from '../imageEditor/imageEditor';
import { DetailsPanel } from './detailsPanel';
import { EmbedView } from './embedView';
import { icons } from './icons';
import type { MediaSpec } from './insertMedia';
import { LibraryView, type LibrarySort } from './libraryView';
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
  stock: { label: 'Stock photos', icon: icons.stock, className: 'tab-stock' },
  upload: { label: 'Upload', icon: icons.upload, className: 'tab-upload' },
  url: { label: 'From URL', icon: icons.link, className: 'tab-url' },
  embed: { label: 'Embed', icon: icons.embed, className: 'tab-embed' },
};

const ALL_KINDS: PickerKind[] = ['image', 'video', 'audio'];

/** What to call what is chosen: "image" for one picture, "videos" for several, "items" for a mix. */
const nounFor = (items: Array<{ type: string }>, count: number): string => {
  const types = new Set(items.map((item) => item.type));
  const one = types.size === 1 ? (types.values().next().value as PickerKind) : null;
  return one && ALL_KINDS.includes(one) ? kindNoun([one], count > 1) : count > 1 ? 'items' : 'item';
};

/**
 * The media picker: a library to browse, stock photos, an upload queue, an address field and an embed field, with a
 * details panel for what is chosen. Built once and updated in place, never rebuilt, so the focus stays where it is.
 */
export const openMediaPicker = (options: PickerOptions): void => {
  const { mode } = options;
  const config = resolveMediaManagerConfig(options.config);
  const provider = resolveProvider(config);
  // The picker is one place for all media: what the command was for decides which filter it opens on, and the
  // person can change it. Replacing an image takes an image.
  const allowedKinds: PickerKind[] = mode === 'insert' ? ALL_KINDS : ['image'];
  const stock = mode === 'insert' ? config.stockProvider : undefined;
  const canEmbed = mode === 'insert';
  const hasLibrary = typeof provider.list === 'function';
  const views: View[] = [
    ...(hasLibrary ? (['library'] as const) : []),
    ...(stock ? (['stock'] as const) : []),
    'upload',
    'url',
    ...(canEmbed ? (['embed'] as const) : []),
  ];
  // Replacing an image starts from the address it has now; inserting starts from what can be browsed or dropped.
  // The library kept in this browser starts empty: open on what can be uploaded, and move to it if it has something.
  const localOnly = hasLibrary && isLocalLibrary(provider);
  let view: View = mode === 'replace' && (!hasLibrary || localOnly) ? 'url' : localOnly ? views.find((name) => name !== 'library')! : views[0];
  let touched = false;

  const overlay = createDialogOverlay(options.contextElement);
  const dialog = createDialogShell();
  dialog.classList.add('rte-mp', 'no-details');
  const live = el('div', 'rte-mp-sr');
  live.setAttribute('aria-live', 'polite');
  live.setAttribute('role', 'status');

  const selection = new SelectionModel<MediaItem>(mode === 'insert', () => onSelectionChange());
  let active: MediaItem | null = null;

  // ── context shared with the views ────────────────────────────────────────────────────────────
  let library: LibraryView | null = null;
  const ctx: PickerContext = {
    get kinds() {
      return library?.kinds ?? allowedKinds;
    },
    allowedKinds,
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

  const upload = new UploadView(
    ctx,
    (item) => library?.addUploaded(item),
    () => library?.syncPending(),
  );
  library = hasLibrary
    ? new LibraryView(ctx, () => showView('upload'), {
        pills: mode === 'insert' ? { filter: options.kinds.length === 1 ? options.kinds[0] : 'all' } : undefined,
        queue: () => upload.queue,
        dropHint: true,
      })
    : null;
  const stockView = stock
    ? new LibraryView(ctx, () => {}, {
        id: 'stock',
        source: stockAsList(stock),
        emptyTitle: `Search ${stock.name}`,
        emptyHint: `Photos from ${stock.name} will show up here.`,
        offerUpload: false,
        kinds: ['image'],
        sortable: false,
      })
    : null;
  const searchable: Partial<Record<View, LibraryView | null>> = { library, stock: stockView };
  const url = new UrlView(allowedKinds, options.initialUrl ?? '', options.initialAlt, () => updateChrome(), () => commit(), options.kinds[0] ?? 'image');
  const embed = canEmbed ? new EmbedView(config.embedProviders ?? [], () => updateChrome(), () => commit()) : null;
  const details = new DetailsPanel(selection, {
    defaultAlt: options.initialAlt,
    config: options.config,
    captions: config.wrapInFigure !== false,
    // Only what is in the library can be deleted from it: not a stock photo, not a loose address.
    canDelete: (item) => Boolean(library && provider.delete && !item.metadata?.stock),
    onDelete: (item) =>
      void library?.deleteItem(item).then((deleted) => {
        if (!deleted) return;
        const entry = upload.queue.entries.find((candidate) => candidate.item?.id === item.id);
        if (entry) upload.queue.remove(entry.id);
        ctx.setActive(selection.items.at(-1) ?? null);
      }),
    onEdit: (item) =>
      openImageEditor({
        src: item.src,
        name: item.name,
        config: options.config,
        contextElement: dialog,
        // The edited picture is a new file: it takes the place of the original in what is chosen.
        onApply: ({ item: edited }) => {
          selection.remove(item.id);
          library?.addUploaded(edited);
          if (mode === 'insert') selection.toggle(edited);
          else selection.only(edited);
          ctx.setActive(edited);
          ctx.announce(`${edited.name} saved`);
        },
      }),
  });

  // ── layout ──────────────────────────────────────────────────────────────────────────────────
  const header = el('div', 'rte-mp-header');
  const title = el('h2', 'rte-media-title');
  // The window is one place for all media; what it was opened for is its accessible name.
  title.textContent = mode === 'insert' ? 'Media' : options.title;
  dialog.setAttribute('aria-label', options.title);

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

  // What the library can be changed to look like: its order and whether it is a grid or a list.
  const viewTools = el('div', 'rte-mp-viewtools');
  const sortSelect = el('select', 'rte-mp-sort');
  sortSelect.setAttribute('aria-label', 'Sort by');
  for (const [value, label] of [['newest', 'Newest'], ['oldest', 'Oldest'], ['name', 'Name']] as const) {
    const option = el('option');
    option.value = value;
    option.textContent = label;
    sortSelect.append(option);
  }
  const layoutGroup = el('div', 'rte-mp-layout');
  layoutGroup.setAttribute('role', 'group');
  layoutGroup.setAttribute('aria-label', 'Layout');
  const layoutButtons = new Map<'grid' | 'list', HTMLButtonElement>();
  for (const [value, label, icon] of [['grid', 'Grid', icons.grid], ['list', 'List', icons.list]] as const) {
    const button = el('button', 'rte-mp-iconbtn');
    button.type = 'button';
    button.setAttribute('aria-label', `${label} view`);
    button.setAttribute('aria-pressed', String(value === 'grid'));
    button.innerHTML = icon;
    button.addEventListener('click', () => {
      library?.setLayout(value);
      layoutButtons.forEach((other, key) => other.setAttribute('aria-pressed', String(key === value)));
    });
    layoutButtons.set(value, button);
    layoutGroup.append(button);
  }
  sortSelect.addEventListener('change', () => library?.setSort(sortSelect.value as LibrarySort));
  viewTools.append(sortSelect, layoutGroup);
  viewTools.hidden = !library;

  const closeButton = el('button', 'close-btn rte-media-close-btn');
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.innerHTML = icons.close;
  header.append(title, searchBox, viewTools, closeButton);

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
    button.querySelector('span')!.textContent = NAV[name].label;
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
    touched = true;
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
    viewTools.hidden = next !== 'library';
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
      caption: details.captionFor(item),
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
    const noun = view === 'embed' ? 'video' : view === 'url' ? nounFor(url.spec() ? [url.spec()!] : [], 1) : nounFor(selection.items, pickCount);
    if (mode === 'replace') insertButton.textContent = 'Replace';
    else insertButton.textContent = pickCount > 1 ? `Insert ${pickCount} ${noun}` : pickCount === 1 ? `Insert ${noun}` : 'Insert';
    insertButton.disabled = pickCount === 0;

    // Several pictures can go in as one gallery.
    const onlyPictures = selection.size >= 2 && selection.items.every((item) => item.type === 'image');
    galleryButton.hidden = !(mode === 'insert' && isBrowse() && onlyPictures);

    if (view === 'url' || view === 'embed') count.textContent = '';
    else count.textContent = selection.size ? `${selection.size} selected` : mode === 'insert' ? 'Select media to insert' : 'Select an image';

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
    details.dispose();
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
    receive(files);
  });
  dialog.addEventListener('paste', (event) => {
    const files = Array.from(event.clipboardData?.files ?? []);
    if (!files.length) return;
    event.preventDefault();
    receive(files);
  });

  /** Files dropped or pasted: they go up, and show where they will end up (the library grid, else the Upload view). */
  function receive(files: File[]): void {
    if (view !== 'library' && view !== 'upload') showView(library ? 'library' : 'upload');
    upload.add(files);
  }

  showView(view);
  touched = false;
  if (localOnly && mode === 'insert') {
    void provider.list!({ limit: 1 }).then(
      (page) => {
        if (page.total > 0 && !touched && overlay.isConnected) {
          showView('library');
          searchInput.focus({ preventScroll: true });
        }
      },
      () => {},
    );
  }
  if (searchable[view]) searchInput.focus({ preventScroll: true });
  else if (view === 'upload') upload.focusDropzone();
  else if (view === 'embed') embed?.focus();
  else url.focus();
};
