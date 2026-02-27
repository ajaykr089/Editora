import { Plugin } from '@editora/core';

/**
 * Clear Formatting Plugin - Framework Agnostic
 * 
 * Removes all formatting from selected text with native command implementation.
 * No React dependency required.
 */
export const ClearFormattingPlugin = (): Plugin => ({
  name: "clearFormatting",

  // Toolbar button configuration
  toolbar: [
    {
      label: "Clear Formatting",
      command: "clearFormatting",
      icon: '<svg width="24" height="24" focusable="false"><path d="M13.2 6a1 1 0 0 1 0 .2l-2.6 10a1 1 0 0 1-1 .8h-.2a.8.8 0 0 1-.8-1l2.6-10H8a1 1 0 1 1 0-2h9a1 1 0 0 1 0 2h-3.8ZM5 18h7a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Zm13 1.5L16.5 18 15 19.5a.7.7 0 0 1-1-1l1.5-1.5-1.5-1.5a.7.7 0 0 1 1-1l1.5 1.5 1.5-1.5a.7.7 0 0 1 1 1L17.5 17l1.5 1.5a.7.7 0 0 1-1 1Z" fill-rule="evenodd"></path></svg>',
      shortcut: "Mod-\\",
    },
  ],

  // Native command implementations
  commands: {
    /**
     * Remove all formatting from current selection
     */
    clearFormatting: () => {
      const content = getActiveContentElement();
      if (!content) return false;

      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return false;

      const range = selection.getRangeAt(0);
      if (!content.contains(range.commonAncestorContainer)) return false;

      const originalRange = range.cloneRange();
      content.focus({ preventScroll: true });

      // Browser-level cleanup first.
      document.execCommand("unlink", false);
      document.execCommand("removeFormat", false);

      // Normalize what native removeFormat often misses across complex selections.
      normalizeBlockFormatting(content, originalRange);
      normalizeInlineFormatting(content, originalRange);

      content.dispatchEvent(new Event("input", { bubbles: true }));
      return true;
    },
  },

  // Keyboard shortcuts
  keymap: {
    "Mod-\\": "clearFormatting",
  },
});

const INLINE_UNWRAP_TAGS = new Set([
  "A",
  "B",
  "STRONG",
  "I",
  "EM",
  "U",
  "S",
  "STRIKE",
  "DEL",
  "FONT",
  "MARK",
  "CODE",
  "SUB",
  "SUP",
]);

const BLOCK_FORMAT_TAGS = new Set([
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "BLOCKQUOTE",
  "PRE",
]);

const CLEARABLE_STYLE_PROPS = [
  "color",
  "background-color",
  "font-size",
  "font-family",
  "font-weight",
  "font-style",
  "text-decoration",
  "text-transform",
  "line-height",
  "letter-spacing",
  "word-spacing",
  "vertical-align",
  "text-align",
  "padding-left",
];

function getActiveContentElement(): HTMLElement | null {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const node = selection.getRangeAt(0).startContainer;
    const element = node.nodeType === Node.ELEMENT_NODE
      ? (node as HTMLElement)
      : node.parentElement;
    const content = element?.closest('[contenteditable="true"], .rte-content, .editora-content') as HTMLElement | null;
    if (content) return content;
  }

  const active = document.activeElement as HTMLElement | null;
  if (!active) return null;
  if (active.getAttribute("contenteditable") === "true") return active;
  return active.closest('[contenteditable="true"], .rte-content, .editora-content') as HTMLElement | null;
}

function intersectsRange(range: Range, node: Node): boolean {
  try {
    if (typeof range.intersectsNode === "function") {
      return range.intersectsNode(node);
    }
  } catch {
    // Continue with fallback.
  }

  const nodeRange = document.createRange();
  if (node.nodeType === Node.ELEMENT_NODE) {
    nodeRange.selectNodeContents(node);
  } else {
    nodeRange.selectNode(node);
  }

  return (
    range.compareBoundaryPoints(Range.END_TO_START, nodeRange) > 0 &&
    range.compareBoundaryPoints(Range.START_TO_END, nodeRange) < 0
  );
}

function getElementDepth(element: HTMLElement): number {
  let depth = 0;
  let node: Node | null = element;
  while (node && node.parentNode) {
    depth += 1;
    node = node.parentNode;
  }
  return depth;
}

function removeFormattingStyles(element: HTMLElement): void {
  CLEARABLE_STYLE_PROPS.forEach((property) => {
    element.style.removeProperty(property);
  });

  if (!element.getAttribute("style") || element.style.length === 0) {
    element.removeAttribute("style");
  }

  if (element.classList.contains("rte-text-color")) {
    element.classList.remove("rte-text-color");
  }
  if (element.classList.contains("rte-bg-color")) {
    element.classList.remove("rte-bg-color");
  }
  if (element.classList.length === 0) {
    element.removeAttribute("class");
  }
}

function unwrapElement(element: HTMLElement): void {
  const parent = element.parentNode;
  if (!parent) return;

  while (element.firstChild) {
    parent.insertBefore(element.firstChild, element);
  }
  parent.removeChild(element);
}

function normalizeBlockFormatting(content: HTMLElement, range: Range): void {
  const blockNodes = Array.from(
    content.querySelectorAll("h1,h2,h3,h4,h5,h6,blockquote,pre"),
  ) as HTMLElement[];

  blockNodes.forEach((block) => {
    if (!intersectsRange(range, block)) return;
    if (!BLOCK_FORMAT_TAGS.has(block.tagName)) return;

    const replacement = document.createElement("p");
    while (block.firstChild) {
      replacement.appendChild(block.firstChild);
    }
    block.parentNode?.replaceChild(replacement, block);
  });
}

function normalizeInlineFormatting(content: HTMLElement, range: Range): void {
  const candidates = Array.from(
    content.querySelectorAll(
      "a,b,strong,i,em,u,s,strike,del,font,mark,code,sub,sup,span,[style],[class]",
    ),
  ) as HTMLElement[];

  candidates.sort((a, b) => getElementDepth(b) - getElementDepth(a));

  candidates.forEach((element) => {
    if (!element.isConnected) return;
    if (!intersectsRange(range, element)) return;

    // Ignore protected/atomic widgets.
    if (
      element.getAttribute("contenteditable") === "false" ||
      element.closest('[contenteditable="false"]')
    ) {
      return;
    }

    removeFormattingStyles(element);

    if (INLINE_UNWRAP_TAGS.has(element.tagName)) {
      unwrapElement(element);
      return;
    }

    if (
      element.tagName === "SPAN" &&
      element.attributes.length === 0
    ) {
      unwrapElement(element);
    }
  });
}
