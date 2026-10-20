import { confirmAction } from '../../../shared/confirmDialog';
import { showAltTextDialog } from './altTextDialog';
import { isDarkThemeContext } from './dialogKit';
import { showLinkDialogForMedia } from './linkDialog';
import { showReplaceImageDialog } from './replaceDialog';
import { injectMediaDialogStyles } from './styles';
import type { MediaManagerConfig } from '../types/media';

type Media = HTMLImageElement | HTMLVideoElement;

export interface ToolbarHooks {
  /** The settings the plugin was created with (the replace dialog uploads with them). */
  config?: () => Partial<MediaManagerConfig> | undefined;
  /**
   * Run `change`, record it as one undoable step and tell the editor the content changed. `before` is the
   * editor's content from before the change, for a change that was already made.
   */
  commit: (media: HTMLElement, change: () => void, before?: string) => void;
  /** The media was changed in a way that needs the selection frame and the toolbar redrawn. */
  refresh: () => void;
  /** The media was taken out of the document. */
  removed: () => void;
}

const icon = (paths: string) =>
  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${paths}</svg>`;

const ICONS = {
  left: icon('<line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line>'),
  center: icon('<line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line>'),
  right: icon('<line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line>'),
  alt: icon('<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>'),
  link: icon('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>'),
  replace: icon('<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>'),
  remove: icon('<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>'),
};

/**
 * The bar of actions above a selected image or video. Like the resize handles it is a layer on `document.body`
 * placed with `position: fixed`, so nothing of it is ever part of the document being edited.
 */
export class FloatingToolbar {
  readonly element: HTMLDivElement;

  constructor(
    private readonly media: Media,
    private readonly hooks: ToolbarHooks,
  ) {
    injectMediaDialogStyles();
    const isImage = media.tagName === 'IMG';
    const existingLink = media.closest('a');

    const el = document.createElement('div');
    el.className = 'media-floating-toolbar';
    el.setAttribute('role', 'toolbar');
    el.setAttribute('aria-label', isImage ? 'Image options' : 'Video options');
    if (isDarkThemeContext(media)) el.classList.add('rte-ui-theme-dark');

    const button = (cls: string, label: string, svg: string) =>
      `<button class="media-floating-toolbar-btn ${cls}" title="${label}" aria-label="${label}" type="button">${svg}</button>`;
    el.innerHTML = [
      button('btn-align-left', 'Align left', ICONS.left),
      button('btn-align-center', 'Align center', ICONS.center),
      button('btn-align-right', 'Align right', ICONS.right),
      '<div class="media-floating-toolbar-separator" aria-hidden="true"></div>',
      isImage ? button('btn-alt', 'Edit alt text', ICONS.alt) : '',
      button('btn-link', existingLink ? 'Edit or remove link' : 'Add link', ICONS.link),
      isImage ? button('btn-replace', 'Replace image', ICONS.replace) : '',
      '<div class="media-floating-toolbar-separator" aria-hidden="true"></div>',
      button('btn-remove', 'Remove', ICONS.remove),
    ].join('');

    // Pressing a button must not pull the caret out of the editor.
    el.addEventListener('mousedown', (event) => event.preventDefault());
    this.element = el;
    document.body.appendChild(el);

    const on = (selector: string, handler: () => void) =>
      el.querySelector(selector)?.addEventListener('click', handler);
    const align = (left: string, right: string) => () => {
      hooks.commit(media, () => {
        media.style.display = 'block';
        media.style.marginLeft = left;
        media.style.marginRight = right;
      });
      hooks.refresh();
    };
    on('.btn-align-left', align('0', 'auto'));
    on('.btn-align-center', align('auto', 'auto'));
    on('.btn-align-right', align('auto', '0'));

    // The dialogs change the media themselves; the content from before they opened is what Undo goes back to.
    on('.btn-alt', () => this.viaDialog((changed) => showAltTextDialog(media as HTMLImageElement, changed)));
    on('.btn-link', () => this.viaDialog((changed) => showLinkDialogForMedia(media, changed)));
    on('.btn-replace', () =>
      this.viaDialog((changed) => showReplaceImageDialog(media as HTMLImageElement, hooks.config?.(), changed)),
    );

    on('.btn-remove', async () => {
      const confirmed = await confirmAction('Remove this media?', {
        title: 'Remove media',
        confirmText: 'Remove',
        danger: true,
        context: media,
      });
      if (!confirmed || !media.isConnected) return;
      // A link that wraps only this media goes with it; one that carries text stays.
      const link = media.closest('a');
      const wrapper = link && link.children.length === 1 && !link.textContent?.trim() ? link : media;
      hooks.commit(media, () => wrapper.remove());
      hooks.removed();
    });

    this.reposition();
  }

  /** Open a dialog that edits the media itself; when it reports a change, record the result as one step. */
  private viaDialog(open: (changed: () => void) => void): void {
    const host = this.media.closest<HTMLElement>('[contenteditable="true"]');
    const before = host?.innerHTML ?? '';
    open(() => {
      this.hooks.commit(this.media, () => {}, before);
      this.hooks.refresh();
    });
  }

  reposition(): void {
    const { element, media } = this;
    if (!media.isConnected) return;

    const rect = media.getBoundingClientRect();
    const height = element.offsetHeight || 40;
    const width = element.offsetWidth || 220;

    // Above the media, unless that would put it over the editor's own toolbar (media at the top of the document).
    const host = media.closest('[contenteditable="true"]');
    const hostTop = host ? host.getBoundingClientRect().top : 0;
    const above = rect.top - height - 8;
    const top = above < Math.max(hostTop, 0) ? rect.bottom + 8 : above;
    const left = Math.min(Math.max(rect.left + rect.width / 2 - width / 2, 8), Math.max(window.innerWidth - width - 8, 8));

    element.style.top = `${Math.round(top)}px`;
    element.style.left = `${Math.round(left)}px`;
    element.style.display = 'flex';
  }

  contains(node: EventTarget | null): boolean {
    return node instanceof Node && this.element.contains(node);
  }

  destroy(): void {
    this.element.remove();
  }
}
