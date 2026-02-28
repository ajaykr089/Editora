/**
 * Lightweight Code Editor - View/Renderer
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import { Position, Range } from './types';

export class View {
  private container: HTMLElement;
  private editorContainer!: HTMLElement;
  private contentElement!: HTMLElement;
  private lineNumbersElement!: HTMLElement;
  private gutterWidth = 50;
  private lineHeight = 21;
  private _rafId?: number;
  private readonly trailingNewlineMarkerAttr = 'data-lce-trailing-newline-marker';

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
      /* make the outer container the single scrollable element so gutter and content scroll together */
      overflow: auto;
    `;

    // Create gutter (line numbers)
    this.lineNumbersElement = document.createElement('div');
    this.lineNumbersElement.setAttribute('data-editor-gutter', 'true');
    this.lineNumbersElement.style.cssText = `
      display: table-cell;
      vertical-align: top;
      width: ${this.gutterWidth}px;
      background: var(--editor-gutter-background, #252526);
      color: var(--editor-gutter-foreground, #858585);
      padding: 0 8px 0 0;
      text-align: right;
      border-right: 1px solid var(--editor-gutter-border, #3e3e42);
      user-select: none;
      z-index: 1;
    `;

    // Create content area
    this.contentElement = document.createElement('div');
    this.contentElement.style.cssText = `
      display: table-cell;
      vertical-align: top;
      padding: 0 12px;
      background: transparent;
      border: none;
      outline: none;
      white-space: pre;
      overflow-x: auto;
      overflow-y: visible;
      min-height: 400px;
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
      color: inherit;
      tab-size: 2;
      -moz-tab-size: 2;
    `;
    this.contentElement.contentEditable = 'true';
    this.contentElement.spellcheck = false;

    // Assemble: create a single scroll wrapper so gutter and content
    // share the same scroller and remain aligned when scrolling.
    const scrollWrapper = document.createElement('div');
    scrollWrapper.setAttribute('data-editora-editor', 'true');
    // Use a table-like layout so gutter and content are table-cells
    // inside the same scrollable container (`editorContainer`) and
    // therefore always scroll together naturally.
    scrollWrapper.style.cssText = `display: table; table-layout: fixed; width: 100%; height: 100%;`;

    // Put both into the same scroll surface by appending to the editor container
    scrollWrapper.appendChild(this.lineNumbersElement);
    scrollWrapper.appendChild(this.contentElement);
    editorContainer.appendChild(scrollWrapper);
    this.container.appendChild(editorContainer);

    // Make the outer editor container the single scrollable element so
    // the gutter and content scroll together naturally. No transform
    // syncing or RAF loop is necessary.
    this.updateLineNumbers(1);
  }

  // Update line numbers
  updateLineNumbers(lineCount: number): void {
    const maxLines = Math.max(lineCount, 20);
    const lineNumbers = Array.from({ length: maxLines }, (_, i) => i + 1);
    this.lineNumbersElement.innerHTML = lineNumbers
      .map(num => `<div style="height: ${this.lineHeight}px; line-height: ${this.lineHeight}px; padding-right: 12px;">${num}</div>`)
      .join('');
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
    const text = this.contentElement.textContent || '';
    const hasMarker = !!this.contentElement.querySelector(`[${this.trailingNewlineMarkerAttr}]`);
    if (hasMarker && text.endsWith('\u200B')) {
      return text.slice(0, -1);
    }
    return text;
  }

  // Set text content
  setText(text: string): void {
    this.contentElement.textContent = text;
    this.syncTrailingNewlineMarker(text.endsWith('\n'));
    const lines = text.split('\n').length;
    this.updateLineNumbers(lines);
  }

  // Set inner HTML (used for syntax highlighted content)
  setHTML(html: string): void {
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

  // Keep trailing-newline caret marker in sync for live contenteditable edits
  // (without forcing a full setText/setHTML render).
  syncTrailingNewlineMarkerForText(text: string): void {
    this.syncTrailingNewlineMarker(text.endsWith('\n'));
  }

  // Get cursor position from DOM selection
  getCursorPosition(): Position {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return { line: 0, column: 0 };
    }

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(this.contentElement);
    preCaretRange.setEnd(range.endContainer, range.endOffset);

    const text = preCaretRange.toString();
    const lines = text.replace(/\u200B/g, '').split('\n');

    return {
      line: lines.length - 1,
      column: lines[lines.length - 1].length
    };
  }

  // Set cursor position
  setCursorPosition(position: Position): void {
    const text = this.getText();
    const lines = text.split('\n');

    // Ensure position is valid
    const line = Math.min(position.line, lines.length - 1);
    const column = Math.min(position.column, lines[line]?.length || 0);

    // Calculate offset
    let offset = 0;
    for (let i = 0; i < line; i++) {
      offset += lines[i].length + 1; // +1 for newline
    }
    offset += column;

    // Set selection
    const range = document.createRange();
    const selection = window.getSelection();

    // Find the text node and offset
    let currentOffset = 0;
    let targetNode: Node | null = null;
    let targetOffset = 0;

    const walker = document.createTreeWalker(
      this.contentElement,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node: Node | null;
    while ((node = walker.nextNode())) {
      const nodeLength = node.textContent?.length || 0;
      if (currentOffset + nodeLength >= offset) {
        targetNode = node;
        targetOffset = offset - currentOffset;
        break;
      }
      currentOffset += nodeLength;
    }

    if (targetNode) {
      try {
        range.setStart(targetNode, targetOffset);
        range.setEnd(targetNode, targetOffset);
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
      try {
        if (marker && marker.parentNode === this.contentElement) {
          range.setStartBefore(marker);
        } else {
          range.selectNodeContents(this.contentElement);
          range.collapse(false);
        }
        range.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(range);
        this.ensureCaretVisible();
      } catch (e) {
        console.warn('Could not set fallback cursor position:', e);
      }
    }
  }

  // Get selection range
  getSelectionRange(): Range | undefined {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      return undefined;
    }

    const range = selection.getRangeAt(0);

    // Get start position
    const startRange = range.cloneRange();
    startRange.selectNodeContents(this.contentElement);
    startRange.setEnd(range.startContainer, range.startOffset);
    const startText = startRange.toString().replace(/\u200B/g, '');
    const startLines = startText.split('\n');

    // Get end position
    const endRange = range.cloneRange();
    endRange.selectNodeContents(this.contentElement);
    endRange.setEnd(range.endContainer, range.endOffset);
    const endText = endRange.toString().replace(/\u200B/g, '');
    const endLines = endText.split('\n');

    return {
      start: {
        line: startLines.length - 1,
        column: startLines[startLines.length - 1].length
      },
      end: {
        line: endLines.length - 1,
        column: endLines[endLines.length - 1].length
      }
    };
  }

  // Set selection range
  setSelectionRange(range: Range): void {
    const startPos = this.setCursorPosition(range.start);
    // Note: This is simplified - proper range selection would need more complex logic
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

    const range = selection.getRangeAt(0).cloneRange();
    range.collapse(false);

    let caretRect = range.getClientRects()[0] || range.getBoundingClientRect();
    if ((!caretRect || (caretRect.width === 0 && caretRect.height === 0)) && selection.focusNode instanceof Element) {
      caretRect = selection.focusNode.getBoundingClientRect();
    } else if ((!caretRect || (caretRect.width === 0 && caretRect.height === 0)) && selection.focusNode?.parentElement) {
      caretRect = selection.focusNode.parentElement.getBoundingClientRect();
    }

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
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = undefined;
    }
  }
}
