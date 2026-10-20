import { recordDomHistory } from '../../../shared/historyHelpers';
import { resolveMediaManagerConfig } from '../constants';
import {
  FIGURE_SELECTOR,
  adoptFigures,
  figureOf,
  isMedia,
  mediaRootOf,
  styleCaption,
  toggleCaption,
  isEmbed,
  isResizable,
  type MediaElement,
} from '../model/figure';
import { isTypeAllowed } from '../uploadService';
import type { MediaManagerConfig } from '../types/media';
import { FloatingToolbar } from './floatingToolbar';
import { injectMediaDialogStyles } from './styles';
import { PendingUploads } from './pendingUploads';
import { ResizeHandles } from './resizeHandles';

type Media = MediaElement;

const EDITABLE = '[contenteditable="true"]';
/** What a figure's media is, in the order of how likely. */
const MEDIA_SELECTOR = 'img, video, audio, iframe';

/** An event's target as an element: the document, and text, can be targets too. */
const elementOf = (target: EventTarget | null): HTMLElement | null =>
  target instanceof HTMLElement ? target : target instanceof Node ? target.parentElement : null;

const hostOf = (node: Node | null): HTMLElement | null =>
  (node instanceof HTMLElement ? node : node?.parentElement)?.closest<HTMLElement>(EDITABLE) ?? null;

/** The files on a clipboard or a drag that are images or videos. */
const mediaFilesOf = (transfer: DataTransfer | null, allowed: string[] | undefined): File[] =>
  Array.from(transfer?.files ?? []).filter(
    (file) => /^(image|video|audio)\//.test(file.type) && isTypeAllowed(file.type, allowed),
  );

/**
 * A clipboard that is a picture and nothing else. Excel puts an image of the cells next to their text and a copied
 * page puts one next to its markup; those are text to paste, not files to upload.
 */
const isPictureOnly = (clipboard: DataTransfer): boolean => {
  if (clipboard.getData('text/plain').trim()) return false;
  const html = clipboard.getData('text/html');
  if (!html) return true;
  const body = new DOMParser().parseFromString(html, 'text/html').body;
  return !body.textContent?.trim() && !body.querySelector('table');
};

const isPlainMedia = (node: Element | null): boolean =>
  Boolean(node && node.matches(FIGURE_SELECTOR) && !node.hasAttribute('data-rte-media-pending'));

/** A collapsed range at the very start or end of a block's content, inside its first or last text node. */
const edgeRange = (block: Node, edge: 'start' | 'end'): Range => {
  let node: Node = block;
  while (node.nodeType !== Node.TEXT_NODE && (edge === 'start' ? node.firstChild : node.lastChild)) {
    node = (edge === 'start' ? node.firstChild : node.lastChild)!;
  }
  const range = document.createRange();
  if (node.nodeType === Node.TEXT_NODE) range.setStart(node, edge === 'start' ? 0 : (node.textContent ?? '').length);
  else range.setStart(node, edge === 'start' ? 0 : node.childNodes.length);
  range.collapse(true);
  return range;
};

/** The top-level block of an editor that holds a node. */
const topBlockOf = (node: Node, host: HTMLElement): HTMLElement | null => {
  let current: Node | null = node;
  while (current && current.parentNode !== host) current = current.parentNode;
  return current instanceof HTMLElement ? current : null;
};

/** Is the collapsed range at the very start or end of `block`'s content, with nothing but nothing between? */
const atEdgeOf = (range: Range, block: HTMLElement, edge: 'start' | 'end'): boolean => {
  const rest = document.createRange();
  if (edge === 'end') {
    rest.setStart(range.endContainer, range.endOffset);
    rest.setEnd(block, block.childNodes.length);
  } else {
    rest.setStart(block, 0);
    rest.setEnd(range.startContainer, range.startOffset);
  }
  return rest.toString() === '' && !rest.cloneContents().querySelector('img, video, figure, table, hr');
};

/** Where in the page a drop landed, as a range. */
const rangeAtPoint = (x: number, y: number): Range | null => {
  const doc = document as Document & {
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
  };
  if (doc.caretRangeFromPoint) return doc.caretRangeFromPoint(x, y);
  const position = doc.caretPositionFromPoint?.(x, y);
  if (!position) return null;
  const range = document.createRange();
  range.setStart(position.offsetNode, position.offset);
  range.collapse(true);
  return range;
};

/**
 * Selecting an image or video inside an editor: the frame with its resize handles and the toolbar of actions.
 * Also what the media does inside the editor that is not a dialog: images and videos pasted or dropped become
 * uploads, captions behave (Enter leaves them, Backspace in an empty one removes it, pasting into one is text),
 * and media can be selected and acted on from the keyboard.
 *
 * There is one selection on a page at a time, so there is one controller, however many editors and however many
 * times the plugin is created. The earlier version registered a fresh set of document listeners and four more
 * handles on every initialisation, and scoped clicks to the last editor element it had been given.
 */
export class MediaController {
  private selected: Media | null = null;
  private toolbar: FloatingToolbar | null = null;
  private handles: ResizeHandles | null = null;
  private uploads = new PendingUploads();
  private attached = false;
  /** When media was last selected, so that the browser's own selection changes just after are not read as leaving it. */
  private selectedAt = 0;
  private config: () => Partial<MediaManagerConfig> | undefined = () => undefined;

  /** The settings of the plugin instance that most recently asked for the controller. */
  setConfigSource(source: () => Partial<MediaManagerConfig> | undefined): void {
    this.config = source;
  }

  attach(): void {
    if (this.attached || typeof document === 'undefined') return;
    this.attached = true;
    // Embedded players must not take the clicks meant for selecting them; that is a rule of this stylesheet.
    injectMediaDialogStyles();
    this.handles = new ResizeHandles(
      (media, before) => this.commit(media, () => {}, before),
      () => this.toolbar?.reposition(),
    );
    document.addEventListener('click', this.onClick);
    document.addEventListener('keydown', this.onKeyDown, true);
    document.addEventListener('paste', this.onPaste, true);
    document.addEventListener('dragover', this.onDragOver, true);
    document.addEventListener('drop', this.onDrop, true);
    document.addEventListener('focusin', this.onFocusIn, true);
    document.addEventListener('selectionchange', this.onSelectionChange);
    window.addEventListener('scroll', this.onViewportChange, true);
    window.addEventListener('resize', this.onViewportChange);
  }

  detach(): void {
    if (!this.attached) return;
    this.attached = false;
    this.deselect();
    this.uploads.dispose();
    this.handles?.destroy();
    this.handles = null;
    document.removeEventListener('click', this.onClick);
    document.removeEventListener('keydown', this.onKeyDown, true);
    document.removeEventListener('paste', this.onPaste, true);
    document.removeEventListener('dragover', this.onDragOver, true);
    document.removeEventListener('drop', this.onDrop, true);
    document.removeEventListener('focusin', this.onFocusIn, true);
    document.removeEventListener('selectionchange', this.onSelectionChange);
    window.removeEventListener('scroll', this.onViewportChange, true);
    window.removeEventListener('resize', this.onViewportChange);
  }

  get isAttached(): boolean {
    return this.attached;
  }

  get selection(): Media | null {
    return this.selected;
  }

  select(media: Media): void {
    if (this.selected === media && this.toolbar) {
      this.onViewportChange();
      return;
    }
    this.deselect();
    this.selected = media;
    this.selectedAt = performance.now();
    const host = hostOf(media);
    if (host) adoptFigures(host);
    this.toolbar = new FloatingToolbar(media, {
      config: () => this.config(),
      commit: (target, change, before) => this.commit(target, change, before),
      refresh: () => this.refresh(),
      removed: () => this.deselect(),
      returnFocus: () => this.returnFocus(),
      focusCaption: (caption) => this.focusCaption(caption),
    });
    this.handles?.show(isResizable(media) ? media : null);
  }

  deselect(): void {
    this.toolbar?.destroy();
    this.toolbar = null;
    this.selected = null;
    this.handles?.show(null);
  }

  /** Redraw the frame and the toolbar, rebuilding the toolbar so that it shows the media's current state. */
  refresh(): void {
    const media = this.selected;
    if (!media || !media.isConnected) {
      this.deselect();
      return;
    }
    // The toolbar is rebuilt to show the new state; the keyboard stays on the button it was on (a dialog that was
    // opened from it has just given the focus back to the page, so that counts too).
    const old = this.toolbar;
    const focused = document.activeElement;
    const wasInToolbar = old?.contains(focused) || focused === document.body || focused === null;
    const button = wasInToolbar ? old?.currentButton() ?? null : null;
    old?.destroy();
    this.toolbar = null;
    this.selected = null;
    this.select(media);
    // `select` has made the new toolbar (TypeScript cannot see that through the call).
    if (button) (this.toolbar as FloatingToolbar | null)?.focusButton(button);
  }

  /**
   * Make the media the browser's selection too (a node selection), so that what the browser does next agrees with
   * it. A click on media in an editor that has no focus is followed by the browser focusing the editor and putting
   * a caret at the start of its text; without this that looked like the end of the selection.
   */
  private placeNodeSelection(media: Media): void {
    const root = figureOf(media) ?? mediaRootOf(media);
    const selection = window.getSelection();
    if (!selection || !root.isConnected) return;
    const range = document.createRange();
    range.selectNode(root);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  /** Give the editor back the focus, with the media still selected as a node (so Delete removes it). */
  private returnFocus(): void {
    const media = this.selected;
    const host = media ? hostOf(media) : null;
    if (!media || !host) return;
    host.focus({ preventScroll: true });
    const root = figureOf(media) ?? mediaRootOf(media);
    const range = document.createRange();
    range.selectNode(root);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  private focusCaption(caption: HTMLElement): void {
    styleCaption(caption);
    caption.focus({ preventScroll: true });
    const range = document.createRange();
    range.selectNodeContents(caption);
    range.collapse(true);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  /** One undoable step for a change to the media, and the editor is told its content changed. */
  private commit(media: HTMLElement, change: () => void, before?: string): void {
    const host = media.closest<HTMLElement>(EDITABLE);
    const snapshot = before ?? host?.innerHTML ?? '';
    change();
    if (!host) return;
    recordDomHistory(host, snapshot);
    host.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // ── events ──────────────────────────────────────────────────────────────────────────────────

  private readonly onClick = (event: MouseEvent): void => {
    const target = elementOf(event.target);
    if (!target) return;

    // An embedded player is a page of its own: it takes no clicks (see the stylesheet), so the figure gets them.
    const embedFigure = target.closest<HTMLElement>('figure.rte-embed');
    const embedded = embedFigure?.querySelector<MediaElement>('iframe') ?? null;
    if (embedded && embedFigure!.closest(EDITABLE) && !target.closest('figcaption')) {
      event.preventDefault();
      event.stopPropagation();
      this.select(embedded);
      this.placeNodeSelection(embedded);
      return;
    }

    if (isMedia(target) && target.closest(EDITABLE)) {
      // Audio is all controls, so a click on it is for them: it selects the audio and carries on to play it.
      if (target.tagName === 'AUDIO') {
        this.select(target);
        return;
      }
      // The bar of a video's own controls plays and pauses it; every other click on a video, and any on an image,
      // selects it, which is all they do: not following a link, not placing a caret in it.
      const onVideoControls =
        target.tagName === 'VIDEO' &&
        (target as HTMLVideoElement).controls &&
        event.offsetY > target.clientHeight - 44;
      if (!onVideoControls) {
        event.preventDefault();
        event.stopPropagation();
        this.select(target);
        this.placeNodeSelection(target);
        return;
      }
    }

    // Clicks on our own parts, on a dialog opened from them, or on any button (the editor's toolbar acts on the
    // selected media too) keep the selection.
    if (
      this.toolbar?.contains(target) ||
      this.handles?.contains(target) ||
      target.closest('.rte-media-overlay') ||
      target.closest('.rte-mp-pending') ||
      target.closest('button')
    ) {
      return;
    }
    // A click in the caption edits it; the media stays selected so that its toolbar is there.
    if (this.selected && figureOf(this.selected)?.contains(target)) return;
    this.deselect();
  };

  /** Figures that were loaded (not inserted here) become atomic as soon as the editor is entered. */
  private readonly onFocusIn = (event: FocusEvent): void => {
    const host = hostOf(event.target as Node);
    if (!host) return;
    adoptFigures(host);
    // A document that was saved mid-upload holds an empty placeholder nothing is working on.
    if (this.uploads.sweep(host)) host.dispatchEvent(new Event('input', { bubbles: true }));
  };

  private readonly onSelectionChange = (): void => {
    if (this.selected && !this.selected.isConnected) {
      this.deselect();
      return;
    }
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);

    // A node selection of media (what Shift+Arrow over it, and a click on it, make) selects it here too.
    const found = this.mediaInRange(range);
    if (found) {
      if (this.selected !== found) this.select(found);
      return;
    }
    if (!this.selected) return;

    // Left alone while the selection is outside the editor (the toolbar or a dialog has the focus) or in the
    // media's own caption; a caret anywhere else in the text is the end of the selection.
    const host = hostOf(this.selected);
    const inside = range.commonAncestorContainer;
    if (!host || !host.contains(inside)) return;
    if (figureOf(this.selected)?.contains(inside)) return;
    // Just after selecting, what the browser does with the selection is its own business (see placeNodeSelection).
    if (performance.now() - this.selectedAt < 150) return;
    this.deselect();
  };

  private mediaInRange(range: Range): Media | null {
    if (range.collapsed || range.startContainer !== range.endContainer || range.endOffset - range.startOffset !== 1) return null;
    const node = range.startContainer.childNodes[range.startOffset];
    if (!(node instanceof HTMLElement) || !hostOf(node)) return null;
    if (isMedia(node)) return node;
    if (node.matches(FIGURE_SELECTOR) && !node.hasAttribute('data-rte-media-pending')) {
      return node.querySelector<Media>(MEDIA_SELECTOR);
    }
    if (node.tagName === 'A' && node.children.length === 1 && isMedia(node.firstElementChild)) return node.firstElementChild;
    return null;
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    const target = elementOf(event.target);

    // Escape inside the toolbar (or its menu) belongs to the toolbar: it closes the menu, then hands the focus back.
    if (this.toolbar?.contains(target)) return;
    if (event.key === 'Escape' && this.selected && !document.querySelector('.rte-media-overlay')) {
      this.deselect();
      return;
    }

    // Alt+F10: into the toolbar of the selected media, as in other editors.
    if (event.key === 'F10' && event.altKey && this.selected) {
      event.preventDefault();
      this.toolbar?.focusFirst();
      return;
    }

    this.arrowOntoMedia(event, target);

    const caption = target?.closest<HTMLElement>('figure.rte-media > figcaption');
    if (!caption) return;
    const figure = caption.parentElement!;
    const host = hostOf(caption);
    if (!host) return;

    if (event.key === 'Enter' && !event.shiftKey) {
      // The caption is one line of text. Enter ends it and goes on below the media; nothing is split.
      event.preventDefault();
      event.stopPropagation();
      const before = host.innerHTML;
      const paragraph = document.createElement('p');
      paragraph.innerHTML = '<br>';
      figure.after(paragraph);
      recordDomHistory(host, before);
      host.dispatchEvent(new Event('input', { bubbles: true }));
      const range = document.createRange();
      range.setStart(paragraph, 0);
      range.collapse(true);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
    } else if (event.key === 'Backspace' && !caption.textContent?.trim()) {
      // Backspace in an empty caption takes the caption away and goes back to the media.
      event.preventDefault();
      event.stopPropagation();
      const media = figure.querySelector<Media>(MEDIA_SELECTOR);
      if (!media) return;
      this.commit(media, () => toggleCaption(media));
      this.select(media);
      this.returnFocus();
    }
  };

  /**
   * Arrow keys step onto media instead of over it. The browser's caret skips a figure (which is not editable), so
   * from the keyboard it could not be reached: the arrow at the edge of the block next to it selects it, the
   * next arrow carries on past it; from the start of its caption, up goes back to the media.
   */
  private arrowOntoMedia(event: KeyboardEvent, target: HTMLElement | null): void {
    const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown';
    const backward = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
    if ((!forward && !backward) || event.shiftKey || event.altKey || event.ctrlKey || event.metaKey || event.defaultPrevented) return;
    const host = target ? hostOf(target) : null;
    const selection = window.getSelection();
    if (!host || !selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);

    const select = (node: Node, collapse?: 'before' | 'after') => {
      event.preventDefault();
      const next = document.createRange();
      if (collapse === 'before') next.setStartBefore(node);
      else if (collapse === 'after') next.setStartAfter(node);
      else next.selectNode(node);
      if (collapse) next.collapse(true);
      selection.removeAllRanges();
      selection.addRange(next);
      // Browsers say so with a `selectionchange` of their own; do not wait for it.
      const media = (node as HTMLElement).querySelector<Media>(MEDIA_SELECTOR);
      if (media) this.select(media);
    };

    // A figure selected as a node: step off it in the direction pressed.
    const selected = this.mediaInRange(range);
    if (selected) {
      const figure = figureOf(selected);
      const root = figure ?? mediaRootOf(selected);
      const neighbour = forward ? root.nextElementSibling : root.previousElementSibling;
      if (neighbour) {
        event.preventDefault();
        selection.removeAllRanges();
        selection.addRange(edgeRange(neighbour, forward ? 'start' : 'end'));
      }
      return;
    }

    if (!range.collapsed) return;

    // In a caption, back up to its media.
    const caption = target?.closest<HTMLElement>('figure.rte-media > figcaption');
    if (caption) {
      if (backward && atEdgeOf(range, caption, 'start')) select(caption.parentElement!);
      return;
    }

    const block = topBlockOf(range.startContainer, host);
    if (!block || isPlainMedia(block)) return;
    const next = forward ? block.nextElementSibling : block.previousElementSibling;
    if (next && isPlainMedia(next) && atEdgeOf(range, block, forward ? 'end' : 'start')) select(next);
  }

  private readonly onPaste = (event: ClipboardEvent): void => {
    const target = elementOf(event.target);
    const host = target ? hostOf(target) : null;
    const clipboard = event.clipboardData;
    if (!host || !clipboard) return;

    // A caption is plain text on one line, whatever was copied.
    if (target?.closest('figure.rte-media > figcaption')) {
      event.preventDefault();
      event.stopPropagation();
      const text = clipboard.getData('text/plain').replace(/\s*[\r\n]+\s*/g, ' ');
      if (text) document.execCommand('insertText', false, text);
      return;
    }

    const config = resolveMediaManagerConfig(this.config());
    if (config.uploadOnPaste === false) return;
    const files = mediaFilesOf(clipboard, undefined);
    if (files.length === 0 || !isPictureOnly(clipboard)) return;

    event.preventDefault();
    event.stopPropagation();
    const selection = window.getSelection();
    const range = selection && selection.rangeCount > 0 && host.contains(selection.anchorNode) ? selection.getRangeAt(0) : null;
    this.uploads.start(files, host, range, this.config());
  };

  private readonly onDragOver = (event: DragEvent): void => {
    if (!this.wantsDrop(event)) return;
    // Without this the browser does not let the drop happen, and opens the file instead.
    event.preventDefault();
  };

  private readonly onDrop = (event: DragEvent): void => {
    if (!this.wantsDrop(event)) return;
    const host = hostOf(event.target as Node);
    if (!host) return;
    event.preventDefault();
    event.stopPropagation();

    let range = rangeAtPoint(event.clientX, event.clientY);
    if (range && !host.contains(range.startContainer)) range = null;
    // Dropped onto media (or its caption): go on after it.
    const figure = range ? (range.startContainer instanceof HTMLElement ? range.startContainer : range.startContainer.parentElement)?.closest<HTMLElement>(FIGURE_SELECTOR) : null;
    if (range && figure) {
      range = document.createRange();
      range.setStartAfter(figure);
      range.collapse(true);
    }
    this.uploads.start(mediaFilesOf(event.dataTransfer, undefined), host, range, this.config());
  };

  private wantsDrop(event: DragEvent): boolean {
    const target = elementOf(event.target);
    if (!target || target.closest('.rte-media-overlay') || !hostOf(target)) return false;
    if (resolveMediaManagerConfig(this.config()).uploadOnPaste === false) return false;
    const transfer = event.dataTransfer;
    if (!transfer || !Array.from(transfer.types ?? []).includes('Files')) return false;
    // During a drag the files themselves are hidden; only their types are known, and only once dropped.
    return event.type === 'dragover' || mediaFilesOf(transfer, undefined).length > 0;
  }

  private readonly onViewportChange = (): void => {
    if (!this.selected) return;
    this.handles?.update();
    this.toolbar?.reposition();
  };
}

let controller: MediaController | null = null;

/** The one controller of the page; made on first use. */
export const getMediaController = (): MediaController => (controller ??= new MediaController());

