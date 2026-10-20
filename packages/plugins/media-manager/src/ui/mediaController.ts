import { recordDomHistory } from '../../../shared/historyHelpers';
import type { MediaManagerConfig } from '../types/media';
import { FloatingToolbar } from './floatingToolbar';
import { ResizeHandles } from './resizeHandles';

type Media = HTMLImageElement | HTMLVideoElement;

const EDITABLE = '[contenteditable="true"]';

/**
 * Selecting an image or video inside an editor: the frame with its resize handles and the toolbar of actions.
 *
 * There is one selection on a page at a time, so there is one controller, however many editors and however many
 * times the plugin is created. The earlier version registered a fresh set of document listeners and four more
 * handles on every initialisation, and scoped clicks to the last editor element it had been given.
 */
export class MediaController {
  private selected: Media | null = null;
  private toolbar: FloatingToolbar | null = null;
  private handles: ResizeHandles | null = null;
  private attached = false;
  private config: () => Partial<MediaManagerConfig> | undefined = () => undefined;

  /** The settings of the plugin instance that most recently asked for the controller. */
  setConfigSource(source: () => Partial<MediaManagerConfig> | undefined): void {
    this.config = source;
  }

  attach(): void {
    if (this.attached || typeof document === 'undefined') return;
    this.attached = true;
    this.handles = new ResizeHandles(
      (media, before) => this.commit(media, () => {}, before),
      () => this.toolbar?.reposition(),
    );
    document.addEventListener('click', this.onClick);
    document.addEventListener('keydown', this.onKeyDown, true);
    window.addEventListener('scroll', this.onViewportChange, true);
    window.addEventListener('resize', this.onViewportChange);
  }

  detach(): void {
    if (!this.attached) return;
    this.attached = false;
    this.deselect();
    this.handles?.destroy();
    this.handles = null;
    document.removeEventListener('click', this.onClick);
    document.removeEventListener('keydown', this.onKeyDown, true);
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
    this.toolbar = new FloatingToolbar(media, {
      config: () => this.config(),
      commit: (target, change, before) => this.commit(target, change, before),
      refresh: () => this.refresh(),
      removed: () => this.deselect(),
    });
    this.handles?.show(media);
  }

  deselect(): void {
    this.toolbar?.destroy();
    this.toolbar = null;
    this.selected = null;
    this.handles?.show(null);
  }

  /** Redraw the frame and the toolbar, rebuilding the toolbar so that it shows the media's current state (a link). */
  refresh(): void {
    const media = this.selected;
    if (!media || !media.isConnected) {
      this.deselect();
      return;
    }
    this.toolbar?.destroy();
    this.toolbar = null;
    this.selected = null;
    this.select(media);
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

  private readonly onClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
      if (target.closest(EDITABLE)) {
        // Selecting the media is all a click on it does: not following its link, not placing a caret in it.
        event.preventDefault();
        event.stopPropagation();
        this.select(target as Media);
        return;
      }
    }

    // Clicks on our own parts, on a dialog opened from them, or on any button (the editor's toolbar acts on the
    // selected media too) keep the selection.
    if (
      this.toolbar?.contains(target) ||
      this.handles?.contains(target) ||
      target.closest('.rte-media-overlay') ||
      target.closest('button')
    ) {
      return;
    }
    this.deselect();
  };

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && this.selected && !document.querySelector('.rte-media-overlay')) {
      this.deselect();
    }
  };

  private readonly onViewportChange = (): void => {
    if (!this.selected) return;
    this.handles?.update();
    this.toolbar?.reposition();
  };
}

let controller: MediaController | null = null;

/** The one controller of the page; made on first use. */
export const getMediaController = (): MediaController => (controller ??= new MediaController());
