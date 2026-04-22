/**
 * Context Menu Extension
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import {
  EditorAPI,
  EditorExtension,
} from '../types';

export interface ContextMenuCommandItem {
  id?: string;
  type?: 'command';
  label: string;
  command: string;
  args?: unknown[];
  shortcut?: string;
  isVisible?: (editor: EditorAPI) => boolean;
  isEnabled?: (editor: EditorAPI) => boolean;
}

export interface ContextMenuActionItem {
  id?: string;
  type: 'action';
  label: string;
  onSelect: (editor: EditorAPI) => void;
  shortcut?: string;
  isVisible?: (editor: EditorAPI) => boolean;
  isEnabled?: (editor: EditorAPI) => boolean;
}

export interface ContextMenuSeparatorItem {
  id?: string;
  type: 'separator';
  isVisible?: (editor: EditorAPI) => boolean;
}

export type ContextMenuItem =
  | ContextMenuCommandItem
  | ContextMenuActionItem
  | ContextMenuSeparatorItem;

export interface ContextMenuExtensionConfig {
  items?: ContextMenuItem[];
  closeOnBlur?: boolean;
  closeOnScroll?: boolean;
}

type ResolvedContextMenuCommandItem = ContextMenuCommandItem & {
  id: string;
  type: 'command';
  isEnabledNow: boolean;
};

type ResolvedContextMenuActionItem = ContextMenuActionItem & {
  id: string;
  type: 'action';
  isEnabledNow: boolean;
};

type ResolvedContextMenuItem =
  | ResolvedContextMenuCommandItem
  | ResolvedContextMenuActionItem
  | {
    id: string;
    type: 'separator';
  };

export class ContextMenuExtension implements EditorExtension {
  private static readonly css = {
    root: 'lce-context-menu',
    visible: 'is-visible',
    list: 'lce-context-menu-list',
    item: 'lce-context-menu-item',
    itemLabel: 'lce-context-menu-item-label',
    itemShortcut: 'lce-context-menu-item-shortcut',
    separator: 'lce-context-menu-separator',
  } as const;

  public readonly name = 'context-menu';

  private editor: EditorAPI | null = null;
  private menuElement: HTMLElement | null = null;
  private listElement: HTMLElement | null = null;
  private documentPointerHandler: ((event: MouseEvent) => void) | null = null;
  private documentResizeHandler: (() => void) | null = null;
  private blurHandler: (() => void) | null = null;
  private scrollHandler: (() => void) | null = null;
  private items: ResolvedContextMenuItem[] = [];
  private itemButtons: HTMLButtonElement[] = [];
  private isVisible = false;
  private readonly config: Required<ContextMenuExtensionConfig>;

  constructor(config: ContextMenuExtensionConfig = {}) {
    this.config = {
      items: config.items || [],
      closeOnBlur: config.closeOnBlur ?? true,
      closeOnScroll: config.closeOnScroll ?? true,
    };
  }

  setup(editor: EditorAPI): void {
    this.editor = editor;

    editor.registerCommand('openContextMenu', (x?: number, y?: number) => {
      this.openContextMenu(typeof x === 'number' ? x : undefined, typeof y === 'number' ? y : undefined);
    });

    editor.registerCommand('closeContextMenu', () => {
      this.closeContextMenu();
    });

    this.createMenu();

    this.documentPointerHandler = (event: MouseEvent) => {
      if (!this.isVisible) {
        return;
      }
      const target = event.target as Node | null;
      if (!target || this.menuElement?.contains(target)) {
        return;
      }
      this.closeContextMenu();
    };
    document.addEventListener('mousedown', this.documentPointerHandler, true);

    this.documentResizeHandler = () => {
      if (this.isVisible) {
        this.closeContextMenu();
      }
    };
    window.addEventListener('resize', this.documentResizeHandler);

    if (this.config.closeOnBlur) {
      this.blurHandler = () => {
        window.setTimeout(() => {
          const activeElement = document.activeElement;
          if (activeElement && this.menuElement?.contains(activeElement)) {
            return;
          }
          this.closeContextMenu();
        }, 0);
      };
      editor.on('blur', this.blurHandler);
    }

    if (this.config.closeOnScroll) {
      this.scrollHandler = () => {
        if (this.isVisible) {
          this.closeContextMenu();
        }
      };
      editor.getView().getScrollElement().addEventListener('scroll', this.scrollHandler, {
        passive: true,
      });
    }
  }

  onContextMenu(event: MouseEvent): boolean | void {
    if (!this.editor) {
      return;
    }

    this.openContextMenu(event.clientX, event.clientY);
    return false;
  }

  onKeyDown(event: KeyboardEvent): boolean | void {
    if (!this.isVisible) {
      return;
    }

    if (event.key === 'Escape') {
      this.closeContextMenu();
      this.editor?.focus();
      return false;
    }
  }

  private openContextMenu(clientX?: number, clientY?: number): void {
    if (!this.editor) {
      return;
    }

    if (!this.menuElement || !this.listElement) {
      this.createMenu();
    }

    if (!this.menuElement || !this.listElement) {
      return;
    }

    this.items = this.resolveMenuItems();
    if (this.items.length === 0) {
      this.closeContextMenu();
      return;
    }

    this.renderItems();

    const position = this.resolveAnchorPosition(clientX, clientY);
    this.menuElement.style.visibility = 'hidden';
    this.menuElement.style.display = 'block';
    this.menuElement.setAttribute('aria-hidden', 'false');
    this.menuElement.classList.add(ContextMenuExtension.css.visible);
    this.positionMenu(position.x, position.y);
    this.menuElement.style.visibility = 'visible';
    this.isVisible = true;

    const firstEnabled = this.itemButtons.find((button) => !button.disabled);
    firstEnabled?.focus();
  }

  private closeContextMenu(): void {
    if (!this.menuElement) {
      return;
    }

    this.menuElement.style.display = 'none';
    this.menuElement.style.visibility = 'hidden';
    this.menuElement.setAttribute('aria-hidden', 'true');
    this.menuElement.classList.remove(ContextMenuExtension.css.visible);
    this.isVisible = false;
    this.itemButtons = [];
  }

  private createMenu(): void {
    if (!this.editor || this.menuElement) {
      return;
    }

    const container = this.getMenuContainer();
    if (!container) {
      return;
    }

    if (window.getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }

    this.menuElement = document.createElement('div');
    this.menuElement.className = ContextMenuExtension.css.root;
    this.menuElement.setAttribute('aria-hidden', 'true');
    this.menuElement.setAttribute('role', 'menu');
    this.menuElement.style.display = 'none';

    this.listElement = document.createElement('div');
    this.listElement.className = ContextMenuExtension.css.list;
    this.listElement.setAttribute('role', 'presentation');

    this.menuElement.appendChild(this.listElement);
    container.appendChild(this.menuElement);

    this.menuElement.addEventListener('keydown', (event) => {
      if (!this.isVisible || this.itemButtons.length === 0) {
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        this.closeContextMenu();
        this.editor?.focus();
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.focusRelativeButton(1);
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.focusRelativeButton(-1);
        return;
      }

      if (event.key === 'Home') {
        event.preventDefault();
        this.itemButtons.find((button) => !button.disabled)?.focus();
        return;
      }

      if (event.key === 'End') {
        event.preventDefault();
        [...this.itemButtons].reverse().find((button) => !button.disabled)?.focus();
      }
    });
  }

  private renderItems(): void {
    if (!this.listElement || !this.editor) {
      return;
    }

    this.listElement.innerHTML = '';
    this.itemButtons = [];
    const fragment = document.createDocumentFragment();

    this.items.forEach((item) => {
      if (item.type === 'separator') {
        const separator = document.createElement('div');
        separator.className = ContextMenuExtension.css.separator;
        separator.setAttribute('role', 'separator');
        fragment.appendChild(separator);
        return;
      }

      const button = document.createElement('button');
      button.type = 'button';
      button.className = ContextMenuExtension.css.item;
      button.setAttribute('role', 'menuitem');
      button.disabled = !item.isEnabledNow;
      button.dataset.lceContextMenuItem = item.id;

      const label = document.createElement('span');
      label.className = ContextMenuExtension.css.itemLabel;
      label.textContent = item.label;
      button.appendChild(label);

      if (item.shortcut) {
        const shortcut = document.createElement('span');
        shortcut.className = ContextMenuExtension.css.itemShortcut;
        shortcut.textContent = item.shortcut;
        button.appendChild(shortcut);
      }

      button.addEventListener('click', () => {
        this.activateItem(item);
      });

      fragment.appendChild(button);
      this.itemButtons.push(button);
    });

    this.listElement.appendChild(fragment);
  }

  private activateItem(
    item: ResolvedContextMenuCommandItem | ResolvedContextMenuActionItem,
  ): void {
    const editor = this.editor;
    if (!editor || !item.isEnabledNow) {
      return;
    }

    this.closeContextMenu();

    if (item.type === 'command') {
      editor.executeCommand(item.command, ...(item.args || []));
      return;
    }

    item.onSelect(editor);
  }

  private resolveMenuItems(): ResolvedContextMenuItem[] {
    const editor = this.editor;
    if (!editor) {
      return [];
    }

    const sourceItems = this.config.items.length > 0
      ? this.config.items
      : this.getDefaultItems();
    const resolved: ResolvedContextMenuItem[] = [];

    sourceItems.forEach((item, index) => {
      if (item.isVisible && !item.isVisible(editor)) {
        return;
      }

      if (item.type === 'separator') {
        resolved.push({
          id: item.id || `separator-${index}`,
          type: 'separator',
        });
        return;
      }

      if (item.type === 'action') {
        resolved.push({
          ...item,
          id: item.id || `item-${index}-${this.slugify(item.label)}`,
          type: 'action',
          isEnabledNow: item.isEnabled ? item.isEnabled(editor) : true,
        });
        return;
      }

      resolved.push({
        ...item,
        id: item.id || `item-${index}-${this.slugify(item.label)}`,
        type: 'command',
        isEnabledNow: item.isEnabled ? item.isEnabled(editor) : true,
      });
    });

    return this.normalizeSeparators(resolved);
  }

  private normalizeSeparators(items: ResolvedContextMenuItem[]): ResolvedContextMenuItem[] {
    const normalized: ResolvedContextMenuItem[] = [];

    for (const item of items) {
      const previous = normalized[normalized.length - 1];
      if (item.type === 'separator') {
        if (!previous || previous.type === 'separator') {
          continue;
        }
      }
      normalized.push(item);
    }

    while (normalized.length > 0 && normalized[normalized.length - 1].type === 'separator') {
      normalized.pop();
    }

    return normalized;
  }

  private getDefaultItems(): ContextMenuItem[] {
    return [
      {
        label: 'Undo',
        command: 'undo',
        shortcut: 'Ctrl/Cmd+Z',
        isEnabled: (editor) => !editor.getState().readOnly,
      },
      {
        label: 'Redo',
        command: 'redo',
        shortcut: 'Ctrl/Cmd+Shift+Z',
        isEnabled: (editor) => !editor.getState().readOnly,
      },
      { type: 'separator' },
      {
        label: 'Find',
        command: 'find',
        shortcut: 'Ctrl/Cmd+F',
      },
      {
        label: 'Find & Replace',
        command: 'replace',
        shortcut: 'Ctrl/Cmd+H',
        isEnabled: (editor) => !editor.getState().readOnly,
      },
      { type: 'separator' },
      {
        label: 'Format Selection',
        command: 'formatSelection',
        shortcut: 'Selection',
        isEnabled: (editor) => !editor.getState().readOnly && !!editor.getSelection(),
      },
      {
        label: 'Format Document',
        command: 'formatDocument',
        shortcut: 'Shift+Alt+F',
        isEnabled: (editor) => !editor.getState().readOnly,
      },
    ];
  }

  private resolveAnchorPosition(clientX?: number, clientY?: number): { x: number; y: number } {
    const container = this.getMenuContainer();
    const scrollElement = this.editor?.getView().getScrollElement();
    if (!container || !scrollElement) {
      return { x: 24, y: 24 };
    }

    if (typeof clientX === 'number' && typeof clientY === 'number') {
      const rect = container.getBoundingClientRect();
      return {
        x: clientX - rect.left + scrollElement.scrollLeft,
        y: clientY - rect.top + scrollElement.scrollTop,
      };
    }

    const selection = this.editor?.getSelection();
    const range = selection
      ? this.editor?.getView().createDomRangeFromRange(selection)
      : (() => {
        const cursor = this.editor?.getCursor().position;
        if (!cursor) {
          return null;
        }
        return this.editor?.getView().createDomRangeFromRange({
          start: cursor,
          end: cursor,
        }) || null;
      })();
    const anchorRect = range?.getClientRects()[0] || range?.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    if (anchorRect) {
      return {
        x: anchorRect.left - containerRect.left + scrollElement.scrollLeft,
        y: anchorRect.bottom - containerRect.top + scrollElement.scrollTop + 8,
      };
    }

    return {
      x: scrollElement.scrollLeft + 24,
      y: scrollElement.scrollTop + 24,
    };
  }

  private positionMenu(x: number, y: number): void {
    if (!this.menuElement || !this.editor) {
      return;
    }

    const container = this.getMenuContainer();
    const scrollElement = this.editor.getView().getScrollElement();
    if (!container) {
      return;
    }

    const padding = 12;
    const menuWidth = this.menuElement.offsetWidth || 240;
    const menuHeight = this.menuElement.offsetHeight || 220;
    const minLeft = scrollElement.scrollLeft + padding;
    const minTop = scrollElement.scrollTop + padding;
    const maxLeft = scrollElement.scrollLeft + container.clientWidth - menuWidth - padding;
    const maxTop = scrollElement.scrollTop + container.clientHeight - menuHeight - padding;

    const left = Math.max(minLeft, Math.min(x, maxLeft));
    const top = Math.max(minTop, Math.min(y, maxTop));

    this.menuElement.style.left = `${left}px`;
    this.menuElement.style.top = `${top}px`;
  }

  private focusRelativeButton(delta: number): void {
    if (this.itemButtons.length === 0) {
      return;
    }

    const enabledButtons = this.itemButtons.filter((button) => !button.disabled);
    if (enabledButtons.length === 0) {
      return;
    }

    const activeElement = document.activeElement as HTMLButtonElement | null;
    const currentIndex = enabledButtons.findIndex((button) => button === activeElement);
    const nextIndex =
      currentIndex === -1
        ? 0
        : (currentIndex + delta + enabledButtons.length) % enabledButtons.length;
    enabledButtons[nextIndex]?.focus();
  }

  private getMenuContainer(): HTMLElement | null {
    const contentElement = this.editor?.getView().getContentElement();
    if (!contentElement) {
      return null;
    }

    return (
      (contentElement.closest('[data-lce-editor-container="true"]') as HTMLElement | null) ||
      contentElement.parentElement
    );
  }

  private slugify(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
  }

  destroy(): void {
    if (this.documentPointerHandler) {
      document.removeEventListener('mousedown', this.documentPointerHandler, true);
    }
    if (this.documentResizeHandler) {
      window.removeEventListener('resize', this.documentResizeHandler);
    }
    if (this.blurHandler && this.editor) {
      this.editor.off('blur', this.blurHandler);
    }
    if (this.scrollHandler && this.editor) {
      this.editor
        .getView()
        .getScrollElement()
        .removeEventListener('scroll', this.scrollHandler);
    }

    this.menuElement?.remove();
    this.menuElement = null;
    this.listElement = null;
    this.itemButtons = [];
    this.items = [];
    this.editor = null;
  }
}
