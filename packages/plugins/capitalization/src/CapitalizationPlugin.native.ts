import type { Plugin } from '@editora/core';

/**
 * CapitalizationPlugin - Native implementation for text case transformations
 * 
 * Features:
 * - Convert text to UPPERCASE
 * - Convert text to lowercase
 * - Convert text to Title Case
 * - Useful for formatting headings, names, acronyms
 * 
 * Commands:
 * - toUpperCase: Convert selection to UPPERCASE
 * - toLowerCase: Convert selection to lowercase
 * - toTitleCase: Convert selection to Title Case
 */

type TextSlice = {
  node: Text;
  start: number;
  end: number;
  text: string;
};

type TextSliceTransformer = (slice: TextSlice, index: number) => string;

const EDITOR_CONTENT_SELECTOR = '.rte-content, .editora-content, [contenteditable="true"]';
const ROOT_EDITOR_SELECTOR = '[data-editora-editor], .rte-editor, .editora-editor, editora-editor';

declare global {
  interface Window {
    execEditorCommand?: (command: string, ...args: any[]) => any;
    executeEditorCommand?: (command: string, ...args: any[]) => any;
    __editoraCommandEditorRoot?: HTMLElement | null;
  }
}

const getElementForNode = (node: Node | null): HTMLElement | null => {
  if (!node) return null;
  return node.nodeType === Node.ELEMENT_NODE ? node as HTMLElement : node.parentElement;
};

const resolveEditorContent = (context?: any): HTMLElement | null => {
  const contextContent = context?.contentElement;
  if (contextContent instanceof HTMLElement) return contextContent;

  const contextEditor = context?.editorElement;
  if (contextEditor instanceof HTMLElement) {
    const content = contextEditor.querySelector(EDITOR_CONTENT_SELECTOR);
    if (content instanceof HTMLElement) return content;
    if (contextEditor.getAttribute('contenteditable') === 'true') return contextEditor;
  }

  const commandRoot = window.__editoraCommandEditorRoot;
  if (commandRoot instanceof HTMLElement) {
    const content = commandRoot.querySelector(EDITOR_CONTENT_SELECTOR);
    if (content instanceof HTMLElement) return content;
    if (commandRoot.getAttribute('contenteditable') === 'true') return commandRoot;
  }

  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const selectedElement = getElementForNode(selection.getRangeAt(0).startContainer);
    const content = selectedElement?.closest(EDITOR_CONTENT_SELECTOR);
    if (content instanceof HTMLElement) return content;

    const editorRoot = selectedElement?.closest(ROOT_EDITOR_SELECTOR);
    const rootContent = editorRoot?.querySelector(EDITOR_CONTENT_SELECTOR);
    if (rootContent instanceof HTMLElement) return rootContent;
  }

  const activeElement = document.activeElement;
  const activeContent = activeElement instanceof HTMLElement
    ? activeElement.closest(EDITOR_CONTENT_SELECTOR)
    : null;
  if (activeContent instanceof HTMLElement) return activeContent;

  return document.querySelector(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
};

const getSelectionRangeInEditor = (editor: HTMLElement): Range | null => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null;

  const range = selection.getRangeAt(0);
  if (!editor.contains(range.startContainer) || !editor.contains(range.endContainer)) {
    return null;
  }

  return range;
};

const rangeIntersectsTextNode = (range: Range, node: Text): boolean => {
  if (!node.data) return false;

  if (typeof range.intersectsNode === 'function') {
    try {
      return range.intersectsNode(node);
    } catch {
      return false;
    }
  }

  const nodeRange = document.createRange();
  nodeRange.selectNodeContents(node);
  return range.compareBoundaryPoints(Range.END_TO_START, nodeRange) < 0
    && range.compareBoundaryPoints(Range.START_TO_END, nodeRange) > 0;
};

const getTextSlicesInRange = (editor: HTMLElement, range: Range): TextSlice[] => {
  const slices: TextSlice[] = [];
  const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT);

  let current = walker.nextNode();
  while (current) {
    const textNode = current as Text;
    if (rangeIntersectsTextNode(range, textNode)) {
      const start = textNode === range.startContainer ? range.startOffset : 0;
      const end = textNode === range.endContainer ? range.endOffset : textNode.data.length;

      if (start < end) {
        slices.push({
          node: textNode,
          start,
          end,
          text: textNode.data.slice(start, end),
        });
      }
    }

    current = walker.nextNode();
  }

  return slices;
};

const isLetter = (value: string): boolean => /\p{L}/u.test(value);
const isWordContinuation = (value: string): boolean => /[\p{M}'’-]/u.test(value);

const createTitleCaseTransformer = (): TextSliceTransformer => {
  let insideWord = false;

  return (slice) => {
    let result = '';

    Array.from(slice.text).forEach((char) => {
      if (isLetter(char)) {
        result += insideWord ? char.toLocaleLowerCase() : char.toLocaleUpperCase();
        insideWord = true;
        return;
      }

      result += char;
      if (!isWordContinuation(char)) {
        insideWord = false;
      }
    });

    return result;
  };
};

const restoreSelectionFromSlices = (slices: TextSlice[]): void => {
  if (slices.length === 0) return;

  const first = slices[0];
  const last = slices[slices.length - 1];
  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  range.setStart(first.node, first.start);
  range.setEnd(last.node, last.end);
  selection.removeAllRanges();
  selection.addRange(range);
};

const recordDomHistoryTransaction = (editor: HTMLElement, beforeHTML: string, afterHTML: string): void => {
  if (beforeHTML === afterHTML) return;
  if (typeof window.execEditorCommand === 'function') {
    window.execEditorCommand('recordDomTransaction', editor, beforeHTML, afterHTML);
    return;
  }

  if (typeof window.executeEditorCommand !== 'function') return;

  try {
    window.executeEditorCommand('recordDomTransaction', { editor, beforeHTML, afterHTML });
  } catch {
    // History plugin may be unavailable.
  }
};

export const CapitalizationPlugin = (): Plugin => {
  const transformSelection = (
    transform: TextSliceTransformer,
    context?: any,
  ): boolean => {
    try {
      const editor = resolveEditorContent(context);
      if (!editor) return false;

      const range = getSelectionRangeInEditor(editor);
      if (!range) return false;

      const slices = getTextSlicesInRange(editor, range);
      if (slices.length === 0) return false;

      const beforeHTML = editor.innerHTML;

      slices.forEach((slice, index) => {
        const nextText = transform(slice, index);
        slice.node.replaceData(slice.start, slice.end - slice.start, nextText);
        slice.end = slice.start + nextText.length;
      });

      const afterHTML = editor.innerHTML;
      if (beforeHTML === afterHTML) return false;

      recordDomHistoryTransaction(editor, beforeHTML, afterHTML);
      editor.dispatchEvent(new window.Event('input', { bubbles: true }));
      restoreSelectionFromSlices(slices);
      return true;
    } catch (error) {
      console.error("Failed to transform capitalization:", error);
      return false;
    }
  };

  const toUpperCaseImpl = (_params?: unknown, context?: any) => {
    return transformSelection((slice) => slice.text.toLocaleUpperCase(), context);
  };

  const toLowerCaseImpl = (_params?: unknown, context?: any) => {
    return transformSelection((slice) => slice.text.toLocaleLowerCase(), context);
  };

  const toTitleCaseImpl = (_params?: unknown, context?: any) => {
    return transformSelection(createTitleCaseTransformer(), context);
  };

  const setCapitalizationImpl = (value?: string, context?: any) => {
    if (!value) return false;

    switch (value) {
      case 'uppercase':
        return toUpperCaseImpl(undefined, context);
      case 'lowercase':
        return toLowerCaseImpl(undefined, context);
      case 'titlecase':
        return toTitleCaseImpl(undefined, context);
      default:
        return false;
    }
  };

  const normalizeCommandArgs = (first?: unknown, second?: unknown): { value?: string; context?: any } => {
    if (typeof first === 'string') {
      return { value: first, context: second };
    }

    if (typeof second === 'string') {
      return { value: second };
    }

    return {
      value: undefined,
      context: second,
    };
  };

  const normalizeShortcutContext = (first?: unknown, second?: unknown): any => {
    if (second && typeof second === 'object' && !(second as any).doc) {
      return second;
    }

    return undefined;
  };

  const commandWithOptionalContext = (
    command: (_params?: unknown, context?: any) => boolean,
  ) => (first?: unknown, second?: unknown) => {
    return command(undefined, normalizeShortcutContext(first, second));
  };

  return {
    name: "capitalization",

    toolbar: [
      {
        label: "Capitalization",
        command: "setCapitalization",
        type: "inline-menu",
        options: [
          { label: "lowercase", value: "lowercase" },
          { label: "UPPERCASE", value: "uppercase" },
          { label: "Title Case", value: "titlecase" },
        ],
        icon: '<svg fill="#000000" width="24" height="24" viewBox="0 0 32.00 32.00" id="icon" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.192"></g><g id="SVGRepo_iconCarrier"><defs><style>.cls-1{fill:none;}</style></defs><title>letter--Aa</title><path d="M23,13H18v2h5v2H19a2,2,0,0,0-2,2v2a2,2,0,0,0,2,2h6V15A2,2,0,0,0,23,13Zm0,8H19V19h4Z"></path><path d="M13,9H9a2,2,0,0,0-2,2V23H9V18h4v5h2V11A2,2,0,0,0,13,9ZM9,16V11h4v5Z"></path><rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" class="cls-1" width="32" height="32"></rect></g></svg>',
      }
    ],

    commands: {
      setCapitalization: (first?: unknown, second?: unknown) => {
        const { value, context } = normalizeCommandArgs(first, second);
        return setCapitalizationImpl(value, context);
      },

      toUpperCase: commandWithOptionalContext(toUpperCaseImpl),
      toLowerCase: commandWithOptionalContext(toLowerCaseImpl),
      toTitleCase: commandWithOptionalContext(toTitleCaseImpl),
    },

    keymap: {
      "Mod-Shift-u": "toUpperCase",
      "Mod-Shift-k": "toLowerCase",
      "Mod-Shift-t": "toTitleCase",
    },
  };
};
