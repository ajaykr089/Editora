/**
 * Lightweight Code Editor - Text Model
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import { Position, Range, TextChange } from './types';

export class TextModel {
  private _lines: string[] = [];
  private _version = 0;

  constructor(text: string = '') {
    this.setText(text);
  }

  // Get line at index
  getLine(line: number): string {
    return this._lines[line] || '';
  }

  // Get all lines
  getLines(): string[] {
    return [...this._lines];
  }

  // Get total number of lines
  getLineCount(): number {
    return this._lines.length;
  }

  // Get total text content
  getText(): string {
    return this._lines.join('\n');
  }

  // Set entire text content
  setText(text: string): void {
    this._lines = text.split('\n');
    this._version++;
  }

  // Get text in a range
  getTextInRange(range: Range): string {
    if (range.start.line === range.end.line) {
      return this.getLine(range.start.line).substring(range.start.column, range.end.column);
    }

    const lines = [];
    lines.push(this.getLine(range.start.line).substring(range.start.column));

    for (let i = range.start.line + 1; i < range.end.line; i++) {
      lines.push(this.getLine(i));
    }

    if (range.end.line < this.getLineCount()) {
      lines.push(this.getLine(range.end.line).substring(0, range.end.column));
    }

    return lines.join('\n');
  }

  // Replace text in range
  replaceRange(range: Range, text: string): TextChange {
    const normalizedRange = this.normalizeRange(range);
    const oldText = this.getTextInRange(normalizedRange);
    const fullText = this.getText();
    const startOffset = this.positionToOffset(normalizedRange.start);
    const endOffset = this.positionToOffset(normalizedRange.end);
    const nextText =
      fullText.slice(0, startOffset) +
      text +
      fullText.slice(endOffset);

    this.setText(nextText);
    return { range: normalizedRange, text, oldText };
  }

  // Insert text at position
  insertText(position: Position, text: string): TextChange {
    const range = { start: position, end: position };
    return this.replaceRange(range, text);
  }

  // Delete text in range
  deleteRange(range: Range): TextChange {
    return this.replaceRange(range, '');
  }

  // Convert position to offset
  positionToOffset(position: Position): number {
    let offset = 0;
    for (let i = 0; i < position.line; i++) {
      offset += this.getLine(i).length + 1; // +1 for newline
    }
    offset += position.column;
    return offset;
  }

  // Convert offset to position
  offsetToPosition(offset: number): Position {
    let remaining = offset;
    for (let line = 0; line < this.getLineCount(); line++) {
      const lineLength = this.getLine(line).length;
      if (remaining <= lineLength) {
        return { line, column: remaining };
      }
      remaining -= lineLength + 1; // +1 for newline
    }
    // Past end of document
    return {
      line: this.getLineCount() - 1,
      column: this.getLine(this.getLineCount() - 1).length
    };
  }

  // Validate position
  isValidPosition(position: Position): boolean {
    if (position.line < 0 || position.line >= this.getLineCount()) {
      return false;
    }
    if (position.column < 0 || position.column > this.getLine(position.line).length) {
      return false;
    }
    return true;
  }

  // Validate range
  isValidRange(range: Range): boolean {
    return this.isValidPosition(range.start) && this.isValidPosition(range.end);
  }

  // Get version for change tracking
  getVersion(): number {
    return this._version;
  }

  // Clone the model
  clone(): TextModel {
    const clone = new TextModel();
    clone._lines = [...this._lines];
    clone._version = this._version;
    return clone;
  }

  private normalizeRange(range: Range): Range {
    if (this.comparePositions(range.start, range.end) <= 0) {
      return range;
    }

    return {
      start: range.end,
      end: range.start,
    };
  }

  private comparePositions(a: Position, b: Position): number {
    if (a.line !== b.line) {
      return a.line - b.line;
    }
    return a.column - b.column;
  }
}
