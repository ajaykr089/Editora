import type { Plugin } from '@editora/core';

/**
 * MathPlugin - Native implementation for mathematical equations
 * 
 * Features:
 * - Math dialog with LaTeX/MathML templates
 * - Live KaTeX preview
 * - Double-click to edit formulas
 * - Inline/block math support
 */

const MATH_TEMPLATES = {
  latex: [
    { name: 'Fraction', formula: '\\frac{a}{b}', description: 'Simple fraction' },
    { name: 'Square Root', formula: '\\sqrt{x}', description: 'Square root' },
    { name: 'Power', formula: 'x^{2}', description: 'Exponent/power' },
    { name: 'Subscript', formula: 'x_{sub}', description: 'Subscript' },
    { name: 'Integral', formula: '\\int_{a}^{b} f(x) \\, dx', description: 'Definite integral' },
    { name: 'Summation', formula: '\\sum_{i=1}^{n} x_{i}', description: 'Summation' },
    { name: 'Limit', formula: '\\lim_{x \\to 0} f(x)', description: 'Limit' },
    { name: 'Derivative', formula: '\\frac{d}{dx} f(x)', description: 'Derivative' },
    { name: 'Matrix 2x2', formula: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', description: '2x2 matrix' },
    { name: 'System', formula: '\\begin{cases} x + y = 1 \\\\ 2x - y = 0 \\end{cases}', description: 'System of equations' },
  ],
  mathml: [
    { name: 'Fraction', formula: '<mfrac><mi>a</mi><mi>b</mi></mfrac>', description: 'Simple fraction' },
    { name: 'Square Root', formula: '<msqrt><mi>x</mi></msqrt>', description: 'Square root' },
    { name: 'Power', formula: '<msup><mi>x</mi><mn>2</mn></msup>', description: 'Exponent/power' },
    { name: 'Subscript', formula: '<msub><mi>x</mi><mi>sub</mi></msub>', description: 'Subscript' },
    { name: 'Parentheses', formula: '<mfenced open="(" close=")"><mi>a</mi><mo>+</mo><mi>b</mi></mfenced>', description: 'Grouped expression' },
  ],
};

let savedSelection: Range | null = null;
let editingMathElement: HTMLElement | null = null;
let katexLoaded = false;
let activeMathEditorContent: HTMLElement | null = null;
const DARK_THEME_SELECTOR = '[data-theme="dark"], .dark, .editora-theme-dark';

// Global flag to ensure listener is added only once across all instances
declare global {
  interface Window {
    __mathPluginDoubleClickInitialized?: boolean;
  }
}

const loadKaTeX = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if ((window as any).katex) {
      resolve((window as any).katex);
      return;
    }

    if (katexLoaded) {
      const checkInterval = setInterval(() => {
        if ((window as any).katex) {
          clearInterval(checkInterval);
          resolve((window as any).katex);
        }
      }, 100);
      return;
    }

    katexLoaded = true;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
    script.onload = () => resolve((window as any).katex);
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const getEditorContentFromSelection = (): HTMLElement | null => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const node = selection.getRangeAt(0).startContainer;
  const element = node.nodeType === Node.ELEMENT_NODE
    ? (node as HTMLElement)
    : node.parentElement;
  return (element?.closest('.rte-content, .editora-content') as HTMLElement | null) || null;
};

const isDarkThemeContext = (editorContent?: HTMLElement | null): boolean => {
  const source = editorContent || getEditorContentFromSelection();
  if (source?.closest(DARK_THEME_SELECTOR)) return true;

  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const node = selection.getRangeAt(0).startContainer;
    const element = node.nodeType === Node.ELEMENT_NODE
      ? (node as HTMLElement)
      : node.parentElement;
    if (element?.closest(DARK_THEME_SELECTOR)) return true;
  }

  const active = document.activeElement as HTMLElement | null;
  if (active?.closest(DARK_THEME_SELECTOR)) return true;

  return document.body.matches(DARK_THEME_SELECTOR) || document.documentElement.matches(DARK_THEME_SELECTOR);
};

const showMathDialog = async (
  initialData?: { formula: string; format: 'latex' | 'mathml'; inline: boolean },
  preferredEditorContent?: HTMLElement | null,
) => {
  const editorContent =
    preferredEditorContent ||
    (editingMathElement?.closest('.rte-content, .editora-content') as HTMLElement | null) ||
    getEditorContentFromSelection() ||
    activeMathEditorContent;
  activeMathEditorContent = editorContent || null;

  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    savedSelection = editorContent && editorContent.contains(range.commonAncestorContainer)
      ? range.cloneRange()
      : null;
  }

  await loadKaTeX();
  const isDarkTheme = isDarkThemeContext(editorContent);
  const palette = isDarkTheme
    ? {
      overlay: 'rgba(0, 0, 0, 0.62)',
      dialogBg: '#1f2937',
      border: '#3b4657',
      panelBg: '#222d3a',
      fieldBg: '#111827',
      fieldBorder: '#4b5563',
      text: '#e2e8f0',
      muted: '#94a3b8',
      templateBtnBg: '#273244',
      templateBtnHover: '#334155',
      templateBtnText: '#dbe7f7',
      templateSubText: '#9fb0c6',
      previewBg: '#111827',
      previewText: '#cbd5e1',
      cancelBg: '#334155',
      cancelText: '#e2e8f0',
      cancelBorder: '#4b5563',
      insertBg: '#3b82f6',
      insertHover: '#2563eb',
      invalid: '#f87171',
    }
    : {
      overlay: 'rgba(0, 0, 0, 0.5)',
      dialogBg: '#ffffff',
      border: '#e1e5e9',
      panelBg: '#f8f9fa',
      fieldBg: '#ffffff',
      fieldBorder: '#ced4da',
      text: '#1f2937',
      muted: '#6c757d',
      templateBtnBg: '#ffffff',
      templateBtnHover: '#f8f9fa',
      templateBtnText: '#1f2937',
      templateSubText: '#6c757d',
      previewBg: '#f8f9fa',
      previewText: '#6c757d',
      cancelBg: '#ffffff',
      cancelText: '#1f2937',
      cancelBorder: '#ced4da',
      insertBg: '#007bff',
      insertHover: '#0069d9',
      invalid: '#cc0000',
    };

  const overlay = document.createElement('div');
  overlay.style.cssText = `position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: ${palette.overlay}; display: flex; align-items: center; justify-content: center; z-index: 99999;`;

  const dialog = document.createElement('div');
  dialog.style.cssText = `background: ${palette.dialogBg}; border: 1px solid ${palette.border}; border-radius: 8px; width: 90%; max-width: 600px; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2); color: ${palette.text};`;

  let currentFormat: 'latex' | 'mathml' = initialData?.format || 'latex';
  let currentFormula = initialData?.formula || '';
  let currentInline = initialData?.inline !== false;
  let previewRaf: number | null = null;
  let lastPreviewSignature = '';

  dialog.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid ${palette.border}; background: ${palette.panelBg};">
      <h2 style="margin: 0; font-size: 18px; font-weight: 600; color: ${palette.text};">${initialData ? 'Edit' : 'Insert'} Math Formula</h2>
      <button class="close-btn" style="background: none; border: none; font-size: 28px; cursor: pointer; color: ${palette.muted}; padding: 0; width: 30px; height: 30px; line-height: 1;">×</button>
    </div>
    
    <div style="padding: 20px; overflow-y: auto; flex: 1;">
      <div style="margin-bottom: 20px;">
        <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px; color: ${palette.text};">Format:</label>
        <div style="display: flex; gap: 16px;">
          <label style="cursor: pointer; color: ${palette.text};"><input type="radio" name="format" value="latex" ${currentFormat === 'latex' ? 'checked' : ''} style="margin-right: 6px;"> LaTeX</label>
          <label style="cursor: pointer; color: ${palette.text};"><input type="radio" name="format" value="mathml" ${currentFormat === 'mathml' ? 'checked' : ''} style="margin-right: 6px;"> MathML</label>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px; color: ${palette.text};">Quick Templates:</label>
        <div id="templates-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; max-height: 200px; overflow-y: auto;"></div>
      </div>

      <div style="margin-bottom: 20px;">
        <label style="cursor: pointer; color: ${palette.text};"><input type="checkbox" id="inline-cb" ${currentInline ? 'checked' : ''} style="margin-right: 8px;"> Inline math</label>
      </div>

      <div style="margin-bottom: 20px;">
        <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px; color: ${palette.text};">Formula:</label>
        <textarea id="formula-input" rows="4" style="width: 100%; min-height: 112px; padding: 10px 12px; border: 1px solid ${palette.fieldBorder}; border-radius: 6px; font-family: 'Courier New', monospace; font-size: 14px; line-height: 1.45; background: ${palette.fieldBg}; color: ${palette.text}; box-sizing: border-box; overflow-x: hidden; overflow-y: auto; resize: vertical;">${currentFormula}</textarea>
      </div>

      <div style="margin-bottom: 20px;">
        <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px; color: ${palette.text};">Preview:</label>
        <div id="preview-area" style="min-height: 60px; padding: 15px; border: 1px solid ${palette.fieldBorder}; border-radius: 4px; background: ${palette.previewBg}; display: flex; align-items: center; justify-content: center; color: ${palette.previewText};"></div>
      </div>
    </div>

    <div style="display: flex; justify-content: flex-end; gap: 10px; padding: 16px 20px; border-top: 1px solid ${palette.border}; background: ${palette.panelBg};">
      <button class="cancel-btn" style="padding: 10px 20px; background: ${palette.cancelBg}; color: ${palette.cancelText}; border: 1px solid ${palette.cancelBorder}; border-radius: 4px; cursor: pointer; font-size: 14px;">Cancel</button>
      <button id="insert-btn" style="padding: 10px 20px; background: ${palette.insertBg}; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;" disabled>${initialData ? 'Update' : 'Insert'}</button>
    </div>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  const formulaInput = dialog.querySelector('#formula-input') as HTMLTextAreaElement;
  const previewArea = dialog.querySelector('#preview-area') as HTMLDivElement;
  const templatesGrid = dialog.querySelector('#templates-grid') as HTMLDivElement;
  const formatRadios = dialog.querySelectorAll('input[name="format"]') as NodeListOf<HTMLInputElement>;
  const inlineCb = dialog.querySelector('#inline-cb') as HTMLInputElement;
  const insertBtn = dialog.querySelector('#insert-btn') as HTMLButtonElement;
  const closeBtn = dialog.querySelector('.close-btn') as HTMLButtonElement;
  const cancelBtn = dialog.querySelector('.cancel-btn') as HTMLButtonElement;

  const encodeFormulaAttr = (formula: string): string => encodeURIComponent(formula);
  const decodeFormulaAttr = (encoded: string): string => {
    try {
      return decodeURIComponent(encoded);
    } catch {
      return encoded;
    }
  };

  const updateTemplates = () => {
    const templates = MATH_TEMPLATES[currentFormat];
    templatesGrid.innerHTML = templates.map(t => `
      <button type="button" data-formula="${encodeFormulaAttr(t.formula)}" title="${t.description}" style="padding: 8px; border: 1px solid ${palette.fieldBorder}; border-radius: 4px; background: ${palette.templateBtnBg}; cursor: pointer; text-align: left; transition: background-color 0.16s ease;">
        <div style="font-weight: 600; font-size: 12px; color: ${palette.templateBtnText};">${t.name}</div>
        <div style="font-size: 10px; color: ${palette.templateSubText}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${t.formula.substring(0, 20)}...</div>
      </button>
    `).join('');
  };

  const updatePreview = () => {
    const formula = formulaInput.value.trim();
    const signature = `${currentFormat}:${formula}`;
    if (signature === lastPreviewSignature) return;
    lastPreviewSignature = signature;
    
    if (!formula) {
      previewArea.innerHTML = `<span style="color: ${palette.previewText};">Enter a formula to see preview</span>`;
      insertBtn.disabled = true;
      return;
    }

    insertBtn.disabled = false;

    try {
      if (currentFormat === 'latex') {
        const katex = (window as any).katex;
        previewArea.innerHTML = katex.renderToString(formula, { displayMode: false, throwOnError: false });
      } else {
        // For MathML, check if it starts with <math>, if not, wrap it
        if (formula.trim().startsWith('<math')) {
          previewArea.innerHTML = formula;
        } else {
          // Wrap in <math> tag and render
          previewArea.innerHTML = `<math xmlns="http://www.w3.org/1998/Math/MathML" display="inline">${formula}</math>`;
        }
      }
    } catch {
      previewArea.innerHTML = `<span style="color: ${palette.invalid};">Invalid formula</span>`;
    }
  };

  const schedulePreview = () => {
    if (previewRaf !== null) {
      cancelAnimationFrame(previewRaf);
    }
    previewRaf = requestAnimationFrame(() => {
      previewRaf = null;
      updatePreview();
    });
  };

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key !== 'Escape') return;
    e.preventDefault();
    e.stopPropagation();
    closeDialog();
  };

  const closeDialog = () => {
    document.removeEventListener('keydown', handleEscape, true);
    if (previewRaf !== null) {
      cancelAnimationFrame(previewRaf);
      previewRaf = null;
    }
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  };
  closeBtn.onmouseover = () => {
    closeBtn.style.color = '#f8fafc';
    closeBtn.style.background = isDarkTheme ? '#334155' : '#e5e7eb';
    closeBtn.style.borderRadius = '4px';
  };
  closeBtn.onmouseout = () => {
    closeBtn.style.color = palette.muted;
    closeBtn.style.background = 'none';
  };
  cancelBtn.onmouseover = () => {
    cancelBtn.style.background = isDarkTheme ? '#475569' : '#f3f4f6';
  };
  cancelBtn.onmouseout = () => {
    cancelBtn.style.background = palette.cancelBg;
  };
  insertBtn.onmouseover = () => {
    if (!insertBtn.disabled) insertBtn.style.background = palette.insertHover;
  };
  insertBtn.onmouseout = () => {
    insertBtn.style.background = palette.insertBg;
  };

  templatesGrid.addEventListener('mouseover', (event) => {
    const target = event.target as HTMLElement;
    const button = target.closest('button[data-formula]') as HTMLButtonElement | null;
    if (!button) return;
    button.style.background = palette.templateBtnHover;
  });

  templatesGrid.addEventListener('mouseout', (event) => {
    const target = event.target as HTMLElement;
    const button = target.closest('button[data-formula]') as HTMLButtonElement | null;
    if (!button) return;
    button.style.background = palette.templateBtnBg;
  });

  templatesGrid.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const button = target.closest('button[data-formula]') as HTMLButtonElement | null;
    if (!button) return;
    formulaInput.value = decodeFormulaAttr(button.getAttribute('data-formula') || '');
    currentFormula = formulaInput.value;
    schedulePreview();
  });

  const insertMath = () => {
    const formula = formulaInput.value.trim();
    if (!formula) return;

    const mathData = { formula, format: currentFormat, inline: inlineCb.checked };
    const mathEl = mathData.inline ? document.createElement('span') : document.createElement('div');
    
    mathEl.className = mathData.inline ? 'math-formula' : 'math-block';
    mathEl.setAttribute('data-math-formula', formula);
    mathEl.setAttribute('data-math-format', currentFormat);
    mathEl.contentEditable = 'false';
    mathEl.style.cssText = mathData.inline 
      ? 'background: #f0f8ff; border: 1px solid #b8daff; border-radius: 4px; padding: 2px 6px; margin: 0 2px; color: #004085; display: inline-block; cursor: pointer;'
      : 'background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; padding: 12px; margin: 8px 0; text-align: center; display: block; cursor: pointer;';
    
    // Render with KaTeX for LaTeX formulas
    if (currentFormat === 'latex') {
      const katex = (window as any).katex;
      try {
        mathEl.innerHTML = katex.renderToString(formula, { 
          displayMode: !mathData.inline, 
          throwOnError: false 
        });
      } catch {
        mathEl.textContent = mathData.inline ? `$${formula}$` : `$$${formula}$$`;
      }
    } else {
      // For MathML, wrap in <math> tag if not already wrapped
      if (formula.trim().startsWith('<math')) {
        mathEl.innerHTML = formula;
      } else {
        // Create proper MathML with namespace
        const mathContent = `<math xmlns="http://www.w3.org/1998/Math/MathML" display="${mathData.inline ? 'inline' : 'block'}">${formula}</math>`;
        mathEl.innerHTML = mathContent;
      }
    }

    if (editingMathElement) {
      editingMathElement.replaceWith(mathEl);
    } else if (savedSelection) {
      savedSelection.deleteContents();
      savedSelection.insertNode(mathEl);
    } else if (activeMathEditorContent && activeMathEditorContent.isConnected) {
      const fallbackRange = document.createRange();
      fallbackRange.selectNodeContents(activeMathEditorContent);
      fallbackRange.collapse(false);
      fallbackRange.insertNode(mathEl);
    }

    const targetEditor = (mathEl.closest('.rte-content, .editora-content') as HTMLElement | null) || activeMathEditorContent;
    targetEditor?.dispatchEvent(new Event('input', { bubbles: true }));

    closeDialog();
  };

  closeBtn.addEventListener('click', closeDialog);
  cancelBtn.addEventListener('click', closeDialog);
  insertBtn.addEventListener('click', insertMath);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDialog(); });
  document.addEventListener('keydown', handleEscape, true);

  formatRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentFormat = (e.target as HTMLInputElement).value as 'latex' | 'mathml';
      lastPreviewSignature = '';
      updateTemplates();
      schedulePreview();
    });
  });

  formulaInput.addEventListener('input', () => {
    currentFormula = formulaInput.value;
    schedulePreview();
  });

  formulaInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      insertMath();
    }
  });

  updateTemplates();
  schedulePreview();
  formulaInput.focus();
};

// Initialize double-click editing (only once globally)
if (typeof window !== 'undefined' && !window.__mathPluginDoubleClickInitialized) {
  window.__mathPluginDoubleClickInitialized = true;
  
  const handleMathDoubleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const mathEl = target.closest('.math-formula, .math-block') as HTMLElement;
    
    if (mathEl) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      editingMathElement = mathEl;
      const formula = mathEl.getAttribute('data-math-formula') || '';
      const format = (mathEl.getAttribute('data-math-format') || 'latex') as 'latex' | 'mathml';
      const inline = mathEl.classList.contains('math-formula');
      showMathDialog({ formula, format, inline });
    }
  };

  const initDoubleClick = () => {
    document.addEventListener('dblclick', handleMathDoubleClick, { capture: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDoubleClick);
  } else {
    setTimeout(initDoubleClick, 100);
  }
}

export const MathPlugin = (): Plugin => ({
  name: "math",

  toolbar: [
    {
      label: "Insert Math",
      command: "insertMath",
      icon: '<svg width="24" height="24" focusable="false"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 4.8c.1-.5.5-.8 1-.8h10a1 1 0 1 1 0 2h-9.2L8.3 19.2a1 1 0 0 1-1.7.4l-3.4-4.2a1 1 0 0 1 1.6-1.2l2 2.5L9 4.8Zm9.7 5.5c.4.4.4 1 0 1.4L17 13.5l1.8 1.8a1 1 0 0 1-1.4 1.4L15.5 15l-1.8 1.8a1 1 0 0 1-1.4-1.4l1.8-1.8-1.8-1.8a1 1 0 0 1 1.4-1.4l1.8 1.8 1.8-1.8a1 1 0 0 1 1.4 0Z"></path></svg>',
    },
  ],

  commands: {
    insertMath: (_args: unknown, context: any) => {
      const editorContent =
        context?.contentElement instanceof HTMLElement
          ? context.contentElement
          : null;
      showMathDialog(undefined, editorContent);
      return true;
    },
  },

  keymap: {
    "Mod-Shift-m": "insertMath",
  },
});
