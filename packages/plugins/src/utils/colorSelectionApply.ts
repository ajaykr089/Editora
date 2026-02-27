export type ActiveEditorResolver = () => HTMLElement | null;

const BLOCK_SELECTOR =
  'p,div,li,ul,ol,table,thead,tbody,tfoot,tr,td,th,h1,h2,h3,h4,h5,h6,blockquote,pre';

function selectionContainsBlockNodes(range: Range): boolean {
  const fragment = range.cloneContents();
  return !!fragment.querySelector(BLOCK_SELECTOR);
}

function getEditorContentForNode(
  node: Node | null,
  getActiveEditorRoot: ActiveEditorResolver,
): HTMLElement | null {
  const startElement = node?.nodeType === Node.ELEMENT_NODE
    ? (node as HTMLElement)
    : node?.parentElement ?? null;

  return (
    (startElement?.closest('[contenteditable="true"]') as HTMLElement | null) ||
    (getActiveEditorRoot()?.querySelector('[contenteditable="true"]') as HTMLElement | null) ||
    (document.querySelector('[contenteditable="true"]') as HTMLElement | null)
  );
}

function dispatchInputEvent(
  node: Node | null,
  getActiveEditorRoot: ActiveEditorResolver,
): void {
  const editorContent = getEditorContentForNode(node, getActiveEditorRoot);
  if (editorContent) {
    editorContent.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

function findEnclosingColorSpan(range: Range, className: string): HTMLElement | null {
  const startElement = range.startContainer.nodeType === Node.TEXT_NODE
    ? range.startContainer.parentElement
    : (range.startContainer as HTMLElement);

  let currentElement: HTMLElement | null = startElement as HTMLElement | null;

  while (currentElement && currentElement !== document.body) {
    if (currentElement.classList.contains(className)) {
      const spanRange = document.createRange();
      spanRange.selectNodeContents(currentElement);

      if (
        spanRange.compareBoundaryPoints(Range.START_TO_START, range) <= 0 &&
        spanRange.compareBoundaryPoints(Range.END_TO_END, range) >= 0
      ) {
        return currentElement;
      }
    }
    currentElement = currentElement.parentElement;
  }

  return null;
}

export interface ApplyColorSelectionOptions {
  color: string;
  className: string;
  styleProperty: 'color' | 'backgroundColor';
  commands: string[];
  savedRange: Range | null;
  getActiveEditorRoot: ActiveEditorResolver;
  warnMessage?: string;
}

export function applyColorToSelection(options: ApplyColorSelectionOptions): boolean {
  try {
    if (options.savedRange) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(options.savedRange.cloneRange());
      }
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      return false;
    }

    const range = selection.getRangeAt(0);
    if (range.collapsed) {
      return false;
    }

    const targetSpan = findEnclosingColorSpan(range, options.className);
    if (targetSpan) {
      if (options.styleProperty === 'backgroundColor') {
        targetSpan.style.backgroundColor = options.color;
      } else {
        targetSpan.style.color = options.color;
      }
      dispatchInputEvent(targetSpan, options.getActiveEditorRoot);
      return true;
    }

    const editorContent = getEditorContentForNode(
      range.commonAncestorContainer,
      options.getActiveEditorRoot,
    );
    editorContent?.focus({ preventScroll: true });

    try {
      document.execCommand('styleWithCSS', false, 'true');
    } catch {
      // Ignore unsupported browsers.
    }

    let applied = false;
    options.commands.forEach((command) => {
      if (!applied) {
        applied = document.execCommand(command, false, options.color);
      }
    });

    if (!applied && !selectionContainsBlockNodes(range)) {
      const span = document.createElement('span');
      if (options.styleProperty === 'backgroundColor') {
        span.style.backgroundColor = options.color;
      } else {
        span.style.color = options.color;
      }
      span.className = options.className;

      const contents = range.extractContents();
      span.appendChild(contents);
      range.insertNode(span);
      range.setStartAfter(span);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      applied = true;
    }

    if (!applied) {
      if (options.warnMessage) {
        console.warn(options.warnMessage);
      }
      return false;
    }

    dispatchInputEvent(range.commonAncestorContainer, options.getActiveEditorRoot);
    return true;
  } catch (error) {
    if (options.warnMessage) {
      console.error(options.warnMessage, error);
    } else {
      console.error('[ColorApply] Failed to apply color', error);
    }
    return false;
  }
}
