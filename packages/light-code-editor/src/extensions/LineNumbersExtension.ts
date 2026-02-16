/**
 * Line Numbers Extension
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 */

import { EditorExtension, EditorCore } from '../types';

export class LineNumbersExtension implements EditorExtension {
  public readonly name = 'line-numbers';
  private editor: EditorCore | null = null;
  private lineNumbersElement: HTMLElement | null = null;
  private isEnabled = true;

  setup(editor: EditorCore): void {
    this.editor = editor;

    // Create line numbers container
    this.createLineNumbers();

    // Register commands
    editor.registerCommand('toggleLineNumbers', () => {
      this.toggle();
    });

    // Listen for content changes to update line numbers
    editor.on('change', () => {
      this.updateLineNumbers();
    });

    // Initial update
    this.updateLineNumbers();
  }

  private createLineNumbers(): void {
    if (!this.editor) return;

    // Reuse the gutter element created by the View to avoid duplicate overlays.
    const view = this.editor.getView();
    const gutter = view.getLineNumbersElement();
    if (!gutter) return;

    this.lineNumbersElement = gutter;
  }

  private updateLineNumbers(): void {
    if (!this.lineNumbersElement || !this.editor || !this.isEnabled) return;
    const lineCount = this.editor.getValue().split('\n').length;
    const lineNumbers = Array.from({ length: Math.max(lineCount, 20) }, (_, i) => i + 1);

    this.lineNumbersElement.innerHTML = lineNumbers
      .map(num => `<div style="height: ${21}px; line-height: ${21}px; padding-right: 12px;">${num}</div>`)
      .join('');
  }

  private toggle(): void {
    this.isEnabled = !this.isEnabled;

    if (this.lineNumbersElement) {
      this.lineNumbersElement.style.display = this.isEnabled ? 'block' : 'none';
    }

    const contentElement = this.editor.getView().getContentElement();
    if (contentElement) {
      contentElement.style.marginLeft = this.isEnabled ? '60px' : '0';
    }

    this.updateLineNumbers();
  }

  destroy(): void {
    // Do not remove the view's gutter element; only clear our reference.
    this.lineNumbersElement = null;
    this.editor = null;
  }
}
