import { cleanPaste, type CleanPasteOptions, type CleanPasteResult } from './clean';

export interface AttachPasteCleanerOptions extends CleanPasteOptions {
  /**
   * Change or veto the result before it is inserted: return replacement HTML,
   * `false` to let the browser paste natively, or nothing to insert as is.
   */
  transform?: (result: CleanPasteResult) => string | false | void;
  /**
   * Upload pasted image files (screenshots) and data: images; resolve with the
   * URL to use. Without it, pasted files are left to the browser and data:
   * images stay inline.
   */
  uploadImage?: (image: Blob) => Promise<string>;
  /** How to insert: `native` keeps the browser's own undo (execCommand), `range` edits the DOM directly. Default `native`. */
  insertMode?: 'native' | 'range';
  /** Called after every cleaned paste. */
  onPaste?: (result: CleanPasteResult) => void;
}

export interface PasteCleaner {
  /** The last cleaned paste, for inspection. */
  readonly lastResult: CleanPasteResult | null;
  detach(): void;
}

const BLOCK_SELECTOR = 'p,h1,h2,h3,h4,h5,h6,blockquote,pre,li,td,th,div,figure,figcaption';
const isMac = () => typeof navigator !== 'undefined' && /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent);

/** Clean every paste into `element` (a contenteditable). Shift+Ctrl/Cmd+V pastes plain text. */
export function attachPasteCleaner(element: HTMLElement, options: AttachPasteCleanerOptions = {}): PasteCleaner {
  let lastResult: CleanPasteResult | null = null;
  let plainNext = false;

  const onKeyDown = (event: KeyboardEvent) => {
    const mod = isMac() ? event.metaKey : event.ctrlKey;
    plainNext = mod && event.shiftKey && event.key.toLowerCase() === 'v';
  };

  const onPaste = (event: ClipboardEvent) => {
    if (event.defaultPrevented || !event.clipboardData) return;
    const data = event.clipboardData;
    const html = data.getData('text/html');
    const text = data.getData('text/plain');
    const files = Array.from(data.files ?? []).filter((file) => file.type.startsWith('image/'));
    const plain = plainNext;
    plainNext = false;

    if (!html && !text) {
      if (files.length > 0 && options.uploadImage) {
        event.preventDefault();
        void insertUploadedFiles(element, files, options);
      }
      return;
    }

    const result = cleanPaste({ html: plain ? '' : html, text }, { ...options, markdown: plain ? false : options.markdown, plainText: plain || options.plainText });
    lastResult = result;
    const transformed = options.transform?.(result);
    if (transformed === false) return;
    const output = typeof transformed === 'string' ? transformed : result.html;

    event.preventDefault();
    if (!output) return;
    insertHtml(element, output, options.insertMode ?? 'native');
    if (options.uploadImage) void uploadInlineImages(element, options.uploadImage);
    options.onPaste?.(result);
  };

  element.addEventListener('keydown', onKeyDown);
  element.addEventListener('paste', onPaste);

  return {
    get lastResult() {
      return lastResult;
    },
    detach() {
      element.removeEventListener('keydown', onKeyDown);
      element.removeEventListener('paste', onPaste);
    },
  };
}

/** Insert HTML at the selection in `root`, splitting the current paragraph when blocks are pasted into it. */
export function insertHtml(root: HTMLElement, html: string, mode: 'native' | 'range' = 'range'): void {
  const doc = root.ownerDocument;
  const selection = doc.getSelection();
  if (!selection || selection.rangeCount === 0 || !root.contains(selection.getRangeAt(0).commonAncestorContainer)) {
    root.insertAdjacentHTML('beforeend', html);
    return;
  }

  if (mode === 'native' && typeof doc.execCommand === 'function') {
    try {
      if (doc.execCommand('insertHTML', false, html)) return;
    } catch {
      // Fall through to DOM insertion.
    }
  }

  const range = selection.getRangeAt(0);
  range.deleteContents();
  const template = doc.createElement('template');
  template.innerHTML = html;
  const fragment = template.content;
  const hasBlocks = Array.from(fragment.children).some((child) => child.matches(`${BLOCK_SELECTOR},ul,ol,table,hr`));

  let last: Node | null = fragment.lastChild;
  const block = (range.startContainer.nodeType === 1 ? (range.startContainer as Element) : range.startContainer.parentElement)?.closest(BLOCK_SELECTOR);
  const insideBlock = block && block !== root && root.contains(block) ? (block as HTMLElement) : null;

  if (!hasBlocks || !insideBlock) {
    range.insertNode(fragment);
  } else if (insideBlock.matches('li,td,th,pre')) {
    // Blocks cannot go inside these: keep the text, one line per pasted block.
    const lines = Array.from(fragment.childNodes).map((node) => node.textContent ?? '');
    const inline = doc.createDocumentFragment();
    lines.forEach((line, index) => {
      if (index > 0) inline.appendChild(doc.createElement('br'));
      inline.appendChild(doc.createTextNode(line));
    });
    last = inline.lastChild;
    range.insertNode(inline);
  } else {
    // Split the paragraph at the caret and put the pasted blocks between the halves.
    const tailRange = doc.createRange();
    tailRange.setStart(range.endContainer, range.endOffset);
    tailRange.setEnd(insideBlock, insideBlock.childNodes.length);
    const tail = insideBlock.cloneNode(false) as HTMLElement;
    tail.appendChild(tailRange.extractContents());
    insideBlock.after(tail);

    const pasted = Array.from(fragment.childNodes);
    insideBlock.after(fragment);

    // The first and last pasted paragraphs join the text around the caret.
    const first = pasted[0];
    if (first?.nodeType === 1 && (first as Element).tagName === 'P' && hasText(insideBlock)) {
      while (first.firstChild) insideBlock.appendChild(first.firstChild);
      (first as Element).remove();
      last = last === first ? insideBlock.lastChild : last;
    }
    const final = pasted[pasted.length - 1];
    if (final?.nodeType === 1 && (final as Element).isConnected && (final as Element).tagName === 'P' && hasText(tail)) {
      last = final.lastChild;
      while (tail.firstChild) final.appendChild(tail.firstChild);
      tail.remove();
    }
    if (!hasText(insideBlock)) insideBlock.remove();
    if (tail.isConnected && !hasText(tail)) tail.remove();
  }

  if (last && last.isConnected) {
    const caret = doc.createRange();
    caret.setStartAfter(last);
    caret.collapse(true);
    selection.removeAllRanges();
    selection.addRange(caret);
  }
  root.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertFromPaste' }));
}

function hasText(element: Element): boolean {
  return (element.textContent ?? '').trim() !== '' || element.querySelector('img') !== null;
}

async function insertUploadedFiles(root: HTMLElement, files: File[], options: AttachPasteCleanerOptions): Promise<void> {
  for (const file of files) {
    try {
      const url = await options.uploadImage!(file);
      insertHtml(root, `<img src="${url.replace(/"/g, '&quot;')}" alt="">`, options.insertMode ?? 'native');
    } catch {
      // The uploader reports its own errors.
    }
  }
}

async function uploadInlineImages(root: HTMLElement, upload: (image: Blob) => Promise<string>): Promise<void> {
  const images = Array.from(root.querySelectorAll<HTMLImageElement>('img[src^="data:image/"]'));
  await Promise.all(
    images.map(async (image) => {
      try {
        const blob = await (await fetch(image.src)).blob();
        image.src = await upload(blob);
      } catch {
        // Leave the data: image in place.
      }
    }),
  );
}
