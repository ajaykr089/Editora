import type { Plugin } from "@editora/core";

/**
 * FontSizePlugin - Native implementation for font size formatting
 *
 * Features:
 * - Decrease/Increase font size buttons (−/+)
 * - Manual font size input field with CSS unit support (px, em, rem)
 * - Range: 8-72px or 0.5-5em/rem
 * - Updates input to show current size with unit
 *
 * Commands:
 * - decreaseFontSize: Decrease font size by 2px (or 0.125em/rem)
 * - increaseFontSize: Increase font size by 2px (or 0.125em/rem)
 * - setFontSize: Set specific font size from input (supports px, em, rem)
 *
 * UI/UX Features:
 * - Three toolbar items: decrease button, input, increase button
 * - Input shows current font size from selection with unit
 * - Simple +/− text icons matching React version
 * - Unit preservation (if user sets em, stays in em)
 */
export const FontSizePlugin = (): Plugin => {
  return {
    name: "fontSize",

    marks: {
      fontSize: {
        attrs: {
          size: { default: null },
        },
        parseDOM: [
          {
            tag: 'span[style*="font-size"]',
            getAttrs: (dom) => {
              const element = dom as HTMLElement;
              const size = element.style.fontSize;
              return size ? { size } : false;
            },
          },
          {
            tag: "font[size]",
            getAttrs: (dom) => {
              const element = dom as HTMLElement;
              const size = element.getAttribute("size");
              return size ? { size } : false;
            },
          },
        ],
        toDOM: (mark) => {
          return ["span", { style: `font-size: ${mark.attrs.size}` }, 0];
        },
      },
    },

    toolbar: [
      {
        label: "Font Size",
        command: "fontSize",
        type: "group",
        items: [
          {
            label: "Decrease Font Size",
            command: "decreaseFontSize",
            icon: "−",
            type: "button",
          },
          {
            label: "Font Size",
            command: "setFontSize",
            type: "input",
            placeholder: "14",
          },
          {
            label: "Increase Font Size",
            command: "increaseFontSize",
            icon: "+",
            type: "button",
          },
        ],
      },
    ],

    commands: {
      decreaseFontSize: () => {
        try {
          applyFontSizeChange(-2);
          updateFontSizeInput();
          return true;
        } catch (error) {
          console.error("Failed to decrease font size:", error);
          return false;
        }
      },

      increaseFontSize: () => {
        try {
          applyFontSizeChange(2);
          updateFontSizeInput();
          return true;
        } catch (error) {
          console.error("Failed to increase font size:", error);
          return false;
        }
      },

      setFontSize: (size?: string) => {
        if (!size) return false;

        try {
          // Parse size with unit support (px, em, rem)
          const trimmedSize = size.trim();
          const match = trimmedSize.match(/^(\d+(?:\.\d+)?)(px|em|rem)?$/i);

          if (!match) return false;

          const value = parseFloat(match[1]);
          const unit = match[2]?.toLowerCase() || "px"; // Default to px if no unit

          // Unit-specific validation
          if (unit === "px" && (value < 8 || value > 72)) return false;
          if ((unit === "em" || unit === "rem") && (value < 0.5 || value > 5))
            return false;

          applyFontSizeToSelection(value, unit);
          return true;
        } catch (error) {
          console.error("Failed to set font size:", error);
          return false;
        }
      },
    },

    keymap: {},
  };
};

const BLOCK_SELECTOR =
  "p,div,li,ul,ol,table,thead,tbody,tfoot,tr,td,th,h1,h2,h3,h4,h5,h6,blockquote,pre";

const FONT_SIZE_KEYWORD_TO_PX: Record<string, number> = {
  "xx-small": 9,
  "x-small": 10,
  small: 13,
  medium: 16,
  large: 18,
  "x-large": 24,
  "xx-large": 32,
  "xxx-large": 48,
  smaller: 13,
  larger: 18,
};

function parseFontSizeValue(raw: string): { value: number; unit: string } | null {
  const size = raw.trim().toLowerCase();
  const numericMatch = size.match(/^(\d+(?:\.\d+)?)(px|em|rem)$/i);
  if (numericMatch) {
    return {
      value: parseFloat(numericMatch[1]),
      unit: numericMatch[2].toLowerCase(),
    };
  }

  const keywordValue = FONT_SIZE_KEYWORD_TO_PX[size];
  if (keywordValue) {
    return { value: keywordValue, unit: "px" };
  }

  return null;
}

function isKeywordFontSize(raw: string): boolean {
  const size = raw.trim().toLowerCase();
  return size in FONT_SIZE_KEYWORD_TO_PX;
}

function selectionContainsBlockNodes(range: Range): boolean {
  const fragment = range.cloneContents();
  return !!fragment.querySelector(BLOCK_SELECTOR);
}

function getEditableContentFromNode(node: Node): HTMLElement | null {
  const element =
    node.nodeType === Node.ELEMENT_NODE
      ? (node as HTMLElement)
      : node.parentElement;

  return (
    (element?.closest('[contenteditable="true"]') as HTMLElement | null) ||
    (document.querySelector('[contenteditable="true"]') as HTMLElement | null)
  );
}

function dispatchEditorInput(editorContent: HTMLElement | null): void {
  if (editorContent) {
    editorContent.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

function replaceFontTagWithSpan(fontElement: HTMLElement, fontSizeValue: string): void {
  const span = document.createElement("span");

  for (const attr of Array.from(fontElement.attributes)) {
    if (attr.name === "size" || attr.name === "style") continue;
    span.setAttribute(attr.name, attr.value);
  }

  const existingStyle = fontElement.getAttribute("style");
  if (existingStyle) {
    span.setAttribute("style", existingStyle);
  }

  span.style.fontSize = fontSizeValue;
  while (fontElement.firstChild) {
    span.appendChild(fontElement.firstChild);
  }
  fontElement.parentNode?.replaceChild(span, fontElement);
}

function normalizeAppliedFontSize(
  editorContent: HTMLElement,
  previousNodes: Set<HTMLElement>,
  fontSizeValue: string,
  affectedRange: Range | null,
): boolean {
  const candidates = Array.from(
    editorContent.querySelectorAll("font[size], [style*='font-size']"),
  ) as HTMLElement[];

  const intersectsRange = (element: HTMLElement): boolean => {
    if (!affectedRange || !element.isConnected) return false;
    try {
      if (typeof affectedRange.intersectsNode === "function") {
        return affectedRange.intersectsNode(element);
      }
    } catch {
      // Fall back to manual range comparison below.
    }

    const elementRange = document.createRange();
    elementRange.selectNodeContents(element);
    return (
      affectedRange.compareBoundaryPoints(Range.END_TO_START, elementRange) > 0 &&
      affectedRange.compareBoundaryPoints(Range.START_TO_END, elementRange) < 0
    );
  };

  let changed = false;
  candidates.forEach((candidate) => {
    const isNewNode = !previousNodes.has(candidate);
    const isLegacyFontTag = candidate.tagName === "FONT";
    const hasKeywordFontSize = isKeywordFontSize(candidate.style.fontSize || "");
    const isInAffectedSelection = intersectsRange(candidate);

    if (!isNewNode && !isInAffectedSelection) return;
    if (!isNewNode && !isLegacyFontTag && !hasKeywordFontSize) return;

    changed = true;
    if (candidate.tagName === "FONT") {
      replaceFontTagWithSpan(candidate, fontSizeValue);
      return;
    }

    candidate.style.fontSize = fontSizeValue;
  });

  return changed;
}

function cleanupEmptyInlineStyleSpans(editorContent: HTMLElement): void {
  const emptySpans = editorContent.querySelectorAll("span");
  emptySpans.forEach((span) => {
    if (span.childElementCount > 0) return;
    if ((span.textContent || "").trim().length > 0) return;
    span.remove();
  });
}

function applyInlineFontSizeFallback(
  range: Range,
  selection: Selection,
  fontSizeValue: string,
): boolean {
  if (selectionContainsBlockNodes(range)) {
    return false;
  }

  const span = document.createElement("span");
  span.style.fontSize = fontSizeValue;

  try {
    range.surroundContents(span);
  } catch {
    const contents = range.extractContents();
    span.appendChild(contents);
    range.insertNode(span);
  }

  const newRange = document.createRange();
  newRange.selectNodeContents(span);
  selection.removeAllRanges();
  selection.addRange(newRange);
  return true;
}

/**
 * Helper function to apply relative font size change
 */
function applyFontSizeChange(delta: number) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  // Get current font size from selection with unit
  const { value, unit } = getCurrentFontSizeFromSelection();

  // Calculate delta based on unit
  let adjustedDelta = delta;
  if (unit === "em" || unit === "rem") {
    // For em/rem, use smaller increments (0.125 = 2px at 16px base)
    adjustedDelta = delta * 0.125;
  }

  // Calculate new size with bounds based on unit
  let newSize: number;
  if (unit === "px") {
    newSize =
      delta < 0 ? Math.max(8, value + delta) : Math.min(72, value + delta);
  } else {
    newSize =
      delta < 0
        ? Math.max(0.5, value + adjustedDelta)
        : Math.min(5, value + adjustedDelta);
  }

  applyFontSizeToSelection(newSize, unit);
}

/**
 * Helper function to get current font size from selection with unit
 */
function getCurrentFontSizeFromSelection(): { value: number; unit: string } {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return { value: 14, unit: "px" };
  }

  const range = selection.getRangeAt(0);
  const startContainer = range.startContainer;
  const element =
    startContainer.nodeType === Node.TEXT_NODE
      ? startContainer.parentElement
      : (startContainer as Element);

  if (element) {
    // First check if there's an inline style with font-size (preserves user's unit choice)
    const inlineStyle = (element as HTMLElement).style?.fontSize;
    if (inlineStyle) {
      const parsed = parseFontSizeValue(inlineStyle);
      if (parsed) {
        return parsed;
      }
    }

    // Fall back to computed style (usually returns px)
    const computedStyle = window.getComputedStyle(element);
    const fontSize = computedStyle.fontSize;
    const parsed = parseFontSizeValue(fontSize);
    if (parsed) {
      return parsed;
    }
  }

  return { value: 14, unit: "px" };
}

/**
 * Helper function to apply font size to the current selection
 */
function applyFontSizeToSelection(size: number, unit: string = "px") {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const originalRange = range.cloneRange();
  const editorContent = getEditableContentFromNode(range.commonAncestorContainer);

  // If there's no actual selection (just cursor), return
  if (range.collapsed) {
    return;
  }

  const fontSizeValue = `${size}${unit}`;

  // Check if the entire selection is within a single font-size span
  const commonAncestor = range.commonAncestorContainer;
  const fontSizeSpan = findFontSizeSpanAncestor(commonAncestor);

  if (fontSizeSpan && isSelectionEntirelyWithinSpan(range, fontSizeSpan)) {
    // Update existing span's font-size
    fontSizeSpan.style.fontSize = fontSizeValue;
    dispatchEditorInput(editorContent);

    // Restore selection
    const newRange = document.createRange();
    newRange.selectNodeContents(fontSizeSpan);
    selection.removeAllRanges();
    selection.addRange(newRange);
    return;
  }

  if (!editorContent) return;

  const previousNodes = new Set(
    Array.from(
      editorContent.querySelectorAll("font[size], [style*='font-size']"),
    ) as HTMLElement[],
  );

  editorContent.focus({ preventScroll: true });
  try {
    document.execCommand("styleWithCSS", false, "true");
  } catch {
    // Some browsers ignore this command.
  }

  let applied = document.execCommand("fontSize", false, "7");
  const selectionRangeAfterExec =
    selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : originalRange;
  const normalized = normalizeAppliedFontSize(
    editorContent,
    previousNodes,
    fontSizeValue,
    selectionRangeAfterExec,
  );

  if (applied && normalized) {
    cleanupEmptyInlineStyleSpans(editorContent);
    dispatchEditorInput(editorContent);
    return;
  }

  applied = applyInlineFontSizeFallback(originalRange, selection, fontSizeValue);
  if (applied) {
    cleanupEmptyInlineStyleSpans(editorContent);
    dispatchEditorInput(editorContent);
  }
}

/**
 * Helper function to find if there's a font-size span ancestor
 */
function findFontSizeSpanAncestor(node: Node): HTMLElement | null {
  let current: Node | null = node;

  while (current && current !== document.body) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const element = current as HTMLElement;
      if (element.tagName === "SPAN" && element.style.fontSize) {
        return element;
      }
    }
    current = current.parentNode;
  }

  return null;
}

/**
 * Helper function to check if selection is entirely within a span
 */
function isSelectionEntirelyWithinSpan(
  range: Range,
  span: HTMLElement,
): boolean {
  const startContainer = range.startContainer;
  const endContainer = range.endContainer;

  // Check if both start and end are within the span
  return span.contains(startContainer) && span.contains(endContainer);
}

/**
 * Update font size input field to reflect current selection
 */
function updateFontSizeInput() {
  setTimeout(() => {
    const { value, unit } = getCurrentFontSizeFromSelection();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    let editorContainer: HTMLElement | null = null;
    const range = selection.getRangeAt(0);
    let node: Node | null = range.startContainer;

    // Traverse up to find the editor container.
    while (node) {
      if (
        node instanceof HTMLElement &&
        (node.classList.contains("rte-editor") ||
          node.classList.contains("editora-editor") ||
          node.hasAttribute("data-editora-editor"))
      ) {
        editorContainer = node;
        break;
      }
      node = node.parentNode;
    }

    if (!editorContainer) return;

    const toolbarScope =
      (editorContainer.querySelector(
        ".rte-toolbar-wrapper, .editora-toolbar-container",
      ) as HTMLElement | null) || editorContainer;

    const inputs = Array.from(
      toolbarScope.querySelectorAll(
        'input[data-command="setFontSize"], input.editora-toolbar-input.font-size, input.rte-toolbar-input.font-size, input[title="Font Size"]',
      ),
    ) as HTMLInputElement[];

    if (inputs.length === 0) return;

    // Format value: remove trailing zeros and show unit
    const formattedValue =
      value % 1 === 0
        ? value.toString()
        : value.toFixed(2).replace(/\.?0+$/, "");
    const text = `${formattedValue}${unit}`;

    inputs.forEach((input) => {
      input.value = text;
    });
  }, 10);
}
