/**
 * Diagnostics Extension
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import {
  Cursor,
  DiagnosticSeverity,
  EditorAPI,
  EditorDecoration,
  EditorDiagnostic,
  EditorExtension,
  Position,
  Range,
  TextChange,
} from '../types';

export interface DiagnosticsExtensionConfig {
  diagnostics?: EditorDiagnostic[];
  maxDiagnostics?: number;
  clearOnChange?: boolean;
  showInlineHighlights?: boolean;
  showGutterMarkers?: boolean;
  showActiveLine?: boolean;
  showStatusBar?: boolean;
  layerName?: string;
}

type RequiredDiagnosticsConfig = Required<DiagnosticsExtensionConfig>;

type LineMarker = {
  line: number;
  severity: DiagnosticSeverity;
  messages: string[];
};

const SEVERITY_PRIORITY: Record<DiagnosticSeverity, number> = {
  error: 4,
  warning: 3,
  info: 2,
  hint: 1,
};

const SEVERITY_LABEL: Record<DiagnosticSeverity, string> = {
  error: 'Error',
  warning: 'Warning',
  info: 'Info',
  hint: 'Hint',
};

const SEVERITY_COLOR: Record<DiagnosticSeverity, string> = {
  error: '#ff6b6b',
  warning: '#f59e0b',
  info: '#38bdf8',
  hint: '#94a3b8',
};

export class DiagnosticsExtension implements EditorExtension {
  public readonly name = 'diagnostics';

  private editor: EditorAPI | null = null;
  private diagnostics: EditorDiagnostic[] = [];
  private activeDiagnosticIndex = -1;
  private statusElement: HTMLElement | null = null;
  private summaryElement: HTMLElement | null = null;
  private messageElement: HTMLElement | null = null;
  private cursorHandler: ((cursor: Cursor) => void) | null = null;
  private changeHandler: ((changes: TextChange[]) => void) | null = null;
  private readonly config: RequiredDiagnosticsConfig;

  constructor(config: DiagnosticsExtensionConfig = {}) {
    this.config = {
      diagnostics: config.diagnostics || [],
      maxDiagnostics: Math.max(1, Math.floor(config.maxDiagnostics ?? 200)),
      clearOnChange: config.clearOnChange ?? false,
      showInlineHighlights: config.showInlineHighlights ?? true,
      showGutterMarkers: config.showGutterMarkers ?? true,
      showActiveLine: config.showActiveLine ?? true,
      showStatusBar: config.showStatusBar ?? true,
      layerName: (config.layerName || 'diagnostics').trim() || 'diagnostics',
    };
  }

  setup(editor: EditorAPI): void {
    this.editor = editor;

    editor.registerCommand('setDiagnostics', (diagnostics: EditorDiagnostic[]) => {
      this.setDiagnostics(Array.isArray(diagnostics) ? diagnostics : []);
    });

    editor.registerCommand('clearDiagnostics', () => {
      this.clearDiagnostics();
    });

    editor.registerCommand('nextDiagnostic', () => {
      this.focusNextDiagnostic();
    });

    editor.registerCommand('prevDiagnostic', () => {
      this.focusPreviousDiagnostic();
    });

    if (this.config.showStatusBar) {
      this.createStatusBar();
    }

    this.cursorHandler = (cursor: Cursor) => {
      this.syncActiveDiagnosticFromPosition(cursor.position);
    };
    editor.on('cursor', this.cursorHandler);

    if (this.config.clearOnChange) {
      this.changeHandler = (_changes: TextChange[]) => {
        this.clearDiagnostics();
      };
      editor.on('change', this.changeHandler);
    }

    this.setDiagnostics(this.config.diagnostics);
  }

  setDiagnostics(diagnostics: EditorDiagnostic[]): void {
    const text = this.editor?.getValue() || '';
    const normalized = diagnostics
      .slice(0, this.config.maxDiagnostics)
      .map((diagnostic, index) => this.normalizeDiagnostic(diagnostic, text, index))
      .filter((diagnostic): diagnostic is EditorDiagnostic => diagnostic !== null);

    this.diagnostics = normalized;
    if (this.diagnostics.length === 0) {
      this.activeDiagnosticIndex = -1;
      this.applyDecorations();
      this.updateStatusBar();
      return;
    }

    const cursorPosition = this.editor?.getCursor().position;
    const cursorMatchIndex =
      cursorPosition ? this.findDiagnosticIndexAtPosition(cursorPosition) : -1;
    if (cursorMatchIndex !== -1) {
      this.activeDiagnosticIndex = cursorMatchIndex;
    } else if (
      this.activeDiagnosticIndex < 0 ||
      this.activeDiagnosticIndex >= this.diagnostics.length
    ) {
      this.activeDiagnosticIndex = 0;
    }

    this.applyDecorations();
    this.updateStatusBar();
  }

  clearDiagnostics(): void {
    this.diagnostics = [];
    this.activeDiagnosticIndex = -1;
    this.editor?.clearDecorations(this.config.layerName);
    this.updateStatusBar();
  }

  getDiagnostics(): EditorDiagnostic[] {
    return this.diagnostics.map((diagnostic) => ({
      ...diagnostic,
      range: {
        start: { ...diagnostic.range.start },
        end: { ...diagnostic.range.end },
      },
    }));
  }

  focusNextDiagnostic(): void {
    if (this.diagnostics.length === 0) {
      return;
    }

    const nextIndex =
      this.activeDiagnosticIndex >= 0
        ? (this.activeDiagnosticIndex + 1) % this.diagnostics.length
        : 0;
    this.focusDiagnostic(nextIndex);
  }

  focusPreviousDiagnostic(): void {
    if (this.diagnostics.length === 0) {
      return;
    }

    const previousIndex =
      this.activeDiagnosticIndex >= 0
        ? (this.activeDiagnosticIndex - 1 + this.diagnostics.length) %
          this.diagnostics.length
        : this.diagnostics.length - 1;
    this.focusDiagnostic(previousIndex);
  }

  private focusDiagnostic(index: number): void {
    if (!this.editor || this.diagnostics.length === 0) {
      return;
    }

    const safeIndex = Math.max(0, Math.min(index, this.diagnostics.length - 1));
    const diagnostic = this.diagnostics[safeIndex];
    this.activeDiagnosticIndex = safeIndex;
    this.editor.setSelection(diagnostic.range);
    this.editor.focus();
    this.editor.getView().scrollToPosition(diagnostic.range.start);
    this.applyDecorations();
    this.updateStatusBar();
  }

  private syncActiveDiagnosticFromPosition(position: Position): void {
    const nextIndex = this.findDiagnosticIndexAtPosition(position);
    if (nextIndex === -1 || nextIndex === this.activeDiagnosticIndex) {
      return;
    }

    this.activeDiagnosticIndex = nextIndex;
    this.applyDecorations();
    this.updateStatusBar();
  }

  private findDiagnosticIndexAtPosition(position: Position): number {
    for (let i = 0; i < this.diagnostics.length; i++) {
      if (this.rangeContainsPosition(this.diagnostics[i].range, position)) {
        return i;
      }
    }
    return -1;
  }

  private applyDecorations(): void {
    if (!this.editor) {
      return;
    }

    if (this.diagnostics.length === 0) {
      this.editor.clearDecorations(this.config.layerName);
      return;
    }

    const decorations: EditorDecoration[] = [];

    if (this.config.showInlineHighlights) {
      for (const diagnostic of this.diagnostics) {
        decorations.push({
          id: `inline-${diagnostic.id || diagnostic.message}`,
          type: 'inline',
          range: diagnostic.range,
          style: this.getInlineStyle(diagnostic.severity),
        });
      }
    }

    if (this.config.showGutterMarkers) {
      for (const marker of this.buildLineMarkers()) {
        decorations.push({
          id: `gutter-${marker.line}`,
          type: 'gutter',
          line: marker.line,
          label: '●',
          title: marker.messages.join('\n'),
          style: {
            color: SEVERITY_COLOR[marker.severity],
            paddingRight: '8px',
          },
        });
      }
    }

    if (
      this.config.showActiveLine &&
      this.activeDiagnosticIndex >= 0 &&
      this.activeDiagnosticIndex < this.diagnostics.length
    ) {
      const activeDiagnostic = this.diagnostics[this.activeDiagnosticIndex];
      decorations.push({
        id: `active-line-${activeDiagnostic.id || this.activeDiagnosticIndex}`,
        type: 'line',
        line: activeDiagnostic.range.start.line,
        style: this.getActiveLineStyle(activeDiagnostic.severity),
      });
    }

    if (decorations.length === 0) {
      this.editor.clearDecorations(this.config.layerName);
      return;
    }

    this.editor.setDecorations(this.config.layerName, decorations);
  }

  private buildLineMarkers(): LineMarker[] {
    const markersByLine = new Map<number, LineMarker>();

    for (const diagnostic of this.diagnostics) {
      const line = diagnostic.range.start.line;
      const existing = markersByLine.get(line);
      const nextMessage = this.formatDiagnosticLabel(diagnostic);

      if (!existing) {
        markersByLine.set(line, {
          line,
          severity: diagnostic.severity,
          messages: [nextMessage],
        });
        continue;
      }

      if (
        SEVERITY_PRIORITY[diagnostic.severity] >
        SEVERITY_PRIORITY[existing.severity]
      ) {
        existing.severity = diagnostic.severity;
      }

      if (!existing.messages.includes(nextMessage)) {
        existing.messages.push(nextMessage);
      }
    }

    return Array.from(markersByLine.values()).sort((a, b) => a.line - b.line);
  }

  private updateStatusBar(): void {
    if (!this.summaryElement || !this.messageElement) {
      return;
    }

    if (this.diagnostics.length === 0) {
      this.summaryElement.textContent = 'No diagnostics';
      this.messageElement.textContent = 'Add diagnostics with setDiagnostics(...) or the setDiagnostics command.';
      return;
    }

    this.summaryElement.textContent = this.buildSummaryText();

    const activeDiagnostic =
      this.activeDiagnosticIndex >= 0 &&
      this.activeDiagnosticIndex < this.diagnostics.length
        ? this.diagnostics[this.activeDiagnosticIndex]
        : this.diagnostics[0];

    this.messageElement.textContent = `${SEVERITY_LABEL[activeDiagnostic.severity]}: ${this.formatDiagnosticLabel(activeDiagnostic)}`;
  }

  private buildSummaryText(): string {
    const counts = {
      error: 0,
      warning: 0,
      info: 0,
      hint: 0,
    } satisfies Record<DiagnosticSeverity, number>;

    for (const diagnostic of this.diagnostics) {
      counts[diagnostic.severity] += 1;
    }

    return (Object.keys(counts) as DiagnosticSeverity[])
      .filter((severity) => counts[severity] > 0)
      .map((severity) => {
        const count = counts[severity];
        return `${count} ${count === 1 ? severity : `${severity}s`}`;
      })
      .join(' · ');
  }

  private createStatusBar(): void {
    if (!this.editor || this.statusElement) {
      return;
    }

    const contentElement = this.editor.getView().getContentElement();
    const container = contentElement.closest(
      '[data-lce-editor-container="true"]',
    ) as HTMLElement | null;
    if (!container) {
      return;
    }

    this.statusElement = document.createElement('div');
    this.statusElement.setAttribute('data-lce-diagnostics-status', 'true');
    this.statusElement.style.cssText = `
      position: absolute;
      right: 12px;
      bottom: 12px;
      z-index: 4;
      max-width: min(420px, calc(100% - 24px));
      padding: 8px 10px;
      border-radius: 8px;
      border: 1px solid rgba(148, 163, 184, 0.24);
      background: rgba(15, 23, 42, 0.88);
      color: #e2e8f0;
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.22);
      pointer-events: none;
      font-family: inherit;
      font-size: 12px;
      line-height: 1.45;
      backdrop-filter: blur(8px);
    `;

    this.summaryElement = document.createElement('div');
    this.summaryElement.style.cssText = `
      font-weight: 700;
      letter-spacing: 0.01em;
    `;

    this.messageElement = document.createElement('div');
    this.messageElement.style.cssText = `
      margin-top: 4px;
      color: rgba(226, 232, 240, 0.9);
    `;

    this.statusElement.appendChild(this.summaryElement);
    this.statusElement.appendChild(this.messageElement);
    container.appendChild(this.statusElement);
  }

  private normalizeDiagnostic(
    diagnostic: EditorDiagnostic,
    text: string,
    index: number,
  ): EditorDiagnostic | null {
    const start = this.clampPositionToText(diagnostic.range.start, text);
    const end = this.clampPositionToText(diagnostic.range.end, text);
    const normalizedRange = this.normalizeRange({ start, end });
    if (
      normalizedRange.start.line === normalizedRange.end.line &&
      normalizedRange.start.column === normalizedRange.end.column
    ) {
      return null;
    }

    return {
      id: diagnostic.id || `diagnostic-${index}`,
      message: diagnostic.message,
      severity: diagnostic.severity,
      source: diagnostic.source,
      code: diagnostic.code,
      range: normalizedRange,
    };
  }

  private formatDiagnosticLabel(diagnostic: EditorDiagnostic): string {
    const details = [diagnostic.source, diagnostic.code].filter(Boolean).join(' ');
    return details ? `${diagnostic.message} (${details})` : diagnostic.message;
  }

  private getInlineStyle(severity: DiagnosticSeverity): Record<string, string> {
    switch (severity) {
      case 'error':
        return {
          backgroundColor: 'rgba(255, 107, 107, 0.18)',
          textDecoration: 'underline wavy rgba(255, 107, 107, 0.95)',
        };
      case 'warning':
        return {
          backgroundColor: 'rgba(245, 158, 11, 0.18)',
          textDecoration: 'underline wavy rgba(245, 158, 11, 0.95)',
        };
      case 'info':
        return {
          backgroundColor: 'rgba(56, 189, 248, 0.16)',
          textDecoration: 'underline solid rgba(56, 189, 248, 0.95)',
        };
      case 'hint':
      default:
        return {
          backgroundColor: 'rgba(148, 163, 184, 0.14)',
          textDecoration: 'underline dotted rgba(148, 163, 184, 0.95)',
        };
    }
  }

  private getActiveLineStyle(
    severity: DiagnosticSeverity,
  ): Record<string, string> {
    switch (severity) {
      case 'error':
        return {
          backgroundColor: 'rgba(255, 107, 107, 0.08)',
          boxShadow: 'inset 0 0 0 1px rgba(255, 107, 107, 0.18)',
        };
      case 'warning':
        return {
          backgroundColor: 'rgba(245, 158, 11, 0.08)',
          boxShadow: 'inset 0 0 0 1px rgba(245, 158, 11, 0.18)',
        };
      case 'info':
        return {
          backgroundColor: 'rgba(56, 189, 248, 0.08)',
          boxShadow: 'inset 0 0 0 1px rgba(56, 189, 248, 0.18)',
        };
      case 'hint':
      default:
        return {
          backgroundColor: 'rgba(148, 163, 184, 0.06)',
          boxShadow: 'inset 0 0 0 1px rgba(148, 163, 184, 0.16)',
        };
    }
  }

  private rangeContainsPosition(range: Range, position: Position): boolean {
    return (
      this.comparePositions(range.start, position) <= 0 &&
      this.comparePositions(position, range.end) <= 0
    );
  }

  private comparePositions(a: Position, b: Position): number {
    if (a.line !== b.line) {
      return a.line - b.line;
    }
    return a.column - b.column;
  }

  private normalizeRange(range: Range): Range {
    return this.comparePositions(range.start, range.end) <= 0
      ? range
      : {
          start: range.end,
          end: range.start,
        };
  }

  private clampPositionToText(position: Position, text: string): Position {
    const lines = text.split('\n');
    const line = Math.max(0, Math.min(position.line, lines.length - 1));
    const lineText = lines[line] || '';
    return {
      line,
      column: Math.max(0, Math.min(position.column, lineText.length)),
    };
  }

  destroy(): void {
    if (this.editor && this.cursorHandler) {
      this.editor.off('cursor', this.cursorHandler);
    }
    if (this.editor && this.changeHandler) {
      this.editor.off('change', this.changeHandler);
    }

    this.editor?.clearDecorations(this.config.layerName);

    if (this.statusElement?.parentNode) {
      this.statusElement.parentNode.removeChild(this.statusElement);
    }

    this.statusElement = null;
    this.summaryElement = null;
    this.messageElement = null;
    this.cursorHandler = null;
    this.changeHandler = null;
    this.editor = null;
    this.diagnostics = [];
    this.activeDiagnosticIndex = -1;
  }
}
