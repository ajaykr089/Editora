/**
 * Code Folding Extension
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import { EditorExtension, EditorAPI, FoldRange, Position, Range } from '../types';

type FoldProjection = {
  text: string;
  segments: Array<
    | { type: 'text'; text: string }
    | { type: 'placeholder'; text: string; fold: FoldRange; hiddenText: string }
  >;
};

type FoldSnapshot = {
  hiddenText: string;
  startLineText: string;
  endLineText: string;
  lineSpan: number;
};

export class CodeFoldingExtension implements EditorExtension {
  public readonly name = 'code-folding';
  private readonly lineHeight = 21;
  private editor: EditorAPI | null = null;
  private foldingUI: HTMLElement | null = null;
  private pendingUpdateRaf: number | null = null;
  private lastSnapshot = '';
  private changeHandler: ((changes: unknown[]) => void) | null = null;
  private foldRegions: FoldRange[] = [];
  private foldSnapshots = new Map<string, FoldSnapshot>();
  private isDisplayingFolded = false;

  setup(editor: EditorAPI): void {
    this.editor = editor;

    editor.registerCommand('fold', () => {
      this.foldAtCursor();
    });

    editor.registerCommand('unfold', () => {
      this.unfoldAtCursor();
    });

    editor.registerCommand('foldAll', () => {
      this.foldAll();
    });

    editor.registerCommand('unfoldAll', () => {
      this.unfoldAll();
    });

    this.changeHandler = () => {
      this.syncFoldingState();
    };
    editor.on('change', this.changeHandler);

    this.createFoldingUI();
    this.syncFoldingState();
  }

  onKeyDown(event: KeyboardEvent): boolean | void {
    void event;
  }

  onMouseDown(event: MouseEvent): boolean | void {
    void event;
  }

  private createFoldingUI(): void {
    if (!this.editor) return;

    const contentElement = this.editor.getView().getContentElement();
    const container = contentElement.closest(
      '[data-lce-editor-container="true"]',
    ) as HTMLElement | null;
    if (!container) return;

    this.foldingUI = document.createElement('div');
    this.foldingUI.setAttribute('data-lce-folding-ui', 'true');
    this.foldingUI.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 20px;
      pointer-events: none;
      z-index: 3;
    `;

    container.appendChild(this.foldingUI);
  }

  private syncFoldingState(): void {
    if (!this.editor) return;

    const text = this.editor.getValue();
    const previousSnapshots = this.foldSnapshots;

    this.foldRegions = this.buildFoldRegions(text);
    this.pruneInvalidFolds(text, previousSnapshots);

    if (this.hasActiveFolds()) {
      this.applyFoldedDisplay();
    } else {
      this.restoreFullDisplay();
    }

    this.rememberActiveFoldSnapshots(text);
    this.scheduleFoldIndicatorUpdate();
  }

  private scheduleFoldIndicatorUpdate(): void {
    if (this.pendingUpdateRaf !== null) return;
    this.pendingUpdateRaf = requestAnimationFrame(() => {
      this.pendingUpdateRaf = null;
      this.updateFoldIndicators();
    });
  }

  private updateFoldIndicators(): void {
    if (!this.editor || !this.foldingUI) return;

    const text = this.editor.getValue();
    const activeFoldKeys = this.getActiveFolds()
      .map((fold) => this.getFoldKey(fold))
      .join('|');
    const snapshot = `${text}::${activeFoldKeys}`;
    if (snapshot === this.lastSnapshot) return;
    this.lastSnapshot = snapshot;

    this.foldingUI.innerHTML = '';

    const activeTopLevelFolds = this.getRenderableActiveFolds();
    const fragment = document.createDocumentFragment();

    for (const region of this.foldRegions) {
      const displayLine = this.toDisplayLine(region, activeTopLevelFolds);
      if (displayLine === null) continue;
      const isCollapsed = this.isFoldActive(region);
      const indicator = this.createFoldIndicator(region, displayLine, isCollapsed);
      fragment.appendChild(indicator);
    }

    this.foldingUI.appendChild(fragment);
  }

  private buildFoldRegions(text: string): FoldRange[] {
    const lines = text.split('\n');
    const stack: Array<{ char: string; line: number; column: number }> = [];
    const regions: FoldRange[] = [];
    const openToClose: Record<string, string> = {
      '{': '}',
      '[': ']',
      '(': ')',
    };
    const closeToOpen: Record<string, string> = {
      '}': '{',
      ']': '[',
      ')': '(',
    };

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      for (let column = 0; column < line.length; column++) {
        const char = line[column];
        if (openToClose[char]) {
          stack.push({ char, line: lineIndex, column });
          continue;
        }

        const expectedOpen = closeToOpen[char];
        if (!expectedOpen) continue;

        let matchIndex = -1;
        for (let i = stack.length - 1; i >= 0; i--) {
          if (stack[i].char === expectedOpen) {
            matchIndex = i;
            break;
          }
        }
        if (matchIndex === -1) continue;

        const open = stack.splice(matchIndex, 1)[0];
        if (open.line >= lineIndex) continue;

        const startColumn = lines[open.line]?.length || 0;
        const region: FoldRange = {
          start: { line: open.line, column: startColumn },
          end: { line: lineIndex, column: 0 },
          collapsed: false,
          level: matchIndex,
        };

        if (this.isValidFoldRegion(region)) {
          regions.push(region);
        }
      }
    }

    regions.sort((a, b) => {
      if (a.start.line !== b.start.line) {
        return a.start.line - b.start.line;
      }
      if (a.end.line !== b.end.line) {
        return a.end.line - b.end.line;
      }
      return a.start.column - b.start.column;
    });

    return regions;
  }

  private createFoldIndicator(region: FoldRange, displayLine: number, isCollapsed: boolean): HTMLElement {
    const indicator = document.createElement('button');
    indicator.type = 'button';
    indicator.style.cssText = `
      position: absolute;
      left: 0;
      top: ${displayLine * this.lineHeight}px;
      width: 20px;
      height: ${this.lineHeight}px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      pointer-events: auto;
      color: var(--editor-gutter-foreground, #858585);
      background: transparent;
      border: none;
      padding: 0;
      font-size: 10px;
      user-select: none;
    `;
    indicator.textContent = isCollapsed ? '▶' : '▼';
    indicator.title = isCollapsed ? 'Expand folded region' : 'Collapse region';
    indicator.setAttribute('aria-label', indicator.title);

    indicator.addEventListener('mousedown', (event) => {
      event.preventDefault();
    });

    indicator.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.toggleFold(region);
    });

    return indicator;
  }

  private toggleFold(region: FoldRange): void {
    if (!this.editor) return;

    if (this.isFoldActive(region)) {
      this.editor.unfold(region);
    } else {
      this.editor.fold(region);
    }

    this.syncFoldingState();
  }

  private foldAtCursor(): void {
    if (!this.editor) return;
    const cursorLine = this.editor.getCursor().position.line;
    const region = this.findBestRegionForLine(cursorLine, false);
    if (!region) return;
    this.editor.fold(region);
    this.syncFoldingState();
  }

  private unfoldAtCursor(): void {
    if (!this.editor) return;
    const cursorLine = this.editor.getCursor().position.line;
    const region = this.findBestRegionForLine(cursorLine, true);
    if (!region) return;
    this.editor.unfold(region);
    this.syncFoldingState();
  }

  private foldAll(): void {
    if (!this.editor) return;
    const topLevelRegions = this.getTopLevelFoldRegions(this.foldRegions);
    for (const region of topLevelRegions) {
      this.editor.fold(region);
    }
    this.syncFoldingState();
  }

  private unfoldAll(): void {
    if (!this.editor) return;
    const activeFolds = this.getActiveFolds();
    for (const fold of activeFolds) {
      this.editor.unfold(fold);
    }
    this.syncFoldingState();
  }

  private applyFoldedDisplay(): void {
    if (!this.editor) return;

    const activeFolds = this.getRenderableActiveFolds();
    if (activeFolds.length === 0) {
      this.restoreFullDisplay();
      return;
    }

    const projection = this.buildFoldedProjection(this.editor.getValue(), activeFolds);
    this.withPreservedSelection(() => {
      this.renderEditorText(projection.text);
      this.renderFoldPlaceholders(projection);
      this.isDisplayingFolded = true;
    });
  }

  private restoreFullDisplay(): void {
    if (!this.editor) return;

    if (this.isDisplayingFolded) {
      this.withPreservedSelection(() => {
        this.renderEditorText(this.editor!.getValue());
      });
    }

    this.isDisplayingFolded = false;
  }

  private renderEditorText(text: string): void {
    if (!this.editor) return;

    const coreLike = this.editor as EditorAPI & {
      expectingProgrammaticCursor?: boolean;
      renderTextWithHighlight?: (text: string, restoreSelection?: boolean) => void;
    };

    if (typeof coreLike.renderTextWithHighlight === 'function') {
      coreLike.expectingProgrammaticCursor = true;
      coreLike.renderTextWithHighlight(text, false);
      coreLike.expectingProgrammaticCursor = false;
      return;
    }

    this.editor.getView().setText(text);
  }

  private buildFoldedProjection(text: string, folds: FoldRange[]): FoldProjection {
    const { lineStarts, lines } = this.buildLineStarts(text);
    const sortedFolds = [...folds].sort((a, b) => this.comparePositions(a.start, b.start));
    let output = '';
    const segments: FoldProjection['segments'] = [];
    let cursor = 0;

    for (const fold of sortedFolds) {
      const startOffset = this.positionToOffset(fold.start, lineStarts, lines);
      const endOffset = this.positionToOffset(fold.end, lineStarts, lines);
      const leadingText = text.slice(cursor, startOffset);
      const placeholderText = this.getFoldPlaceholder(fold);
      const hiddenText = text.slice(startOffset, endOffset);
      output += leadingText;
      output += placeholderText;
      if (leadingText) {
        segments.push({ type: 'text', text: leadingText });
      }
      segments.push({
        type: 'placeholder',
        text: placeholderText,
        fold,
        hiddenText,
      });
      cursor = endOffset;
    }

    const trailingText = text.slice(cursor);
    output += trailingText;
    if (trailingText) {
      segments.push({ type: 'text', text: trailingText });
    }
    return { text: output, segments };
  }

  private renderFoldPlaceholders(projection: FoldProjection): void {
    if (!this.editor) return;

    const contentElement = this.editor.getView().getContentElement();
    const placeholderSources = new Map<string, string>();
    const fragment = document.createDocumentFragment();

    for (const segment of projection.segments) {
      if (segment.type === 'text') {
        fragment.appendChild(document.createTextNode(segment.text));
        continue;
      }

      const placeholder = document.createElement('span');
      const foldKey = this.getFoldKey(segment.fold);
      placeholder.setAttribute('data-lce-fold-placeholder', foldKey);
      placeholder.setAttribute('aria-label', 'Folded region');
      placeholder.contentEditable = 'false';
      placeholderSources.set(foldKey, segment.hiddenText);
      placeholder.style.cssText = `
        cursor: text;
        user-select: text;
        pointer-events: auto;
        white-space: pre;
      `;
      placeholder.textContent = segment.text;
      fragment.appendChild(placeholder);
    }

    contentElement.replaceChildren(fragment);
    (
      contentElement as HTMLElement & {
        __lceFoldPlaceholderSources?: Map<string, string>;
      }
    ).__lceFoldPlaceholderSources = placeholderSources;
    this.editor.getView().syncTrailingNewlineMarkerForText(projection.text);
  }

  private getFoldPlaceholder(fold: FoldRange): string {
    const hiddenLines = Math.max(1, fold.end.line - fold.start.line);
    return ` … ${hiddenLines} ${hiddenLines === 1 ? 'line' : 'lines'} … `;
  }

  private pruneInvalidFolds(text: string, previousSnapshots: Map<string, FoldSnapshot>): void {
    if (!this.editor) return;

    const activeFolds = this.editor.getFolds().filter((fold) => fold.collapsed !== false);
    const currentKeys = new Set(activeFolds.map((fold) => this.getFoldKey(fold)));
    const nextFolds: FoldRange[] = [];
    const claimedKeys = new Set<string>();

    for (const fold of activeFolds) {
      const replacement = this.findReplacementFold(
        fold,
        previousSnapshots.get(this.getFoldKey(fold)),
        claimedKeys,
        text,
      );
      if (!replacement) {
        continue;
      }

      const replacementKey = this.getFoldKey(replacement);
      nextFolds.push(replacement);
      claimedKeys.add(replacementKey);
    }

    const nextKeys = new Set(nextFolds.map((fold) => this.getFoldKey(fold)));

    for (const fold of activeFolds) {
      if (!nextKeys.has(this.getFoldKey(fold))) {
        this.editor.unfold(fold);
      }
    }

    for (const fold of nextFolds) {
      if (!currentKeys.has(this.getFoldKey(fold))) {
        this.editor.fold(fold);
      }
    }
  }

  private getActiveFolds(): FoldRange[] {
    if (!this.editor) return [];
    return this.editor.getFolds().filter((fold) => fold.collapsed !== false);
  }

  private hasActiveFolds(): boolean {
    return this.getActiveFolds().length > 0;
  }

  private getRenderableActiveFolds(): FoldRange[] {
    return this.getTopLevelFoldRegions(this.getActiveFolds());
  }

  private getTopLevelFoldRegions(regions: FoldRange[]): FoldRange[] {
    const sorted = [...regions].sort((a, b) => this.comparePositions(a.start, b.start));
    const topLevel: FoldRange[] = [];

    for (const region of sorted) {
      const parent = topLevel[topLevel.length - 1];
      if (parent && this.containsRange(parent, region)) {
        continue;
      }
      topLevel.push(region);
    }

    return topLevel;
  }

  private toDisplayLine(region: FoldRange, activeTopLevelFolds: FoldRange[]): number | null {
    let hiddenLines = 0;

    for (const fold of activeTopLevelFolds) {
      if (this.isSameRange(fold, region)) {
        break;
      }

      if (this.containsRange(fold, region)) {
        return null;
      }

      if (fold.end.line <= region.start.line) {
        hiddenLines += fold.end.line - fold.start.line;
      }
    }

    return region.start.line - hiddenLines;
  }

  private findBestRegionForLine(line: number, activeOnly: boolean): FoldRange | null {
    const regions = activeOnly ? this.getActiveFolds() : this.foldRegions;
    const candidates = regions.filter((region) =>
      region.start.line <= line && region.end.line >= line,
    );
    if (candidates.length === 0) return null;

    candidates.sort((a, b) => {
      const aSpan = a.end.line - a.start.line;
      const bSpan = b.end.line - b.start.line;
      if (aSpan !== bSpan) {
        return aSpan - bSpan;
      }
      return this.comparePositions(a.start, b.start);
    });

    return candidates[0];
  }

  private findReplacementFold(
    previous: FoldRange,
    previousSnapshot: FoldSnapshot | undefined,
    activeKeys: Set<string>,
    text: string,
  ): FoldRange | null {
    const exactKey = this.getFoldKey(previous);
    const exactMatch = this.foldRegions.find(
      (region) =>
        this.getFoldKey(region) === exactKey &&
        !activeKeys.has(exactKey),
    );
    if (exactMatch) {
      return exactMatch;
    }

    const previousSpan = previous.end.line - previous.start.line;
    const previousFallbackSnapshot = previousSnapshot ?? this.createFoldSnapshot(previous, text);
    const ranked = this.foldRegions
      .filter((region) => !activeKeys.has(this.getFoldKey(region)))
      .map((region) => {
        const snapshot = this.createFoldSnapshot(region, text);
        const startLineMatch =
          previousFallbackSnapshot &&
          snapshot?.startLineText === previousFallbackSnapshot.startLineText
            ? 1
            : 0;
        const endLineMatch =
          previousFallbackSnapshot &&
          snapshot?.endLineText === previousFallbackSnapshot.endLineText
            ? 1
            : 0;
        const lineSpanMatch =
          previousFallbackSnapshot &&
          snapshot?.lineSpan === previousFallbackSnapshot.lineSpan
            ? 1
            : 0;
        return {
          region,
          overlaps: this.lineRangeOverlap(previous, region),
          lineDistance:
            Math.abs(region.start.line - previous.start.line) +
            Math.abs(region.end.line - previous.end.line),
          spanDistance: Math.abs(
            (region.end.line - region.start.line) - previousSpan,
          ),
          columnDistance:
            Math.abs(region.start.column - previous.start.column) +
            Math.abs(region.end.column - previous.end.column),
          hiddenTextMatch:
            previousFallbackSnapshot &&
            snapshot?.hiddenText === previousFallbackSnapshot.hiddenText
              ? 1
              : 0,
          boundaryMatchScore: startLineMatch + endLineMatch + lineSpanMatch,
        };
      })
      .sort((a, b) => {
        if (a.hiddenTextMatch !== b.hiddenTextMatch) {
          return b.hiddenTextMatch - a.hiddenTextMatch;
        }
        if (a.boundaryMatchScore !== b.boundaryMatchScore) {
          return b.boundaryMatchScore - a.boundaryMatchScore;
        }
        if (a.overlaps !== b.overlaps) {
          return b.overlaps - a.overlaps;
        }
        if (a.lineDistance !== b.lineDistance) {
          return a.lineDistance - b.lineDistance;
        }
        if (a.spanDistance !== b.spanDistance) {
          return a.spanDistance - b.spanDistance;
        }
        return a.columnDistance - b.columnDistance;
      });

    const best = ranked[0];
    if (!best) {
      return null;
    }

    const isNearStructuralMatch =
      best.lineDistance <= 2 && best.spanDistance <= 1;
    const hasStrongSnapshotMatch =
      best.hiddenTextMatch === 1 || best.boundaryMatchScore >= 2;

    if (!hasStrongSnapshotMatch && !isNearStructuralMatch) {
      return null;
    }

    return best.region;
  }

  private lineRangeOverlap(a: FoldRange, b: FoldRange): number {
    const start = Math.max(a.start.line, b.start.line);
    const end = Math.min(a.end.line, b.end.line);
    return Math.max(0, end - start);
  }

  private rememberActiveFoldSnapshots(text: string): void {
    const nextSnapshots = new Map<string, FoldSnapshot>();

    for (const fold of this.getActiveFolds()) {
      const snapshot = this.createFoldSnapshot(fold, text);
      if (!snapshot) {
        continue;
      }
      nextSnapshots.set(this.getFoldKey(fold), snapshot);
    }

    this.foldSnapshots = nextSnapshots;
  }

  private createFoldSnapshot(fold: FoldRange, text: string): FoldSnapshot | null {
    const { lineStarts, lines } = this.buildLineStarts(text);
    if (lines.length === 0) {
      return null;
    }

    const startOffset = this.positionToOffset(fold.start, lineStarts, lines);
    const endOffset = this.positionToOffset(fold.end, lineStarts, lines);
    const safeStartLine = Math.max(0, Math.min(fold.start.line, lines.length - 1));
    const safeEndLine = Math.max(0, Math.min(fold.end.line, lines.length - 1));

    return {
      hiddenText: text.slice(startOffset, endOffset),
      startLineText: lines[safeStartLine] ?? '',
      endLineText: lines[safeEndLine] ?? '',
      lineSpan: fold.end.line - fold.start.line,
    };
  }

  private withPreservedSelection(render: () => void): void {
    if (!this.editor) {
      render();
      return;
    }

    const view = this.editor.getView();
    const contentElement = view.getContentElement();
    const wasFocused = document.activeElement === contentElement;
    const selectionOffsets = view.getSelectionOffsets();
    const shouldRestoreSelection = selectionOffsets.isInEditor;

    render();

    if (!shouldRestoreSelection) {
      return;
    }

    const remappedSelectionOffsets = this.remapSelectionOffsetsForVisibleDisplay(
      selectionOffsets.anchorOffset ?? selectionOffsets.startOffset,
      selectionOffsets.focusOffset ?? selectionOffsets.endOffset,
    );
    view.setSelectionBoundaryOffsets(
      remappedSelectionOffsets.startOffset,
      remappedSelectionOffsets.endOffset,
    );
    if (wasFocused || selectionOffsets.isInEditor) {
      this.editor.focus();
    }
  }

  private remapSelectionOffsetsForVisibleDisplay(
    startOffset: number,
    endOffset: number,
  ): { startOffset: number; endOffset: number } {
    if (!this.editor) {
      return { startOffset, endOffset };
    }

    const text = this.editor.getValue();
    const { lineStarts, lines } = this.buildLineStarts(text);
    const activeTopLevelFolds = this.getRenderableActiveFolds();
    if (activeTopLevelFolds.length === 0) {
      const maxOffset = text.length;
      return {
        startOffset: Math.max(0, Math.min(startOffset, maxOffset)),
        endOffset: Math.max(0, Math.min(endOffset, maxOffset)),
      };
    }

    return {
      startOffset: this.remapOffsetToVisibleBoundary(
        startOffset,
        activeTopLevelFolds,
        lineStarts,
        lines,
        text.length,
      ),
      endOffset: this.remapOffsetToVisibleBoundary(
        endOffset,
        activeTopLevelFolds,
        lineStarts,
        lines,
        text.length,
      ),
    };
  }

  private remapOffsetToVisibleBoundary(
    offset: number,
    folds: FoldRange[],
    lineStarts: number[],
    lines: string[],
    maxOffset: number,
  ): number {
    const boundedOffset = Math.max(0, Math.min(offset, maxOffset));

    for (const fold of folds) {
      const foldStartOffset = this.positionToOffset(fold.start, lineStarts, lines);
      const foldEndOffset = this.positionToOffset(fold.end, lineStarts, lines);
      if (boundedOffset <= foldStartOffset || boundedOffset >= foldEndOffset) {
        continue;
      }

      const distanceToStart = boundedOffset - foldStartOffset;
      const distanceToEnd = foldEndOffset - boundedOffset;
      return distanceToStart <= distanceToEnd
        ? foldStartOffset
        : foldEndOffset;
    }

    return boundedOffset;
  }

  private buildLineStarts(text: string): { lineStarts: number[]; lines: string[] } {
    const lines = text.split('\n');
    const lineStarts: number[] = new Array(lines.length);
    let running = 0;
    for (let i = 0; i < lines.length; i++) {
      lineStarts[i] = running;
      running += lines[i].length + 1;
    }
    return { lineStarts, lines };
  }

  private positionToOffset(position: Position, lineStarts: number[], lines: string[]): number {
    const safeLine = Math.max(0, Math.min(position.line, lines.length - 1));
    const safeColumn = Math.max(0, Math.min(position.column, lines[safeLine]?.length || 0));
    return lineStarts[safeLine] + safeColumn;
  }

  private comparePositions(a: Position, b: Position): number {
    if (a.line !== b.line) {
      return a.line - b.line;
    }
    return a.column - b.column;
  }

  private containsRange(parent: FoldRange, child: FoldRange): boolean {
    return (
      this.comparePositions(parent.start, child.start) <= 0 &&
      this.comparePositions(parent.end, child.end) >= 0 &&
      !this.isSameRange(parent, child)
    );
  }

  private isSameRange(a: Range, b: Range): boolean {
    return (
      a.start.line === b.start.line &&
      a.start.column === b.start.column &&
      a.end.line === b.end.line &&
      a.end.column === b.end.column
    );
  }

  private isFoldActive(region: FoldRange): boolean {
    return this.getActiveFolds().some((fold) => this.isSameRange(fold, region));
  }

  private isValidFoldRegion(region: FoldRange): boolean {
    return (
      region.start.line < region.end.line &&
      (region.start.line !== region.end.line || region.start.column !== region.end.column)
    );
  }

  private getFoldKey(range: Range): string {
    return `${range.start.line}:${range.start.column}-${range.end.line}:${range.end.column}`;
  }

  destroy(): void {
    if (this.pendingUpdateRaf !== null) {
      cancelAnimationFrame(this.pendingUpdateRaf);
      this.pendingUpdateRaf = null;
    }
    if (this.editor && this.changeHandler) {
      this.editor.off('change', this.changeHandler);
    }
    if (this.foldingUI && this.foldingUI.parentNode) {
      this.foldingUI.parentNode.removeChild(this.foldingUI);
    }

    this.restoreFullDisplay();
    this.changeHandler = null;
    this.lastSnapshot = '';
    this.foldingUI = null;
    this.foldRegions = [];
    this.editor = null;
  }
}
