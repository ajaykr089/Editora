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
  // 24px: a fold button is a pointer target, and WCAG 2.5.8 wants at least 24x24 CSS px for those.
  private readonly gutterFoldColumnWidth = 24;
  private readonly gutterFoldColumnGap = 4;
  private readonly gutterLineNumberPaddingLeft = 8;
  private readonly gutterLineNumberPaddingRight = 4;
  private readonly gutterDigitWidth = 9;
  // 24px lines (not 21) so that fold buttons on consecutive lines are 24px tall without overlapping.
  private lineHeight = 24;
  private _rafId?: number;
  private readonly trailingNewlineMarkerAttr = 'data-lce-trailing-newline-marker';
  private readonly foldPlaceholderAttr = 'data-lce-fold-placeholder';
  private readonly virtualMarkerRegex = /[\u200B\uE000]/;
  private readonly virtualMarkerGlobalRegex = /[\u200B\uE000]/g;
  private lastLineCount = 0;
  private lastHighlightHTML = '';
  private highlightOverlayActive = false;
  private readonly lineDecorationElements = new Map<string, { element: HTMLElement; key: string }>();
  private readonly gutterDecorationElements = new Map<string, { element: HTMLElement; key: string }>();
  private lineDecorations: LineDecoration[] = [];
  private gutterDecorations: GutterDecoration[] = [];
  // With line wrapping a line is as many rows tall as it wraps to, so the line numbers (and anything placed by
  // line) cannot assume a fixed height per line. These are the measured heights and tops, per line; null while
  // wrapping is off or before the first measurement, when every line is one row.
  private lineWrapping = false;
  private measuredHeights: number[] | null = null;
  private measuredTops: number[] = [];
  // The lines the heights were measured for, and what else their heights depend on (see wrapSignature): a line
  // that has not changed under the same signature keeps its height, so an edit measures only the lines it touched.
  private measuredLines: string[] | null = null;
  private measuredSignature = '';
  private measureQueued = false;
  private measurer: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private destroyed = false;
  // The editable text is one block per line (<div data-lce-line>). An edit then lays out only the lines it touched;
  // as one text node, every keystroke re-laid out the whole document. A folded document is still shown flat (text
  // nodes and fold placeholders), and every method below reads both shapes.
  private readonly lineAttr = 'data-lce-line';
  /** The lines the content holds, as last rendered here; trusted only while `domDirty` is false. */
  private renderedLines: string[] | null = null;
  private renderedText: string | null = null;
  private renderedLineStarts: number[] | null = null;
  /** The HTML of each line of the highlight overlay, as rendered, and the elements left open from the line before. */
  private overlayLines: string[] = [];
  private overlayStartTags: string[] = [];
  /** Sees edits the browser makes itself (IME composition, drag and drop): after one, the DOM is read again. */
  private contentObserver: MutationObserver | null = null;
  private domDirty = true;
  /**
   * While something is folded: for each line of the document, the line it is shown on, or -1 inside a fold. Line
   * numbers, line decorations and scrolling to a line go through it; they used to count shown lines as document
   * lines, so after a fold the gutter renumbered the lines below it and decorations sat lines too low.
   */
  private foldedDisplayLines: number[] | null = null;
  private gutterRelabelled = false;

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
      overflow: auto;
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
      min-width: ${this.gutterWidth}px;
      background: var(--editor-gutter-background, #252526);
      color: var(--editor-gutter-foreground, #858585);
      padding: 0;
      text-align: right;
      border-right: 1px solid var(--editor-gutter-border, #3e3e42);
      box-sizing: border-box;
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
      box-sizing: border-box;
      padding: 0 ${this.gutterFoldColumnWidth + this.gutterFoldColumnGap}px 0 ${this.gutterLineNumberPaddingLeft}px;
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
      min-width: max-content;
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
      display: block;
      box-sizing: border-box;
      padding: 0 12px;
      background: transparent;
      border: none;
      outline: none;
      white-space: pre;
      overflow: visible;
      width: 100%;
      min-width: max-content;
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
    // A contenteditable div is announced as nothing at all: make it a named multi-line text box.
    this.contentElement.setAttribute('role', 'textbox');
    this.contentElement.setAttribute('aria-multiline', 'true');
    this.contentElement.setAttribute('aria-label', 'Code editor');

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
      table-layout: auto;
      width: 100%;
      min-width: 100%;
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

    if (typeof MutationObserver !== 'undefined') {
      this.contentObserver = new MutationObserver(() => {
        this.domDirty = true;
      });
      this.contentObserver.observe(this.contentElement, { childList: true, subtree: true, characterData: true });
    }
  }

  // Update line numbers
  updateLineNumbers(lineCount: number): void {
    this.updateGutterWidth(lineCount);

    // A line can wrap to more or fewer rows without the number of lines changing.
    this.queueWrapMeasure();

    if (lineCount === this.lastLineCount) {
      return;
    }
    this.lastLineCount = lineCount;
    this.syncGutterRows(Math.max(lineCount, 1));
  }

  /**
   * One row per line, numbered in order, so a different number of lines only adds rows at the end or takes them
   * away from it. The rows that stay keep their heights (see applyMeasuredHeights).
   */
  private syncGutterRows(count: number): void {
    const container = this.lineNumbersContentElement;
    while (container.children.length > count) {
      container.lastElementChild!.remove();
    }
    let html = '';
    for (let number = container.children.length + 1; number <= count; number += 1) {
      html += `<div style="height: ${this.lineHeight}px; line-height: ${this.lineHeight}px;">${number}</div>`;
    }
    if (html) container.insertAdjacentHTML('beforeend', html);
  }

  /** Where a line starts, in pixels from the top of the content. */
  private lineTop(line: number): number {
    return this.measuredTops[line] ?? line * this.lineHeight;
  }

  /** How tall a line is: one row, or as many as it wraps to. */
  private lineHeightAt(line: number): number {
    return this.measuredHeights?.[line] ?? this.lineHeight;
  }

  private queueWrapMeasure(): void {
    if (!this.lineWrapping || this.measureQueued || this.destroyed) return;
    this.measureQueued = true;
    // Once per task, after the text has been updated and before anything is painted.
    void Promise.resolve().then(() => {
      this.measureQueued = false;
      this.measureWrappedLines();
    });
  }

  /**
   * Finds out how many rows each line wraps to, by laying the same text out one block per line in a hidden copy
   * of the content, and sizes the line numbers to match. Done in one layout pass: all blocks are built, then all
   * heights are read.
   */
  private measureWrappedLines(): void {
    if (!this.lineWrapping || this.destroyed || !this.contentElement.isConnected) return;

    const sources = (this.contentElement as HTMLElement & { __lceFoldPlaceholderSources?: Map<string, string> })
      .__lceFoldPlaceholderSources;
    const rows = this.lineNumbersContentElement.children;
    const lines = this.getText().split('\n');
    // Folded blocks make the text on screen differ from the document, so lines cannot be matched to numbers; and
    // a hidden editor has no width to wrap to (it is measured when it is shown: see the resize observer).
    const width = this.contentElement.clientWidth;
    if ((sources && sources.size > 0) || rows.length !== lines.length || width === 0) {
      this.applyMeasuredHeights(null);
      return;
    }

    const signature = this.wrapSignature(width);
    const previousLines = this.measuredLines;
    const previousHeights = this.measuredHeights;
    let heights: number[];
    if (previousLines && previousHeights && previousHeights.length === previousLines.length && signature === this.measuredSignature) {
      // Typing changes one line, or a few: everything before the first changed line and after the last one
      // is as it was, so only the lines in between are laid out.
      const shared = Math.min(previousLines.length, lines.length);
      let head = 0;
      while (head < shared && previousLines[head] === lines[head]) head += 1;
      let tail = 0;
      while (tail < shared - head && previousLines[previousLines.length - 1 - tail] === lines[lines.length - 1 - tail]) tail += 1;
      heights = previousHeights
        .slice(0, head)
        .concat(this.measureLines(lines.slice(head, lines.length - tail), width), previousHeights.slice(previousHeights.length - tail));
    } else {
      heights = this.measureLines(lines, width);
    }
    this.measuredLines = lines;
    this.measuredSignature = signature;
    this.applyMeasuredHeights(heights);
  }

  /** Lays each line out as a block of its own in the hidden copy of the content, and returns how tall each came out. */
  private measureLines(lines: string[], width: number): number[] {
    if (lines.length === 0) return [];
    const measurer = this.ensureMeasurer(width);
    measurer.innerHTML = lines
      .map((line) => `<div>${line === '' ? '&#8203;' : line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`)
      .join('');
    const heights = Array.from(measurer.children, (child) => (child as HTMLElement).offsetHeight);
    measurer.textContent = '';
    return heights;
  }

  /** What the height of a line depends on besides its text. When this changes, every line is measured again. */
  private wrapSignature(width: number): string {
    const style = getComputedStyle(this.contentElement);
    return [
      width,
      style.fontFamily,
      style.fontSize,
      style.fontWeight,
      style.letterSpacing,
      style.tabSize,
      style.paddingLeft,
      style.paddingRight,
      style.whiteSpace,
      style.overflowWrap,
      style.wordBreak,
    ].join('|');
  }

  private ensureMeasurer(width: number): HTMLElement {
    if (!this.measurer) {
      const measurer = document.createElement('div');
      measurer.setAttribute('aria-hidden', 'true');
      measurer.setAttribute('data-editor-measurer', 'true');
      this.contentSurface.appendChild(measurer);
      this.measurer = measurer;
    }
    // Wraps exactly as the content does: the same font, padding, tab size and wrapping rules.
    this.measurer.style.cssText = this.contentElement.style.cssText;
    Object.assign(this.measurer.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      zIndex: '-1',
      visibility: 'hidden',
      pointerEvents: 'none',
      width: `${width}px`,
      minWidth: '0',
      minHeight: '0',
      height: 'auto',
    });
    return this.measurer;
  }

  private applyMeasuredHeights(heights: number[] | null): void {
    const previous = this.measuredHeights;
    const unchanged =
      previous === heights ||
      (previous !== null && heights !== null && previous.length === heights.length && previous.every((h, i) => h === heights[i]));
    if (unchanged) return;

    this.measuredHeights = heights;
    this.measuredTops = [];
    if (heights) {
      let top = 0;
      for (const height of heights) {
        this.measuredTops.push(top);
        top += height;
      }
    } else {
      this.measuredLines = null;
    }

    // A row is as tall as the line it numbers; only the rows whose height is not what it was are written to.
    // (A row that is new, or was never measured, is one line high.)
    const rows = this.lineNumbersContentElement.children;
    for (let i = 0; i < rows.length; i += 1) {
      const was = previous?.[i] ?? this.lineHeight;
      const now = heights?.[i] ?? this.lineHeight;
      if (was !== now) (rows[i] as HTMLElement).style.height = `${now}px`;
    }

    // Decorations are placed by line, so they move with the lines.
    this.renderLineDecorations(this.lineDecorations);
    this.renderGutterDecorations(this.gutterDecorations);
  }

  private updateGutterWidth(lineCount: number): void {
    const digitCount = String(Math.max(lineCount, 1)).length;
    const lineNumberWidth =
      digitCount * this.gutterDigitWidth +
      this.gutterLineNumberPaddingLeft +
      this.gutterLineNumberPaddingRight;
    const nextGutterWidth = Math.ceil(
      lineNumberWidth + this.gutterFoldColumnGap + this.gutterFoldColumnWidth,
    );

    if (nextGutterWidth === this.gutterWidth) {
      return;
    }

    this.gutterWidth = nextGutterWidth;
    if (this.lineNumbersElement.style.display !== 'none') {
      this.lineNumbersElement.style.width = `${this.gutterWidth}px`;
      this.lineNumbersElement.style.minWidth = `${this.gutterWidth}px`;
    }
  }

  setDecorations(
    lineDecorations: LineDecoration[],
    gutterDecorations: GutterDecoration[],
  ): void {
    this.lineDecorations = lineDecorations;
    this.gutterDecorations = gutterDecorations;
    this.renderLineDecorations(lineDecorations);
    this.renderGutterDecorations(gutterDecorations);
  }

  clearDecorations(): void {
    this.lineDecorations = [];
    this.gutterDecorations = [];
    if (this.lineDecorationElements.size > 0) {
      this.lineDecorationsElement.innerHTML = '';
      this.lineDecorationElements.clear();
    }
    if (this.gutterDecorationElements.size > 0) {
      this.gutterDecorationsElement.innerHTML = '';
      this.gutterDecorationElements.clear();
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
    const lines = this.cleanRenderedLines();
    if (lines) {
      if (this.renderedText === null) this.renderedText = lines.join('\n');
      return this.renderedText;
    }
    return this.serializeContentToSource();
  }

  // Set text content (and drop the highlight overlay)
  setText(text: string): void {
    this.clearHighlightOverlay();
    this.setSourceText(text);
  }

  /**
   * Shows `text` in the editable surface, one block per line, changing only the lines that differ from what is
   * there. Lines that already read right are not touched, so an IME composition in progress is left alone.
   */
  setSourceText(text: string): void {
    this.setFoldPlaceholderSources(new Map());
    const lines = text.split('\n');
    this.renderContentLines(lines, text);
    this.updateLineNumbers(lines.length);
    if (this.foldedDisplayLines || this.gutterRelabelled) this.refreshFoldedLayout();
  }

  /**
   * Re-reads which lines are hidden by folds (from the fold placeholders in the editable DOM) and places the line
   * numbers and line decorations by the lines as shown. Folding calls it after it changes the DOM.
   */
  refreshFoldedLayout(): void {
    this.foldedDisplayLines = this.computeFoldedDisplayLines();
    this.labelGutterRows();
    this.renderLineDecorations(this.lineDecorations);
    this.renderGutterDecorations(this.gutterDecorations);
  }

  /** The shown line a document line is on, or -1 when it is folded away. */
  private displayLineOf(line: number): number {
    if (!this.foldedDisplayLines) return line;
    return this.foldedDisplayLines[line] ?? -1;
  }

  private computeFoldedDisplayLines(): number[] | null {
    if (!this.contentElement.querySelector(`[${this.foldPlaceholderAttr}]`)) return null;
    const map: number[] = [0];
    let shown = 0;
    const countBreaks = (text: string, hidden: boolean) => {
      for (let at = text.indexOf('\n'); at !== -1; at = text.indexOf('\n', at + 1)) {
        if (hidden) {
          map.push(-1);
        } else {
          shown += 1;
          map.push(shown);
        }
      }
    };
    this.contentElement.childNodes.forEach((child) => {
      if (child instanceof HTMLElement && child.hasAttribute(this.foldPlaceholderAttr)) {
        countBreaks(this.getFoldPlaceholderSource(child), true);
      } else {
        countBreaks(this.nodeSource(child), false);
      }
    });
    return map;
  }

  /** Numbers the gutter rows with the document lines they show (1, 2, 3, then 9 after a fold of lines 4-8). */
  private labelGutterRows(): void {
    const rows = this.lineNumbersContentElement.children;
    const labels: number[] = [];
    if (this.foldedDisplayLines) {
      this.foldedDisplayLines.forEach((shown, line) => {
        if (shown >= 0 && labels[shown] === undefined) labels[shown] = line + 1;
      });
    }
    for (let i = 0; i < rows.length; i++) {
      const label = String(labels[i] ?? i + 1);
      if (rows[i].textContent !== label) rows[i].textContent = label;
    }
    this.gutterRelabelled = !!this.foldedDisplayLines;
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
    const lines = text.split('\n');
    this.updateLineNumbers(lines.length);
  }

  setHighlightHTML(html: string, lineCount?: number): void {
    if (html !== this.lastHighlightHTML || (lineCount !== undefined && lineCount !== this.overlayLines.length)) {
      // One block per line, like the editable text, and only the lines whose HTML changed are replaced. A highlighter
      // may drop a trailing line break: the overlay still gets a line for every line of the text.
      const { lines, startTags } = View.splitHtmlLines(html);
      while (lineCount !== undefined && lines.length < lineCount) {
        lines.push('');
        startTags.push('');
      }
      this.patchBlocks(this.highlightElement, this.overlayLines, lines, (block, line) => {
        block.innerHTML = line || '<br>';
      });
      this.overlayLines = lines;
      this.overlayStartTags = startTags;
      this.lastHighlightHTML = html;
    }
    this.highlightElement.style.visibility = 'visible';
    this.highlightOverlayActive = true;
    this.contentElement.style.color = 'transparent';
    (this.contentElement.style as CSSStyleDeclaration & { WebkitTextFillColor?: string }).WebkitTextFillColor = 'transparent';

    // The gutter counts the lines of the text (set with it), not of the highlighted HTML.
    this.updateLineNumbers(Math.max(1, this.renderedLines?.length ?? this.overlayLines.length));
  }

  setLineWrapping(enabled: boolean): void {
    this.lineWrapping = enabled;
    if (enabled) {
      // The width the text wraps to changes with the size of the editor, so look again when it does.
      if (!this.resizeObserver && typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(() => this.queueWrapMeasure());
        this.resizeObserver.observe(this.contentElement);
      }
      this.queueWrapMeasure();
    } else {
      this.resizeObserver?.disconnect();
      this.resizeObserver = null;
      this.applyMeasuredHeights(null);
    }
    this.contentElement.style.whiteSpace = enabled ? 'pre-wrap' : 'pre';
    this.contentElement.style.overflow = 'visible';
    this.contentElement.style.minWidth = enabled ? '100%' : 'max-content';
    this.contentSurface.style.minWidth = enabled ? '100%' : 'max-content';
    this.contentElement.style.wordBreak = 'normal';
    this.contentElement.style.overflowWrap = enabled ? 'anywhere' : 'normal';
    this.highlightElement.style.whiteSpace = enabled ? 'pre-wrap' : 'pre';
    this.highlightElement.style.wordBreak = 'normal';
    this.highlightElement.style.overflowWrap = enabled ? 'anywhere' : 'normal';
  }

  setLineNumbersVisible(visible: boolean): void {
    this.lineNumbersElement.style.display = visible ? 'table-cell' : 'none';
    this.lineNumbersElement.style.width = visible ? `${this.gutterWidth}px` : '0';
    this.lineNumbersElement.style.minWidth = visible ? `${this.gutterWidth}px` : '0';
    this.lineNumbersElement.style.borderRightWidth = visible ? '1px' : '0';
    this.scrollWrapper.style.width = '100%';
    this.scrollWrapper.style.minWidth = '100%';
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
    if (readOnly) this.contentElement.setAttribute('aria-readonly', 'true');
    else this.contentElement.removeAttribute('aria-readonly');
  }

  /** The accessible name of the editing surface (what a screen reader calls the editor). */
  setAccessibleName(name: string): void {
    this.contentElement.setAttribute('aria-label', name || 'Code editor');
  }

  // Apply theme
  applyTheme(theme: Record<string, string>): void {
    Object.entries(theme).forEach(([key, value]) => {
      this.container.style.setProperty(`--${key}`, value);
    });
  }

  // Scroll to position
  scrollToPosition(position: Position): void {
    let safeLine = Math.max(0, Math.floor(position.line) || 0);
    // A line inside a fold is shown as the fold's first line.
    while (safeLine > 0 && this.displayLineOf(safeLine) < 0) safeLine -= 1;
    const targetTop = this.lineTop(this.displayLineOf(safeLine));
    const centeredTop = targetTop - (this.editorContainer.clientHeight / 2) + (this.lineHeight / 2);
    this.editorContainer.scrollTop = Math.max(0, centeredTop);
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

    // With a block per line the last, empty line is a block of its own: the marker is only for the flat (folded) text.
    if (!shouldShow || this.isLineElement(this.contentElement.firstChild)) return;

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

    if (caretRect.right > containerRect.right - padding) {
      this.editorContainer.scrollLeft += caretRect.right - (containerRect.right - padding);
    } else if (caretRect.left < containerRect.left + padding) {
      this.editorContainer.scrollLeft -= (containerRect.left + padding) - caretRect.left;
    }
  }

  // Destroy the view
  destroy(): void {
    this.destroyed = true;
    this.contentObserver?.disconnect();
    this.contentObserver = null;
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
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
    const children = this.contentElement.childNodes;

    const lines = this.cleanRenderedLines();
    if (lines) {
      const starts = this.getRenderedLineStarts();
      const index = View.lineIndexAt(starts, boundedOffset);
      return this.pointInLineElement(children[index], Math.min(boundedOffset - starts[index], lines[index].length));
    }

    const parts = this.computeContentParts();
    if (parts.length === 0) {
      return { node: this.contentElement, offset: children.length };
    }
    const part = parts.find((candidate) => boundedOffset <= candidate.start + candidate.length) ?? parts[parts.length - 1];
    const target = Math.max(part.start, Math.min(boundedOffset, part.start + part.length));
    if (part.kind === 'block') {
      return this.pointInLineElement(children[part.first], target - part.start);
    }

    let currentOffset = part.start;
    for (let i = part.first; i <= part.last; i++) {
      const child = children[i];

      if (child instanceof Text) {
        const text = child.textContent || '';
        const visibleToDom = this.buildVisibleToDomMap(text);
        const visibleLen = Math.max(0, visibleToDom.length - 1);
        if (currentOffset + visibleLen >= target) {
          const localVisibleOffset = Math.max(0, target - currentOffset);
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
        if (currentOffset + hiddenLength >= target) {
          const localOffset = target - currentOffset;
          return {
            node: this.contentElement,
            offset: localOffset <= hiddenLength / 2 ? i : i + 1,
          };
        }
        currentOffset += hiddenLength;
        continue;
      }

      currentOffset += this.getSourceLength(child);
    }

    return {
      node: this.contentElement,
      offset: part === parts[parts.length - 1] ? children.length : part.last + 1,
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
    this.overlayLines = [];
    this.overlayStartTags = [];
    this.highlightOverlayActive = false;
    this.contentElement.style.color = 'inherit';
    (this.contentElement.style as CSSStyleDeclaration & { WebkitTextFillColor?: string }).WebkitTextFillColor = 'currentcolor';
  }

  private serializeContentToSource(): string {
    const children = this.contentElement.childNodes;
    return this.computeContentParts()
      .map((part) => {
        let output = '';
        for (let i = part.first; i <= part.last; i++) {
          output += this.nodeSource(children[i]);
        }
        return output;
      })
      .join('\n');
  }

  /** The source text a node stands for: its text without the virtual markers, or the code under a fold. */
  private nodeSource(node: Node): string {
    if (node instanceof Text) {
      return this.stripVirtualMarkers(node.textContent || '');
    }
    if (!(node instanceof HTMLElement) || node.hasAttribute(this.trailingNewlineMarkerAttr)) {
      return '';
    }
    if (node.hasAttribute(this.foldPlaceholderAttr)) {
      return this.getFoldPlaceholderSource(node);
    }
    let output = '';
    node.childNodes.forEach((child) => {
      output += this.nodeSource(child);
    });
    return output;
  }

  private sourceOffsetFromBoundary(container: Node, offset: number): number {
    const children = this.contentElement.childNodes;

    const lines = this.cleanRenderedLines();
    if (lines) {
      const starts = this.getRenderedLineStarts();
      if (container === this.contentElement) {
        return offset >= children.length ? this.getText().length : starts[Math.max(0, offset)];
      }
      const top = this.topLevelChildOf(container);
      const index = top ? Array.prototype.indexOf.call(children, top) : -1;
      if (!top || index < 0 || index >= lines.length) return 0;
      return starts[index] + Math.min(this.sourceOffsetWithinNode(top, container, offset), lines[index].length);
    }

    const parts = this.computeContentParts();
    const last = parts[parts.length - 1];
    const textLength = last ? last.start + last.length : 0;

    if (container === this.contentElement) {
      if (offset >= children.length) return textLength;
      for (const part of parts) {
        if (offset > part.last) continue;
        if (offset <= part.first) return part.start;
        let total = part.start;
        for (let i = part.first; i < offset; i++) total += this.getSourceLength(children[i]);
        return total;
      }
      return textLength;
    }

    const top = this.topLevelChildOf(container);
    const index = top ? Array.prototype.indexOf.call(children, top) : -1;
    const part = parts.find((candidate) => index >= candidate.first && index <= candidate.last);
    if (!top || !part) {
      const next = parts.find((candidate) => candidate.first > index);
      return next ? next.start : textLength;
    }
    if (part.kind === 'block') {
      return part.start + Math.min(this.sourceOffsetWithinNode(top, container, offset), part.length);
    }

    let total = part.start;
    for (let i = part.first; i < index; i++) total += this.getSourceLength(children[i]);
    const child = children[index];

    if (child === container) {
      if (child instanceof Text) {
        return total + this.stripVirtualMarkers((child.textContent || '').slice(0, offset)).length;
      }

      if (child instanceof HTMLElement) {
        if (child.hasAttribute(this.foldPlaceholderAttr)) {
          return total + this.getFoldPlaceholderBoundaryOffset(child, child, offset);
        }

        const innerChildren = Array.from(child.childNodes);
        for (let j = 0; j < Math.min(offset, innerChildren.length); j++) {
          total += this.getSourceLength(innerChildren[j]);
        }
      }
      return total;
    }

    if (child instanceof HTMLElement && child.hasAttribute(this.foldPlaceholderAttr)) {
      return total + this.getFoldPlaceholderBoundaryOffset(child, container, offset);
    }
    return total + this.sourceOffsetWithinNode(child, container, offset);
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

  private isLineElement(node: Node | null): node is HTMLElement {
    return node instanceof HTMLElement && node.hasAttribute(this.lineAttr);
  }

  /** Whether the editable DOM may have changed since this view last rendered it (an edit the browser made). */
  private syncDomDirty(): boolean {
    if (this.contentObserver && this.contentObserver.takeRecords().length > 0) {
      this.domDirty = true;
    }
    return this.domDirty;
  }

  /** The rendered lines, when the DOM is still exactly what this view put there. */
  private cleanRenderedLines(): string[] | null {
    if (!this.renderedLines || this.syncDomDirty()) return null;
    return this.renderedLines;
  }

  private getRenderedLineStarts(): number[] {
    if (!this.renderedLineStarts) {
      const starts: number[] = [];
      let offset = 0;
      for (const line of this.renderedLines ?? ['']) {
        starts.push(offset);
        offset += line.length + 1;
      }
      this.renderedLineStarts = starts;
    }
    return this.renderedLineStarts;
  }

  /** The line holding `offset`: the last line that starts at or before it. */
  private static lineIndexAt(starts: number[], offset: number): number {
    let low = 0;
    let high = starts.length - 1;
    while (low < high) {
      const mid = (low + high + 1) >> 1;
      if (starts[mid] <= offset) low = mid;
      else high = mid - 1;
    }
    return low;
  }

  private topLevelChildOf(node: Node): Node | null {
    let current: Node | null = node;
    while (current && current.parentNode !== this.contentElement) {
      current = current.parentNode;
    }
    return current;
  }

  /** A DOM point `local` characters into one line block. */
  private pointInLineElement(line: Node, local: number): { node: Node; offset: number } {
    const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT);
    let consumed = 0;
    let lastText: Text | null = null;
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node as Text;
      const visibleToDom = this.buildVisibleToDomMap(text.data);
      const visibleLength = visibleToDom.length - 1;
      if (consumed + visibleLength >= local) {
        return { node: text, offset: visibleToDom[Math.max(0, local - consumed)] ?? text.data.length };
      }
      consumed += visibleLength;
      lastText = text;
    }
    return lastText ? { node: lastText, offset: lastText.data.length } : { node: line, offset: 0 };
  }

  /**
   * The content as lines: each line block is a line, and a run of other nodes (the flat text of a folded document,
   * or something the browser put between blocks) is one more. Nodes with no text do not start a line of their own.
   */
  private computeContentParts(): Array<{ kind: 'block' | 'inline'; first: number; last: number; start: number; length: number }> {
    type Part = { kind: 'block' | 'inline'; first: number; last: number; start: number; length: number };
    const parts: Part[] = [];
    const children = this.contentElement.childNodes;
    let inline: Part | null = null;
    const nextStart = () => {
      const previous = parts[parts.length - 1];
      return previous ? previous.start + previous.length + 1 : 0;
    };
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (this.isLineElement(child)) {
        inline = null;
        parts.push({ kind: 'block', first: i, last: i, start: nextStart(), length: this.getSourceLength(child) });
        continue;
      }
      const length = this.getSourceLength(child);
      if (!inline) {
        if (length === 0 && parts.length > 0) continue;
        inline = { kind: 'inline', first: i, last: i, start: nextStart(), length: 0 };
        parts.push(inline);
      }
      inline.last = i;
      inline.length += length;
    }
    return parts;
  }

  /** What a line block holds when it is exactly as rendered here: one text node, or a <br> for an empty line. */
  private canonicalLineText(block: HTMLElement): string | null {
    if (block.childNodes.length !== 1) return null;
    const only = block.firstChild!;
    if (only instanceof Text) return only.data && !this.virtualMarkerRegex.test(only.data) ? only.data : null;
    return only instanceof HTMLBRElement ? '' : null;
  }

  private renderContentLines(lines: string[], text: string): void {
    const content = this.contentElement;
    let current: Array<string | null> | null = null;
    if (this.renderedLines && !this.syncDomDirty()) {
      current = this.renderedLines;
    } else {
      // Read what is there: the browser may have edited it, or folding may have replaced it with flat text.
      const children = content.childNodes;
      current = [];
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (!this.isLineElement(child)) {
          current = null;
          break;
        }
        current.push(this.canonicalLineText(child));
      }
    }

    if (current && current.length > 0) {
      this.patchBlocks(content, current, lines, (block, line) => this.fillLineElement(block, line));
    } else {
      const fragment = document.createDocumentFragment();
      for (const line of lines) fragment.appendChild(this.createLineElement(line));
      content.replaceChildren(fragment);
    }

    this.renderedLines = lines;
    this.renderedText = text;
    this.renderedLineStarts = null;
    this.contentObserver?.takeRecords();
    this.domDirty = !this.contentObserver;
  }

  private createLineElement(line: string): HTMLElement {
    const block = document.createElement('div');
    block.setAttribute(this.lineAttr, '');
    this.fillLineElement(block, line);
    return block;
  }

  private fillLineElement(block: HTMLElement, line: string): void {
    if (line === '') {
      if (!(block.childNodes.length === 1 && block.firstChild instanceof HTMLBRElement)) {
        block.replaceChildren(document.createElement('br'));
      }
      return;
    }
    const only = block.childNodes.length === 1 ? block.firstChild : null;
    if (only instanceof Text) {
      if (only.data !== line) only.data = line;
      return;
    }
    block.replaceChildren(document.createTextNode(line));
  }

  /**
   * Makes the block children of `parent` hold `next` (one block per entry), given that they hold `previous` now (null
   * for a block whose content is unknown). Only the blocks between the first and the last difference are written.
   */
  private patchBlocks(
    parent: HTMLElement,
    previous: ReadonlyArray<string | null>,
    next: ReadonlyArray<string>,
    fill: (block: HTMLElement, value: string) => void,
  ): void {
    const makeBlock = (value: string) => {
      if (parent === this.contentElement) return this.createLineElement(value);
      const block = document.createElement('div');
      fill(block, value);
      return block;
    };
    const children = parent.children;
    if (children.length !== previous.length || parent.childNodes.length !== children.length) {
      const fragment = document.createDocumentFragment();
      for (const value of next) fragment.appendChild(makeBlock(value));
      parent.replaceChildren(fragment);
      return;
    }

    const shared = Math.min(previous.length, next.length);
    let head = 0;
    while (head < shared && previous[head] === next[head]) head += 1;
    let tail = 0;
    while (tail < shared - head && previous[previous.length - 1 - tail] === next[next.length - 1 - tail]) tail += 1;

    const oldMiddle = previous.length - head - tail;
    const newMiddle = next.length - head - tail;
    const common = Math.min(oldMiddle, newMiddle);
    for (let i = 0; i < common; i++) {
      if (previous[head + i] !== next[head + i]) fill(children[head + i] as HTMLElement, next[head + i]);
    }
    if (newMiddle > oldMiddle) {
      const fragment = document.createDocumentFragment();
      for (let i = common; i < newMiddle; i++) fragment.appendChild(makeBlock(next[head + i]));
      parent.insertBefore(fragment, children[head + common] ?? null);
    } else {
      for (let i = oldMiddle - 1; i >= common; i--) {
        children[head + i].remove();
      }
    }
  }

  private static readonly voidTags = new Set(['br', 'hr', 'img', 'wbr', 'input', 'col', 'area', 'source', 'track', 'embed', 'meta', 'link', 'base', 'param']);

  /**
   * Splits highlighted HTML at its line breaks into one string per line. An element open across a break (a block
   * comment, a template string) is closed at the end of the line and opened again on the next one; `startTags` has,
   * for each line, the elements that were opened again (empty when the line starts outside any). `carried` is HTML
   * of elements already open before the first line.
   */
  static splitHtmlLines(html: string, carried = ''): { lines: string[]; startTags: string[] } {
    const lines: string[] = [];
    const startTags: string[] = [];
    const openTags: string[] = [];
    const openNames: string[] = [];
    const pattern = /<\/?([A-Za-z][\w-]*)[^>]*>|\n|[^<\n]+|</g;
    const open = (token: string, name: string) => {
      if (!View.voidTags.has(name) && !token.endsWith('/>')) {
        openNames.push(name);
        openTags.push(token);
      }
    };
    for (let match = pattern.exec(carried); match; match = pattern.exec(carried)) {
      if (match[1] && !match[0].startsWith('</')) open(match[0], match[1].toLowerCase());
    }
    let line = openTags.join('');
    startTags.push(line);
    for (let match = pattern.exec(html); match; match = pattern.exec(html)) {
      const token = match[0];
      const name = match[1]?.toLowerCase();
      if (token === '\n') {
        for (let i = openNames.length - 1; i >= 0; i--) line += `</${openNames[i]}>`;
        lines.push(line);
        line = openTags.join('');
        startTags.push(line);
      } else if (name && token.startsWith('</')) {
        line += token;
        const at = openNames.lastIndexOf(name);
        if (at !== -1) {
          openNames.splice(at, 1);
          openTags.splice(at, 1);
        }
      } else if (name) {
        line += token;
        open(token, name);
      } else {
        line += token;
      }
    }
    for (let i = openNames.length - 1; i >= 0; i--) line += `</${openNames[i]}>`;
    lines.push(line);
    return { lines, startTags };
  }

  static splitHtmlIntoLines(html: string): string[] {
    return View.splitHtmlLines(html).lines;
  }

  /** How many lines the highlight overlay shows. */
  getHighlightLineCount(): number {
    return this.highlightOverlayActive ? this.overlayLines.length : 0;
  }

  /** The HTML of the elements still open where overlay line `line` starts (empty when it starts outside any). */
  getHighlightLineStartTags(line: number): string {
    return this.overlayStartTags[line] ?? '';
  }

  /** Replaces `removeCount` overlay lines from `start` with new ones, leaving every other line as it is. */
  replaceHighlightLines(start: number, removeCount: number, lines: string[], startTags: string[]): void {
    const previous = this.overlayLines.slice(start, start + removeCount);
    const next = [...this.overlayLines];
    next.splice(start, removeCount, ...lines);
    const nextStarts = [...this.overlayStartTags];
    nextStarts.splice(start, removeCount, ...startTags);

    const children = this.highlightElement.children;
    const common = Math.min(removeCount, lines.length);
    for (let i = 0; i < common; i++) {
      if (previous[i] !== lines[i]) (children[start + i] as HTMLElement).innerHTML = lines[i] || '<br>';
    }
    if (lines.length > removeCount) {
      const fragment = document.createDocumentFragment();
      for (let i = common; i < lines.length; i++) {
        const block = document.createElement('div');
        block.innerHTML = lines[i] || '<br>';
        fragment.appendChild(block);
      }
      this.highlightElement.insertBefore(fragment, children[start + common] ?? null);
    } else {
      for (let i = removeCount - 1; i >= common; i--) children[start + i].remove();
    }

    this.overlayLines = next;
    this.overlayStartTags = nextStarts;
    // The overlay no longer matches any one highlighted HTML string: the next full highlight is compared line by line.
    this.lastHighlightHTML = '\u0000';
    this.updateLineNumbers(Math.max(1, this.renderedLines?.length ?? next.length));
  }

  private renderLineDecorations(lineDecorations: LineDecoration[]): void {
    this.syncDecorationElements(
      this.lineDecorationsElement,
      this.lineDecorationElements,
      lineDecorations.filter((decoration) => this.displayLineOf(decoration.line) >= 0),
      (decoration) =>
        `${this.lineTop(this.displayLineOf(decoration.line))}:${this.lineHeightAt(this.displayLineOf(decoration.line))}:${decoration.className || ''}:${this.serializeStyleObject(decoration.style)}`,
      (element, decoration) => {
        element.className = this.joinClassNames('lce-decoration lce-decoration-line', decoration.className);
        element.setAttribute('data-decoration-id', decoration.id);
        element.setAttribute('data-decoration-line', String(decoration.line));
        element.style.cssText = this.joinStyleFragments([
          'position: absolute',
          `top: ${this.lineTop(this.displayLineOf(decoration.line))}px`,
          `height: ${this.lineHeightAt(this.displayLineOf(decoration.line))}px`,
          'left: 12px',
          'right: 12px',
          'border-radius: 3px',
          this.serializeStyleObject(decoration.style),
        ]);
      },
    );
  }

  private renderGutterDecorations(gutterDecorations: GutterDecoration[]): void {
    this.syncDecorationElements(
      this.gutterDecorationsElement,
      this.gutterDecorationElements,
      gutterDecorations.filter((decoration) => this.displayLineOf(decoration.line) >= 0),
      (decoration) =>
        `${this.lineTop(this.displayLineOf(decoration.line))}:${this.lineHeightAt(this.displayLineOf(decoration.line))}:${decoration.label || ''}:${decoration.title || ''}:${decoration.className || ''}:${this.serializeStyleObject(decoration.style)}`,
      (element, decoration) => {
        element.className = this.joinClassNames('lce-decoration lce-decoration-gutter', decoration.className);
        element.setAttribute('data-decoration-id', decoration.id);
        element.setAttribute('data-decoration-line', String(decoration.line));
        element.style.cssText = this.joinStyleFragments([
          'position: absolute',
          `top: ${this.lineTop(this.displayLineOf(decoration.line))}px`,
          `height: ${this.lineHeightAt(this.displayLineOf(decoration.line))}px`,
          'left: 0',
          'right: 0',
          'display: flex',
          'align-items: center',
          'justify-content: flex-end',
          'padding-right: 4px',
          'box-sizing: border-box',
          this.serializeStyleObject(decoration.style),
        ]);
        if (decoration.title) element.title = decoration.title;
        else element.removeAttribute('title');
        element.textContent = decoration.label || '';
      },
    );
  }

  /**
   * Keeps one element per decoration id, writing only those whose description changed. Rebuilding them all used to
   * cost several milliseconds whenever a layer changed (a thousand indent guides in a long file).
   */
  private syncDecorationElements<T extends { id: string; line: number }>(
    host: HTMLElement,
    store: Map<string, { element: HTMLElement; key: string }>,
    decorations: T[],
    describe: (decoration: T) => string,
    paint: (element: HTMLElement, decoration: T) => void,
  ): void {
    const seen = new Set<string>();
    let fragment: DocumentFragment | null = null;
    for (const decoration of decorations) {
      if (!Number.isFinite(decoration.line) || decoration.line < 0) continue;
      let id = decoration.id;
      for (let copy = 2; seen.has(id); copy += 1) id = `${decoration.id}#${copy}`;
      seen.add(id);
      const key = describe(decoration);
      const existing = store.get(id);
      if (existing) {
        if (existing.key !== key) {
          paint(existing.element, decoration);
          existing.key = key;
        }
        continue;
      }
      const element = document.createElement('div');
      paint(element, decoration);
      store.set(id, { element, key });
      (fragment ??= document.createDocumentFragment()).appendChild(element);
    }
    for (const [id, entry] of store) {
      if (!seen.has(id)) {
        entry.element.remove();
        store.delete(id);
      }
    }
    if (fragment) host.appendChild(fragment);
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

    let output = '';
    for (const key in style) {
      const value = style[key];
      if (typeof value !== 'string' || value.length === 0) continue;
      output += `${output ? '; ' : ''}${this.toKebabCase(key)}: ${value}`;
    }
    return output;
  }

  private readonly kebabCache = new Map<string, string>();

  private toKebabCase(value: string): string {
    let kebab = this.kebabCache.get(value);
    if (kebab === undefined) {
      kebab = value.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
      this.kebabCache.set(value, kebab);
    }
    return kebab;
  }

  private offsetToPositionInText(offset: number, text: string): Position {
    const boundedOffset = Math.max(0, Math.min(offset, text.length));
    if (text === this.renderedText && this.renderedLines) {
      const starts = this.getRenderedLineStarts();
      const line = View.lineIndexAt(starts, boundedOffset);
      return { line, column: boundedOffset - starts[line] };
    }
    const before = text.slice(0, boundedOffset);
    const lines = before.split('\n');
    return {
      line: lines.length - 1,
      column: lines[lines.length - 1].length,
    };
  }

  private positionToTextOffset(position: Position, text: string): number {
    if (text === this.renderedText && this.renderedLines) {
      const lines = this.renderedLines;
      const safeLine = Math.max(0, Math.min(position.line, lines.length - 1));
      const safeColumn = Math.max(0, Math.min(position.column, lines[safeLine].length));
      return this.getRenderedLineStarts()[safeLine] + safeColumn;
    }
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
