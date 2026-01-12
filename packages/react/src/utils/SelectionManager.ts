/**
 * Selection manager for preserving cursor position in contentEditable elements.
 */
export class SelectionManager {
  private savedRange: Range | null = null;
  private element: HTMLElement | null = null;

  constructor(element?: HTMLElement) {
    this.element = element || null;
  }

  /**
   * Set the element for this selection manager.
   */
  setElement(element: HTMLElement): void {
    this.element = element;
  }

  /**
   * Save the current selection range.
   */
  saveSelection(): void {
    this.save();
  }

  /**
   * Restore the saved selection range.
   */
  restoreSelection(): void {
    this.restore();
  }

  /**
   * Save the current selection range.
   */
  save(): void {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && this.element?.contains(selection.anchorNode)) {
      this.savedRange = selection.getRangeAt(0).cloneRange();
    }
  }

  /**
   * Restore the saved selection range.
   */
  restore(): void {
    if (this.savedRange && this.element) {
      try {
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(this.savedRange);
          this.element.focus();
        }
      } catch (e) {
        // Range might be invalid, just focus the element
        this.element.focus();
      }
    }
  }

  /**
   * Execute a function while preserving selection.
   */
  preserveSelection<T>(fn: () => T): T {
    this.save();
    const result = fn();
    // Use setTimeout to restore after DOM updates
    setTimeout(() => this.restore(), 0);
    return result;
  }

  /**
   * Get current cursor position as offset from start of element.
   */
  getCursorOffset(): number {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !this.element) {
      return 0;
    }

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(this.element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
  }

  /**
   * Set cursor position by offset from start of element.
   */
  setCursorOffset(offset: number): void {
    if (!this.element) return;

    const walker = document.createTreeWalker(
      this.element,
      NodeFilter.SHOW_TEXT,
      null
    );

    let currentOffset = 0;
    let node: Node | null;

    while ((node = walker.nextNode())) {
      const textLength = node.textContent?.length || 0;
      if (currentOffset + textLength >= offset) {
        const range = document.createRange();
        range.setStart(node, offset - currentOffset);
        range.collapse(true);

        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
        return;
      }
      currentOffset += textLength;
    }

    // If offset is beyond content, place at end
    const range = document.createRange();
    range.selectNodeContents(this.element);
    range.collapse(false);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
}