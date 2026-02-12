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
      const match = inlineStyle.match(/^(\d+(?:\.\d+)?)(px|em|rem)$/i);
      if (match) {
        return {
          value: parseFloat(match[1]),
          unit: match[2].toLowerCase(),
        };
      }
    }

    // Fall back to computed style (usually returns px)
    const computedStyle = window.getComputedStyle(element);
    const fontSize = computedStyle.fontSize;
    const match = fontSize.match(/^(\d+(?:\.\d+)?)(px|em|rem)$/i);
    if (match) {
      return {
        value: parseFloat(match[1]),
        unit: match[2].toLowerCase(),
      };
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

    // Restore selection
    const newRange = document.createRange();
    newRange.selectNodeContents(fontSizeSpan);
    selection.removeAllRanges();
    selection.addRange(newRange);
  } else {
    // Create new span wrapper
    const span = document.createElement("span");
    span.style.fontSize = fontSizeValue;

    // Wrap the selected content
    try {
      range.surroundContents(span);
    } catch (e) {
      // surroundContents fails if the range spans multiple elements
      const contents = range.extractContents();
      span.appendChild(contents);
      range.insertNode(span);
    }

    // Restore selection to the inserted span
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    selection.removeAllRanges();
    selection.addRange(newRange);
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
  // Small delay to ensure DOM has updated
  setTimeout(() => {
    const { value, unit } = getCurrentFontSizeFromSelection();

    // Try multiple selectors to find the font size input
    let input: HTMLInputElement | null = null;

    // Try finding by placeholder
    input = document.querySelector(
      'input[placeholder="14"]',
    ) as HTMLInputElement;

    // Try finding by class if available
    if (!input) {
      input = document.querySelector(
        '.rte-toolbar-input[type="text"]',
      ) as HTMLInputElement;
    }

    // Try finding any input near the increase/decrease buttons
    if (!input) {
      const decreaseBtn = Array.from(document.querySelectorAll("button")).find(
        (btn) => btn.textContent?.trim() === "−",
      );
      if (decreaseBtn && decreaseBtn.parentElement) {
        input = decreaseBtn.parentElement.querySelector(
          'input[type="text"]',
        ) as HTMLInputElement;
      }
    }

    if (input) {
      // Format value: remove trailing zeros and show unit
      const formattedValue =
        value % 1 === 0
          ? value.toString()
          : value.toFixed(2).replace(/\.?0+$/, "");
      input.value = `${formattedValue}${unit}`;
    }
  }, 10);
}
