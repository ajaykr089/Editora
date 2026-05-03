/**
 * Lightweight Code Editor - View/Renderer
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import { GutterDecoration, LineDecoration, Position, Range } from './types';

export class View {
  private container: HTMLElement;
  private editorContainer!: HTMLElement;
  private scrollWrapper!: HTMLElement;
  private contentSurface!: HTMLElement;
  private contentElement!: HTMLElement;
  private highlightElement!: HTMLElement;
  private lineNumbersElement!: HTMLElement;
  private lineNumbersContentElement!: HTMLElement;
  private gutterDecorationsElement!: HTMLElement;
  private lineDecorationsElement!: HTMLElement;
  private gutterWidth = 50;
  private lineHeight = 21;
  private _rafId?: number;
  private readonly trailingNewlineMarkerAttr = 'data-lce-trailing-newline-marker';
  private readonly foldPlaceholderAttr = 'data-lce-fold-placeholder';
  private readonly virtualMarkerRegex = /[\u200B\uE000]/;
  private readonly virtualMarkerGlobalRegex = /[\u200B\uE000]/g;
  private lastLineCount = 0;
  private lastHighlightHTML = '';
  private highlightOverlayActive = false;
  private lastLineDecorationSnapshot = '';
  private lastGutterDecorationSnapshot = '';

  constructor(container: HTMLElement) {
    this.container = container;
    this.createDOM();
  }

  private createDOM(): void {
    // Clear container
    this.container.innerHTML = '';

    // Create main editor container
    const editorContainer = document.createElement('div');
    this.editorContainer = editorContainer;
    editorContainer.setAttribute('data-lce-editor-container', 'true');
    editorContainer.style.cssText = `
      position: relative;
      display: flex;
      width: 100%;
      height: 100%;
      background: var(--editor-background, #1e1e1e);
      color: var(--editor-foreground, #f8f9fa);
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 14px;
      line-height: ${this.lineHeight}px;
      /* vertical scrolling is shared; horizontal scrolling belongs to the code pane */
      overflow-x: hidden;
      overflow-y: auto;
    `;

    // Create gutter (line numbers)
    this.lineNumbersElement = document.createElement('div');
    this.lineNumbersElement.setAttribute('data-editor-gutter', 'true');
    this.lineNumbersElement.style.cssText = `
      display: table-cell;
      vertical-align: top;
      position: sticky;
      left: 0;
      width: ${this.gutterWidth}px;
      background: var(--editor-gutter-background, #252526);
      color: var(--editor-gutter-foreground, #858585);
      padding: 0 8px 0 0;
      text-align: right;
      border-right: 1px solid var(--editor-gutter-border, #3e3e42);
      background-clip: padding-box;
      user-select: none;
      overflow: hidden;
      z-index: 3;
    `;

    this.lineNumbersContentElement = document.createElement('div');
    this.lineNumbersContentElement.setAttribute('data-editor-gutter-content', 'true');
    this.lineNumbersContentElement.style.cssText = `
      position: relative;
      z-index: 1;
    `;

    this.gutterDecorationsElement = document.createElement('div');
    this.gutterDecorationsElement.setAttribute('data-editor-gutter-decorations', 'true');
    this.gutterDecorationsElement.setAttribute('aria-hidden', 'true');
    this.gutterDecorationsElement.style.cssText = `
      position: absolute;
      inset: 0;
      z-index: 2;
      pointer-events: none;
    `;

    // Create content surface so highlight overlay can paint without replacing
    // the editable DOM. Both layers share the same scroll container.
    const contentSurface = document.createElement('div');
    this.contentSurface = contentSurface;
    contentSurface.setAttribute('data-editor-content-surface', 'true');
    contentSurface.style.cssText = `
      display: table-cell;
      vertical-align: top;
      position: relative;
      width: 100%;
      min-height: 400px;
    `;

    this.highlightElement = document.createElement('div');
    this.highlightElement.setAttribute('data-editor-highlight', 'true');
    this.highlightElement.setAttribute('aria-hidden', 'true');
    this.highlightElement.style.cssText = `
      position: absolute;
      inset: 0;
      padding: 0 12px;
      white-space: pre;
      overflow: hidden;
      min-height: 400px;
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
      pointer-events: none;
      user-select: none;
      background: transparent;
      visibility: hidden;
    `;

    this.lineDecorationsElement = document.createElement('div');
    this.lineDecorationsElement.setAttribute('data-editor-line-decorations', 'true');
    this.lineDecorationsElement.setAttribute('aria-hidden', 'true');
    this.lineDecorationsElement.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
    `;

    // Create content area
    this.contentElement = document.createElement('div');
    this.contentElement.style.cssText = `
      position: relative;
      z-index: 1;
      padding: 0 12px;
      background: transparent;
      border: none;
      outline: none;
      white-space: pre;
      overflow-x: auto;
      overflow-y: visible;
      width: 100%;
      min-height: 400px;
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
      color: inherit;
      caret-color: var(--editor-foreground, #f8f9fa);
      tab-size: 2;
      -moz-tab-size: 2;
    `;
    this.contentElement.contentEditable = 'true';
    this.contentElement.spellcheck = false;
    this.contentElement.tabIndex = 0;

    // Assemble: create a single scroll wrapper so gutter and content
    // share the same scroller and remain aligned when scrolling.
    const scrollWrapper = document.createElement('div');
    this.scrollWrapper = scrollWrapper;
    scrollWrapper.setAttribute('data-editora-editor', 'true');
    // Use a table-like layout so gutter and content are table-cells
    // inside the same scrollable container (`editorContainer`) and
    // therefore always scroll together naturally.
    scrollWrapper.style.cssText = `
      position: relative;
      display: table;
      table-layout: fixed;
      width: 100%;
      height: 100%;
    `;

    // Put both into the same scroll surface by appending to the editor container
    this.lineNumbersElement.appendChild(this.lineNumbersContentElement);
    this.lineNumbersElement.appendChild(this.gutterDecorationsElement);
    scrollWrapper.appendChild(this.lineNumbersElement);
    contentSurface.appendChild(this.lineDecorationsElement);
    contentSurface.appendChild(this.highlightElement);
    contentSurface.appendChild(this.contentElement);
    scrollWrapper.appendChild(contentSurface);
    editorContainer.appendChild(scrollWrapper);
    this.container.appendChild(editorContainer);

    // Make the outer editor container the single scrollable element so
    // the gutter and content scroll together naturally. No transform
    // syncing or RAF loop is necessary.
    this.updateLineNumbers(1);
  }

  // Update line numbers
  updateLineNumbers(lineCount: number): void {
    if (lineCount === this.lastLineCount) {
      return;
    }
    this.lastLineCount = lineCount;
    const maxLines = Math.max(lineCount, 1);
    const lineNumbers = Array.from({ length: maxLines }, (_, i) => i + 1);
    this.lineNumbersContentElement.innerHTML = lineNumbers
      .map(num => `<div style="height: ${this.lineHeight}px; line-height: ${this.lineHeight}px; padding-right: 12px;">${num}</div>`)
      .join('');
  }

  setDecorations(
    lineDecorations: LineDecoration[],
    gutterDecorations: GutterDecoration[],
  ): void {
    this.renderLineDecorations(lineDecorations);
    this.renderGutterDecorations(gutterDecorations);
  }

  clearDecorations(): void {
    if (this.lastLineDecorationSnapshot) {
      this.lineDecorationsElement.innerHTML = '';
      this.lastLineDecorationSnapshot = '';
    }
    if (this.lastGutterDecorationSnapshot) {
      this.gutterDecorationsElement.innerHTML = '';
      this.lastGutterDecorationSnapshot = '';
    }
  }

  // Get content element
  getContentElement(): HTMLElement {
    return this.contentElement;
  }

  // Get line numbers element
  getLineNumbersElement(): HTMLElement {
    return this.lineNumbersElement;
  }

  // Get text content
  getText(): string {
    return this.serializeContentToSource();
  }

  // Set text content
  setText(text: string): void {
    this.clearHighlightOverlay();
    this.setFoldPlaceholderSources(new Map());
    if (this.contentElement.textContent !== text) {
      this.contentElement.textContent = text;
    }
    this.syncTrailingNewlineMarker(text.endsWith('\n'));
    const lines = text.split('\n').length;
    this.updateLineNumbers(lines);
  }

  // Set inner HTML (used for syntax highlighted content)
  setHTML(html: string): void {
    this.clearHighlightOverlay();
    this.setFoldPlaceholderSources(new Map());
    const hasTrailingNewline = /\n$/.test(html);

    // Decide how to render the provided HTML-like string safely:
    // - Highlighting output contains escaped tag entities (e.g. &lt;div&gt;)
    //   and also uses <span> wrappers for colored tokens. For this case we
    //   should set `innerHTML` so the spans render while entities remain
    //   escaped text (showing the source tags visibly).
    // - If the string contains raw tags (e.g. `<mark ...>`) and does NOT
    //   contain escaped entities, treat it as literal text to avoid
    //   inserting arbitrary DOM elements.
    const hasEntities = /&lt;|&gt;/.test(html);
    const hasSpanWrapper = /<span\b/i.test(html);
    const hasRawTags = /<[^>]+>/.test(html);

    if (hasEntities && hasSpanWrapper) {
      // This is likely highlighted source produced by the extension.
      this.contentElement.innerHTML = html;
    } else if (hasRawTags && !hasEntities) {
      // Raw user-supplied HTML — render as text to avoid DOM injection.
      this.contentElement.textContent = html;
    } else {
      // Default: allow innerHTML so simple markup or escaped entities render.
      this.contentElement.innerHTML = html;
    }
    this.syncTrailingNewlineMarker(hasTrailingNewline);

    const text = this.contentElement.textContent || '';
    const lines = text.split('\n').length;
    this.updateLineNumbers(lines);
  }

  setHighlightHTML(html: string): void {
    if (html !== this.lastHighlightHTML) {
      this.highlightElement.innerHTML = html;
      this.lastHighlightHTML = html;
    }
    this.highlightElement.style.visibility = 'visible';
    this.highlightOverlayActive = true;
    this.contentElement.style.color = 'transparent';
    (this.contentElement.style as CSSStyleDeclaration & { WebkitTextFillColor?: string }).WebkitTextFillColor = 'transparent';

    const text = this.contentElement.textContent || '';
    const lines = text.split('\n').length;
    this.updateLineNumbers(lines);
  }

  setLineWrapping(enabled: boolean): void {
    this.contentElement.style.whiteSpace = enabled ? 'pre-wrap' : 'pre';
    this.contentElement.style.overflowX = enabled ? 'hidden' : 'auto';
    this.contentElement.style.overflowY = 'visible';
    this.contentElement.style.wordBreak = 'normal';
    this.contentElement.style.overflowWrap = enabled ? 'anywhere' : 'normal';
    this.highlightElement.style.whiteSpace = enabled ? 'pre-wrap' : 'pre';
    this.highlightElement.style.wordBreak = 'normal';
    this.highlightElement.style.overflowWrap = enabled ? 'anywhere' : 'normal';
  }

  setLineNumbersVisible(visible: boolean): void {
    this.lineNumbersElement.style.display = visible ? 'table-cell' : 'none';
    this.lineNumbersElement.style.width = visible ? `${this.gutterWidth}px` : '0';
    this.lineNumbersElement.style.paddingRight = visible ? '8px' : '0';
    this.lineNumbersElement.style.borderRightWidth = visible ? '1px' : '0';
    this.scrollWrapper.style.width = visible ? '100%' : 'auto';
  }

  setTabSize(tabSize: number): void {
    const safeTabSize = Math.max(1, Math.floor(tabSize) || 2);
    this.contentElement.style.tabSize = String(safeTabSize);
    (this.contentElement.style as CSSStyleDeclaration & { MozTabSize?: string }).MozTabSize = String(safeTabSize);
    this.highlightElement.style.tabSize = String(safeTabSize);
    (this.highlightElement.style as CSSStyleDeclaration & { MozTabSize?: string }).MozTabSize = String(safeTabSize);
  }

  // Keep trailing-newline caret marker in sync for live contenteditable edits
  // (without forcing a full setText/setHTML render).
  syncTrailingNewlineMarkerForText(text: string): void {
    this.syncTrailingNewlineMarker(text.endsWith('\n'));
  }

  // Get cursor position from DOM selection
  getCursorPosition(): Position {
    return this.getSelectionState().cursor ?? { line: 0, column: 0 };
  }

  // Set cursor position
  setCursorPosition(position: Position): void {
    const text = this.getText();
    const offset = this.positionToTextOffset(position, text);
    const selection = window.getSelection();
    const range = this.createDomRangeFromOffsets(offset);

    if (range) {
      try {
        selection?.removeAllRanges();
        selection?.addRange(range);
        this.ensureCaretVisible();
      } catch (e) {
        // Fallback for edge cases
        console.warn('Could not set cursor position:', e);
      }
    } else {
      // Fallback to end-of-content when the requested offset maps to trailing
      // visual newline space (e.g., final empty line).
      const marker = this.contentElement.querySelector(
        `[${this.trailingNewlineMarkerAttr}]`
      );
      const fallbackRange = document.createRange();
      try {
        if (marker && marker.parentNode === this.contentElement) {
          fallbackRange.setStartBefore(marker);
        } else {
          fallbackRange.selectNodeContents(this.contentElement);
          fallbackRange.collapse(false);
        }
        fallbackRange.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(fallbackRange);
        this.ensureCaretVisible();
      } catch (e) {
        console.warn('Could not set fallback cursor position:', e);
      }
    }
  }

  // Get selection range
  getSelectionRange(): Range | undefined {
    return this.getSelectionState().range;
  }

  getSelectionOffsets(): {
    isInEditor: boolean;
    isCollapsed: boolean;
    startOffset: number;
    endOffset: number;
    anchorOffset?: number;
    focusOffset?: number;
  } {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return {
        isInEditor: false,
        isCollapsed: true,
        startOffset: 0,
        endOffset: 0,
      };
    }

    const domRange = selection.getRangeAt(0);
    if (
      !this.isNodeInsideContent(domRange.startContainer) ||
      !this.isNodeInsideContent(domRange.endContainer)
    ) {
      return {
        isInEditor: false,
        isCollapsed: selection.isCollapsed,
        startOffset: 0,
        endOffset: 0,
      };
    }

    const anchorOffset =
      selection.anchorNode && this.isNodeInsideContent(selection.anchorNode)
        ? this.sourceOffsetFromBoundary(
          selection.anchorNode,
          selection.anchorOffset,
        )
        : undefined;
    const focusOffset =
      selection.focusNode && this.isNodeInsideContent(selection.focusNode)
        ? this.sourceOffsetFromBoundary(
          selection.focusNode,
          selection.focusOffset,
        )
        : undefined;

    return {
      isInEditor: true,
      isCollapsed: selection.isCollapsed,
      startOffset: this.sourceOffsetFromBoundary(
        domRange.startContainer,
        domRange.startOffset,
      ),
      endOffset: this.sourceOffsetFromBoundary(
        domRange.endContainer,
        domRange.endOffset,
      ),
      anchorOffset,
      focusOffset,
    };
  }

  getSelectionState(): {
    isInEditor: boolean;
    isCollapsed: boolean;
    cursor?: Position;
    range?: Range;
  } {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return {
        isInEditor: false,
        isCollapsed: true,
      };
    }

    const domRange = selection.getRangeAt(0);
    if (
      !this.isNodeInsideContent(domRange.startContainer) ||
      !this.isNodeInsideContent(domRange.endContainer)
    ) {
      return {
        isInEditor: false,
        isCollapsed: selection.isCollapsed,
      };
    }

    const text = this.getText();
    const startOffset = this.sourceOffsetFromBoundary(domRange.startContainer, domRange.startOffset);
    const endOffset = this.sourceOffsetFromBoundary(domRange.endContainer, domRange.endOffset);
    const focusOffset =
      selection.focusNode && this.isNodeInsideContent(selection.focusNode)
        ? this.sourceOffsetFromBoundary(
          selection.focusNode,
          selection.focusOffset,
        )
        : endOffset;
    const start = this.offsetToPositionInText(startOffset, text);
    const end = this.offsetToPositionInText(endOffset, text);
    const cursor = this.offsetToPositionInText(focusOffset, text);

    return {
      isInEditor: true,
      isCollapsed: selection.isCollapsed,
      cursor,
      range: selection.isCollapsed ? undefined : { start, end },
    };
  }

  // Set selection range
  setSelectionRange(range: Range): void {
    const domRange = this.createDomRangeFromRange(range);
    if (!domRange) return;

    try {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(domRange);
      this.ensureCaretVisible();
    } catch (error) {
      console.warn('Could not set selection range:', error);
    }
  }

  createDomRangeFromOffsets(
    startOffset: number,
    endOffset: number = startOffset,
  ): globalThis.Range | null {
    const [fromOffset, toOffset] =
      startOffset <= endOffset
        ? [startOffset, endOffset]
        : [endOffset, startOffset];

    const fromPoint = this.resolveOffsetToDomPoint(fromOffset);
    const toPoint = this.resolveOffsetToDomPoint(toOffset);
    if (!fromPoint || !toPoint) {
      return null;
    }

    const domRange = document.createRange();
    try {
      domRange.setStart(fromPoint.node, fromPoint.offset);
      domRange.setEnd(toPoint.node, toPoint.offset);
      return domRange;
    } catch {
      return null;
    }
  }

  createDomRangeFromRange(range: Range): globalThis.Range | null {
    const text = this.getText();
    return this.createDomRangeFromOffsets(
      this.positionToTextOffset(range.start, text),
      this.positionToTextOffset(range.end, text),
    );
  }

  getPositionFromClientPoint(clientX: number, clientY: number): Position | null {
    const domRange = this.getDomRangeFromClientPoint(clientX, clientY);
    if (!domRange || !this.isNodeInsideContent(domRange.startContainer)) {
      return null;
    }

    const offset = this.sourceOffsetFromBoundary(
      domRange.startContainer,
      domRange.startOffset,
    );
    return this.offsetToPositionInText(offset, this.getText());
  }

  setSelectionOffsets(startOffset: number, endOffset: number = startOffset): void {
    const domRange = this.createDomRangeFromOffsets(startOffset, endOffset);
    if (!domRange) return;

    try {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(domRange);
      this.ensureCaretVisible();
    } catch (error) {
      console.warn('Could not set selection offsets:', error);
    }
  }

  setSelectionBoundaryOffsets(anchorOffset: number, focusOffset: number): void {
    const anchorPoint = this.resolveOffsetToDomPoint(anchorOffset);
    const focusPoint = this.resolveOffsetToDomPoint(focusOffset);
    const selection = window.getSelection();

    if (!anchorPoint || !focusPoint || !selection) {
      this.setSelectionOffsets(anchorOffset, focusOffset);
      return;
    }

    try {
      selection.removeAllRanges();

      if (anchorOffset === focusOffset) {
        const collapsedRange = document.createRange();
        collapsedRange.setStart(anchorPoint.node, anchorPoint.offset);
        collapsedRange.collapse(true);
        selection.addRange(collapsedRange);
        this.ensureCaretVisible();
        return;
      }

      if (typeof selection.extend === 'function') {
        const collapsedRange = document.createRange();
        collapsedRange.setStart(anchorPoint.node, anchorPoint.offset);
        collapsedRange.collapse(true);
        selection.addRange(collapsedRange);
        selection.extend(focusPoint.node, focusPoint.offset);
        this.ensureCaretVisible();
        return;
      }

      const domRange = this.createDomRangeFromOffsets(anchorOffset, focusOffset);
      if (!domRange) {
        return;
      }
      selection.addRange(domRange);
      this.ensureCaretVisible();
    } catch (error) {
      console.warn('Could not set selection boundary offsets:', error);
      this.setSelectionOffsets(anchorOffset, focusOffset);
    }
  }

  // Focus the editor
  focus(): void {
    this.contentElement.focus();
    this.ensureCaretVisible();
  }

  // Blur the editor
  blur(): void {
    this.contentElement.blur();
  }

  // Set read-only mode
  setReadOnly(readOnly: boolean): void {
    this.contentElement.contentEditable = readOnly ? 'false' : 'true';
  }

  // Apply theme
  applyTheme(theme: Record<string, string>): void {
    Object.entries(theme).forEach(([key, value]) => {
      this.container.style.setProperty(`--${key}`, value);
    });
  }

  // Scroll to position
  scrollToPosition(position: Position): void {
    const lineElement = this.lineNumbersElement.children[position.line] as HTMLElement;
    if (lineElement) {
      lineElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  // Get scroll position
  getScrollTop(): number {
    // The editor container is the scroll container for vertical scroll
    return this.editorContainer.scrollTop;
  }

  // Get primary scroll element
  getScrollElement(): HTMLElement {
    return this.editorContainer;
  }

  // Set scroll position
  setScrollTop(scrollTop: number): void {
    this.editorContainer.scrollTop = scrollTop;
  }

  private syncTrailingNewlineMarker(shouldShow: boolean): void {
    this.contentElement
      .querySelectorAll(`[${this.trailingNewlineMarkerAttr}]`)
      .forEach((node) => node.remove());

    if (!shouldShow) return;

    const marker = document.createElement('span');
    marker.setAttribute(this.trailingNewlineMarkerAttr, 'true');
    marker.setAttribute('aria-hidden', 'true');
    marker.contentEditable = 'false';
    marker.style.cssText = `
      display: inline-block;
      width: 0;
      overflow: hidden;
      pointer-events: none;
      user-select: none;
    `;
    marker.appendChild(document.createTextNode('\u200B'));
    this.contentElement.appendChild(marker);
  }

  // Ensure caret is visible inside the editor scroll container
  ensureCaretVisible(): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const caretRect = this.getCaretClientRect(selection);
    if (!caretRect) return;

    const containerRect = this.editorContainer.getBoundingClientRect();
    const padding = 12;

    if (caretRect.bottom > containerRect.bottom - padding) {
      this.editorContainer.scrollTop += caretRect.bottom - (containerRect.bottom - padding);
    } else if (caretRect.top < containerRect.top + padding) {
      this.editorContainer.scrollTop -= (containerRect.top + padding) - caretRect.top;
    }
  }

  // Destroy the view
  destroy(): void {
    this.clearDecorations();
    if (this.container) {
      this.container.innerHTML = '';
    }
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = undefined;
    }
  }

  private resolveOffsetToDomPoint(offset: number): { node: Node; offset: number } | null {
    const boundedOffset = Math.max(0, offset);
    let currentOffset = 0;
    const children = Array.from(this.contentElement.childNodes);

    for (let i = 0; i < children.length; i++) {
      const child = children[i];

      if (child instanceof Text) {
        const text = child.textContent || '';
        const visibleToDom = this.buildVisibleToDomMap(text);
        const visibleLen = Math.max(0, visibleToDom.length - 1);
        if (currentOffset + visibleLen >= boundedOffset) {
          const localVisibleOffset = Math.max(0, boundedOffset - currentOffset);
          const domOffset = visibleToDom[localVisibleOffset] ?? text.length;
          return { node: child, offset: domOffset };
        }
        currentOffset += visibleLen;
        continue;
      }

      if (!(child instanceof HTMLElement)) {
        continue;
      }

      if (child.hasAttribute(this.trailingNewlineMarkerAttr)) {
        continue;
      }

      if (child.hasAttribute(this.foldPlaceholderAttr)) {
        const hiddenText = this.getFoldPlaceholderSource(child);
        const hiddenLength = hiddenText.length;
        if (currentOffset + hiddenLength >= boundedOffset) {
          const localOffset = boundedOffset - currentOffset;
          return {
            node: this.contentElement,
            offset: localOffset <= hiddenLength / 2 ? i : i + 1,
          };
        }
        currentOffset += hiddenLength;
      }
    }

    return {
      node: this.contentElement,
      offset: this.contentElement.childNodes.length,
    };
  }

  private getDomRangeFromClientPoint(
    clientX: number,
    clientY: number,
  ): globalThis.Range | null {
    const documentWithCaretPosition = document as Document & {
      caretPositionFromPoint?: (
        x: number,
        y: number,
      ) => {
        offsetNode: Node | null;
        offset: number;
      } | null;
      caretRangeFromPoint?: (
        x: number,
        y: number,
      ) => globalThis.Range | null;
    };

    if (typeof documentWithCaretPosition.caretPositionFromPoint === 'function') {
      const caretPosition = documentWithCaretPosition.caretPositionFromPoint(
        clientX,
        clientY,
      );
      if (caretPosition?.offsetNode) {
        const range = document.createRange();
        try {
          range.setStart(caretPosition.offsetNode, caretPosition.offset);
          range.collapse(true);
          return range;
        } catch {
          return null;
        }
      }
    }

    if (typeof documentWithCaretPosition.caretRangeFromPoint === 'function') {
      return documentWithCaretPosition.caretRangeFromPoint(clientX, clientY);
    }

    return null;
  }

  private buildVisibleToDomMap(text: string): number[] {
    const map: number[] = [0];
    let visibleCount = 0;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (this.virtualMarkerRegex.test(ch)) {
        continue;
      }
      visibleCount += 1;
      map[visibleCount] = i + 1;
    }
    return map;
  }

  private isNodeInsideContent(node: Node): boolean {
    return node === this.contentElement || this.contentElement.contains(node);
  }

  private getCaretClientRect(selection: Selection): DOMRect | null {
    const currentRange = selection.getRangeAt(0).cloneRange();
    currentRange.collapse(false);

    const directRect = this.getUsableRangeRect(currentRange);
    if (directRect) {
      return directRect;
    }

    const focusNode = selection.focusNode;
    const focusOffset = selection.focusOffset;
    if (focusNode instanceof Text) {
      const textLength = focusNode.textContent?.length ?? 0;
      const probeRange = document.createRange();

      if (focusOffset < textLength) {
        probeRange.setStart(focusNode, focusOffset);
        probeRange.setEnd(focusNode, Math.min(textLength, focusOffset + 1));
        const nextCharRect = this.getUsableRangeRect(probeRange);
        if (nextCharRect) {
          return nextCharRect;
        }
      }

      if (focusOffset > 0) {
        probeRange.setStart(focusNode, focusOffset - 1);
        probeRange.setEnd(focusNode, focusOffset);
        const previousCharRect = this.getUsableRangeRect(probeRange);
        if (previousCharRect) {
          return previousCharRect;
        }
      }
    }

    const fallbackElement =
      focusNode instanceof Element
        ? focusNode
        : focusNode?.parentElement ?? null;
    if (
      fallbackElement &&
      fallbackElement !== this.contentElement &&
      fallbackElement !== this.editorContainer &&
      this.contentElement.contains(fallbackElement)
    ) {
      const rect = fallbackElement.getBoundingClientRect();
      if (this.isUsableRect(rect)) {
        return rect;
      }
    }

    return null;
  }

  private getUsableRangeRect(range: globalThis.Range): DOMRect | null {
    const clientRects = Array.from(range.getClientRects());
    for (let i = 0; i < clientRects.length; i++) {
      if (this.isUsableRect(clientRects[i])) {
        return clientRects[i];
      }
    }

    const boundingRect = range.getBoundingClientRect();
    return this.isUsableRect(boundingRect) ? boundingRect : null;
  }

  private isUsableRect(rect: DOMRect | null | undefined): rect is DOMRect {
    return !!rect && Number.isFinite(rect.top) && Number.isFinite(rect.bottom) &&
      (rect.width > 0 || rect.height > 0);
  }

  private stripVirtualMarkers(value: string): string {
    return value.replace(this.virtualMarkerGlobalRegex, '');
  }

  private clearHighlightOverlay(): void {
    if (!this.highlightOverlayActive && !this.lastHighlightHTML) {
      return;
    }

    this.highlightElement.innerHTML = '';
    this.highlightElement.style.visibility = 'hidden';
    this.lastHighlightHTML = '';
    this.highlightOverlayActive = false;
    this.contentElement.style.color = 'inherit';
    (this.contentElement.style as CSSStyleDeclaration & { WebkitTextFillColor?: string }).WebkitTextFillColor = 'currentcolor';
  }

  private serializeContentToSource(): string {
    let output = '';
    const children = Array.from(this.contentElement.childNodes);

    for (const child of children) {
      if (child instanceof Text) {
        output += this.stripVirtualMarkers(child.textContent || '');
        continue;
      }

      if (!(child instanceof HTMLElement)) {
        continue;
      }

      if (child.hasAttribute(this.trailingNewlineMarkerAttr)) {
        continue;
      }

      if (child.hasAttribute(this.foldPlaceholderAttr)) {
        output += this.getFoldPlaceholderSource(child);
        continue;
      }

      output += this.stripVirtualMarkers(child.textContent || '');
    }

    return output;
  }

  private sourceOffsetFromBoundary(container: Node, offset: number): number {
    let total = 0;
    const children = Array.from(this.contentElement.childNodes);

    if (container === this.contentElement) {
      for (let i = 0; i < Math.min(offset, children.length); i++) {
        total += this.getSourceLength(children[i]);
      }
      return total;
    }

    for (let i = 0; i < children.length; i++) {
      const child = children[i];

      if (child === container) {
        if (child instanceof Text) {
          return total + this.stripVirtualMarkers((child.textContent || '').slice(0, offset)).length;
        }

        if (child instanceof HTMLElement) {
          if (child.hasAttribute(this.foldPlaceholderAttr)) {
            return total + this.getFoldPlaceholderBoundaryOffset(
              child,
              child,
              offset,
            );
          }

          const innerChildren = Array.from(child.childNodes);
          for (let j = 0; j < Math.min(offset, innerChildren.length); j++) {
            total += this.getSourceLength(innerChildren[j]);
          }
          return total;
        }
      }

      if (child instanceof HTMLElement && child.contains(container)) {
        if (child.hasAttribute(this.foldPlaceholderAttr)) {
          return total + this.getFoldPlaceholderBoundaryOffset(
            child,
            container,
            offset,
          );
        }
        return total + this.sourceOffsetWithinNode(child, container, offset);
      }

      total += this.getSourceLength(child);
    }

    return total;
  }

  private sourceOffsetWithinNode(root: Node, container: Node, offset: number): number {
    let total = 0;
    const children = Array.from(root.childNodes);

    if (container === root) {
      for (let i = 0; i < Math.min(offset, children.length); i++) {
        total += this.getSourceLength(children[i]);
      }
      return total;
    }

    for (let i = 0; i < children.length; i++) {
      const child = children[i];

      if (child === container) {
        if (child instanceof Text) {
          return total + this.stripVirtualMarkers((child.textContent || '').slice(0, offset)).length;
        }

        if (child instanceof HTMLElement) {
          if (child.hasAttribute(this.foldPlaceholderAttr)) {
            return total + this.getFoldPlaceholderBoundaryOffset(
              child,
              child,
              offset,
            );
          }

          const innerChildren = Array.from(child.childNodes);
          for (let j = 0; j < Math.min(offset, innerChildren.length); j++) {
            total += this.getSourceLength(innerChildren[j]);
          }
          return total;
        }
      }

      if (child instanceof HTMLElement && child.contains(container)) {
        if (child.hasAttribute(this.foldPlaceholderAttr)) {
          return total + this.getFoldPlaceholderBoundaryOffset(
            child,
            container,
            offset,
          );
        }
        return total + this.sourceOffsetWithinNode(child, container, offset);
      }

      total += this.getSourceLength(child);
    }

    return total;
  }

  private getSourceLength(node: Node): number {
    if (node instanceof Text) {
      return this.stripVirtualMarkers(node.textContent || '').length;
    }

    if (!(node instanceof HTMLElement)) {
      return 0;
    }

    if (node.hasAttribute(this.trailingNewlineMarkerAttr)) {
      return 0;
    }

    if (node.hasAttribute(this.foldPlaceholderAttr)) {
      return this.getFoldPlaceholderSource(node).length;
    }

    let total = 0;
    node.childNodes.forEach((child) => {
      total += this.getSourceLength(child);
    });
    return total;
  }

  private renderLineDecorations(lineDecorations: LineDecoration[]): void {
    const normalized = [...lineDecorations]
      .filter((decoration) => Number.isFinite(decoration.line) && decoration.line >= 0)
      .sort((a, b) => a.line - b.line || a.id.localeCompare(b.id));
    const snapshot = normalized
      .map((decoration) =>
        `${decoration.id}:${decoration.line}:${decoration.className || ''}:${this.serializeStyleObject(decoration.style)}`,
      )
      .join('|');
    if (snapshot === this.lastLineDecorationSnapshot) {
      return;
    }

    this.lineDecorationsElement.innerHTML = '';
    this.lastLineDecorationSnapshot = snapshot;
    if (normalized.length === 0) {
      return;
    }

    const fragment = document.createDocumentFragment();
    for (const decoration of normalized) {
      const element = document.createElement('div');
      element.className = this.joinClassNames(
        'lce-decoration lce-decoration-line',
        decoration.className,
      );
      element.setAttribute('data-decoration-id', decoration.id);
      element.setAttribute('data-decoration-line', String(decoration.line));
      element.style.cssText = this.joinStyleFragments([
        'position: absolute',
        `top: ${decoration.line * this.lineHeight}px`,
        `height: ${this.lineHeight}px`,
        'left: 12px',
        'right: 12px',
        'border-radius: 3px',
        this.serializeStyleObject(decoration.style),
      ]);
      fragment.appendChild(element);
    }

    this.lineDecorationsElement.appendChild(fragment);
  }

  private renderGutterDecorations(gutterDecorations: GutterDecoration[]): void {
    const normalized = [...gutterDecorations]
      .filter((decoration) => Number.isFinite(decoration.line) && decoration.line >= 0)
      .sort((a, b) => a.line - b.line || a.id.localeCompare(b.id));
    const snapshot = normalized
      .map((decoration) =>
        `${decoration.id}:${decoration.line}:${decoration.label || ''}:${decoration.title || ''}:${decoration.className || ''}:${this.serializeStyleObject(decoration.style)}`,
      )
      .join('|');
    if (snapshot === this.lastGutterDecorationSnapshot) {
      return;
    }

    this.gutterDecorationsElement.innerHTML = '';
    this.lastGutterDecorationSnapshot = snapshot;
    if (normalized.length === 0) {
      return;
    }

    const fragment = document.createDocumentFragment();
    for (const decoration of normalized) {
      const element = document.createElement('div');
      element.className = this.joinClassNames(
        'lce-decoration lce-decoration-gutter',
        decoration.className,
      );
      element.setAttribute('data-decoration-id', decoration.id);
      element.setAttribute('data-decoration-line', String(decoration.line));
      element.style.cssText = this.joinStyleFragments([
        'position: absolute',
        `top: ${decoration.line * this.lineHeight}px`,
        `height: ${this.lineHeight}px`,
        'left: 0',
        'right: 0',
        'display: flex',
        'align-items: center',
        'justify-content: flex-end',
        'padding-right: 4px',
        'box-sizing: border-box',
        this.serializeStyleObject(decoration.style),
      ]);
      if (decoration.title) {
        element.title = decoration.title;
      }
      element.textContent = decoration.label || '';
      fragment.appendChild(element);
    }

    this.gutterDecorationsElement.appendChild(fragment);
  }

  private joinClassNames(...parts: Array<string | undefined>): string {
    return parts.filter(Boolean).join(' ').trim();
  }

  private joinStyleFragments(parts: Array<string | undefined>): string {
    return parts
      .filter((part) => !!part && part.trim().length > 0)
      .map((part) => {
        const trimmed = part!.trim();
        return trimmed.endsWith(';') ? trimmed : `${trimmed};`;
      })
      .join(' ');
  }

  private serializeStyleObject(style: Record<string, string> | undefined): string {
    if (!style) {
      return '';
    }

    return Object.entries(style)
      .filter(([, value]) => typeof value === 'string' && value.length > 0)
      .map(([key, value]) => `${this.toKebabCase(key)}: ${value}`)
      .join('; ');
  }

  private toKebabCase(value: string): string {
    return value.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
  }

  private offsetToPositionInText(offset: number, text: string): Position {
    const boundedOffset = Math.max(0, Math.min(offset, text.length));
    const before = text.slice(0, boundedOffset);
    const lines = before.split('\n');
    return {
      line: lines.length - 1,
      column: lines[lines.length - 1].length,
    };
  }

  private positionToTextOffset(position: Position, text: string): number {
    const lines = text.split('\n');
    const safeLine = Math.max(0, Math.min(position.line, lines.length - 1));
    const safeColumn = Math.max(
      0,
      Math.min(position.column, lines[safeLine]?.length || 0),
    );

    let offset = 0;
    for (let i = 0; i < safeLine; i++) {
      offset += lines[i].length + 1;
    }

    return offset + safeColumn;
  }

  private getFoldPlaceholderSource(element: HTMLElement): string {
    const foldKey = element.getAttribute(this.foldPlaceholderAttr);
    const sources = this.getFoldPlaceholderSources();
    if (foldKey && sources.has(foldKey)) {
      return sources.get(foldKey) || '';
    }

    return (
      (
        element as HTMLElement & {
          __lceFoldHiddenText?: string;
        }
      ).__lceFoldHiddenText || ''
    );
  }

  private getFoldPlaceholderSources(): Map<string, string> {
    return (
      (
        this.contentElement as HTMLElement & {
          __lceFoldPlaceholderSources?: Map<string, string>;
        }
      ).__lceFoldPlaceholderSources || new Map()
    );
  }

  private getFoldPlaceholderBoundaryOffset(
    placeholder: HTMLElement,
    container: Node,
    offset: number,
  ): number {
    const hiddenLength = this.getFoldPlaceholderSource(placeholder).length;
    const visibleLength = this.stripVirtualMarkers(placeholder.textContent || '').length;
    if (hiddenLength === 0 || visibleLength === 0) {
      return 0;
    }

    const range = document.createRange();
    range.selectNodeContents(placeholder);
    try {
      range.setEnd(container, offset);
    } catch {
      return 0;
    }

    const visibleOffset = this.stripVirtualMarkers(range.toString()).length;
    return visibleOffset <= visibleLength / 2 ? 0 : hiddenLength;
  }

  private setFoldPlaceholderSources(sources: Map<string, string>): void {
    (
      this.contentElement as HTMLElement & {
        __lceFoldPlaceholderSources?: Map<string, string>;
      }
    ).__lceFoldPlaceholderSources = sources;
  }
}
