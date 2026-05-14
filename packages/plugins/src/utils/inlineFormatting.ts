export type InlineFormatCommand = 'bold' | 'italic' | 'underline' | 'strikeThrough';

export interface InlineFormattingContext {
  editorElement?: HTMLElement | null;
  contentElement?: HTMLElement | null;
}

export interface ApplyInlineFormattingOptions {
  command: InlineFormatCommand;
  context?: InlineFormattingContext | null;
  normalize?: (editorContent: HTMLElement) => void;
}

const SELECTION_MARKER_ATTR = 'data-editora-selection-marker';

function getElementForNode(node: Node | null): HTMLElement | null {
  if (!node) return null;
  return node.nodeType === Node.ELEMENT_NODE ? node as HTMLElement : node.parentElement;
}

function getEditableFromElement(element: HTMLElement | null): HTMLElement | null {
  if (!element) return null;
  if (element.getAttribute('contenteditable') === 'true') return element;
  return element.querySelector('[contenteditable="true"]') as HTMLElement | null;
}

function resolveEditorContent(context?: InlineFormattingContext | null): HTMLElement | null {
  if (context?.contentElement instanceof HTMLElement) return context.contentElement;

  const contextEditable = getEditableFromElement(context?.editorElement ?? null);
  if (contextEditable) return contextEditable;

  const commandRoot = typeof window !== 'undefined'
    ? (window as any).__editoraCommandEditorRoot
    : null;
  const commandEditable = commandRoot instanceof HTMLElement ? getEditableFromElement(commandRoot) : null;
  if (commandEditable) return commandEditable;

  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const selectedElement = getElementForNode(selection.getRangeAt(0).startContainer);
    const selectedEditable = selectedElement?.closest('.rte-content, .editora-content, [contenteditable="true"]');
    if (selectedEditable instanceof HTMLElement) return selectedEditable;
  }

  const active = document.activeElement;
  if (active instanceof HTMLElement) {
    const activeEditable = active.closest('.rte-content, .editora-content, [contenteditable="true"]');
    if (activeEditable instanceof HTMLElement) return activeEditable;
  }

  return document.querySelector('.rte-content, .editora-content, [contenteditable="true"]') as HTMLElement | null;
}

function selectionBelongsToEditor(editorContent: HTMLElement): boolean {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const range = selection.getRangeAt(0);
  return editorContent.contains(range.startContainer) && editorContent.contains(range.endContainer);
}

function createSelectionMarker(type: 'start' | 'end'): HTMLSpanElement {
  const marker = document.createElement('span');
  marker.setAttribute(SELECTION_MARKER_ATTR, type);
  marker.style.display = 'inline-block';
  marker.style.width = '0';
  marker.style.height = '0';
  marker.style.overflow = 'hidden';
  marker.style.lineHeight = '0';
  marker.appendChild(document.createTextNode('\uFEFF'));
  return marker;
}

function bookmarkSelection(editorContent: HTMLElement): (() => void) | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  if (!editorContent.contains(range.startContainer) || !editorContent.contains(range.endContainer)) {
    return null;
  }

  const collapsed = range.collapsed;
  const startMarker = createSelectionMarker('start');
  const endMarker = collapsed ? null : createSelectionMarker('end');
  const bookmarkedRange = range.cloneRange();

  if (endMarker) {
    const endRange = bookmarkedRange.cloneRange();
    endRange.collapse(false);
    endRange.insertNode(endMarker);
  }

  const startRange = bookmarkedRange.cloneRange();
  startRange.collapse(true);
  startRange.insertNode(startMarker);

  return () => {
    const currentSelection = window.getSelection();
    const restoredRange = document.createRange();
    const currentStartMarker = editorContent.querySelector(
      `[${SELECTION_MARKER_ATTR}="start"]`,
    );
    const currentEndMarker = editorContent.querySelector(
      `[${SELECTION_MARKER_ATTR}="end"]`,
    );

    if (!currentSelection || !currentStartMarker) {
      editorContent.querySelectorAll(`[${SELECTION_MARKER_ATTR}]`).forEach((marker) => marker.remove());
      return;
    }

    if (collapsed || !currentEndMarker) {
      restoredRange.setStartBefore(currentStartMarker);
      restoredRange.collapse(true);
    } else {
      restoredRange.setStartAfter(currentStartMarker);
      restoredRange.setEndBefore(currentEndMarker);
    }

    currentSelection.removeAllRanges();
    currentSelection.addRange(restoredRange);
    currentStartMarker.remove();
    currentEndMarker?.remove();
  };
}

function recordDomHistoryTransaction(editor: HTMLElement, beforeHTML: string, afterHTML: string): void {
  if (beforeHTML === afterHTML) return;
  if (typeof (window as any).execEditorCommand === 'function') {
    (window as any).execEditorCommand('recordDomTransaction', editor, beforeHTML, afterHTML);
    return;
  }

  if (typeof (window as any).executeEditorCommand !== 'function') return;

  try {
    (window as any).executeEditorCommand('recordDomTransaction', { editor, beforeHTML, afterHTML });
  } catch {
    // History plugin may be unavailable.
  }
}

export function applyInlineFormatting(options: ApplyInlineFormattingOptions): boolean {
  const editorContent = resolveEditorContent(options.context);
  if (!editorContent) return false;

  const beforeHTML = editorContent.innerHTML;
  if (selectionBelongsToEditor(editorContent)) {
    editorContent.focus({ preventScroll: true });
  }

  let executed = false;
  try {
    executed = document.execCommand(options.command, false);
  } catch {
    executed = false;
  }

  const htmlAfterCommand = editorContent.innerHTML;
  if (options.normalize && htmlAfterCommand !== beforeHTML) {
    const restoreSelection = bookmarkSelection(editorContent);
    options.normalize(editorContent);
    restoreSelection?.();
  }

  const afterHTML = editorContent.innerHTML;
  if (beforeHTML !== afterHTML) {
    recordDomHistoryTransaction(editorContent, beforeHTML, afterHTML);
    editorContent.dispatchEvent(new Event('input', { bubbles: true }));
  }

  return executed !== false || beforeHTML !== afterHTML;
}
