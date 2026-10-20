import { confirmAction } from '../../../shared/confirmDialog';
import {
  captionOf,
  figureOf,
  getAlign,
  setAlign,
  setWidth,
  toggleCaption,
  type Align,
} from '../model/figure';
import type { MediaManagerConfig } from '../types/media';
import { showAltTextDialog } from './altTextDialog';
import { isDarkThemeContext } from './dialogKit';
import { showLinkDialogForMedia } from './linkDialog';
import { showReplaceImageDialog } from './replaceDialog';
import { injectMediaDialogStyles } from './styles';

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
  /** Leave the toolbar for the editor, with the media still selected. */
  returnFocus: () => void;
  /** A caption was just added: put the caret in it. */
  focusCaption: (caption: HTMLElement) => void;
}

const icon = (paths: string) =>
  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${paths}</svg>`;

const ICONS = {
  left: icon('<line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line>'),
  center: icon('<line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line>'),
  right: icon('<line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line>'),
  size: icon('<polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line>'),
  caption: icon('<rect x="3" y="4" width="18" height="11" rx="2"></rect><line x1="7" y1="19" x2="17" y2="19"></line>'),
  alt: icon('<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>'),
  link: icon('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>'),
  replace: icon('<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>'),
  remove: icon('<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>'),
};

/** The sizes in the Size menu: a share of the width of the editor's text, or the picture's own size. */
export const SIZE_PRESETS: Array<{ label: string; share: number | 'original' }> = [
  { label: 'Small', share: 0.25 },
  { label: 'Medium', share: 0.5 },
  { label: 'Large', share: 0.75 },
  { label: 'Full width', share: 1 },
  { label: 'Original size', share: 'original' },
];

/**
 * The width the editor's text has to work with. An editor in a flex or grid cell can be stretched by something
 * wide inside it (a code line) far past what can be seen, so its own width is capped by what is visible: what
 * scrolling ancestors and the window leave of it.
 */
export const visibleContentWidth = (host: HTMLElement): number => {
  const style = getComputedStyle(host);
  const padding = (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0);
  let width = host.clientWidth - padding;

  const rect = host.getBoundingClientRect();
  let left = Math.max(rect.left, 0);
  let right = document.documentElement.clientWidth;
  for (let el = host.parentElement; el; el = el.parentElement) {
    if (getComputedStyle(el).overflowX === 'visible') continue;
    const box = el.getBoundingClientRect();
    left = Math.max(left, box.left);
    right = Math.min(right, box.right);
  }
  const visible = right - left - padding;
  // Without layout (no rectangles to go by) there is nothing to cap with.
  if (visible > 0) width = Math.min(width, visible);
  return width;
};

/**
 * The bar of actions above a selected image or video. Like the resize handles it is a layer on `document.body`
 * placed with `position: fixed`, so nothing of it is ever part of the document being edited. It is a toolbar in
 * the keyboard sense too: one tab stop, arrow keys between the buttons, Escape back to the text.
 */
export class FloatingToolbar {
  readonly element: HTMLDivElement;
  private menu: HTMLElement | null = null;

  constructor(
    private readonly media: Media,
    private readonly hooks: ToolbarHooks,
  ) {
    injectMediaDialogStyles();
    const isImage = media.tagName === 'IMG';
    const existingLink = media.closest('a');
    const figure = figureOf(media);
    const align = getAlign(media);
    const hasCaption = Boolean(figure && captionOf(figure));

    const el = document.createElement('div');
    el.className = 'media-floating-toolbar';
    el.setAttribute('role', 'toolbar');
    el.setAttribute('aria-label', isImage ? 'Image options' : 'Video options');
    if (isDarkThemeContext(media)) el.classList.add('rte-ui-theme-dark');

    const button = (cls: string, label: string, svg: string, pressed?: boolean, popup = false) =>
      `<button class="media-floating-toolbar-btn ${cls}" title="${label}" aria-label="${label}" type="button" tabindex="-1"${
        pressed === undefined ? '' : ` aria-pressed="${pressed}"`
      }${popup ? ' aria-haspopup="menu" aria-expanded="false"' : ''}>${svg}</button>`;
    const sep = '<div class="media-floating-toolbar-separator" aria-hidden="true"></div>';
    el.innerHTML = [
      button('btn-align-left', 'Align left', ICONS.left, align === 'left'),
      button('btn-align-center', 'Align center', ICONS.center, align === 'center'),
      button('btn-align-right', 'Align right', ICONS.right, align === 'right'),
      button('btn-size', 'Size', ICONS.size, undefined, true),
      button('btn-caption', hasCaption ? 'Remove caption' : 'Add caption', ICONS.caption, hasCaption),
      sep,
      isImage ? button('btn-alt', 'Edit alt text', ICONS.alt) : '',
      button('btn-link', existingLink ? 'Edit or remove link' : 'Add link', ICONS.link),
      isImage ? button('btn-replace', 'Replace image', ICONS.replace) : '',
      sep,
      button('btn-remove', 'Remove', ICONS.remove),
    ].join('');

    // Pressing a button must not pull the caret out of the editor.
    el.addEventListener('mousedown', (event) => event.preventDefault());
    el.addEventListener('keydown', this.onKeyDown);
    el.addEventListener('focusin', (event) => {
      const button = (event.target as HTMLElement).closest<HTMLElement>('.media-floating-toolbar-btn');
      this.lastButton = [...(button?.classList ?? [])].find((name) => name.startsWith('btn-')) ?? this.lastButton;
    });
    this.element = el;
    this.buttons()[0]?.setAttribute('tabindex', '0');
    document.body.appendChild(el);

    const on = (selector: string, handler: () => void) =>
      el.querySelector(selector)?.addEventListener('click', handler);
    const alignTo = (to: Align) => () => {
      hooks.commit(media, () => setAlign(media, to));
      hooks.refresh();
    };
    on('.btn-align-left', alignTo('left'));
    on('.btn-align-center', alignTo('center'));
    on('.btn-align-right', alignTo('right'));

    on('.btn-size', () => (this.menu ? this.closeMenu(true) : this.openMenu()));

    on('.btn-caption', () => {
      let caption: HTMLElement | null = null;
      hooks.commit(media, () => {
        caption = toggleCaption(media);
      });
      hooks.refresh();
      if (caption) hooks.focusCaption(caption);
    });

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
      // What goes with the media: its figure (caption and all), or a link that wraps only this media.
      const link = media.closest('a');
      const wrapper =
        figureOf(media) ?? (link && link.children.length === 1 && !link.textContent?.trim() ? link : media);
      hooks.commit(media, () => wrapper.remove());
      hooks.removed();
    });

    this.reposition();
  }

  private buttons(): HTMLButtonElement[] {
    return [...this.element.querySelectorAll<HTMLButtonElement>(':scope > .media-floating-toolbar-btn')];
  }

  /** Move the focus into the toolbar, onto its first button. */
  focusFirst(): void {
    const first = this.buttons()[0];
    first?.focus();
  }

  /** The `btn-*` class of the button the keyboard is on (inside the toolbar, or the one last used), if any. */
  currentButton(): string | null {
    const active = document.activeElement;
    const inside = active instanceof HTMLElement && this.element.contains(active) ? active : null;
    const button = inside?.closest<HTMLElement>('.media-floating-toolbar-btn') ?? null;
    return [...(button?.classList ?? [])].find((name) => name.startsWith('btn-')) ?? this.lastButton;
  }

  /** Put the focus back on a button of a freshly built toolbar. */
  focusButton(className: string): void {
    const target = this.element.querySelector<HTMLButtonElement>(`.${className}`);
    if (!target) return;
    this.buttons().forEach((b) => (b.tabIndex = -1));
    target.tabIndex = 0;
    target.focus();
  }

  private lastButton: string | null = null;

  /** Open a dialog that edits the media itself; when it reports a change, record the result as one step. */
  private viaDialog(open: (changed: () => void) => void): void {
    const host = this.media.closest<HTMLElement>('[contenteditable="true"]');
    const before = host?.innerHTML ?? '';
    open(() => {
      this.hooks.commit(this.media, () => {}, before);
      this.hooks.refresh();
    });
  }

  private openMenu(): void {
    const { media } = this;
    const trigger = this.element.querySelector<HTMLButtonElement>('.btn-size')!;
    const host = media.closest<HTMLElement>('[contenteditable="true"]');
    const available = host ? visibleContentWidth(host) : 0;

    const menu = document.createElement('div');
    menu.className = 'media-size-menu';
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-label', 'Size');
    for (const preset of SIZE_PRESETS) {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'media-size-menu-item';
      item.setAttribute('role', 'menuitem');
      item.textContent = preset.label;
      item.tabIndex = -1;
      item.addEventListener('click', () => {
        const width =
          preset.share === 'original'
            ? null
            : Math.max(50, Math.round(Math.min(available || Infinity, (available || 800) * preset.share)));
        this.hooks.commit(media, () => setWidth(media, width));
        this.closeMenu(true);
        this.hooks.refresh();
      });
      menu.append(item);
    }
    menu.addEventListener('keydown', (event) => {
      const items = [...menu.querySelectorAll<HTMLButtonElement>('button')];
      const index = items.indexOf(document.activeElement as HTMLButtonElement);
      if (event.key === 'ArrowDown') items[(index + 1) % items.length].focus();
      else if (event.key === 'ArrowUp') items[(index - 1 + items.length) % items.length].focus();
      else if (event.key === 'Home') items[0].focus();
      else if (event.key === 'End') items[items.length - 1].focus();
      else return;
      event.preventDefault();
      event.stopPropagation();
    });

    this.element.append(menu);
    menu.style.left = `${trigger.offsetLeft}px`;
    this.menu = menu;
    trigger.setAttribute('aria-expanded', 'true');
    menu.querySelector<HTMLButtonElement>('button')!.focus();
  }

  private closeMenu(refocus: boolean): void {
    if (!this.menu) return;
    this.menu.remove();
    this.menu = null;
    const trigger = this.element.querySelector<HTMLButtonElement>('.btn-size');
    trigger?.setAttribute('aria-expanded', 'false');
    if (refocus) trigger?.focus();
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      if (this.menu) this.closeMenu(true);
      else this.hooks.returnFocus();
      return;
    }
    if (this.menu) return;

    const buttons = this.buttons();
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;

    let next = -1;
    if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = buttons.length - 1;
    else if (event.key === 'ArrowDown' && buttons[index].classList.contains('btn-size')) {
      event.preventDefault();
      this.openMenu();
      return;
    } else if (event.key === 'Tab') {
      // The toolbar is one stop; Tab leaves it for the text.
      event.preventDefault();
      this.hooks.returnFocus();
      return;
    } else return;

    event.preventDefault();
    buttons.forEach((b) => (b.tabIndex = -1));
    buttons[next].tabIndex = 0;
    buttons[next].focus();
  };

  reposition(): void {
    const { element, media } = this;
    if (!media.isConnected) return;

    const target = figureOf(media) ?? media;
    const rect = target.getBoundingClientRect();
    const height = element.offsetHeight || 40;
    const width = element.offsetWidth || 340;

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
