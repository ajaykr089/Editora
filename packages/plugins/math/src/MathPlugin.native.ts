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

const showMathDialog = async (initialData?: { formula: string; format: 'latex' | 'mathml'; inline: boolean }) => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    savedSelection = selection.getRangeAt(0).cloneRange();
  }

  await loadKaTeX();

  const overlay = document.createElement('div');
  overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 99999;';

  const dialog = document.createElement('div');
  dialog.style.cssText = 'background: white; border-radius: 8px; width: 90%; max-width: 600px; max-height: 90vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);';

  let currentFormat: 'latex' | 'mathml' = initialData?.format || 'latex';
  let currentFormula = initialData?.formula || '';
  let currentInline = initialData?.inline !== false;

  dialog.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #e1e5e9; background: #f8f9fa;">
      <h2 style="margin: 0; font-size: 18px; font-weight: 600;">${initialData ? 'Edit' : 'Insert'} Math Formula</h2>
      <button class="close-btn" style="background: none; border: none; font-size: 28px; cursor: pointer; color: #6c757d; padding: 0; width: 30px; height: 30px; line-height: 1;">×</button>
    </div>
    
    <div style="padding: 20px; overflow-y: auto; flex: 1;">
      <div style="margin-bottom: 20px;">
        <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Format:</label>
        <div style="display: flex; gap: 16px;">
          <label style="cursor: pointer;"><input type="radio" name="format" value="latex" ${currentFormat === 'latex' ? 'checked' : ''} style="margin-right: 6px;"> LaTeX</label>
          <label style="cursor: pointer;"><input type="radio" name="format" value="mathml" ${currentFormat === 'mathml' ? 'checked' : ''} style="margin-right: 6px;"> MathML</label>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Quick Templates:</label>
        <div id="templates-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; max-height: 200px; overflow-y: auto;"></div>
      </div>

      <div style="margin-bottom: 20px;">
        <label style="cursor: pointer;"><input type="checkbox" id="inline-cb" ${currentInline ? 'checked' : ''} style="margin-right: 8px;"> Inline math</label>
      </div>

      <div style="margin-bottom: 20px;">
        <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Formula:</label>
        <textarea id="formula-input" rows="4" style="width: 100%; padding: 10px; border: 1px solid #ced4da; border-radius: 4px; font-family: 'Courier New', monospace; font-size: 14px;">${currentFormula}</textarea>
      </div>

      <div style="margin-bottom: 20px;">
        <label style="display: block; font-weight: 600; margin-bottom: 8px; font-size: 14px;">Preview:</label>
        <div id="preview-area" style="min-height: 60px; padding: 15px; border: 1px solid #dee2e6; border-radius: 4px; background: #f8f9fa; display: flex; align-items: center; justify-content: center; color: #6c757d;"></div>
      </div>
    </div>

    <div style="display: flex; justify-content: flex-end; gap: 10px; padding: 16px 20px; border-top: 1px solid #e1e5e9; background: #f8f9fa;">
      <button class="cancel-btn" style="padding: 10px 20px; background: #fff; border: 1px solid #ced4da; border-radius: 4px; cursor: pointer; font-size: 14px;">Cancel</button>
      <button id="insert-btn" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;" disabled>${initialData ? 'Update' : 'Insert'}</button>
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

  const updateTemplates = () => {
    const templates = MATH_TEMPLATES[currentFormat];
    templatesGrid.innerHTML = templates.map(t => `
      <button type="button" data-formula="${t.formula.replace(/"/g, '&quot;')}" title="${t.description}" style="padding: 8px; border: 1px solid #ced4da; border-radius: 4px; background: #fff; cursor: pointer; text-align: left;">
        <div style="font-weight: 600; font-size: 12px;">${t.name}</div>
        <div style="font-size: 10px; color: #6c757d; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${t.formula.substring(0, 20)}...</div>
      </button>
    `).join('');

    templatesGrid.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        formulaInput.value = btn.getAttribute('data-formula') || '';
        currentFormula = formulaInput.value;
        updatePreview();
      });
    });
  };

  const updatePreview = () => {
    const formula = formulaInput.value.trim();
    
    if (!formula) {
      previewArea.innerHTML = '<span style="color: #6c757d;">Enter a formula to see preview</span>';
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
      previewArea.innerHTML = '<span style="color: #cc0000;">Invalid formula</span>';
    }
  };

  const closeDialog = () => document.body.removeChild(overlay);

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
    }

    closeDialog();
  };

  closeBtn.addEventListener('click', closeDialog);
  cancelBtn.addEventListener('click', closeDialog);
  insertBtn.addEventListener('click', insertMath);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDialog(); });

  formatRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentFormat = (e.target as HTMLInputElement).value as 'latex' | 'mathml';
      updateTemplates();
      updatePreview();
    });
  });

  formulaInput.addEventListener('input', () => {
    currentFormula = formulaInput.value;
    updatePreview();
  });

  formulaInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      insertMath();
    }
  });

  updateTemplates();
  updatePreview();
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
    insertMath: () => {
      showMathDialog();
      return true;
    },
  },

  keymap: {
    "Mod-Shift-m": "insertMath",
  },
});