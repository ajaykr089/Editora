import { resolveMediaManagerConfig } from '../../constants';
import { resolveProvider } from '../../providers';
import type { MediaItem, MediaManagerConfig } from '../../types/media';
import { attachEscapeCloseHandler, createDialogOverlay, createDialogShell } from '../dialogKit';
import { DetailsPanel } from './detailsPanel';
import { icons } from './icons';
import type { MediaSpec } from './insertMedia';
import { LibraryView } from './libraryView';
import { SelectionModel } from './selection';
import { el } from './tile';
import type { PickerContext, PickerKind } from './types';
import { UploadView } from './uploadView';
import { UrlView } from './urlView';

type View = 'library' | 'upload' | 'url';

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
  /** Called once the dialog is closed, with what was chosen. */
  onPick: (specs: MediaSpec[]) => void;
}

const NAV: Record<View, { label: string; icon: string; className: string }> = {
  library: { label: 'Library', icon: icons.library, className: 'tab-library' },
  upload: { label: 'Upload', icon: icons.upload, className: 'tab-upload' },
  url: { label: 'URL', icon: icons.link, className: 'tab-url' },
};

/**
 * The media picker: a library to browse, an upload queue, and an address field, with a details panel for what
 * is chosen. Built once and updated in place, never rebuilt, so the focus stays where it is.
 */
export const openMediaPicker = (options: PickerOptions): void => {
  const { mode, kinds } = options;
  const config = resolveMediaManagerConfig(options.config);
  const provider = resolveProvider(config);
  const hasLibrary = typeof provider.list === 'function';
  const views: View[] = hasLibrary ? ['library', 'upload', 'url'] : ['upload', 'url'];
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
  const upload = new UploadView(ctx, () => library?.markStale());
  const url = new UrlView(kinds, options.initialUrl ?? '', options.initialAlt, () => updateChrome(), () => commit());
  const details = new DetailsPanel(selection, {
    defaultAlt: options.initialAlt,
    canDelete: () => Boolean(library && provider.delete),
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
  searchBox.hidden = !hasLibrary;

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
    button.innerHTML = `${NAV[name].icon}<span>${NAV[name].label}</span>`;
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
  const panels: Record<View, HTMLElement | undefined> = { library: library?.element, upload: upload.element, url: url.element };
  main.append(...views.map((name) => panels[name]!));

  const body = el('div', 'rte-mp-body');
  body.append(nav, main, details.element);

  const footer = el('div', 'rte-mp-footer');
  const count = el('span', 'rte-mp-count');
  const cancelButton = el('button', 'cancel-btn rte-media-btn rte-media-btn-secondary');
  cancelButton.type = 'button';
  cancelButton.textContent = 'Cancel';
  const insertButton = el('button', 'rte-media-btn rte-media-btn-primary');
  insertButton.type = 'button';
  insertButton.id = 'insert-btn';
  footer.append(count, cancelButton, insertButton);

  const veil = el('div', 'rte-mp-drop-veil');
  veil.setAttribute('aria-hidden', 'true');
  veil.textContent = 'Drop to upload';

  dialog.append(header, body, footer, veil, live);
  overlay.append(dialog);
  document.body.append(overlay);

  // ── behaviour ───────────────────────────────────────────────────────────────────────────────
  function showView(next: View): void {
    view = next;
    for (const name of views) {
      const on = name === next;
      panels[name]!.hidden = !on;
      const button = navButtons.get(name)!;
      button.setAttribute('aria-selected', String(on));
      button.tabIndex = on ? 0 : -1;
    }
    searchBox.hidden = !(hasLibrary && next === 'library');
    if (next === 'library') library?.activate();
    updateChrome();
  }

  function specsFor(items: MediaItem[]): MediaSpec[] {
    return items.map((item) => ({ src: item.src, type: item.type, alt: details.altFor(item) }));
  }

  function commit(items?: MediaItem[]): void {
    const specs = view === 'url' && !items ? [url.spec()].filter((s): s is MediaSpec => Boolean(s)) : specsFor(items ?? selection.items);
    if (specs.length === 0) return;
    close();
    options.onPick(specs);
  }

  function updateChrome(): void {
    const pickCount = view === 'url' ? (url.url ? 1 : 0) : selection.size;
    const noun = kinds.length === 1 ? kinds[0] : 'item';
    if (mode === 'replace') insertButton.textContent = 'Replace';
    else insertButton.textContent = pickCount > 1 ? `Insert ${pickCount} ${noun}s` : pickCount === 1 ? `Insert ${noun}` : 'Insert';
    insertButton.disabled = pickCount === 0;

    if (view === 'url') count.textContent = '';
    else count.textContent = selection.size ? `${selection.size} selected` : mode === 'insert' ? `Select ${kinds.length === 1 ? kinds[0] + 's' : 'media'} to insert` : 'Select an image';

    const showDetails = view !== 'url' && active !== null && selection.size > 0;
    dialog.classList.toggle('no-details', !showDetails);
    details.element.hidden = !showDetails;
  }

  function onSelectionChange(): void {
    if (selection.size === 0 && active) {
      active = null;
      details.show(null);
    }
    library?.syncSelection();
    upload.syncSelection();
    updateChrome();
  }

  let cleanupEscape = () => {};
  function close(): void {
    cleanupEscape();
    library?.dispose();
    upload.dispose();
    url.dispose();
    overlay.remove();
  }
  cleanupEscape = attachEscapeCloseHandler(overlay, close);

  closeButton.addEventListener('click', close);
  cancelButton.addEventListener('click', close);
  insertButton.addEventListener('click', () => commit());
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });
  searchInput.addEventListener('input', () => library?.setSearch(searchInput.value.trim()));

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
  if (view === 'library') searchInput.focus({ preventScroll: true });
  else if (view === 'upload') upload.focusDropzone();
  else url.focus();
};
