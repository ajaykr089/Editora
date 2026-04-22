/**
 * Formatting Extension
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import {
  Cursor,
  EditorAPI,
  EditorExtension,
  Formatter,
  FormattingContext,
  FormattingMode,
  FormattingResult,
  Position,
  Range,
} from '../types';

export interface FormattingExtensionConfig {
  formatter?: Formatter;
  timeoutMs?: number;
  showStatusBar?: boolean;
  successDurationMs?: number;
  errorDurationMs?: number;
}

type RequiredFormattingConfig = {
  formatter?: Formatter;
  timeoutMs: number;
  showStatusBar: boolean;
  successDurationMs: number;
  errorDurationMs: number;
};

type StatusTone = 'info' | 'success' | 'warning' | 'error';

type NormalizedFormattingResult = {
  text: string;
  range: Range;
  selection?: Range;
  cursor?: Position;
};

type SelectionSnapshot = {
  selection?: Range;
  cursor: Cursor;
};

export class FormattingExtension implements EditorExtension {
  public readonly name = 'formatting';

  private editor: EditorAPI | null = null;
  private statusElement: HTMLElement | null = null;
  private summaryElement: HTMLElement | null = null;
  private detailElement: HTMLElement | null = null;
  private statusTimer: ReturnType<typeof setTimeout> | null = null;
  private requestSequence = 0;
  private activeAbortController: AbortController | null = null;
  private readonly config: RequiredFormattingConfig;

  constructor(config: FormattingExtensionConfig = {}) {
    this.config = {
      formatter: config.formatter,
      timeoutMs: Math.max(50, Math.floor(config.timeoutMs ?? 4000)),
      showStatusBar: config.showStatusBar ?? true,
      successDurationMs: Math.max(400, Math.floor(config.successDurationMs ?? 1800)),
      errorDurationMs: Math.max(800, Math.floor(config.errorDurationMs ?? 3600)),
    };
  }

  setup(editor: EditorAPI): void {
    this.editor = editor;

    editor.registerCommand('formatDocument', () => {
      void this.format('document');
    });

    editor.registerCommand('formatSelection', () => {
      void this.format('selection');
    });

    if (this.config.showStatusBar) {
      this.createStatusBar();
    }
  }

  async formatDocument(): Promise<boolean> {
    return this.format('document');
  }

  async formatSelection(): Promise<boolean> {
    return this.format('selection');
  }

  private async format(mode: FormattingMode): Promise<boolean> {
    if (!this.editor) {
      return false;
    }

    if (this.editor.getState().readOnly) {
      this.showStatus(
        'Formatting unavailable',
        'The editor is read-only.',
        'warning',
        this.config.errorDurationMs,
      );
      return false;
    }

    if (!this.config.formatter) {
      this.showStatus(
        'No formatter configured',
        'Provide a formatter function to use this extension.',
        'warning',
        this.config.errorDurationMs,
      );
      return false;
    }

    const text = this.editor.getValue();
    const selectionSnapshot = this.captureSelectionSnapshot();
    const range =
      mode === 'selection'
        ? selectionSnapshot.selection
        : this.getFullDocumentRange(text);

    if (!range) {
      this.showStatus(
        'Nothing selected',
        'Select a range first, or run document formatting instead.',
        'warning',
        this.config.errorDurationMs,
      );
      return false;
    }

    const input = this.sliceTextByRange(text, range);
    const requestId = ++this.requestSequence;
    this.abortActiveRequest();
    const controller = new AbortController();
    this.activeAbortController = controller;

    this.showStatus(
      mode === 'selection' ? 'Formatting selection…' : 'Formatting document…',
      mode === 'selection'
        ? 'Applying formatter to the current selection.'
        : 'Applying formatter to the full document.',
      'info',
    );

    try {
      const rawResult = await this.runFormatterWithTimeout(
        this.config.formatter,
        {
          editor: this.editor,
          text,
          input,
          cursor: selectionSnapshot.cursor,
          selection: selectionSnapshot.selection,
          range,
          mode,
          abortSignal: controller.signal,
        },
        controller,
        this.config.timeoutMs,
      );

      if (requestId !== this.requestSequence || !this.editor) {
        return false;
      }

      const normalizedResult = this.normalizeFormattingResult(rawResult, text, range);
      const originalSegment = this.sliceTextByRange(text, normalizedResult.range);
      if (normalizedResult.text === originalSegment && !normalizedResult.selection && !normalizedResult.cursor) {
        this.showStatus(
          'Already formatted',
          mode === 'selection'
            ? 'The selected text did not need changes.'
            : 'The document is already in the formatter’s preferred shape.',
          'success',
          this.config.successDurationMs,
        );
        return true;
      }

      const nextText = this.applyRangeToText(text, normalizedResult.range, normalizedResult.text);
      const nextSelection =
        normalizedResult.selection ||
        this.mapSelectionAfterFormat(
          text,
          nextText,
          normalizedResult.range,
          normalizedResult.text,
          selectionSnapshot.selection,
        );
      const nextCursor =
        normalizedResult.cursor ||
        this.mapCursorAfterFormat(
          text,
          nextText,
          normalizedResult.range,
          normalizedResult.text,
          selectionSnapshot.cursor.position,
          !!selectionSnapshot.selection,
        );

      this.editor.replace(normalizedResult.range, normalizedResult.text);

      if (normalizedResult.selection || selectionSnapshot.selection) {
        if (nextSelection) {
          this.editor.setSelection(this.clampRangeToText(nextSelection, nextText));
        } else {
          this.editor.setCursor(this.clampPositionToText(nextCursor, nextText));
        }
      } else {
        this.editor.setCursor(this.clampPositionToText(nextCursor, nextText));
      }

      this.editor.focus();
      this.editor.getView().scrollToPosition(
        nextSelection?.start || this.clampPositionToText(nextCursor, nextText),
      );

      this.showStatus(
        mode === 'selection' ? 'Selection formatted' : 'Document formatted',
        mode === 'selection'
          ? 'Formatting completed and kept the formatted block selected.'
          : 'Formatting completed successfully.',
        'success',
        this.config.successDurationMs,
      );
      return true;
    } catch (error) {
      if (requestId !== this.requestSequence || !this.editor) {
        return false;
      }

      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Formatter failed unexpectedly.';
      this.showStatus(
        'Formatting failed',
        message,
        'error',
        this.config.errorDurationMs,
      );
      return false;
    } finally {
      if (this.activeAbortController === controller) {
        this.activeAbortController = null;
      }
    }
  }

  private runFormatterWithTimeout(
    formatter: Formatter,
    context: FormattingContext,
    controller: AbortController,
    timeoutMs: number,
  ): Promise<string | FormattingResult> {
    return new Promise((resolve, reject) => {
      let settled = false;
      const handleAbort = () => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timer);
        reject(new Error('Formatting request was cancelled.'));
      };
      const timer = window.setTimeout(() => {
        if (settled) {
          return;
        }
        settled = true;
        context.abortSignal?.removeEventListener('abort', handleAbort);
        controller.abort();
        reject(new Error(`Formatter timed out after ${timeoutMs}ms.`));
      }, timeoutMs);
      context.abortSignal?.addEventListener('abort', handleAbort, { once: true });

      Promise.resolve(formatter(context))
        .then((result) => {
          if (settled) {
            return;
          }
          settled = true;
          clearTimeout(timer);
          context.abortSignal?.removeEventListener('abort', handleAbort);
          resolve(result);
        })
        .catch((error) => {
          if (settled) {
            return;
          }
          settled = true;
          clearTimeout(timer);
          context.abortSignal?.removeEventListener('abort', handleAbort);
          reject(error);
        });
    });
  }

  private normalizeFormattingResult(
    result: string | FormattingResult,
    text: string,
    fallbackRange: Range,
  ): NormalizedFormattingResult {
    if (typeof result === 'string') {
      return {
        text: this.normalizeLineEndings(result),
        range: this.clampRangeToText(fallbackRange, text),
      };
    }

    if (!result || typeof result.text !== 'string') {
      throw new Error('Formatter result must be a string or an object with a text field.');
    }

    const nextText = this.normalizeLineEndings(result.text);
    const range = this.clampRangeToText(result.range || fallbackRange, text);

    return {
      text: nextText,
      range,
      selection: result.selection,
      cursor: result.cursor,
    };
  }

  private captureSelectionSnapshot(): SelectionSnapshot {
    const cursor = this.editor?.getCursor() || { position: { line: 0, column: 0 } };
    const selection = this.editor?.getSelection();
    return {
      cursor,
      selection,
    };
  }

  private mapSelectionAfterFormat(
    previousText: string,
    nextText: string,
    range: Range,
    replacement: string,
    selection?: Range,
  ): Range | undefined {
    if (!selection) {
      return undefined;
    }

    const rangeStart = this.positionToOffset(range.start, previousText);
    const rangeEnd = this.positionToOffset(range.end, previousText);
    const nextLength = replacement.length;
    const isWholeDocumentEdit = rangeStart === 0 && rangeEnd === previousText.length;

    const nextStartOffset = isWholeDocumentEdit
      ? this.mapOffsetThroughWholeDocumentFormat(
        this.positionToOffset(selection.start, previousText),
        previousText,
        nextText,
      )
      : this.mapOffsetThroughSingleEdit(
        this.positionToOffset(selection.start, previousText),
        rangeStart,
        rangeEnd,
        nextLength,
        'backward',
      );
    const nextEndOffset = isWholeDocumentEdit
      ? this.mapOffsetThroughWholeDocumentFormat(
        this.positionToOffset(selection.end, previousText),
        previousText,
        nextText,
      )
      : this.mapOffsetThroughSingleEdit(
        this.positionToOffset(selection.end, previousText),
        rangeStart,
        rangeEnd,
        nextLength,
        'forward',
      );

    return this.normalizeRange({
      start: this.offsetToPosition(nextStartOffset, nextText),
      end: this.offsetToPosition(nextEndOffset, nextText),
    });
  }

  private mapCursorAfterFormat(
    previousText: string,
    nextText: string,
    range: Range,
    replacement: string,
    cursor: Position,
    hadSelection: boolean,
  ): Position {
    if (hadSelection) {
      const mappedSelection = this.mapSelectionAfterFormat(
        previousText,
        nextText,
        range,
        replacement,
        {
          start: cursor,
          end: cursor,
        },
      );
      if (mappedSelection) {
        return mappedSelection.end;
      }
    }

    const cursorOffset = this.positionToOffset(cursor, previousText);
    const rangeStart = this.positionToOffset(range.start, previousText);
    const rangeEnd = this.positionToOffset(range.end, previousText);
    const isWholeDocumentEdit = rangeStart === 0 && rangeEnd === previousText.length;
    const nextOffset = isWholeDocumentEdit
      ? this.mapOffsetThroughWholeDocumentFormat(cursorOffset, previousText, nextText)
      : this.mapOffsetThroughSingleEdit(
        cursorOffset,
        rangeStart,
        rangeEnd,
        replacement.length,
        'forward',
      );

    return this.offsetToPosition(nextOffset, nextText);
  }

  private mapOffsetThroughSingleEdit(
    offset: number,
    start: number,
    end: number,
    replacementLength: number,
    association: 'forward' | 'backward',
  ): number {
    if (offset < start) {
      return offset;
    }

    if (offset > end) {
      return start + replacementLength + (offset - end);
    }

    return association === 'backward' ? start : start + replacementLength;
  }

  private mapOffsetThroughWholeDocumentFormat(
    offset: number,
    previousText: string,
    nextText: string,
  ): number {
    const prefixLength = this.getCommonPrefixLength(previousText, nextText);
    const suffixLength = this.getCommonSuffixLength(previousText, nextText, prefixLength);
    const previousLength = previousText.length;
    const nextLength = nextText.length;

    if (offset <= prefixLength) {
      return offset;
    }

    const trailingDistance = previousLength - offset;
    if (trailingDistance <= suffixLength) {
      return Math.max(0, nextLength - trailingDistance);
    }

    const previousChangedLength = Math.max(1, previousLength - prefixLength - suffixLength);
    const nextChangedLength = Math.max(0, nextLength - prefixLength - suffixLength);
    const relativeOffset = offset - prefixLength;
    const scaledOffset = Math.round((relativeOffset / previousChangedLength) * nextChangedLength);
    return Math.max(0, Math.min(nextLength, prefixLength + scaledOffset));
  }

  private getCommonPrefixLength(a: string, b: string): number {
    const limit = Math.min(a.length, b.length);
    let index = 0;
    while (index < limit && a[index] === b[index]) {
      index += 1;
    }
    return index;
  }

  private getCommonSuffixLength(a: string, b: string, prefixLength: number): number {
    const maxSuffix = Math.min(a.length, b.length) - prefixLength;
    let suffix = 0;
    while (
      suffix < maxSuffix &&
      a[a.length - 1 - suffix] === b[b.length - 1 - suffix]
    ) {
      suffix += 1;
    }
    return suffix;
  }

  private createStatusBar(): void {
    if (!this.editor || this.statusElement) {
      return;
    }

    const container = this.editor
      .getView()
      .getContentElement()
      .closest('[data-lce-editor-container="true"]') as HTMLElement | null;
    if (!container) {
      return;
    }

    this.statusElement = document.createElement('div');
    this.statusElement.setAttribute('data-lce-formatting-status', 'true');
    this.statusElement.style.cssText = `
      position: absolute;
      left: 12px;
      bottom: 12px;
      z-index: 4;
      max-width: min(420px, calc(100% - 24px));
      padding: 8px 10px;
      border-radius: 8px;
      border: 1px solid rgba(56, 189, 248, 0.18);
      background: rgba(15, 23, 42, 0.9);
      color: #e2e8f0;
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.22);
      pointer-events: none;
      font-family: inherit;
      font-size: 12px;
      line-height: 1.45;
      backdrop-filter: blur(8px);
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 140ms ease, transform 140ms ease;
    `;

    this.summaryElement = document.createElement('div');
    this.summaryElement.style.cssText = `
      font-weight: 700;
      letter-spacing: 0.01em;
    `;

    this.detailElement = document.createElement('div');
    this.detailElement.style.cssText = `
      margin-top: 4px;
      color: rgba(226, 232, 240, 0.9);
    `;

    this.statusElement.appendChild(this.summaryElement);
    this.statusElement.appendChild(this.detailElement);
    container.appendChild(this.statusElement);
  }

  private showStatus(
    summary: string,
    detail: string,
    tone: StatusTone,
    autoHideMs?: number,
  ): void {
    if (!this.statusElement || !this.summaryElement || !this.detailElement) {
      return;
    }

    if (this.statusTimer) {
      clearTimeout(this.statusTimer);
      this.statusTimer = null;
    }

    const toneStyles: Record<StatusTone, { border: string; background: string }> = {
      info: {
        border: 'rgba(56, 189, 248, 0.2)',
        background: 'rgba(15, 23, 42, 0.9)',
      },
      success: {
        border: 'rgba(74, 222, 128, 0.28)',
        background: 'rgba(4, 120, 87, 0.92)',
      },
      warning: {
        border: 'rgba(251, 191, 36, 0.32)',
        background: 'rgba(120, 53, 15, 0.94)',
      },
      error: {
        border: 'rgba(248, 113, 113, 0.32)',
        background: 'rgba(127, 29, 29, 0.94)',
      },
    };

    this.summaryElement.textContent = summary;
    this.detailElement.textContent = detail;
    this.statusElement.style.borderColor = toneStyles[tone].border;
    this.statusElement.style.background = toneStyles[tone].background;
    this.statusElement.style.opacity = '1';
    this.statusElement.style.transform = 'translateY(0)';

    if (autoHideMs && autoHideMs > 0) {
      this.statusTimer = setTimeout(() => {
        if (!this.statusElement) {
          return;
        }
        this.statusElement.style.opacity = '0';
        this.statusElement.style.transform = 'translateY(8px)';
      }, autoHideMs);
    }
  }

  private abortActiveRequest(): void {
    if (this.activeAbortController) {
      this.activeAbortController.abort();
      this.activeAbortController = null;
    }
  }

  private normalizeRange(range: Range): Range {
    return this.comparePositions(range.start, range.end) <= 0
      ? range
      : { start: range.end, end: range.start };
  }

  private comparePositions(a: Position, b: Position): number {
    if (a.line !== b.line) {
      return a.line - b.line;
    }
    return a.column - b.column;
  }

  private clampRangeToText(range: Range, text: string): Range {
    return this.normalizeRange({
      start: this.clampPositionToText(range.start, text),
      end: this.clampPositionToText(range.end, text),
    });
  }

  private clampPositionToText(position: Position, text: string): Position {
    const lines = text.split('\n');
    const safeLine = Math.max(0, Math.min(position.line, Math.max(0, lines.length - 1)));
    const safeColumn = Math.max(0, Math.min(position.column, lines[safeLine]?.length ?? 0));
    return {
      line: safeLine,
      column: safeColumn,
    };
  }

  private positionToOffset(position: Position, text: string): number {
    const safe = this.clampPositionToText(position, text);
    const lines = text.split('\n');
    let offset = 0;
    for (let index = 0; index < safe.line; index++) {
      offset += (lines[index]?.length ?? 0) + 1;
    }
    return offset + safe.column;
  }

  private offsetToPosition(offset: number, text: string): Position {
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

  private sliceTextByRange(text: string, range: Range): string {
    const normalizedRange = this.clampRangeToText(range, text);
    return text.slice(
      this.positionToOffset(normalizedRange.start, text),
      this.positionToOffset(normalizedRange.end, text),
    );
  }

  private applyRangeToText(text: string, range: Range, replacement: string): string {
    const normalizedRange = this.clampRangeToText(range, text);
    const startOffset = this.positionToOffset(normalizedRange.start, text);
    const endOffset = this.positionToOffset(normalizedRange.end, text);
    return text.slice(0, startOffset) + replacement + text.slice(endOffset);
  }

  private getFullDocumentRange(text: string): Range {
    const lines = text.split('\n');
    return {
      start: { line: 0, column: 0 },
      end: {
        line: Math.max(0, lines.length - 1),
        column: lines[lines.length - 1]?.length ?? 0,
      },
    };
  }

  private normalizeLineEndings(text: string): string {
    return text.replace(/\r\n?/g, '\n');
  }

  destroy(): void {
    this.abortActiveRequest();
    if (this.statusTimer) {
      clearTimeout(this.statusTimer);
      this.statusTimer = null;
    }
    if (this.statusElement?.parentNode) {
      this.statusElement.parentNode.removeChild(this.statusElement);
    }
    this.statusElement = null;
    this.summaryElement = null;
    this.detailElement = null;
    this.editor = null;
  }
}
