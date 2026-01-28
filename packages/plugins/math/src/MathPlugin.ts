import { Plugin } from '@editora/core';
import katex from 'katex';
import {
  convertMathMLToLatexManual
} from './libs/mathml-converter';

// MathJax types (simplified)
declare global {
  interface Window {
    MathJax?: any;
  }
}

/**
 * Math Plugin for Rich Text Editor
 *
 * Allows users to insert and edit mathematical formulas
 * using LaTeX or MathML syntax with live preview
 */

// Math Node Model - Source of Truth
export interface MathNode {
  id: string;
  type: 'inline' | 'block';
  format: 'latex' | 'mathml';
  formula: string;
  renderedHtml: string;
  semanticLabel: string;
  created: Date;
  modified: Date;
}

// Math Registry - Central store for all math nodes
class MathRegistry {
  private nodes = new Map<string, MathNode>();
  private observers: ((node: MathNode, action: 'add' | 'update' | 'delete') => void)[] = [];

  add(node: MathNode): void {
    this.nodes.set(node.id, node);
    this.notifyObservers(node, 'add');
  }

  update(id: string, updates: Partial<MathNode>): void {
    const node = this.nodes.get(id);
    if (node) {
      Object.assign(node, updates, { modified: new Date() });
      this.notifyObservers(node, 'update');
    }
  }

  delete(id: string): void {
    const node = this.nodes.get(id);
    if (node) {
      this.nodes.delete(id);
      this.notifyObservers(node, 'delete');
    }
  }

  get(id: string): MathNode | undefined {
    return this.nodes.get(id);
  }

  getAll(): MathNode[] {
    return Array.from(this.nodes.values());
  }

  subscribe(observer: (node: MathNode, action: 'add' | 'update' | 'delete') => void): () => void {
    this.observers.push(observer);
    return () => {
      const index = this.observers.indexOf(observer);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  private notifyObservers(node: MathNode, action: 'add' | 'update' | 'delete'): void {
    this.observers.forEach(observer => observer(node, action));
  }
}

// Selection Manager - Handles cursor and selection behavior
class MathSelectionManager {
  private registry: MathRegistry;

  constructor(registry: MathRegistry) {
    this.registry = registry;
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    document.addEventListener('keydown', this.handleKeydown.bind(this));
    document.addEventListener('click', this.handleClick.bind(this));
  }

  private handleKeydown(event: KeyboardEvent): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    // Check if selection is inside a math element
    const mathElement = this.findMathElement(range.commonAncestorContainer);
    if (mathElement) {
      this.handleSelectionInMath(event, range, mathElement);
    } else {
      this.handleSelectionNearMath(event, range);
    }
  }

  private handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const mathElement = target.closest('.math-formula') as HTMLElement;

    if (mathElement) {
      event.preventDefault();
      event.stopPropagation();

      // Select the entire math span
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(mathElement);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }
  

  private handleSelectionInMath(event: KeyboardEvent, range: Range, mathElement: HTMLElement): void {
    // Prevent normal text editing inside math elements
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      // Move cursor after the math element
      this.placeCursorAfterMath(mathElement);
    }

    // Handle deletion of math elements
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      this.deleteMathElement(mathElement);
    }
  }

  private handleSelectionNearMath(event: KeyboardEvent, range: Range): void {
    // Handle deletion near math elements
    if (event.key === 'Backspace') {
      const previousElement = this.findPreviousElement(range.startContainer, range.startOffset);
      if (previousElement && previousElement.classList.contains('math-formula')) {
        event.preventDefault();
        this.deleteMathElement(previousElement);
      }
    }

    if (event.key === 'Delete') {
      const nextElement = this.findNextElement(range.endContainer, range.endOffset);
      if (nextElement && nextElement.classList.contains('math-formula')) {
        event.preventDefault();
        this.deleteMathElement(nextElement);
      }
    }
  }

  private findMathElement(node: Node): HTMLElement | null {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      if (element.classList.contains('math-formula')) {
        return element;
      }
    }

    let current = node;
    while (current) {
      if (current.nodeType === Node.ELEMENT_NODE) {
        const element = current as HTMLElement;
        if (element.classList.contains('math-formula')) {
          return element;
        }
      }
      current = current.parentNode as Node;
    }

    return null;
  }

  private placeCursorAfterMath(mathElement: HTMLElement): void {
    const selection = window.getSelection()!;
    const range = document.createRange();

    const nextNode = this.findNextTextNode(mathElement);
    if (nextNode) {
      range.setStart(nextNode, 0);
      range.setEnd(nextNode, 0);
    } else {
      // Insert a text node if none exists
      const textNode = document.createTextNode('');
      if (mathElement.parentNode) {
        mathElement.parentNode.insertBefore(textNode, mathElement.nextSibling);
        range.setStart(textNode, 0);
        range.setEnd(textNode, 0);
      }
    }

    selection.removeAllRanges();
    selection.addRange(range);
  }

  private deleteMathElement(mathElement: HTMLElement): void {
    const mathId = mathElement.getAttribute('data-math-id');
    if (mathId) {
      this.registry.delete(mathId);
    }
    mathElement.remove();
  }

  private findPreviousElement(container: Node, offset: number): HTMLElement | null {
    if (container.nodeType === Node.TEXT_NODE) {
      if (offset > 0) return null;
      const parent = container.parentNode as HTMLElement;
      const siblings = Array.from(parent.parentNode?.children || []);
      const index = siblings.indexOf(parent);
      for (let i = index - 1; i >= 0; i--) {
        const sibling = siblings[i] as HTMLElement;
        if (sibling.classList.contains('math-formula')) {
          return sibling;
        }
      }
    }
    return null;
  }

  private findNextElement(container: Node, offset: number): HTMLElement | null {
    if (container.nodeType === Node.TEXT_NODE) {
      const textNode = container as Text;
      if (offset < textNode.length) return null;
      const parent = container.parentNode as HTMLElement;
      const siblings = Array.from(parent.parentNode?.children || []);
      const index = siblings.indexOf(parent);
      for (let i = index + 1; i < siblings.length; i++) {
        const sibling = siblings[i] as HTMLElement;
        if (sibling.classList.contains('math-formula')) {
          return sibling;
        }
      }
    }
    return null;
  }

  private findNextTextNode(element: HTMLElement): Text | null {
    let current: Node | null = element.nextSibling;
    while (current) {
      if (current.nodeType === Node.TEXT_NODE && current.textContent?.trim()) {
        return current as Text;
      }
      if (current.nodeType === Node.ELEMENT_NODE && !(current as HTMLElement).classList.contains('math-formula')) {
        // Look inside non-math elements for text nodes
        const textNode = this.findTextNodeInElement(current as HTMLElement);
        if (textNode) return textNode;
      }
      current = current.nextSibling;
    }
    return null;
  }

  private findTextNodeInElement(element: HTMLElement): Text | null {
    for (const child of element.childNodes) {
      if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
        return child as Text;
      }
      if (child.nodeType === Node.ELEMENT_NODE) {
        const textNode = this.findTextNodeInElement(child as HTMLElement);
        if (textNode) return textNode;
      }
    }
    return null;
  }
}

// Math Renderer - Solution A: KaTeX + Browser MathML (Production Ready)
class MathRenderer {
  private cache = new Map<string, { html: string; semantic: string }>();
  private registry: MathRegistry;

  constructor(registry: MathRegistry) {
    this.registry = registry;
  }

  render(node: MathNode): { html: string; semantic: string } {
    const cacheKey = `${node.format}:${node.formula}:${node.type}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const result = this.doRender(node);
    this.cache.set(cacheKey, result);
    return result;
  }

  private doRender(node: MathNode): { html: string; semantic: string } {
    try {
      // Generate semantic label
      const semanticLabel = this.generateSemanticLabel(node.formula, node.format);

      if (node.format === 'latex') {
        // SOLUTION A: Render LaTeX with KaTeX (fast and reliable)
        try {
          const renderedHtml = katex.renderToString(node.formula, {
            displayMode: node.type === 'block',
            throwOnError: false,
            errorColor: '#cc0000'
          }).replace('aria-hidden="true"', ''); // Remove aria-hidden for accessibility

          console.log(`✅ LaTeX rendered with KaTeX: ${node.formula.substring(0, 30)}...`);
          return { html: renderedHtml, semantic: semanticLabel };
        } catch (katexError) {
          console.error('❌ KaTeX rendering failed:', katexError);
          const fallback = `<span class="math-error">[LaTeX Error: ${node.formula.substring(0, 20)}]</span>`;
          return { html: fallback, semantic: semanticLabel };
        }

      } else if (node.format === 'mathml') {
        // SOLUTION A: Store MathML as-is and render appropriately

        // First, try browser's native MathML support (works in modern browsers)
        try {
          // Check if browser supports MathML
          const testElement = document.createElement('math');
          if (testElement.toString() !== '[object HTMLUnknownElement]') {
            // Browser has MathML support - render natively
            const mathContainer = document.createElement('span');
            mathContainer.className = 'mathml-native';
            mathContainer.innerHTML = node.formula;

            console.log(`✅ MathML rendered natively: ${node.formula.substring(0, 30)}...`);
            return { html: mathContainer.outerHTML, semantic: semanticLabel };
          }
        } catch (nativeError) {
          console.warn('⚠️ Native MathML not supported, using fallback');
        }

        // Fallback: Convert MathML to LaTeX and render with KaTeX
        // This preserves the MathML input but renders it using KaTeX
        try {
          const latexEquivalent = this.convertMathMLToLatex(node.formula);
          const renderedHtml = katex.renderToString(latexEquivalent, {
            displayMode: node.type === 'block',
            throwOnError: false,
            errorColor: '#cc0000'
          }).replace('aria-hidden="true"', '');

          console.log(`✅ MathML converted to LaTeX and rendered: ${node.formula.substring(0, 30)}...`);
          return { html: renderedHtml, semantic: semanticLabel };
        } catch (conversionError) {
          console.error('❌ MathML conversion failed:', conversionError);
        }

        // Final fallback: Show MathML as formatted code
        const codeElement = `<code class="mathml-raw" title="MathML">${this.escapeHtml(node.formula)}</code>`;
        console.log(`⚠️ MathML fallback to raw display: ${node.formula.substring(0, 30)}...`);
        return { html: codeElement, semantic: semanticLabel };
      }

      // Unknown format fallback
      const fallback = `<span class="math-unknown">[${String(node.format).toUpperCase()}: ${node.formula.substring(0, 20)}]</span>`;
      return { html: fallback, semantic: node.formula };

    } catch (error) {
      console.error('❌ Math rendering failed:', error);
      const fallback = `<span class="math-error">[Error: ${node.formula.substring(0, 20)}]</span>`;
      return { html: fallback, semantic: node.formula };
    }
  }

  // Use the library function for MathML conversion
  private convertMathMLToLatex(mathml: string): string {
    return convertMathMLToLatexManual(mathml);
  }

  private generateSemanticLabel(formula: string, format: 'latex' | 'mathml'): string {
    if (format === 'latex') {
      // Basic LaTeX to English conversion for accessibility
      return formula
        .replace(/\\frac{([^}]*)}{([^}]*)}/g, 'fraction $1 over $2')
        .replace(/\\sqrt{([^}]*)}/g, 'square root of $1')
        .replace(/([^_]*)_{([^}]*)}/g, '$1 sub $2')
        .replace(/([^\\^]*)\\^([^}]*)/g, '$1 to the power of $2')
        .replace(/[{}]/g, '')
        .replace(/\\/g, '');
    } else {
      // For MathML, extract meaningful text content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = formula;
      return tempDiv.textContent || formula;
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Undo/Redo Manager - Phase 3 Implementation
class MathUndoManager {
  private operations: MathOperation[] = [];
  private maxOperations = 50; // Limit undo history

  record(operation: MathOperation): void {
    this.operations.push(operation);
    // Limit history size
    if (this.operations.length > this.maxOperations) {
      this.operations.shift();
    }
  }

  canUndo(): boolean {
    return this.operations.length > 0;
  }

  canRedo(): boolean {
    return false; // For now, no redo support
  }

  undo(): void {
    const operation = this.operations.pop();
    if (operation) {
      operation.undo();
    }
  }

  clear(): void {
    this.operations = [];
  }
}

interface MathOperation {
  type: 'insert' | 'update' | 'delete';
  nodeId: string;
  before: MathNode | null;
  after: MathNode | null;
  timestamp: Date;

  undo(): void;
  redo(): void;
}

// Export/Import Manager - Phase 3 Implementation
class MathSerializationManager {
  private registry: MathRegistry;

  constructor(registry: MathRegistry) {
    this.registry = registry;
  }

  // Export math content as JSON
  exportToJSON(): string {
    const nodes = this.registry.getAll();
    const exportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      mathNodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        format: node.format,
        formula: node.formula,
        created: node.created.toISOString(),
        modified: node.modified.toISOString()
      }))
    };
    return JSON.stringify(exportData, null, 2);
  }

  // Import math content from JSON
  importFromJSON(jsonString: string): { success: boolean; imported: number; errors: string[] } {
    const errors: string[] = [];
    let imported = 0;

    try {
      const importData = JSON.parse(jsonString);

      if (!importData.mathNodes || !Array.isArray(importData.mathNodes)) {
        errors.push('Invalid JSON format: missing mathNodes array');
        return { success: false, imported: 0, errors };
      }

      for (const nodeData of importData.mathNodes) {
        try {
          const node: MathNode = {
            id: nodeData.id || generateMathId(),
            type: nodeData.type || 'inline',
            format: nodeData.format || 'latex',
            formula: nodeData.formula || '',
            renderedHtml: '',
            semanticLabel: '',
            created: nodeData.created ? new Date(nodeData.created) : new Date(),
            modified: nodeData.modified ? new Date(nodeData.modified) : new Date()
          };

          // Validate the node
          if (!node.formula.trim()) {
            errors.push(`Skipping empty formula for node ${node.id}`);
            continue;
          }

          // Render the node
          const renderResult = mathRenderer.render(node);
          node.renderedHtml = renderResult.html;
          node.semanticLabel = renderResult.semantic;

          this.registry.add(node);
          imported++;

        } catch (nodeError) {
          errors.push(`Failed to import node ${nodeData.id}: ${nodeError}`);
        }
      }

    } catch (parseError) {
      errors.push(`JSON parsing failed: ${parseError}`);
      return { success: false, imported: 0, errors };
    }

    return {
      success: errors.length === 0,
      imported,
      errors
    };
  }

  // Export as HTML with data attributes
  exportToHTML(): string {
    const nodes = this.registry.getAll();
    let html = '';

    for (const node of nodes) {
      const element = createMathElement(node);
      html += element.outerHTML + '\n';
    }

    return html;
  }

  // Import from HTML with data attributes
  importFromHTML(htmlString: string): { success: boolean; imported: number; errors: string[] } {
    const errors: string[] = [];
    let imported = 0;

    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlString;

      const mathElements = tempDiv.querySelectorAll('.math-formula');
      for (const element of mathElements) {
        try {
          const node: MathNode = {
            id: element.getAttribute('data-math-id') || generateMathId(),
            type: (element.getAttribute('data-math-type') as 'inline' | 'block') || 'inline',
            format: (element.getAttribute('data-math-format') as 'latex' | 'mathml') || 'latex',
            formula: element.getAttribute('data-math-formula') || '',
            renderedHtml: element.innerHTML,
            semanticLabel: element.getAttribute('aria-label') || '',
            created: new Date(),
            modified: new Date()
          };

          // Validate the node
          if (!node.formula.trim()) {
            errors.push(`Skipping empty formula for node ${node.id}`);
            continue;
          }

          this.registry.add(node);
          imported++;

        } catch (nodeError) {
          errors.push(`Failed to import HTML node: ${nodeError}`);
        }
      }

    } catch (htmlError) {
      errors.push(`HTML parsing failed: ${htmlError}`);
      return { success: false, imported: 0, errors };
    }

    return {
      success: errors.length === 0,
      imported,
      errors
    };
  }
}

// Global instances (isolated within plugin)
const mathRegistry = new MathRegistry();
const mathRenderer = new MathRenderer(mathRegistry);
const mathSelectionManager = new MathSelectionManager(mathRegistry);
const mathUndoManager = new MathUndoManager();
const mathSerializationManager = new MathSerializationManager(mathRegistry);

// Utility functions
function generateMathId(): string {
  return `math_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function createMathElement(node: MathNode): HTMLElement {
  const element = document.createElement('span');
  element.className = `math-formula math-${node.type}`;
  element.setAttribute('data-math-id', node.id);
  element.setAttribute('data-math-format', node.format);
  element.setAttribute('data-math-formula', node.formula);
  element.setAttribute('contenteditable', 'false');
  element.setAttribute('role', 'math');
  element.setAttribute('aria-label', node.semanticLabel);

  // Add rendered content
  element.innerHTML = node.renderedHtml;

  return element;
}

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

// Clipboard Support - Phase 1 Implementation
class MathClipboardManager {
  private registry: MathRegistry;

  constructor(registry: MathRegistry) {
    this.registry = registry;
    this.initializeClipboardHandlers();
  }

  private initializeClipboardHandlers(): void {
    document.addEventListener('copy', this.handleCopy.bind(this));
    document.addEventListener('paste', this.handlePaste.bind(this));
  }

  private handleCopy(event: ClipboardEvent): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const mathElement = this.findMathElement(range.commonAncestorContainer);

    if (mathElement) {
      event.preventDefault();

      const mathId = mathElement.getAttribute('data-math-id');
      if (mathId) {
        const node = this.registry.get(mathId);
        if (node) {
          // Create HTML format for internal paste
          const htmlFormat = this.createHtmlClipboardFormat(node);

          // Create plain text fallback
          const textFormat = node.format === 'latex' ? node.formula : node.formula.replace(/<[^>]+>/g, '');

          if (event.clipboardData) {
            event.clipboardData.setData('text/html', htmlFormat);
            event.clipboardData.setData('text/plain', textFormat);
          }
        }
      }
    }
  }

  private handlePaste(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData;
    if (!clipboardData) return;

    const htmlData = clipboardData.getData('text/html');
    const textData = clipboardData.getData('text/plain');

    // Check if it's our math paste format
    if (htmlData && htmlData.includes('data-math-format')) {
      event.preventDefault();

      const mathNode = this.parseHtmlClipboardFormat(htmlData);
      if (mathNode) {
        this.insertMathNodeAtCursor(mathNode);
      }
    }
  }

  private findMathElement(node: Node): HTMLElement | null {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      if (element.classList.contains('math-formula')) {
        return element;
      }
    }

    let current = node;
    while (current) {
      if (current.nodeType === Node.ELEMENT_NODE) {
        const element = current as HTMLElement;
        if (element.classList.contains('math-formula')) {
          return element;
        }
      }
      current = current.parentNode as Node;
    }

    return null;
  }

  private createHtmlClipboardFormat(node: MathNode): string {
    return `<span class="math-paste-data" data-math-format="${node.format}" data-math-formula="${this.escapeHtml(node.formula)}" data-math-type="${node.type}">${this.escapeHtml(node.formula)}</span>`;
  }

  private parseHtmlClipboardFormat(html: string): MathNode | null {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const pasteElement = tempDiv.querySelector('.math-paste-data') as HTMLElement;
    if (!pasteElement) return null;

    const format = pasteElement.getAttribute('data-math-format') as 'latex' | 'mathml';
    const formula = pasteElement.getAttribute('data-math-formula');
    const type = pasteElement.getAttribute('data-math-type') as 'inline' | 'block';

    if (!format || !formula || !type) return null;

    return {
      id: generateMathId(),
      type,
      format,
      formula,
      renderedHtml: '',
      semanticLabel: '',
      created: new Date(),
      modified: new Date()
    };
  }

  private insertMathNodeAtCursor(node: MathNode): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    // Render the node
    const renderResult = mathRenderer.render(node);
    node.renderedHtml = renderResult.html;
    node.semanticLabel = renderResult.semantic;

    // Create DOM element
    const element = createMathElement(node);

    // Insert at cursor
    range.insertNode(element);

    // Register the node
    mathRegistry.add(node);

    // Move cursor after the element
    range.setStartAfter(element);
    range.setEndAfter(element);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize clipboard manager
const mathClipboardManager = new MathClipboardManager(mathRegistry);

/**
 * Math Commands - Updated for new architecture
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

// Utility command for undo support (can be called from editor toolbar)
export const undoMathOperation = () => {
  if (mathUndoManager.canUndo()) {
    mathUndoManager.undo();
  }
};

// Utility command to export all math content
export const exportMathContent = (format: 'json' | 'html' = 'json'): string => {
  if (format === 'json') {
    return mathSerializationManager.exportToJSON();
  } else {
    return mathSerializationManager.exportToHTML();
  }
};

// Utility command to import math content
export const importMathContent = (data: string, format: 'json' | 'html' = 'json') => {
  if (format === 'json') {
    return mathSerializationManager.importFromJSON(data);
  } else {
    return mathSerializationManager.importFromHTML(data);
  }
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

  // Create MathNode and render through MathRenderer for consistency
  const mathNode: MathNode = {
    id: generateMathId(),
    type: mathData.inline ? 'inline' : 'block',
    format: mathData.format,
    formula: mathData.formula,
    renderedHtml: '',
    semanticLabel: '',
    created: new Date(),
    modified: new Date()
  };

  // Render using the centralized MathRenderer
  const renderResult = mathRenderer.render(mathNode);
  mathNode.renderedHtml = renderResult.html;
  mathNode.semanticLabel = renderResult.semantic;

  // Create DOM element
  const mathSpan = createMathElement(mathNode);

  // For collapsed selections (just cursor), we'll still insert the math
  // For non-collapsed selections, we'll wrap the selected content

  let insertedElement: HTMLElement | null = null;

  if (mathData.inline) {
    // Use insertHTML command for safe insertion of complex HTML
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // Insert the math span at the cursor position
      range.insertNode(mathSpan);
      insertedElement = mathSpan;

      // Move cursor after the inserted math
      range.setStartAfter(mathSpan);
      range.setEndAfter(mathSpan);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  } else {
    mathSpan.style.display = 'block';
    const pElement = document.createElement("p");
    pElement.innerHTML = mathSpan.outerHTML;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // Insert the math span at the cursor position
      range.insertNode(pElement);
      insertedElement = pElement;

      // Move cursor after the inserted math
      range.setStartAfter(pElement);
      range.setEndAfter(pElement);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    console.log("MathPlugin: block math inserted.");
  }

  // Register the node in the central registry
  mathRegistry.add(mathNode);

  // Record operation for undo/redo
  const mathOperation: MathOperation = {
    type: 'insert',
    nodeId: mathNode.id,
    before: null,
    after: mathNode,
    timestamp: new Date(),
    undo: () => {
      mathRegistry.delete(mathNode.id);
      if (insertedElement) {
        insertedElement.remove();
      }
    },
    redo: () => {
      mathRegistry.add(mathNode);
      if (insertedElement && insertedElement.parentNode) {
        insertedElement.parentNode.appendChild(insertedElement);
      }
    }
  };
  mathUndoManager.record(mathOperation);

  // Restore selection to after the inserted math (only for inline mode)
  if (insertedElement) {
    try {
      const newRange = document.createRange();
      newRange.setStartAfter(insertedElement);
      newRange.setEndAfter(insertedElement);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    } catch (error) {
      console.error('MathPlugin: Error restoring selection:', error);
    }
  }
}

/**
 * Helper function to update existing math span in place
 */
function updateExistingMath(existingSpan: HTMLElement, mathData: MathData) {
  // Create MathNode from existing span data
  const mathId = existingSpan.getAttribute('data-math-id') || generateMathId();
  
  const mathNode: MathNode = {
    id: mathId,
    type: mathData.inline ? 'inline' : 'block',
    format: mathData.format,
    formula: mathData.formula,
    renderedHtml: '',
    semanticLabel: '',
    created: new Date(),
    modified: new Date()
  };

  // Render using the centralized MathRenderer
  const renderResult = mathRenderer.render(mathNode);
  mathNode.renderedHtml = renderResult.html;
  mathNode.semanticLabel = renderResult.semantic;

  // Clear existing content and update
  existingSpan.innerHTML = mathNode.renderedHtml;
  existingSpan.setAttribute('data-math-formula', mathData.formula);
  existingSpan.setAttribute('data-math-format', mathData.format);
  existingSpan.setAttribute('data-math-inline', mathData.inline.toString());
  existingSpan.setAttribute('aria-label', mathNode.semanticLabel);
  existingSpan.style.display = mathData.inline ? 'inline-block' : 'block';

  // Update in registry
  mathRegistry.update(mathId, mathNode);

  // Record operation for undo/redo
  const mathOperation: MathOperation = {
    type: 'update',
    nodeId: mathId,
    before: mathRegistry.get(mathId) || null,
    after: mathNode,
    timestamp: new Date(),
    undo: () => {
      // Undo would restore previous state
      const prevNode = mathRegistry.get(mathId);
      if (prevNode) {
        existingSpan.innerHTML = prevNode.renderedHtml;
      }
    },
    redo: () => {
      existingSpan.innerHTML = mathNode.renderedHtml;
    }
  };
  mathUndoManager.record(mathOperation);
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

// ============================================
// EXPORT PUBLIC API
// ============================================

// Export main managers for external use and for internal access
export {
  mathRegistry,
  mathRenderer,
  mathSelectionManager,
  mathUndoManager,
  mathSerializationManager,
  mathClipboardManager
};

/**
 * Public API for Math Plugin Management
 * 
 * Usage Examples:
 * 
 * 1. Export all math content:
 *    const json = mathSerializationManager.exportToJSON();
 * 
 * 2. Import math content:
 *    const result = mathSerializationManager.importFromJSON(jsonString);
 * 
 * 3. Get all registered math nodes:
 *    const nodes = mathRegistry.getAll();
 * 
 * 4. Subscribe to math node changes:
 *    const unsubscribe = mathRegistry.subscribe((node, action) => {
 *      console.log(`Math node ${action}:`, node);
 *    });
 * 
 * 5. Undo last operation:
 *    if (mathUndoManager.canUndo()) {
 *      mathUndoManager.undo();
 *    }
 * 
 * 6. Render a math formula:
 *    const mathNode: MathNode = {
 *      id: 'custom-id',
 *      type: 'inline',
 *      format: 'latex',
 *      formula: 'x^2 + y^2 = z^2',
 *      renderedHtml: '',
 *      semanticLabel: '',
 *      created: new Date(),
 *      modified: new Date()
 *    };
 *    const result = mathRenderer.render(mathNode);
 */
