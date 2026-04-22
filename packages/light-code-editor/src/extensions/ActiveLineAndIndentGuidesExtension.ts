/**
 * Active Line And Indent Guides Extension
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import {
  DecorationStyle,
  EditorAPI,
  EditorDecoration,
  EditorExtension,
} from '../types';

export interface ActiveLineAndIndentGuidesExtensionConfig {
  activeLine?: boolean;
  indentGuides?: boolean;
  guideStepColumns?: number;
  maxGuideDepth?: number;
  maxGuideLines?: number;
}

type RequiredActiveLineAndIndentGuidesConfig = {
  activeLine: boolean;
  indentGuides: boolean;
  guideStepColumns?: number;
  maxGuideDepth: number;
  maxGuideLines: number;
};

export class ActiveLineAndIndentGuidesExtension implements EditorExtension {
  public readonly name = 'active-line-indent-guides';

  private readonly activeLayerName = 'active-line-indent-guides-active';
  private readonly indentLayerName = 'active-line-indent-guides-indent';
  private readonly config: RequiredActiveLineAndIndentGuidesConfig;
  private editor: EditorAPI | null = null;
  private changeHandler: ((changes: unknown[]) => void) | null = null;
  private cursorHandler: (() => void) | null = null;
  private pendingRefreshRaf: number | null = null;
  private refreshActiveLinePending = false;
  private refreshIndentGuidesPending = false;
  private lastRenderedActiveLine: number | null = null;
  private lastIndentGuidesSignature = '';

  constructor(config: ActiveLineAndIndentGuidesExtensionConfig = {}) {
    this.config = {
      activeLine: config.activeLine ?? true,
      indentGuides: config.indentGuides ?? true,
      guideStepColumns: config.guideStepColumns,
      maxGuideDepth: Math.max(1, Math.floor(config.maxGuideDepth ?? 16)),
      maxGuideLines: Math.max(1, Math.floor(config.maxGuideLines ?? 4000)),
    };
  }

  setup(editor: EditorAPI): void {
    this.editor = editor;

    this.changeHandler = () => {
      this.scheduleRefresh(true, true);
    };
    editor.on('change', this.changeHandler);

    this.cursorHandler = () => {
      this.scheduleRefresh(true, false);
    };
    editor.on('cursor', this.cursorHandler);

    this.scheduleRefresh(true, true);
  }

  private scheduleRefresh(
    activeLine: boolean,
    indentGuides: boolean,
  ): void {
    this.refreshActiveLinePending = this.refreshActiveLinePending || activeLine;
    this.refreshIndentGuidesPending = this.refreshIndentGuidesPending || indentGuides;

    if (this.pendingRefreshRaf !== null || typeof requestAnimationFrame !== 'function') {
      if (this.pendingRefreshRaf === null && typeof requestAnimationFrame !== 'function') {
        this.flushRefresh();
      }
      return;
    }

    this.pendingRefreshRaf = requestAnimationFrame(() => {
      this.pendingRefreshRaf = null;
      this.flushRefresh();
    });
  }

  private flushRefresh(): void {
    if (!this.editor) {
      return;
    }

    if (this.refreshActiveLinePending) {
      this.refreshActiveLinePending = false;
      this.renderActiveLine();
    }

    if (this.refreshIndentGuidesPending) {
      this.refreshIndentGuidesPending = false;
      this.renderIndentGuides();
    }
  }

  private renderActiveLine(): void {
    const editor = this.editor;
    if (!editor) {
      return;
    }

    if (!this.config.activeLine) {
      if (this.lastRenderedActiveLine !== null) {
        editor.clearDecorations(this.activeLayerName);
        this.lastRenderedActiveLine = null;
      }
      return;
    }

    const line = editor.getCursor().position.line;
    if (this.lastRenderedActiveLine === line) {
      return;
    }

    this.lastRenderedActiveLine = line;
    editor.setDecorations(this.activeLayerName, [
      {
        id: 'active-line',
        type: 'line',
        line,
        className: 'lce-decoration-line--active-line',
        style: {
          zIndex: '0',
          backgroundColor: 'var(--lce-active-line-bg, rgba(59, 130, 246, 0.10))',
          boxShadow: 'inset 0 0 0 1px var(--lce-active-line-border, rgba(59, 130, 246, 0.18))',
        },
      },
    ]);
  }

  private renderIndentGuides(): void {
    const editor = this.editor;
    if (!editor) {
      return;
    }

    if (!this.config.indentGuides) {
      if (this.lastIndentGuidesSignature) {
        editor.clearDecorations(this.indentLayerName);
        this.lastIndentGuidesSignature = '';
      }
      return;
    }

    const text = editor.getValue();
    const lines = text.split('\n');
    if (lines.length > this.config.maxGuideLines) {
      if (this.lastIndentGuidesSignature !== 'disabled:max-lines') {
        editor.clearDecorations(this.indentLayerName);
        this.lastIndentGuidesSignature = 'disabled:max-lines';
      }
      return;
    }

    const guideStepColumns = this.resolveGuideStepColumns();
    const decorations: EditorDecoration[] = [];
    const signatureParts: string[] = [];

    lines.forEach((line, lineIndex) => {
      const guideColumns = this.getGuideColumnsForLine(line, guideStepColumns);
      if (guideColumns.length === 0) {
        return;
      }

      decorations.push({
        id: `indent-guides-${lineIndex}`,
        type: 'line',
        line: lineIndex,
        className: 'lce-decoration-line--indent-guides',
        style: this.buildIndentGuideStyle(guideColumns),
      });
      signatureParts.push(`${lineIndex}:${guideColumns.join(',')}`);
    });

    const signature = signatureParts.join('|');
    if (signature === this.lastIndentGuidesSignature) {
      return;
    }

    this.lastIndentGuidesSignature = signature;
    editor.setDecorations(this.indentLayerName, decorations);
  }

  private resolveGuideStepColumns(): number {
    if (typeof this.config.guideStepColumns === 'number' && Number.isFinite(this.config.guideStepColumns)) {
      return Math.max(1, Math.floor(this.config.guideStepColumns));
    }

    const tabSize = this.editor?.getConfig().tabSize ?? 2;
    return Math.max(1, Math.floor(tabSize) || 2);
  }

  private getGuideColumnsForLine(
    line: string,
    guideStepColumns: number,
  ): number[] {
    const leadingWhitespace = line.match(/^[\t ]+/)?.[0] || '';
    if (!leadingWhitespace) {
      return [];
    }

    let indentationColumns = 0;
    for (const character of leadingWhitespace) {
      if (character === '\t') {
        indentationColumns += guideStepColumns;
      } else {
        indentationColumns += 1;
      }
    }

    const levels = Math.min(
      this.config.maxGuideDepth,
      Math.floor(indentationColumns / guideStepColumns),
    );
    if (levels <= 0) {
      return [];
    }

    const columns: number[] = [];
    for (let level = 1; level <= levels; level += 1) {
      columns.push(level * guideStepColumns);
    }
    return columns;
  }

  private buildIndentGuideStyle(columns: number[]): DecorationStyle {
    const backgroundImage = columns
      .map(
        () =>
          'linear-gradient(to bottom, var(--lce-indent-guide-color, rgba(148, 163, 184, 0.26)), var(--lce-indent-guide-color, rgba(148, 163, 184, 0.26)))',
      )
      .join(', ');
    const backgroundPosition = columns
      .map((column) => `calc(${column}ch - 0.5px) 0`)
      .join(', ');
    const backgroundSize = columns
      .map(() => '1px 100%')
      .join(', ');
    const backgroundRepeat = columns
      .map(() => 'no-repeat')
      .join(', ');

    return {
      zIndex: '1',
      backgroundImage,
      backgroundPosition,
      backgroundSize,
      backgroundRepeat,
      opacity: '0.95',
    };
  }

  destroy(): void {
    if (this.pendingRefreshRaf !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(this.pendingRefreshRaf);
      this.pendingRefreshRaf = null;
    }

    if (this.editor && this.changeHandler) {
      this.editor.off('change', this.changeHandler);
    }
    if (this.editor && this.cursorHandler) {
      this.editor.off('cursor', this.cursorHandler);
    }

    this.editor?.clearDecorations(this.activeLayerName);
    this.editor?.clearDecorations(this.indentLayerName);
    this.changeHandler = null;
    this.cursorHandler = null;
    this.lastRenderedActiveLine = null;
    this.lastIndentGuidesSignature = '';
    this.editor = null;
  }
}
