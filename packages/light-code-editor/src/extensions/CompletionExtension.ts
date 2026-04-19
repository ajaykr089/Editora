/**
 * Completion Extension
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import {
  CompletionContext,
  CompletionItem,
  CompletionProvider,
  CompletionResult,
  EditorAPI,
  EditorExtension,
  Position,
  Range,
  TextChange,
} from '../types';

export interface CompletionExtensionConfig {
  providers?: CompletionProvider[];
  debounceMs?: number;
  maxItems?: number;
  maxVisibleItems?: number;
  minPrefixLength?: number;
  autoTrigger?: boolean;
  triggerCharacters?: string[];
  acceptOnEnter?: boolean;
  acceptOnTab?: boolean;
  closeOnBlur?: boolean;
}

type RequiredCompletionConfig = Required<CompletionExtensionConfig>;

type CompletionRequestMeta = {
  explicit: boolean;
  triggerKind: CompletionContext['triggerKind'];
  triggerCharacter?: string;
};

type NormalizedCompletionItem = CompletionItem & {
  id: string;
  insertText: string;
  filterText: string;
  sortText: string;
  replaceRange: Range;
};

type NormalizedCompletionResult = {
  items: CompletionItem[];
  from: Range;
};

export class CompletionExtension implements EditorExtension {
  private static readonly css = {
    popup: 'lce-completion-popup',
    popupVisible: 'is-visible',
    status: 'lce-completion-status',
    list: 'lce-completion-list',
    item: 'lce-completion-item',
    itemActive: 'is-active',
    itemMain: 'lce-completion-item-main',
    itemLabel: 'lce-completion-item-label',
    itemMeta: 'lce-completion-item-meta',
    itemDetail: 'lce-completion-item-detail',
    itemDescription: 'lce-completion-item-description',
    itemKind: 'lce-completion-item-kind',
    itemEmpty: 'lce-completion-empty',
  } as const;

  public readonly name = 'completion';

  private editor: EditorAPI | null = null;
  private popup: HTMLElement | null = null;
  private statusElement: HTMLElement | null = null;
  private listElement: HTMLElement | null = null;
  private items: NormalizedCompletionItem[] = [];
  private selectedIndex = -1;
  private isVisible = false;
  private isDestroyed = false;
  private requestSequence = 0;
  private activeAbortController: AbortController | null = null;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private positionRaf: number | null = null;
  private pendingTrigger: CompletionRequestMeta | null = null;
  private changeHandler: ((changes: TextChange[]) => void) | null = null;
  private blurHandler: (() => void) | null = null;
  private documentMouseDownHandler: ((event: MouseEvent) => void) | null = null;
  private scrollHandler: (() => void) | null = null;
  private readonly config: RequiredCompletionConfig;

  constructor(config: CompletionExtensionConfig = {}) {
    this.config = {
      providers: config.providers || [],
      debounceMs: Math.max(0, Math.floor(config.debounceMs ?? 60)),
      maxItems: Math.max(1, Math.floor(config.maxItems ?? 40)),
      maxVisibleItems: Math.max(3, Math.floor(config.maxVisibleItems ?? 8)),
      minPrefixLength: Math.max(0, Math.floor(config.minPrefixLength ?? 1)),
      autoTrigger: config.autoTrigger ?? true,
      triggerCharacters: Array.from(
        new Set((config.triggerCharacters || ['<', '/', '.', ':']).map((value) => value)),
      ),
      acceptOnEnter: config.acceptOnEnter ?? true,
      acceptOnTab: config.acceptOnTab ?? true,
      closeOnBlur: config.closeOnBlur ?? true,
    };
  }

  setup(editor: EditorAPI): void {
    this.editor = editor;

    editor.registerCommand('showCompletions', () => {
      void this.requestCompletions({
        explicit: true,
        triggerKind: 'manual',
      });
    });

    editor.registerCommand('closeCompletions', () => {
      this.closeCompletions();
    });

    editor.registerCommand('nextCompletion', () => {
      this.moveSelection(1);
    });

    editor.registerCommand('prevCompletion', () => {
      this.moveSelection(-1);
    });

    editor.registerCommand('acceptCompletion', (index?: number) => {
      this.acceptCompletion(index);
    });

    this.createPopup();

    this.changeHandler = () => {
      if (this.pendingTrigger) {
        const meta = this.pendingTrigger;
        this.pendingTrigger = null;
        this.scheduleCompletionRequest(meta);
        return;
      }

      if (this.isVisible) {
        this.closeCompletions();
      }
    };
    editor.on('change', this.changeHandler);

    if (this.config.closeOnBlur) {
      this.blurHandler = () => {
        window.setTimeout(() => {
          if (!this.isVisible) {
            return;
          }
          const activeElement = document.activeElement;
          if (activeElement && this.popup?.contains(activeElement)) {
            return;
          }
          this.closeCompletions();
        }, 0);
      };
      editor.on('blur', this.blurHandler);
    }

    this.documentMouseDownHandler = (event: MouseEvent) => {
      if (!this.isVisible) {
        return;
      }

      const target = event.target as Node | null;
      if (!target) {
        return;
      }

      if (this.popup?.contains(target)) {
        return;
      }

      if (this.editor?.getView().getContentElement().contains(target)) {
        this.closeCompletions();
        return;
      }

      this.closeCompletions();
    };
    document.addEventListener('mousedown', this.documentMouseDownHandler, true);

    this.scrollHandler = () => {
      if (this.isVisible) {
        this.schedulePopupPosition();
      }
    };
    this.editor.getView().getScrollElement().addEventListener('scroll', this.scrollHandler, {
      passive: true,
    });
  }

  onKeyDown(event: KeyboardEvent): boolean | void {
    if (!this.editor || event.isComposing) {
      return;
    }

    if (this.isManualTriggerEvent(event)) {
      void this.requestCompletions({
        explicit: true,
        triggerKind: 'manual',
      });
      return false;
    }

    if (this.isVisible) {
      if (event.key === 'Escape') {
        this.closeCompletions();
        return false;
      }

      if (event.key === 'ArrowDown') {
        this.moveSelection(1);
        return false;
      }

      if (event.key === 'ArrowUp') {
        this.moveSelection(-1);
        return false;
      }

      if (event.key === 'Home') {
        this.setSelectedIndex(0);
        return false;
      }

      if (event.key === 'End') {
        this.setSelectedIndex(this.items.length - 1);
        return false;
      }

      if (event.key === 'PageDown') {
        this.moveSelection(Math.max(1, this.config.maxVisibleItems - 1));
        return false;
      }

      if (event.key === 'PageUp') {
        this.moveSelection(-Math.max(1, this.config.maxVisibleItems - 1));
        return false;
      }

      if (
        ((event.key === 'Enter' && this.config.acceptOnEnter) ||
          (event.key === 'Tab' && this.config.acceptOnTab)) &&
        this.items.length > 0
      ) {
        this.acceptCompletion();
        return false;
      }

      if (
        event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight' ||
        event.key === 'ArrowDown' ||
        event.key === 'ArrowUp'
      ) {
        return;
      }
    }

    if (!this.config.autoTrigger || this.editor.getState().readOnly) {
      return;
    }

    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.pendingTrigger = {
        explicit: false,
        triggerKind: 'input',
      };
      return;
    }

    if (
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'Home' ||
      event.key === 'End' ||
      event.key === 'PageUp' ||
      event.key === 'PageDown'
    ) {
      if (this.isVisible) {
        this.closeCompletions();
      }
      return;
    }

    const triggerCharacter = this.getTypedCharacter(event);
    if (!triggerCharacter) {
      return;
    }

    this.pendingTrigger = {
      explicit: false,
      triggerKind: this.config.triggerCharacters.includes(triggerCharacter)
        ? 'trigger-character'
        : 'input',
      triggerCharacter: this.config.triggerCharacters.includes(triggerCharacter)
        ? triggerCharacter
        : undefined,
    };
  }

  private scheduleCompletionRequest(meta: CompletionRequestMeta): void {
    if (!this.editor || this.isDestroyed) {
      return;
    }

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    this.debounceTimer = setTimeout(() => {
      void this.requestCompletions(meta);
    }, this.config.debounceMs);
  }

  private async requestCompletions(meta: CompletionRequestMeta): Promise<void> {
    if (!this.editor || this.config.providers.length === 0 || this.isDestroyed) {
      this.closeCompletions();
      return;
    }

    const context = this.buildContext(meta);
    if (!context) {
      this.closeCompletions();
      return;
    }

    this.abortActiveRequest();
    const requestId = ++this.requestSequence;
    const controller = new AbortController();
    this.activeAbortController = controller;

    this.renderStatus(meta.explicit ? 'Loading suggestions...' : 'Looking for matches...');
    if (meta.explicit) {
      this.openPopup();
    }

    const settledResults = await Promise.allSettled(
      this.config.providers.map((provider) =>
        Promise.resolve(
          provider({
            ...context,
            abortSignal: controller.signal,
          }),
        ),
      ),
    );

    if (this.isDestroyed || requestId !== this.requestSequence || controller.signal.aborted) {
      return;
    }

    const items = this.normalizeProviderResults(settledResults, context);
    if (items.length === 0) {
      if (meta.explicit) {
        this.items = [];
        this.selectedIndex = -1;
        this.renderItems();
        this.renderStatus('No suggestions');
        this.openPopup();
      } else {
        this.closeCompletions();
      }
      return;
    }

    this.items = items.slice(0, this.config.maxItems);
    this.selectedIndex = this.pickInitialSelection(context.prefix);
    this.renderItems();
    this.renderStatus(
      `${this.items.length} suggestion${this.items.length === 1 ? '' : 's'}`,
    );
    this.openPopup();
  }

  private buildContext(meta: CompletionRequestMeta): CompletionContext | null {
    if (!this.editor) {
      return null;
    }

    const selection = this.editor.getSelection();
    if (selection) {
      return null;
    }

    const text = this.editor.getValue();
    const cursor = this.editor.getCursor();
    const lines = text.split('\n');
    const lineText = lines[cursor.position.line] || '';
    const wordRange = this.getWordRange(lineText, cursor.position);
    const prefix = lineText.slice(wordRange.start.column, cursor.position.column);
    const allowEmptyPrefix =
      meta.explicit || meta.triggerKind === 'trigger-character';

    if (!allowEmptyPrefix && prefix.length < this.config.minPrefixLength) {
      return null;
    }

    if (!allowEmptyPrefix && prefix.length === 0) {
      return null;
    }

    return {
      editor: this.editor,
      text,
      cursor,
      selection,
      lineText,
      prefix,
      wordRange,
      explicit: meta.explicit,
      triggerKind: meta.triggerKind,
      triggerCharacter: meta.triggerCharacter,
    };
  }

  private getWordRange(lineText: string, position: Position): Range {
    let startColumn = Math.max(0, position.column);
    while (startColumn > 0 && this.isWordCharacter(lineText[startColumn - 1] || '')) {
      startColumn -= 1;
    }

    let endColumn = Math.max(startColumn, position.column);
    while (endColumn < lineText.length && this.isWordCharacter(lineText[endColumn] || '')) {
      endColumn += 1;
    }

    return {
      start: { line: position.line, column: startColumn },
      end: { line: position.line, column: endColumn },
    };
  }

  private normalizeProviderResults(
    settledResults: PromiseSettledResult<CompletionItem[] | CompletionResult>[],
    context: CompletionContext,
  ): NormalizedCompletionItem[] {
    const deduped = new Map<string, NormalizedCompletionItem>();
    const normalizedItems: NormalizedCompletionItem[] = [];

    settledResults.forEach((result, providerIndex) => {
      if (result.status === 'rejected') {
        console.warn('Completion provider failed', result.reason);
        return;
      }

      const normalizedResult = this.normalizeCompletionResult(result.value, context);
      normalizedResult.items.forEach((item, itemIndex) => {
        const normalizedItem = this.normalizeCompletionItem(
          item,
          normalizedResult.from,
          providerIndex,
          itemIndex,
        );
        const key = this.getDeduplicationKey(normalizedItem);
        if (!deduped.has(key)) {
          deduped.set(key, normalizedItem);
          normalizedItems.push(normalizedItem);
        }
      });
    });

    return normalizedItems.sort((a, b) => {
      const sortCompare = a.sortText.localeCompare(b.sortText);
      if (sortCompare !== 0) {
        return sortCompare;
      }
      return a.label.localeCompare(b.label);
    });
  }

  private normalizeCompletionResult(
    result: CompletionItem[] | CompletionResult,
    context: CompletionContext,
  ): NormalizedCompletionResult {
    if (Array.isArray(result)) {
      return {
        items: result,
        from: context.wordRange,
      };
    }

    return {
      items: Array.isArray(result.items) ? result.items : [],
      from: result.from || context.wordRange,
    };
  }

  private normalizeCompletionItem(
    item: CompletionItem,
    fallbackRange: Range,
    providerIndex: number,
    itemIndex: number,
  ): NormalizedCompletionItem {
    const label = item.label || '';
    const insertText = item.insertText ?? label;
    const filterText = item.filterText ?? label;
    const sortText = item.sortText ?? label;
    const replaceRange = item.replaceRange || fallbackRange;

    return {
      ...item,
      id:
        item.id ||
        `completion-${providerIndex}-${itemIndex}-${this.slugify(`${label}-${insertText}`)}`,
      label,
      insertText,
      filterText,
      sortText,
      replaceRange: {
        start: { ...replaceRange.start },
        end: { ...replaceRange.end },
      },
    };
  }

  private getDeduplicationKey(item: NormalizedCompletionItem): string {
    return [
      item.label,
      item.insertText,
      item.detail || '',
      item.replaceRange.start.line,
      item.replaceRange.start.column,
      item.replaceRange.end.line,
      item.replaceRange.end.column,
    ].join('|');
  }

  private moveSelection(delta: number): void {
    if (this.items.length === 0) {
      return;
    }

    const nextIndex =
      this.selectedIndex < 0
        ? 0
        : (this.selectedIndex + delta + this.items.length) % this.items.length;
    this.setSelectedIndex(nextIndex);
  }

  private setSelectedIndex(index: number): void {
    if (this.items.length === 0) {
      this.selectedIndex = -1;
      this.renderItems();
      return;
    }

    const safeIndex = Math.max(0, Math.min(index, this.items.length - 1));
    if (safeIndex === this.selectedIndex) {
      return;
    }

    this.selectedIndex = safeIndex;
    this.renderItems();
  }

  private pickInitialSelection(prefix: string): number {
    if (!prefix) {
      return 0;
    }

    const normalizedPrefix = prefix.toLowerCase();
    const startsWithIndex = this.items.findIndex((item) =>
      item.filterText.toLowerCase().startsWith(normalizedPrefix),
    );
    if (startsWithIndex !== -1) {
      return startsWithIndex;
    }

    const containsIndex = this.items.findIndex((item) =>
      item.filterText.toLowerCase().includes(normalizedPrefix),
    );
    return containsIndex !== -1 ? containsIndex : 0;
  }

  private acceptCompletion(index = this.selectedIndex): void {
    if (!this.editor || this.items.length === 0 || index < 0 || index >= this.items.length) {
      return;
    }

    if (this.editor.getState().readOnly) {
      this.closeCompletions();
      return;
    }

    const item = this.items[index];
    const currentText = this.editor.getValue();
    const startOffset = this.positionToOffset(item.replaceRange.start, currentText);
    const endOffset = this.positionToOffset(item.replaceRange.end, currentText);
    const nextText =
      currentText.slice(0, startOffset) +
      item.insertText +
      currentText.slice(endOffset);
    const nextCursorOffset = startOffset + item.insertText.length;
    const nextCursor = this.offsetToPosition(nextText, nextCursorOffset);

    this.closeCompletions();
    this.editor.replace(item.replaceRange, item.insertText);
    this.editor.setCursor(nextCursor);
    this.editor.focus();
  }

  private createPopup(): void {
    if (!this.editor || this.popup) {
      return;
    }

    const container = this.getPopupContainer();
    if (!container) {
      return;
    }

    if (window.getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }

    this.popup = document.createElement('div');
    this.popup.className = CompletionExtension.css.popup;
    this.popup.setAttribute('aria-hidden', 'true');
    this.popup.setAttribute('role', 'dialog');
    this.popup.style.display = 'none';

    this.statusElement = document.createElement('div');
    this.statusElement.className = CompletionExtension.css.status;

    this.listElement = document.createElement('div');
    this.listElement.className = CompletionExtension.css.list;
    this.listElement.setAttribute('role', 'listbox');
    this.listElement.setAttribute('aria-label', 'Completions');
    this.listElement.style.maxHeight = `${this.config.maxVisibleItems * 38}px`;

    this.popup.appendChild(this.statusElement);
    this.popup.appendChild(this.listElement);
    container.appendChild(this.popup);

    this.popup.addEventListener('mousedown', (event) => {
      event.preventDefault();
      const target = event.target as HTMLElement | null;
      const itemElement = target?.closest('[data-lce-completion-index]') as HTMLElement | null;
      if (!itemElement) {
        return;
      }
      const index = Number(itemElement.dataset.lceCompletionIndex);
      if (Number.isFinite(index)) {
        this.acceptCompletion(index);
      }
    });

    this.popup.addEventListener('mousemove', (event) => {
      const target = event.target as HTMLElement | null;
      const itemElement = target?.closest('[data-lce-completion-index]') as HTMLElement | null;
      if (!itemElement) {
        return;
      }
      const index = Number(itemElement.dataset.lceCompletionIndex);
      if (Number.isFinite(index) && index !== this.selectedIndex) {
        this.selectedIndex = index;
        this.renderItems();
      }
    });
  }

  private renderItems(): void {
    if (!this.listElement) {
      return;
    }

    this.listElement.innerHTML = '';

    if (this.items.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = CompletionExtension.css.itemEmpty;
      emptyState.textContent = 'No suggestions';
      this.listElement.appendChild(emptyState);
      return;
    }

    const fragment = document.createDocumentFragment();
    this.items.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = CompletionExtension.css.item;
      if (index === this.selectedIndex) {
        row.classList.add(CompletionExtension.css.itemActive);
        row.setAttribute('aria-selected', 'true');
      } else {
        row.setAttribute('aria-selected', 'false');
      }
      row.setAttribute('role', 'option');
      row.dataset.lceCompletionIndex = String(index);

      const main = document.createElement('div');
      main.className = CompletionExtension.css.itemMain;

      const label = document.createElement('div');
      label.className = CompletionExtension.css.itemLabel;
      label.textContent = item.label;

      const meta = document.createElement('div');
      meta.className = CompletionExtension.css.itemMeta;

      if (item.kind) {
        const kind = document.createElement('span');
        kind.className = CompletionExtension.css.itemKind;
        kind.textContent = item.kind;
        meta.appendChild(kind);
      }

      if (item.detail) {
        const detail = document.createElement('span');
        detail.className = CompletionExtension.css.itemDetail;
        detail.textContent = item.detail;
        meta.appendChild(detail);
      }

      main.appendChild(label);
      if (meta.childNodes.length > 0) {
        main.appendChild(meta);
      }

      row.appendChild(main);

      if (item.description) {
        const description = document.createElement('div');
        description.className = CompletionExtension.css.itemDescription;
        description.textContent = item.description;
        row.appendChild(description);
      }

      fragment.appendChild(row);
    });

    this.listElement.appendChild(fragment);

    const activeElement = this.listElement.querySelector(
      `.${CompletionExtension.css.itemActive}`,
    ) as HTMLElement | null;
    activeElement?.scrollIntoView({ block: 'nearest' });
  }

  private renderStatus(message: string): void {
    if (this.statusElement) {
      this.statusElement.textContent = message;
    }
  }

  private openPopup(): void {
    if (!this.popup) {
      return;
    }

    this.popup.style.display = 'block';
    this.popup.setAttribute('aria-hidden', 'false');
    this.popup.classList.add(CompletionExtension.css.popupVisible);
    this.isVisible = true;
    this.schedulePopupPosition();
  }

  private closeCompletions(): void {
    this.pendingTrigger = null;
    this.items = [];
    this.selectedIndex = -1;
    this.abortActiveRequest();

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    if (this.popup) {
      this.popup.style.display = 'none';
      this.popup.setAttribute('aria-hidden', 'true');
      this.popup.classList.remove(CompletionExtension.css.popupVisible);
    }

    if (this.statusElement) {
      this.statusElement.textContent = '';
    }

    if (this.listElement) {
      this.listElement.innerHTML = '';
    }

    this.isVisible = false;
  }

  private schedulePopupPosition(): void {
    if (this.positionRaf) {
      cancelAnimationFrame(this.positionRaf);
      this.positionRaf = null;
    }

    this.positionRaf = requestAnimationFrame(() => {
      this.positionRaf = null;
      this.positionPopup();
    });
  }

  private positionPopup(): void {
    if (!this.editor || !this.popup || !this.isVisible) {
      return;
    }

    const container = this.getPopupContainer();
    if (!container) {
      return;
    }

    const scrollElement = this.editor.getView().getScrollElement();
    const cursor = this.editor.getCursor().position;
    const anchorRange = this.editor.getView().createDomRangeFromRange({
      start: cursor,
      end: cursor,
    });
    const contentRect = this.editor.getView().getContentElement().getBoundingClientRect();
    const anchorRect =
      anchorRange?.getClientRects()[0] ||
      anchorRange?.getBoundingClientRect() ||
      contentRect;
    const containerRect = container.getBoundingClientRect();
    const horizontalPadding = 12;
    const verticalGap = 8;
    const popupWidth = this.popup.offsetWidth || 320;
    const popupHeight = this.popup.offsetHeight || 180;
    const preferredTop =
      anchorRect.bottom - containerRect.top + scrollElement.scrollTop + verticalGap;
    const preferredBottom =
      anchorRect.top - containerRect.top + scrollElement.scrollTop - popupHeight - verticalGap;
    const maxLeft =
      scrollElement.scrollLeft + container.clientWidth - popupWidth - horizontalPadding;

    let left =
      anchorRect.left - containerRect.left + scrollElement.scrollLeft;
    left = Math.max(scrollElement.scrollLeft + horizontalPadding, Math.min(left, maxLeft));

    let top = preferredTop;
    const visibleBottom =
      preferredTop - scrollElement.scrollTop + popupHeight + horizontalPadding;
    if (visibleBottom > container.clientHeight && preferredBottom >= scrollElement.scrollTop) {
      top = preferredBottom;
    }

    this.popup.style.left = `${Math.max(horizontalPadding, left)}px`;
    this.popup.style.top = `${Math.max(scrollElement.scrollTop + horizontalPadding, top)}px`;
  }

  private abortActiveRequest(): void {
    if (this.activeAbortController) {
      this.activeAbortController.abort();
      this.activeAbortController = null;
    }
  }

  private isManualTriggerEvent(event: KeyboardEvent): boolean {
    const key = event.key.toLowerCase();
    const isSpace = event.key === ' ' || key === 'spacebar';
    return isSpace && (event.ctrlKey || event.metaKey) && !event.altKey;
  }

  private getTypedCharacter(event: KeyboardEvent): string | null {
    if (event.key.length !== 1) {
      return null;
    }

    if (
      event.key === '\r' ||
      event.key === '\n' ||
      event.key === '\t' ||
      /\s/.test(event.key)
    ) {
      return null;
    }

    return event.key;
  }

  private isWordCharacter(value: string): boolean {
    return /[A-Za-z0-9:_-]/.test(value);
  }

  private getPopupContainer(): HTMLElement | null {
    if (!this.editor) {
      return null;
    }

    const contentElement = this.editor.getView().getContentElement();
    return (
      (contentElement.closest('[data-lce-editor-container="true"]') as HTMLElement | null) ||
      contentElement.parentElement
    );
  }

  private positionToOffset(position: Position, text: string): number {
    const lines = text.split('\n');
    const safeLine = Math.max(0, Math.min(position.line, Math.max(0, lines.length - 1)));
    const safeColumn = Math.max(0, Math.min(position.column, lines[safeLine]?.length ?? 0));
    let offset = 0;
    for (let index = 0; index < safeLine; index++) {
      offset += (lines[index]?.length ?? 0) + 1;
    }
    return offset + safeColumn;
  }

  private offsetToPosition(text: string, offset: number): Position {
    const boundedOffset = Math.max(0, Math.min(offset, text.length));
    let line = 0;
    let column = 0;

    for (let index = 0; index < boundedOffset; index++) {
      if (text[index] === '\n') {
        line += 1;
        column = 0;
      } else {
        column += 1;
      }
    }

    return { line, column };
  }

  private slugify(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
  }

  destroy(): void {
    this.isDestroyed = true;
    this.closeCompletions();

    if (this.positionRaf) {
      cancelAnimationFrame(this.positionRaf);
      this.positionRaf = null;
    }

    if (this.changeHandler && this.editor) {
      this.editor.off('change', this.changeHandler);
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

    if (this.documentMouseDownHandler) {
      document.removeEventListener('mousedown', this.documentMouseDownHandler, true);
    }

    this.popup?.remove();
    this.popup = null;
    this.statusElement = null;
    this.listElement = null;
    this.editor = null;
  }
}
