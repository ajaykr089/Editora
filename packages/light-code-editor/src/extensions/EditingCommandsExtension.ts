/**
 * Editing Commands Extension
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import {
  EditorAPI,
  EditorExtension,
  Position,
  Range,
} from '../types';

export interface EditingCommandsExtensionConfig {
  lineCommentToken?: string | null;
  blockCommentTokens?: {
    open: string;
    close: string;
  } | null;
  addSpaceAfterLineComment?: boolean;
  registerKeybindings?: boolean;
}

type RequiredEditingCommandsConfig = {
  lineCommentToken: string | null;
  blockCommentTokens: {
    open: string;
    close: string;
  } | null;
  addSpaceAfterLineComment: boolean;
  registerKeybindings: boolean;
};

type KeybindingRegistration = {
  key: string;
  command: string;
};

type OffsetRange = {
  start: number;
  end: number;
};

type LineTarget = {
  startLine: number;
  endLine: number;
  hasSelection: boolean;
};

export class EditingCommandsExtension implements EditorExtension {
  public readonly name = 'editing-commands';

  private editor: EditorAPI | null = null;
  private keymapExtension:
    | {
      addKeyBinding?: (binding: Record<string, unknown>) => void;
      removeKeyBinding?: (key: string, command?: string) => void;
    }
    | null = null;
  private registeredBindings: KeybindingRegistration[] = [];
  private readonly config: RequiredEditingCommandsConfig;

  constructor(config: EditingCommandsExtensionConfig = {}) {
    this.config = {
      lineCommentToken: config.lineCommentToken ?? '//',
      blockCommentTokens: config.blockCommentTokens ?? {
        open: '/* ',
        close: ' */',
      },
      addSpaceAfterLineComment: config.addSpaceAfterLineComment ?? true,
      registerKeybindings: config.registerKeybindings ?? true,
    };
  }

  setup(editor: EditorAPI): void {
    this.editor = editor;

    editor.registerCommand('toggleLineComment', () => {
      this.toggleLineComment();
    });

    editor.registerCommand('toggleBlockComment', () => {
      this.toggleBlockComment();
    });

    editor.registerCommand('duplicateLine', () => {
      this.duplicateLine();
    });

    editor.registerCommand('moveLineUp', () => {
      this.moveLine('up');
    });

    editor.registerCommand('moveLineDown', () => {
      this.moveLine('down');
    });

    editor.registerCommand('joinLines', () => {
      this.joinLines();
    });

    editor.registerCommand('goToLine', (lineNumber?: number | string) => {
      this.goToLine(lineNumber);
    });

    if (this.config.registerKeybindings) {
      this.registerKeybindings();
    }
  }

  toggleLineComment(): boolean {
    const editor = this.editor;
    const token = this.config.lineCommentToken;
    if (!editor || !token || editor.getState().readOnly) {
      return false;
    }

    const text = editor.getValue();
    const lines = this.getLines(text);
    const cursor = editor.getCursor().position;
    const target = this.getTargetLines(lines, editor.getSelection(), cursor.line);
    const originalLines = lines.slice(target.startLine, target.endLine + 1);
    const nonBlankLines = originalLines.filter((line) => line.trim().length > 0);

    if (nonBlankLines.length === 0) {
      return false;
    }

    const shouldUncomment = nonBlankLines.every((line) => this.isLineCommented(line));
    const updatedLines = originalLines.map((line) =>
      shouldUncomment ? this.uncommentLine(line) : this.commentLine(line),
    );
    const lineRange = this.createLineRange(lines, target.startLine, target.endLine);
    const rangeOffsets = this.rangeToOffsets(lineRange, text);
    const replacement = updatedLines.join('\n');

    let nextSelection: Range | undefined;
    let nextCursor: Position | undefined;

    if (target.hasSelection) {
      nextSelection = {
        start: { line: target.startLine, column: 0 },
        end: {
          line: target.endLine,
          column: updatedLines[updatedLines.length - 1]?.length || 0,
        },
      };
    } else {
      const localLineIndex = cursor.line - target.startLine;
      const originalLine = originalLines[localLineIndex] || '';
      const updatedLine = updatedLines[localLineIndex] || '';
      const cursorColumn = this.mapLineCommentColumn(
        originalLine,
        updatedLine,
        cursor.column,
        shouldUncomment,
      );
      const replacementOffset =
        this.getOffsetWithinLines(updatedLines, localLineIndex) + cursorColumn;
      nextCursor = this.offsetToPosition(
        rangeOffsets.start + replacementOffset,
        this.applyRangeToText(text, rangeOffsets, replacement),
      );
    }

    editor.replace(lineRange, replacement);
    if (nextSelection) {
      editor.setSelection(nextSelection);
    } else if (nextCursor) {
      editor.setCursor(nextCursor);
    }
    editor.focus();
    return true;
  }

  toggleBlockComment(): boolean {
    const editor = this.editor;
    const tokens = this.config.blockCommentTokens;
    if (!editor || !tokens || editor.getState().readOnly) {
      return false;
    }

    const text = editor.getValue();
    const selection = editor.getSelection();
    const cursor = editor.getCursor().position;
    const lines = this.getLines(text);
    const hasSelection =
      !!selection &&
      (selection.start.line !== selection.end.line ||
        selection.start.column !== selection.end.column);
    const targetRange = hasSelection
      ? this.normalizeRange(selection!)
      : this.createLineRange(lines, cursor.line, cursor.line);
    const targetOffsets = this.rangeToOffsets(targetRange, text);
    const segment = text.slice(targetOffsets.start, targetOffsets.end);
    const commentState = this.getBlockCommentState(segment);

    let replacement = segment;
    let nextSelectionOffsets: OffsetRange | undefined;
    let nextCursorOffset: number | undefined;

    if (commentState) {
      replacement =
        segment.slice(0, commentState.contentStart) +
        commentState.innerContent +
        segment.slice(commentState.contentEnd);

      if (hasSelection) {
        nextSelectionOffsets = {
          start: targetOffsets.start + commentState.contentStart,
          end: targetOffsets.start + commentState.contentStart + commentState.innerContent.length,
        };
      } else {
        const localCursor = Math.max(0, cursor.column - commentState.removedPrefixLength);
        nextCursorOffset = targetOffsets.start + Math.min(localCursor, replacement.length);
      }
    } else {
      replacement = `${tokens.open}${segment}${tokens.close}`;

      if (hasSelection) {
        nextSelectionOffsets = {
          start: targetOffsets.start + tokens.open.length,
          end: targetOffsets.start + tokens.open.length + segment.length,
        };
      } else {
        nextCursorOffset = targetOffsets.start + Math.min(
          cursor.column + tokens.open.length,
          replacement.length,
        );
      }
    }

    const nextText = this.applyRangeToText(text, targetOffsets, replacement);
    editor.replace(targetRange, replacement);

    if (nextSelectionOffsets) {
      editor.setSelection({
        start: this.offsetToPosition(nextSelectionOffsets.start, nextText),
        end: this.offsetToPosition(nextSelectionOffsets.end, nextText),
      });
    } else if (typeof nextCursorOffset === 'number') {
      editor.setCursor(this.offsetToPosition(nextCursorOffset, nextText));
    }

    editor.focus();
    return true;
  }

  duplicateLine(): boolean {
    const editor = this.editor;
    if (!editor || editor.getState().readOnly) {
      return false;
    }

    const text = editor.getValue();
    const lines = this.getLines(text);
    const cursor = editor.getCursor().position;
    const target = this.getTargetLines(lines, editor.getSelection(), cursor.line);
    const originalBlock = lines.slice(target.startLine, target.endLine + 1);
    const lineRange = this.createLineRange(lines, target.startLine, target.endLine);
    const rangeOffsets = this.rangeToOffsets(lineRange, text);
    const replacement = `${originalBlock.join('\n')}\n${originalBlock.join('\n')}`;
    const duplicatedStartOffset = rangeOffsets.start + originalBlock.join('\n').length + 1;
    const nextText = this.applyRangeToText(text, rangeOffsets, replacement);

    editor.replace(lineRange, replacement);

    if (target.hasSelection) {
      editor.setSelection({
        start: this.offsetToPosition(duplicatedStartOffset, nextText),
        end: this.offsetToPosition(duplicatedStartOffset + originalBlock.join('\n').length, nextText),
      });
    } else {
      const localLineIndex = cursor.line - target.startLine;
      const cursorOffset =
        duplicatedStartOffset +
        this.getOffsetWithinLines(originalBlock, localLineIndex) +
        Math.min(cursor.column, originalBlock[localLineIndex]?.length || 0);
      editor.setCursor(this.offsetToPosition(cursorOffset, nextText));
    }

    editor.focus();
    return true;
  }

  moveLine(direction: 'up' | 'down'): boolean {
    const editor = this.editor;
    if (!editor || editor.getState().readOnly) {
      return false;
    }

    const text = editor.getValue();
    const lines = this.getLines(text);
    const cursor = editor.getCursor().position;
    const selection = editor.getSelection();
    const target = this.getTargetLines(lines, selection, cursor.line);

    if (direction === 'up' && target.startLine === 0) {
      return false;
    }

    if (direction === 'down' && target.endLine >= lines.length - 1) {
      return false;
    }

    const affectedStartLine = direction === 'up' ? target.startLine - 1 : target.startLine;
    const affectedEndLine = direction === 'down' ? target.endLine + 1 : target.endLine;
    const movedLines = lines.slice(target.startLine, target.endLine + 1);
    const adjacentLine =
      direction === 'up'
        ? lines[target.startLine - 1]
        : lines[target.endLine + 1];
    const replacementLines =
      direction === 'up'
        ? [...movedLines, adjacentLine]
        : [adjacentLine, ...movedLines];
    const affectedRange = this.createLineRange(lines, affectedStartLine, affectedEndLine);
    const affectedOffsets = this.rangeToOffsets(affectedRange, text);
    const replacement = replacementLines.join('\n');
    const nextText = this.applyRangeToText(text, affectedOffsets, replacement);
    const lineDelta = direction === 'up' ? -1 : 1;

    editor.replace(affectedRange, replacement);

    if (selection) {
      const normalizedSelection = this.normalizeRange(selection);
      editor.setSelection({
        start: {
          line: Math.max(0, normalizedSelection.start.line + lineDelta),
          column: normalizedSelection.start.column,
        },
        end: {
          line: Math.max(0, normalizedSelection.end.line + lineDelta),
          column: normalizedSelection.end.column,
        },
      });
    } else {
      editor.setCursor(
        this.clampPosition(
          {
            line: cursor.line + lineDelta,
            column: cursor.column,
          },
          nextText,
        ),
      );
    }

    editor.focus();
    return true;
  }

  joinLines(): boolean {
    const editor = this.editor;
    if (!editor || editor.getState().readOnly) {
      return false;
    }

    const text = editor.getValue();
    const lines = this.getLines(text);
    const cursor = editor.getCursor().position;
    const selection = editor.getSelection();
    const target = this.getTargetLines(lines, selection, cursor.line);
    const endLine =
      target.hasSelection
        ? target.endLine
        : Math.min(lines.length - 1, target.startLine + 1);

    if (endLine <= target.startLine) {
      return false;
    }

    const originalLines = lines.slice(target.startLine, endLine + 1);
    const joinedLine = [
      originalLines[0]?.replace(/\s+$/g, '') || '',
      ...originalLines.slice(1).map((line) => line.trim()).filter(Boolean),
    ].join(' ');
    const lineRange = this.createLineRange(lines, target.startLine, endLine);
    const rangeOffsets = this.rangeToOffsets(lineRange, text);
    const nextText = this.applyRangeToText(text, rangeOffsets, joinedLine);

    editor.replace(lineRange, joinedLine);

    if (target.hasSelection) {
      editor.setSelection({
        start: { line: target.startLine, column: 0 },
        end: { line: target.startLine, column: joinedLine.length },
      });
    } else {
      editor.setCursor(
        this.offsetToPosition(rangeOffsets.start + joinedLine.length, nextText),
      );
    }

    editor.focus();
    return true;
  }

  goToLine(lineNumber?: number | string): boolean {
    const editor = this.editor;
    if (!editor) {
      return false;
    }

    const text = editor.getValue();
    const lineCount = this.getLines(text).length;
    let resolvedLineNumber =
      typeof lineNumber === 'number'
        ? lineNumber
        : typeof lineNumber === 'string'
          ? Number.parseInt(lineNumber, 10)
          : Number.NaN;

    if (!Number.isFinite(resolvedLineNumber)) {
      const response = typeof window !== 'undefined'
        ? window.prompt('Go to line', `${editor.getCursor().position.line + 1}`)
        : null;
      if (response === null) {
        return false;
      }
      resolvedLineNumber = Number.parseInt(response, 10);
    }

    if (!Number.isFinite(resolvedLineNumber)) {
      return false;
    }

    const clampedLine = Math.max(1, Math.min(lineCount, Math.floor(resolvedLineNumber)));
    const position = this.clampPosition(
      {
        line: clampedLine - 1,
        column: 0,
      },
      text,
    );

    editor.setCursor(position);
    editor.getView().scrollToPosition(position);
    editor.focus();
    return true;
  }

  private registerKeybindings(): void {
    const keymapExtension = (this.editor as EditorAPI & {
      getKeymapExtension?: () => {
        addKeyBinding?: (binding: Record<string, unknown>) => void;
        removeKeyBinding?: (key: string, command?: string) => void;
      };
    })?.getKeymapExtension?.();

    if (!keymapExtension?.addKeyBinding) {
      return;
    }

    this.keymapExtension = keymapExtension;

    const bindings = [
      { key: '/', ctrlKey: true, command: 'toggleLineComment' },
      { key: '/', metaKey: true, command: 'toggleLineComment' },
      { key: 'a', altKey: true, shiftKey: true, command: 'toggleBlockComment' },
      { key: 'd', ctrlKey: true, shiftKey: true, command: 'duplicateLine' },
      { key: 'd', metaKey: true, shiftKey: true, command: 'duplicateLine' },
      { key: 'arrowup', altKey: true, command: 'moveLineUp' },
      { key: 'arrowdown', altKey: true, command: 'moveLineDown' },
      { key: 'j', ctrlKey: true, command: 'joinLines' },
      { key: 'j', metaKey: true, command: 'joinLines' },
    ];

    bindings.forEach((binding) => {
      keymapExtension.addKeyBinding?.(binding);
      this.registeredBindings.push({
        key: binding.key,
        command: binding.command,
      });
    });
  }

  private getLines(text: string): string[] {
    return text.split('\n');
  }

  private getTargetLines(
    lines: string[],
    selection: Range | undefined,
    cursorLine: number,
  ): LineTarget {
    if (!selection) {
      const safeLine = Math.max(0, Math.min(lines.length - 1, cursorLine));
      return {
        startLine: safeLine,
        endLine: safeLine,
        hasSelection: false,
      };
    }

    const normalizedSelection = this.normalizeRange(selection);
    const isCollapsed =
      normalizedSelection.start.line === normalizedSelection.end.line &&
      normalizedSelection.start.column === normalizedSelection.end.column;

    if (isCollapsed) {
      const safeLine = Math.max(0, Math.min(lines.length - 1, normalizedSelection.start.line));
      return {
        startLine: safeLine,
        endLine: safeLine,
        hasSelection: false,
      };
    }

    const endLine =
      normalizedSelection.end.column === 0 &&
      normalizedSelection.end.line > normalizedSelection.start.line
        ? normalizedSelection.end.line - 1
        : normalizedSelection.end.line;

    return {
      startLine: Math.max(0, Math.min(lines.length - 1, normalizedSelection.start.line)),
      endLine: Math.max(0, Math.min(lines.length - 1, endLine)),
      hasSelection: true,
    };
  }

  private createLineRange(lines: string[], startLine: number, endLine: number): Range {
    const safeStartLine = Math.max(0, Math.min(lines.length - 1, startLine));
    const safeEndLine = Math.max(safeStartLine, Math.min(lines.length - 1, endLine));

    return {
      start: { line: safeStartLine, column: 0 },
      end: {
        line: safeEndLine,
        column: lines[safeEndLine]?.length || 0,
      },
    };
  }

  private commentLine(line: string): string {
    if (!this.config.lineCommentToken || line.trim().length === 0) {
      return line;
    }

    const indentLength = this.getIndentLength(line);
    const indent = line.slice(0, indentLength);
    const content = line.slice(indentLength);
    const spacer = this.config.addSpaceAfterLineComment ? ' ' : '';
    return `${indent}${this.config.lineCommentToken}${spacer}${content}`;
  }

  private uncommentLine(line: string): string {
    if (!this.config.lineCommentToken || !this.isLineCommented(line)) {
      return line;
    }

    const indentLength = this.getIndentLength(line);
    const indent = line.slice(0, indentLength);
    let content = line.slice(indentLength + this.config.lineCommentToken.length);
    if (this.config.addSpaceAfterLineComment && content.startsWith(' ')) {
      content = content.slice(1);
    }
    return `${indent}${content}`;
  }

  private isLineCommented(line: string): boolean {
    if (!this.config.lineCommentToken) {
      return false;
    }

    return line.slice(this.getIndentLength(line)).startsWith(this.config.lineCommentToken);
  }

  private mapLineCommentColumn(
    originalLine: string,
    updatedLine: string,
    column: number,
    wasCommented: boolean,
  ): number {
    const indentLength = this.getIndentLength(originalLine);
    if (!this.config.lineCommentToken || column <= indentLength || originalLine.trim().length === 0) {
      return Math.min(column, updatedLine.length);
    }

    const tokenLength =
      this.config.lineCommentToken.length + (this.config.addSpaceAfterLineComment ? 1 : 0);
    if (!wasCommented) {
      return Math.min(column + tokenLength, updatedLine.length);
    }

    return Math.min(Math.max(indentLength, column - tokenLength), updatedLine.length);
  }

  private getBlockCommentState(segment: string): {
    contentStart: number;
    contentEnd: number;
    innerContent: string;
    removedPrefixLength: number;
  } | null {
    const tokens = this.config.blockCommentTokens;
    if (!tokens) {
      return null;
    }

    const leadingLength = segment.match(/^\s*/)?.[0].length || 0;
    const trailingLength = segment.match(/\s*$/)?.[0].length || 0;
    const contentEnd = segment.length - trailingLength;
    const content = segment.slice(leadingLength, contentEnd);

    if (!content.startsWith(tokens.open) || !content.endsWith(tokens.close)) {
      return null;
    }

    return {
      contentStart: leadingLength,
      contentEnd,
      innerContent: content.slice(tokens.open.length, content.length - tokens.close.length),
      removedPrefixLength: tokens.open.length,
    };
  }

  private getIndentLength(line: string): number {
    return line.match(/^\s*/)?.[0].length || 0;
  }

  private normalizeRange(range: Range): Range {
    return this.comparePositions(range.start, range.end) <= 0
      ? range
      : {
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

  private rangeToOffsets(range: Range, text: string): OffsetRange {
    return {
      start: this.positionToOffset(range.start, text),
      end: this.positionToOffset(range.end, text),
    };
  }

  private positionToOffset(position: Position, text: string): number {
    const lines = this.getLines(text);
    const safeLine = Math.max(0, Math.min(lines.length - 1, position.line));
    let offset = 0;

    for (let lineIndex = 0; lineIndex < safeLine; lineIndex += 1) {
      offset += (lines[lineIndex]?.length || 0) + 1;
    }

    return offset + Math.max(0, Math.min(position.column, lines[safeLine]?.length || 0));
  }

  private offsetToPosition(offset: number, text: string): Position {
    const lines = this.getLines(text);
    let remaining = Math.max(0, Math.min(offset, text.length));

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
      const lineLength = lines[lineIndex]?.length || 0;
      if (remaining <= lineLength) {
        return {
          line: lineIndex,
          column: remaining,
        };
      }
      remaining -= lineLength + 1;
    }

    return {
      line: Math.max(0, lines.length - 1),
      column: lines[lines.length - 1]?.length || 0,
    };
  }

  private clampPosition(position: Position, text: string): Position {
    const lines = this.getLines(text);
    const safeLine = Math.max(0, Math.min(lines.length - 1, position.line));
    return {
      line: safeLine,
      column: Math.max(0, Math.min(position.column, lines[safeLine]?.length || 0)),
    };
  }

  private getOffsetWithinLines(lines: string[], lineIndex: number): number {
    let offset = 0;
    for (let index = 0; index < lineIndex; index += 1) {
      offset += (lines[index]?.length || 0) + 1;
    }
    return offset;
  }

  private applyRangeToText(text: string, range: OffsetRange, replacement: string): string {
    return text.slice(0, range.start) + replacement + text.slice(range.end);
  }

  destroy(): void {
    if (this.keymapExtension?.removeKeyBinding) {
      this.registeredBindings.forEach((binding) => {
        this.keymapExtension?.removeKeyBinding?.(binding.key, binding.command);
      });
    }

    this.registeredBindings = [];
    this.keymapExtension = null;
    this.editor = null;
  }
}
