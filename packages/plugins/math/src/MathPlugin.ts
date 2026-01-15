import { Plugin } from '@rte-editor/core';
import katex from 'katex';
import { MathMLToLaTeX } from 'mathml-to-latex';

/**
 * Math Plugin for Rich Text Editor
 *
 * Allows users to insert and edit mathematical formulas
 * using LaTeX or MathML syntax with live preview
 */
export const MathPlugin = (): Plugin => ({
  name: 'math',
  toolbar: [
    {
      label: 'Insert Math',
      command: 'insertMath',
      icon: '∑'
    }
  ]
});

/**
 * Math Commands
 * Handles math formula insertion and editing
 */

// Store selection when math command is triggered
let storedMathSelection: Range | null = null;

// Insert math command - opens dialog
export const insertMathCommand = () => {
  // Store current selection before dialog opens
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    storedMathSelection = selection.getRangeAt(0).cloneRange();
  }
  // This will be handled by the MathProvider which manages the dialog state
  // The command triggers the dialog opening
};

// Update math command - for editing existing formulas
export const updateMathCommand = (mathData: MathData, existingSpan?: HTMLElement) => {
  if (existingSpan) {
    // Editing existing math - update the span in place
    updateExistingMath(existingSpan, mathData);
  } else {
    // New math insertion
    applyMathToSelection(mathData);
  }
  // Clear stored selection after use
  storedMathSelection = null;
};

export interface MathData {
  formula: string;
  format: 'latex' | 'mathml';
  inline: boolean; // true for inline math, false for block math
}

/**
 * Helper function to apply math formula to stored selection
 */
function applyMathToSelection(mathData: MathData) {
  // Use stored selection from before dialog opened
  const range = storedMathSelection;
  if (!range) {
    return;
  }

  const selection = window.getSelection();
  if (!selection) {
    return;
  }

  // Restore the stored selection
  selection.removeAllRanges();
  selection.addRange(range);

  // For collapsed selections (just cursor), we'll still insert the math
  // For non-collapsed selections, we'll wrap the selected content

  // Create a math span with data attributes
  const mathSpan = document.createElement('span');
  mathSpan.className = 'math-formula';
  mathSpan.setAttribute('data-math-formula', mathData.formula);
  mathSpan.setAttribute('data-math-format', mathData.format);
  mathSpan.setAttribute('data-math-inline', mathData.inline.toString());
  mathSpan.setAttribute('contenteditable', 'false'); // Make it non-editable

  // Render the math formula
  try {
    let latexFormula = mathData.formula;

    // Convert MathML to LaTeX if needed
    if (mathData.format === 'mathml') {
      console.log('MathPlugin: Converting MathML to LaTeX:', mathData.formula);
      try {
        latexFormula = MathMLToLaTeX.convert(mathData.formula);
        console.log('MathPlugin: MathML converted to LaTeX:', latexFormula);

        // If conversion returns empty, try manual mapping
        if (!latexFormula || latexFormula.trim() === '') {
          console.log('MathPlugin: Conversion returned empty, trying manual mapping');
          latexFormula = convertMathMLToLatexManual(mathData.formula);
          console.log('MathPlugin: Manual conversion result:', latexFormula);
        }
      } catch (conversionError) {
        console.error('MathPlugin: MathML to LaTeX conversion failed:', conversionError);
        // Fallback: try manual mapping
        latexFormula = convertMathMLToLatexManual(mathData.formula);
        console.log('MathPlugin: Using manual conversion fallback:', latexFormula);
      }
    }

    // Use KaTeX for LaTeX rendering (both original LaTeX and converted MathML)
    const renderedHtml = katex.renderToString(latexFormula, {
      displayMode: false, // inline mode
      throwOnError: false,
      errorColor: '#cc0000'
    }).replace('aria-hidden="true"', ''); // Remove aria-hidden to ensure visibility

    // Instead of innerHTML, create a temporary element and append its children
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = renderedHtml;

    // Append the KaTeX elements to our math span
    while (tempDiv.firstChild) {
      mathSpan.appendChild(tempDiv.firstChild);
    }
  } catch (error) {
    console.error('MathPlugin: Rendering failed:', error);
    // Fallback to placeholder text
    const fallbackText = `[${mathData.format.toUpperCase()}: ${mathData.formula.substring(0, 20)}${mathData.formula.length > 20 ? '...' : ''}]`;
    mathSpan.textContent = fallbackText;
  }

  // For inline math, use a span wrapper
  // For block math, replace the entire paragraph
  if (mathData.inline) {
    // Use insertHTML command for safe insertion of complex HTML
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // Insert the math span at the cursor position
      range.insertNode(mathSpan);

      // Move cursor after the inserted math
      range.setStartAfter(mathSpan);
      range.setEndAfter(mathSpan);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  } else {
    // For block math, replace the entire block element
    const blockElement = findBlockAncestor(range.commonAncestorContainer);
    if (blockElement) {
      // Create a block math div
      const mathBlock = document.createElement('div');
      mathBlock.className = 'math-block';
      mathBlock.setAttribute('data-math-formula', mathData.formula);
      mathBlock.setAttribute('data-math-format', mathData.format);
      mathBlock.setAttribute('data-math-inline', 'false');

      // Render the block math formula using KaTeX
      try {
        const renderedHtml = katex.renderToString(mathData.formula, {
          displayMode: true, // block/display mode
          throwOnError: false,
          errorColor: '#cc0000'
        });
        mathBlock.innerHTML = renderedHtml;
      } catch (error) {
        console.error('MathPlugin: KaTeX block rendering failed:', error);
        // Fallback to placeholder text if KaTeX fails
        mathBlock.textContent = `[Math Block: ${mathData.formula.substring(0, 30)}${mathData.formula.length > 30 ? '...' : ''}]`;
      }

      blockElement.parentNode?.replaceChild(mathBlock, blockElement);
    }
  }

  // Restore selection to after the inserted math
  try {
    const newRange = document.createRange();
    newRange.setStartAfter(mathSpan);
    newRange.setEndAfter(mathSpan);
    selection.removeAllRanges();
    selection.addRange(newRange);
  } catch (error) {
    console.error('MathPlugin: Error restoring selection:', error);
  }
}

/**
 * Helper function to update existing math span in place
 */
function updateExistingMath(existingSpan: HTMLElement, mathData: MathData) {
  // Clear existing content
  existingSpan.innerHTML = '';

  // Update data attributes
  existingSpan.setAttribute('data-math-formula', mathData.formula);
  existingSpan.setAttribute('data-math-format', mathData.format);
  existingSpan.setAttribute('data-math-inline', mathData.inline.toString());

  // Render the new math formula
  try {
    let latexFormula = mathData.formula;

    // Convert MathML to LaTeX if needed
    if (mathData.format === 'mathml') {
      try {
        latexFormula = MathMLToLaTeX.convert(mathData.formula);
      } catch (conversionError) {
        console.warn('MathPlugin: MathML to LaTeX conversion failed, using original:', conversionError);
        // Fallback: try to extract text content from MathML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = mathData.formula;
        latexFormula = tempDiv.textContent || mathData.formula;
      }
    }

    // Use KaTeX for LaTeX rendering (both original LaTeX and converted MathML)
    const renderedHtml = katex.renderToString(latexFormula, {
      displayMode: false, // inline mode
      throwOnError: false,
      errorColor: '#cc0000'
    }).replace('aria-hidden="true"', ''); // Remove aria-hidden to ensure visibility

    // Instead of innerHTML, create a temporary element and append its children
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = renderedHtml;

    // Append the KaTeX elements to the existing span
    while (tempDiv.firstChild) {
      existingSpan.appendChild(tempDiv.firstChild);
    }
  } catch (error) {
    console.error('MathPlugin: Rendering failed:', error);
    // Fallback to placeholder text
    const fallbackText = `[${mathData.format.toUpperCase()}: ${mathData.formula.substring(0, 20)}${mathData.formula.length > 20 ? '...' : ''}]`;
    existingSpan.textContent = fallbackText;
  }
}

/**
 * Manual MathML to LaTeX conversion for common elements
 */
function convertMathMLToLatexManual(mathml: string): string {
  try {
    console.log('Manual conversion input:', mathml);

    // Handle complex MathML expressions by parsing the structure
    // First, try to parse as XML to handle nested structures
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(`<root>${mathml}</root>`, 'text/xml');

      // If parsing succeeds, convert the top-level elements
      const rootChildren = Array.from(doc.documentElement.children);
      const convertedParts: string[] = [];

      for (const child of rootChildren) {
        if (child.nodeType === Node.ELEMENT_NODE) {
          const converted = convertMathMLElement(child as Element);
          if (converted) {
            convertedParts.push(converted);
          }
        } else if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
          // Handle text content (operators, etc.)
          convertedParts.push(child.textContent.trim());
        }
      }

      const result = convertedParts.join(' ');
      console.log('XML parsing conversion result:', result);
      return result;

    } catch (xmlError) {
      console.warn('XML parsing failed, falling back to regex approach:', xmlError);
    }

    // Fallback: Simple regex-based approach for basic cases
    const parts = mathml.trim().split(/\s+/);
    console.log('Fallback parsed parts:', parts);

    const convertedParts: string[] = [];

    for (const part of parts) {
      if (part.startsWith('<') && part.includes('</')) {
        // This looks like complete MathML, try to convert it
        const converted = convertSingleMathML(part);
        if (converted) {
          convertedParts.push(converted);
        } else {
          convertedParts.push(extractTextContent(part));
        }
      } else {
        // This is plain text (like operators +, -, etc.)
        convertedParts.push(part);
      }
    }

    const result = convertedParts.join(' ');
    console.log('Manual conversion result:', result);
    return result;

  } catch (error) {
    console.error('Manual MathML conversion failed:', error);
    // Extract text content as final fallback
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = mathml;
    return tempDiv.textContent || mathml;
  }
}

/**
 * Convert a MathML DOM element to LaTeX
 */
function convertMathMLElement(element: Element): string {
  const tagName = element.tagName.toLowerCase();

  switch (tagName) {
    case 'msqrt':
      const sqrtContent = Array.from(element.children).map(convertMathMLElement).join('');
      return `\\sqrt{${sqrtContent}}`;

    case 'msup':
      const supChildren = Array.from(element.children);
      if (supChildren.length >= 2) {
        const base = convertMathMLElement(supChildren[0]);
        const exponent = convertMathMLElement(supChildren[1]);
        return `${base}^{${exponent}}`;
      }
      break;

    case 'msub':
      const subChildren = Array.from(element.children);
      if (subChildren.length >= 2) {
        const base = convertMathMLElement(subChildren[0]);
        const subscript = convertMathMLElement(subChildren[1]);
        return `${base}_{${subscript}}`;
      }
      break;

    case 'mfrac':
      const fracChildren = Array.from(element.children);
      if (fracChildren.length >= 2) {
        const numerator = convertMathMLElement(fracChildren[0]);
        const denominator = convertMathMLElement(fracChildren[1]);
        return `\\frac{${numerator}}{${denominator}}`;
      }
      break;

    case 'mfenced':
      const fencedChildren = Array.from(element.children);
      const open = element.getAttribute('open') || '(';
      const close = element.getAttribute('close') || ')';
      const content = fencedChildren.map(convertMathMLElement).join('');
      return `${open}${content}${close}`;

    case 'mrow':
      return Array.from(element.children).map(convertMathMLElement).join('');

    case 'mi': // identifier
    case 'mn': // number
    case 'mo': // operator
      return element.textContent || '';

    default:
      // For unknown elements, try to extract text content
      return element.textContent || '';
  }

  // Fallback for unhandled elements
  return element.textContent || '';
}

/**
 * Convert a single MathML expression
 */
function convertSingleMathML(mathml: string): string {
  try {
    // Simple regex-based conversion for common patterns
    let result = mathml;

    // Handle fractions: <mfrac><mi>a</mi><mi>b</mi></mfrac> -> \frac{a}{b}
    result = result.replace(/<mfrac[^>]*>(.*?)<\/mfrac>/gi, (match, content) => {
      // Extract numerator and denominator
      const numMatch = content.match(/<m[i|n][^>]*>(.*?)<\/m[i|n]>/i);
      const denomMatch = content.match(/<m[i|n][^>]*>(.*?)<\/m[i|n]>(.*)/i);

      if (numMatch && denomMatch) {
        const numerator = numMatch[1];
        // Get the second match which should be the denominator
        const remaining = content.replace(numMatch[0], '');
        const denomMatch2 = remaining.match(/<m[i|n][^>]*>(.*?)<\/m[i|n]>/i);
        if (denomMatch2) {
          const denominator = denomMatch2[1];
          return `\\frac{${numerator}}{${denominator}}`;
        }
      }
      return match;
    });

    // Handle square roots: <msqrt><mi>x</mi></msqrt> -> \sqrt{x}
    result = result.replace(/<msqrt[^>]*>(.*?)<\/msqrt>/gi, (match, content) => {
      // Extract the content inside msqrt
      const innerMatch = content.match(/<m[i|n][^>]*>(.*?)<\/m[i|n]>/i);
      if (innerMatch) {
        return `\\sqrt{${innerMatch[1]}}`;
      }
      return match;
    });

    // Handle superscripts: <msup><mi>x</mi><mn>2</mn></msup> -> x^{2}
    result = result.replace(/<msup[^>]*>(.*?)<\/msup>/gi, (match, content) => {
      const baseMatch = content.match(/<m[i|n][^>]*>(.*?)<\/m[i|n]>/i);
      if (baseMatch) {
        const remaining = content.replace(baseMatch[0], '');
        const expMatch = remaining.match(/<m[i|n][^>]*>(.*?)<\/m[i|n]>/i);
        if (expMatch) {
          return `${baseMatch[1]}^{${expMatch[1]}}`;
        }
      }
      return match;
    });

    // If we successfully converted something, clean up remaining tags
    if (result !== mathml) {
      result = result.replace(/<[^>]+>/g, '');
      return result;
    }

    return ''; // Return empty if no conversion happened

  } catch (error) {
    console.error('Single MathML conversion failed:', error);
    return '';
  }
}

/**
 * Extract text content from MathML as fallback
 */
function extractTextContent(mathml: string): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = mathml;
  return tempDiv.textContent || mathml;
}

/**
 * Helper function to find the block ancestor of a node
 */
function findBlockAncestor(node: Node): HTMLElement | null {
  let current: Node | null = node;

  while (current) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const element = current as HTMLElement;
      const tagName = element.tagName.toLowerCase();
      if (['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'].includes(tagName)) {
        return element;
      }
    }
    current = current.parentNode;
  }

  return null;
}
