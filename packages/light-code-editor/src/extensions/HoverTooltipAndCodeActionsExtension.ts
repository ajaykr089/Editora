/**
 * Hover Tooltip and Code Actions Extension
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import {
  EditorAPI,
  EditorDiagnostic,
  EditorExtension,
  LanguageServiceCodeAction,
  LanguageServiceCodeActionContext,
  LanguageServiceCodeActionsProvider,
  LanguageServiceDocumentSnapshot,
  LanguageServiceHoverContext,
  LanguageServiceHoverProvider,
  LanguageServiceHoverResult,
  Position,
  Range,
  TextChange,
} from '../types';

export interface HoverTooltipAndCodeActionsExtensionConfig {
  languageId?: string;
  hoverProvider?: LanguageServiceHoverProvider;
  codeActionsProvider?: LanguageServiceCodeActionsProvider;
  diagnostics?: () => EditorDiagnostic[];
  hoverDelayMs?: number;
  maxCodeActions?: number;
  closeOnBlur?: boolean;
  closeOnScroll?: boolean;
  showEmptyActionsOnManualTrigger?: boolean;
}

type RequiredHoverTooltipAndCodeActionsExtensionConfig = {
  languageId: string;
  hoverProvider?: LanguageServiceHoverProvider;
  codeActionsProvider?: LanguageServiceCodeActionsProvider;
  diagnostics: () => EditorDiagnostic[];
  hoverDelayMs: number;
  maxCodeActions: number;
  closeOnBlur: boolean;
  closeOnScroll: boolean;
  showEmptyActionsOnManualTrigger: boolean;
};

type TooltipRequestTrigger = 'hover' | 'manual';

type TooltipAnchor =
  | {
    kind: 'pointer';
    clientX: number;
    clientY: number;
    position: Position;
  }
  | {
    kind: 'range';
    range: Range;
    position: Position;
  };

type TooltipState = {
  hover: LanguageServiceHoverResult | null;
  actions: LanguageServiceCodeAction[];
  position: Position;
  anchor: TooltipAnchor;
  trigger: TooltipRequestTrigger;
};

export class HoverTooltipAndCodeActionsExtension implements EditorExtension {
  private static readonly css = {
    popup: 'lce-hover-tooltip',
    popupVisible: 'is-visible',
    header: 'lce-hover-tooltip-header',
    title: 'lce-hover-tooltip-title',
    content: 'lce-hover-tooltip-content',
    section: 'lce-hover-tooltip-section',
    sectionTitle: 'lce-hover-tooltip-section-title',
    actions: 'lce-hover-tooltip-actions',
    action: 'lce-hover-tooltip-action',
    actionLabel: 'lce-hover-tooltip-action-label',
    actionDetail: 'lce-hover-tooltip-action-detail',
    empty: 'lce-hover-tooltip-empty',
  } as const;

  public readonly name = 'hover-tooltip-and-code-actions';

  private editor: EditorAPI | null = null;
  private popup: HTMLElement | null = null;
  private headerElement: HTMLElement | null = null;
  private contentElement: HTMLElement | null = null;
  private actionsElement: HTMLElement | null = null;
  private hoverTimer: number | null = null;
  private positionRaf: number | null = null;
  private requestSequence = 0;
  private activeAbortController: AbortController | null = null;
  private documentVersion = 0;
  private isVisible = false;
  private isHoveringPopup = false;
  private currentState: TooltipState | null = null;
  private lastHoverPosition: Position | null = null;
  private changeHandler: ((changes: TextChange[]) => void) | null = null;
  private blurHandler: (() => void) | null = null;
  private documentMouseDownHandler: ((event: MouseEvent) => void) | null = null;
  private mouseMoveHandler: ((event: MouseEvent) => void) | null = null;
  private mouseLeaveHandler: ((event: MouseEvent) => void) | null = null;
  private scrollHandler: (() => void) | null = null;
  private readonly config: RequiredHoverTooltipAndCodeActionsExtensionConfig;

  constructor(config: HoverTooltipAndCodeActionsExtensionConfig = {}) {
    this.config = {
      languageId: (config.languageId || 'text').trim() || 'text',
      hoverProvider: config.hoverProvider,
      codeActionsProvider: config.codeActionsProvider,
      diagnostics: config.diagnostics || (() => []),
      hoverDelayMs: Math.max(0, Math.floor(config.hoverDelayMs ?? 220)),
      maxCodeActions: Math.max(1, Math.floor(config.maxCodeActions ?? 6)),
      closeOnBlur: config.closeOnBlur ?? true,
      closeOnScroll: config.closeOnScroll ?? true,
      showEmptyActionsOnManualTrigger:
        config.showEmptyActionsOnManualTrigger ?? true,
    };
  }

  setup(editor: EditorAPI): void {
    this.editor = editor;

    editor.registerCommand('showCodeActions', (position?: Position) => {
      void this.openManual(position);
    });

    editor.registerCommand('hideHoverTooltip', () => {
      this.closeTooltip();
    });

    this.createPopup();

    this.changeHandler = () => {
      this.documentVersion += 1;
      this.cancelHoverTimer();
      this.closeTooltip();
    };
    editor.on('change', this.changeHandler);

    if (this.config.closeOnBlur) {
      this.blurHandler = () => {
        window.setTimeout(() => {
          if (!this.isVisible || this.isHoveringPopup) {
            return;
          }

          const activeElement = document.activeElement;
          if (activeElement && this.popup?.contains(activeElement)) {
            return;
          }

          this.closeTooltip();
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
        this.closeTooltip();
        return;
      }

      if (this.popup?.contains(target)) {
        return;
      }

      if (this.editor?.getView().getContentElement().contains(target)) {
        this.closeTooltip();
        return;
      }

      this.closeTooltip();
    };
    document.addEventListener('mousedown', this.documentMouseDownHandler, true);

    this.mouseMoveHandler = (event: MouseEvent) => {
      this.handleMouseMove(event);
    };
    this.mouseLeaveHandler = (event: MouseEvent) => {
      this.handleMouseLeave(event);
    };

    const contentElement = editor.getView().getContentElement();
    contentElement.addEventListener('mousemove', this.mouseMoveHandler, {
      passive: true,
    });
    contentElement.addEventListener('mouseleave', this.mouseLeaveHandler);

    this.scrollHandler = () => {
      if (!this.isVisible) {
        return;
      }

      if (this.config.closeOnScroll) {
        this.closeTooltip();
        return;
      }

      this.schedulePopupPosition();
    };
    editor
      .getView()
      .getScrollElement()
      .addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  onKeyDown(event: KeyboardEvent): boolean | void {
    if (!this.editor || event.isComposing) {
      return;
    }

    if (this.isManualTriggerEvent(event)) {
      void this.openManual();
      return false;
    }

    if (this.isVisible && event.key === 'Escape') {
      this.closeTooltip();
      return false;
    }
  }

  private handleMouseMove(event: MouseEvent): void {
    if (
      !this.editor ||
      (!this.config.hoverProvider && !this.config.codeActionsProvider)
    ) {
      return;
    }

    if (this.currentState?.trigger === 'manual') {
      return;
    }

    const position = this.editor
      .getView()
      .getPositionFromClientPoint(event.clientX, event.clientY);
    if (!position) {
      this.cancelHoverTimer();
      if (!this.isHoveringPopup) {
        this.closeTooltip();
      }
      return;
    }

    if (
      this.lastHoverPosition &&
      this.arePositionsEqual(this.lastHoverPosition, position)
    ) {
      return;
    }

    this.lastHoverPosition = { ...position };
    this.cancelHoverTimer();
    this.hoverTimer = window.setTimeout(() => {
      this.hoverTimer = null;
      void this.openTooltip({
        trigger: 'hover',
        position,
        anchor: {
          kind: 'pointer',
          clientX: event.clientX,
          clientY: event.clientY,
          position,
        },
      });
    }, this.config.hoverDelayMs);
  }

  private handleMouseLeave(event: MouseEvent): void {
    this.cancelHoverTimer();
    this.lastHoverPosition = null;

    const relatedTarget = event.relatedTarget as Node | null;
    if (relatedTarget && this.popup?.contains(relatedTarget)) {
      return;
    }

    if (this.currentState?.trigger === 'hover' && !this.isHoveringPopup) {
      this.closeTooltip();
    }
  }

  private async openManual(position?: Position): Promise<void> {
    if (!this.editor) {
      return;
    }

    const resolvedPosition = position
      ? { ...position }
      : { ...this.editor.getCursor().position };

    await this.openTooltip({
      trigger: 'manual',
      position: resolvedPosition,
      anchor: {
        kind: 'range',
        range: this.getManualAnchorRange(resolvedPosition),
        position: resolvedPosition,
      },
    });
  }

  private async openTooltip(options: {
    trigger: TooltipRequestTrigger;
    position: Position;
    anchor: TooltipAnchor;
  }): Promise<void> {
    if (!this.editor) {
      return;
    }

    if (!this.config.hoverProvider && !this.config.codeActionsProvider) {
      this.closeTooltip();
      return;
    }

    const requestId = ++this.requestSequence;
    this.abortActiveRequest();

    const controller = new AbortController();
    this.activeAbortController = controller;
    const diagnostics = this.getDiagnosticsAtPosition(options.position);
    const snapshot = this.buildSnapshot();
    const lineText = this.getLineText(snapshot.text, options.position.line);

    try {
      const [hoverResult, codeActions] = await Promise.all([
        this.config.hoverProvider
          ? Promise.resolve(
            this.config.hoverProvider({
              ...snapshot,
              position: options.position,
              lineText,
              diagnostics,
              abortSignal: controller.signal,
            } as LanguageServiceHoverContext),
          )
          : Promise.resolve(null),
        this.config.codeActionsProvider
          ? Promise.resolve(
            this.config.codeActionsProvider({
              ...snapshot,
              position: options.position,
              lineText,
              diagnostics,
              trigger: options.trigger,
              abortSignal: controller.signal,
            } as LanguageServiceCodeActionContext),
          )
          : Promise.resolve([]),
      ]);

      if (
        controller.signal.aborted ||
        requestId !== this.requestSequence ||
        this.activeAbortController !== controller
      ) {
        return;
      }

      const normalizedActions = Array.isArray(codeActions)
        ? codeActions
          .filter((action): action is LanguageServiceCodeAction => !!action)
          .slice(0, this.config.maxCodeActions)
        : [];

      const shouldShowEmptyActions =
        options.trigger === 'manual' &&
        this.config.showEmptyActionsOnManualTrigger &&
        !!this.config.codeActionsProvider;
      if (!hoverResult && normalizedActions.length === 0 && !shouldShowEmptyActions) {
        this.closeTooltip();
        return;
      }

      this.renderTooltip({
        hover: hoverResult,
        actions: normalizedActions,
        position: options.position,
        anchor:
          hoverResult?.range && options.trigger === 'hover'
            ? {
              kind: 'range',
              range: hoverResult.range,
              position: options.position,
            }
            : options.anchor,
        trigger: options.trigger,
      });
    } catch (error) {
      if (controller.signal.aborted || requestId !== this.requestSequence) {
        return;
      }

      this.closeTooltip();
      console.warn('Hover tooltip request failed', error);
    } finally {
      if (this.activeAbortController === controller) {
        this.activeAbortController = null;
      }
    }
  }

  private renderTooltip(state: TooltipState): void {
    if (!this.popup || !this.headerElement || !this.contentElement || !this.actionsElement) {
      return;
    }

    this.currentState = state;

    const headerText =
      state.hover?.title ||
      (state.actions.length > 0 ? 'Code Actions' : 'Info');
    this.headerElement.textContent = headerText;

    this.contentElement.innerHTML = '';
    this.actionsElement.innerHTML = '';

    if (state.hover?.content) {
      const contentSection = document.createElement('div');
      contentSection.className = HoverTooltipAndCodeActionsExtension.css.section;

      const content = document.createElement('div');
      content.className = HoverTooltipAndCodeActionsExtension.css.content;
      content.textContent = state.hover.content;

      contentSection.appendChild(content);
      this.contentElement.appendChild(contentSection);
    }

    if (state.actions.length > 0) {
      const actionsHeading = document.createElement('div');
      actionsHeading.className =
        HoverTooltipAndCodeActionsExtension.css.sectionTitle;
      actionsHeading.textContent = 'Code Actions';
      this.actionsElement.appendChild(actionsHeading);

      const actionsList = document.createElement('div');
      actionsList.className = HoverTooltipAndCodeActionsExtension.css.actions;

      state.actions.forEach((action) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = HoverTooltipAndCodeActionsExtension.css.action;
        button.disabled = !!action.disabled;

        const label = document.createElement('span');
        label.className =
          HoverTooltipAndCodeActionsExtension.css.actionLabel;
        label.textContent = action.label;
        button.appendChild(label);

        if (action.detail) {
          const detail = document.createElement('span');
          detail.className =
            HoverTooltipAndCodeActionsExtension.css.actionDetail;
          detail.textContent = action.detail;
          button.appendChild(detail);
        }

        button.addEventListener('click', () => {
          void Promise.resolve(action.run(this.editor as any)).finally(() => {
            this.closeTooltip();
            this.editor?.focus();
          });
        });

        actionsList.appendChild(button);
      });

      this.actionsElement.appendChild(actionsList);
    } else if (state.trigger === 'manual') {
      const emptyState = document.createElement('div');
      emptyState.className = HoverTooltipAndCodeActionsExtension.css.empty;
      emptyState.textContent = 'No code actions available at this location.';
      this.actionsElement.appendChild(emptyState);
    }

    this.popup.style.display = 'block';
    this.popup.setAttribute('aria-hidden', 'false');
    this.popup.classList.add(
      HoverTooltipAndCodeActionsExtension.css.popupVisible,
    );
    this.isVisible = true;
    this.schedulePopupPosition();
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
    if (!this.editor || !this.popup || !this.currentState || !this.isVisible) {
      return;
    }

    const container = this.getPopupContainer();
    if (!container) {
      return;
    }

    const scrollElement = this.editor.getView().getScrollElement();
    const containerRect = container.getBoundingClientRect();
    const popupWidth = this.popup.offsetWidth || 320;
    const popupHeight = this.popup.offsetHeight || 180;
    const horizontalPadding = 12;
    const verticalPadding = 12;
    const verticalGap = 8;
    let anchorLeft = 0;
    let anchorTop = 0;
    let anchorBottom = 0;

    if (this.currentState.anchor.kind === 'pointer') {
      anchorLeft =
        this.currentState.anchor.clientX - containerRect.left + scrollElement.scrollLeft;
      anchorTop =
        this.currentState.anchor.clientY - containerRect.top + scrollElement.scrollTop;
      anchorBottom = anchorTop;
    } else {
      const anchorRange = this.editor
        .getView()
        .createDomRangeFromRange(this.currentState.anchor.range);
      const anchorRect =
        anchorRange?.getClientRects()[0] ||
        anchorRange?.getBoundingClientRect() ||
        this.editor.getView().getContentElement().getBoundingClientRect();

      anchorLeft =
        anchorRect.left - containerRect.left + scrollElement.scrollLeft;
      anchorTop =
        anchorRect.top - containerRect.top + scrollElement.scrollTop;
      anchorBottom =
        anchorRect.bottom - containerRect.top + scrollElement.scrollTop;
    }

    const maxLeft =
      scrollElement.scrollLeft +
      container.clientWidth -
      popupWidth -
      horizontalPadding;
    let left = Math.max(
      scrollElement.scrollLeft + horizontalPadding,
      Math.min(anchorLeft, maxLeft),
    );

    const preferredTop = anchorBottom + verticalGap;
    const preferredBottom = anchorTop - popupHeight - verticalGap;
    let top = preferredTop;
    const visibleBottom =
      preferredTop - scrollElement.scrollTop + popupHeight + verticalPadding;
    if (
      visibleBottom > container.clientHeight &&
      preferredBottom >= scrollElement.scrollTop + verticalPadding
    ) {
      top = preferredBottom;
    }

    left = Math.max(horizontalPadding, left);
    top = Math.max(scrollElement.scrollTop + verticalPadding, top);

    this.popup.style.left = `${left}px`;
    this.popup.style.top = `${top}px`;
  }

  private closeTooltip(): void {
    this.cancelHoverTimer();
    this.abortActiveRequest();
    this.currentState = null;
    this.isHoveringPopup = false;

    if (this.popup) {
      this.popup.style.display = 'none';
      this.popup.setAttribute('aria-hidden', 'true');
      this.popup.classList.remove(
        HoverTooltipAndCodeActionsExtension.css.popupVisible,
      );
    }

    if (this.headerElement) {
      this.headerElement.textContent = '';
    }
    if (this.contentElement) {
      this.contentElement.innerHTML = '';
    }
    if (this.actionsElement) {
      this.actionsElement.innerHTML = '';
    }

    this.isVisible = false;
  }

  private createPopup(): void {
    const container = this.getPopupContainer();
    if (!container) {
      return;
    }

    this.popup?.remove();

    const popup = document.createElement('div');
    popup.className = HoverTooltipAndCodeActionsExtension.css.popup;
    popup.style.display = 'none';
    popup.setAttribute('aria-hidden', 'true');
    popup.setAttribute('role', 'dialog');

    const header = document.createElement('div');
    header.className = HoverTooltipAndCodeActionsExtension.css.header;

    const content = document.createElement('div');
    const actions = document.createElement('div');

    popup.appendChild(header);
    popup.appendChild(content);
    popup.appendChild(actions);

    popup.addEventListener('mouseenter', () => {
      this.isHoveringPopup = true;
      this.cancelHoverTimer();
    });
    popup.addEventListener('mouseleave', (event) => {
      this.isHoveringPopup = false;
      const relatedTarget = event.relatedTarget as Node | null;
      if (
        this.currentState?.trigger === 'hover' &&
        (!relatedTarget ||
          !this.editor?.getView().getContentElement().contains(relatedTarget))
      ) {
        this.closeTooltip();
      }
    });

    container.appendChild(popup);

    this.popup = popup;
    this.headerElement = header;
    this.contentElement = content;
    this.actionsElement = actions;
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

  private getManualAnchorRange(position: Position): Range {
    const selection = this.editor?.getSelection();
    if (selection && this.isPositionWithinRange(position, selection)) {
      return selection;
    }

    return {
      start: position,
      end: position,
    };
  }

  private getDiagnosticsAtPosition(position: Position): EditorDiagnostic[] {
    return this.config
      .diagnostics()
      .filter((diagnostic) => this.isPositionWithinRange(position, diagnostic.range));
  }

  private buildSnapshot(): LanguageServiceDocumentSnapshot {
    const editor = this.editor;
    if (!editor) {
      throw new Error(
        'HoverTooltipAndCodeActionsExtension requires an editor instance.',
      );
    }

    return {
      editor: editor as any,
      languageId: this.config.languageId,
      version: this.documentVersion,
      text: editor.getValue(),
      cursor: editor.getCursor(),
      selection: editor.getSelection(),
    };
  }

  private getLineText(text: string, line: number): string {
    const lines = text.split('\n');
    const safeLine = Math.max(0, Math.min(line, Math.max(0, lines.length - 1)));
    return lines[safeLine] || '';
  }

  private isPositionWithinRange(position: Position, range: Range): boolean {
    return (
      this.comparePositions(position, range.start) >= 0 &&
      this.comparePositions(position, range.end) <= 0
    );
  }

  private comparePositions(a: Position, b: Position): number {
    if (a.line !== b.line) {
      return a.line - b.line;
    }

    return a.column - b.column;
  }

  private arePositionsEqual(a: Position, b: Position): boolean {
    return a.line === b.line && a.column === b.column;
  }

  private cancelHoverTimer(): void {
    if (this.hoverTimer) {
      window.clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
  }

  private abortActiveRequest(): void {
    if (this.activeAbortController) {
      this.activeAbortController.abort();
      this.activeAbortController = null;
    }
  }

  private isManualTriggerEvent(event: KeyboardEvent): boolean {
    return event.key === '.' && (event.ctrlKey || event.metaKey) && !event.shiftKey;
  }

  destroy(): void {
    this.closeTooltip();

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

    const contentElement = this.editor?.getView().getContentElement();
    if (contentElement && this.mouseMoveHandler) {
      contentElement.removeEventListener('mousemove', this.mouseMoveHandler);
    }
    if (contentElement && this.mouseLeaveHandler) {
      contentElement.removeEventListener('mouseleave', this.mouseLeaveHandler);
    }

    if (this.documentMouseDownHandler) {
      document.removeEventListener(
        'mousedown',
        this.documentMouseDownHandler,
        true,
      );
    }

    this.popup?.remove();
    this.popup = null;
    this.headerElement = null;
    this.contentElement = null;
    this.actionsElement = null;
    this.editor = null;
    this.lastHoverPosition = null;
  }
}
