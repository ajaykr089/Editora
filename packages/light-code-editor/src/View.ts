/**
 * Lightweight Code Editor - View/Renderer
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import { Position, Range } from './types';

export class View {
  private container: HTMLElement;
  private contentElement!: HTMLElement;
  private lineNumbersElement!: HTMLElement;
  private gutterWidth = 50;
  private lineHeight = 21;

  constructor(container: HTMLElement) {
    this.container = container;
    this.createDOM();
  }

  private createDOM(): void {
    // Clear container
    this.container.innerHTML = '';

    // Create main editor container
    const editorContainer = document.createElement('div');
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
      overflow: hidden;
    `;

    // Create gutter (line numbers)
    this.lineNumbersElement = document.createElement('div');
    this.lineNumbersElement.style.cssText = `
      position: sticky;
      left: 0;
      top: 0;
      width: ${this.gutterWidth}px;
      background: var(--editor-gutter-background, #252526);
      color: var(--editor-gutter-foreground, #858585);
      padding: 0;
      text-align: right;
      border-right: 1px solid var(--editor-gutter-border, #3e3e42);
      user-select: none;
      overflow: hidden;
      z-index: 1;
    `;

    // Create content area
    this.contentElement = document.createElement('div');
    this.contentElement.style.cssText = `
      flex: 1;
      padding: 0;
      background: transparent;
      border: none;
      outline: none;
      white-space: pre;
      overflow-x: auto;
      overflow-y: auto;
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

    // Assemble
    editorContainer.appendChild(this.lineNumbersElement);
    editorContainer.appendChild(this.contentElement);
    this.container.appendChild(editorContainer);

    // Initial line numbers
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
    return this.contentElement.textContent || '';
  }

  // Set text content
  setText(text: string): void {
    this.contentElement.textContent = text;
    const lines = text.split('\n').length;
    this.updateLineNumbers(lines);
  }

  // Set inner HTML (used for syntax highlighted content)
  setHTML(html: string): void {
    this.contentElement.innerHTML = html;
    const text = this.contentElement.textContent || '';
    const lines = text.split('\n').length;
    this.updateLineNumbers(lines);
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
    const lines = text.split('\n');

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
      } catch (e) {
        // Fallback for edge cases
        console.warn('Could not set cursor position:', e);
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
    const startText = startRange.toString();
    const startLines = startText.split('\n');

    // Get end position
    const endRange = range.cloneRange();
    endRange.selectNodeContents(this.contentElement);
    endRange.setEnd(range.endContainer, range.endOffset);
    const endText = endRange.toString();
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
    return this.contentElement.scrollTop;
  }

  // Set scroll position
  setScrollTop(scrollTop: number): void {
    this.contentElement.scrollTop = scrollTop;
    this.lineNumbersElement.scrollTop = scrollTop;
  }

  // Destroy the view
  destroy(): void {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}
