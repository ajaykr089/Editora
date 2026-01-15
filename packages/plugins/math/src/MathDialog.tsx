import React, { useState, useEffect, useCallback } from 'react';
import { MathData } from './MathPlugin';
import katex from 'katex';
import { MathMLToLaTeX } from 'mathml-to-latex';
import 'katex/dist/katex.min.css';

interface MathDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (mathData: MathData) => void;
  initialData?: MathData | null;
}

export const MathDialog: React.FC<MathDialogProps> = ({
  isOpen,
  onClose,
  onInsert,
  initialData
}) => {
  const [format, setFormat] = useState<'latex' | 'mathml'>('latex');
  const [formula, setFormula] = useState('');
  const [inline, setInline] = useState(true);
  const [previewHtml, setPreviewHtml] = useState('');

  // Initialize with existing data if editing
  useEffect(() => {
    if (initialData) {
      setFormat(initialData.format);
      setFormula(initialData.formula);
      setInline(initialData.inline);
    } else {
      setFormat('latex');
      setFormula('');
      setInline(true);
    }
  }, [initialData, isOpen]);

  // Generate preview when formula or format changes
  useEffect(() => {
    if (formula.trim()) {
      generatePreview(formula, format);
    } else {
      setPreviewHtml('');
    }
  }, [formula, format]);

  const generatePreview = useCallback(async (formulaText: string, formatType: 'latex' | 'mathml') => {
    try {
      if (formatType === 'latex') {
        // Use KaTeX to render LaTeX formulas
        const renderedHtml = katex.renderToString(formulaText, {
          displayMode: false, // inline mode for preview
          throwOnError: false,
          errorColor: '#cc0000'
        });
        setPreviewHtml(`<span class="math-preview">${renderedHtml}</span>`);
      } else {
        // For MathML, render it properly if it's valid MathML
        try {
          // Check if it looks like valid MathML (starts with <math>)
          if (formulaText.trim().startsWith('<math')) {
            // Render as actual MathML
            setPreviewHtml(`<span class="math-preview mathml-preview">${formulaText}</span>`);
          } else {
            // Show as formatted XML for debugging
            setPreviewHtml(`<span class="math-preview mathml-preview mathml-xml">${formulaText.replace(/</g, '<').replace(/>/g, '>')}</span>`);
          }
        } catch (error) {
          // Fallback to formatted XML
          setPreviewHtml(`<span class="math-preview mathml-preview mathml-xml">${formulaText.replace(/</g, '<').replace(/>/g, '>')}</span>`);
        }
      }
    } catch (error) {
      console.error('Math preview error:', error);
      setPreviewHtml('<span class="math-error">Preview error - invalid formula</span>');
    }
  }, []);

  const handleInsert = () => {
    if (!formula.trim()) return;

    const mathData: MathData = {
      formula: formula.trim(),
      format,
      inline
    };

    onInsert(mathData);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleInsert();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="math-dialog-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999
      }}
    >
      <div
        className="math-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          zIndex: 100000
        }}
      >
        <div className="math-dialog-header">
          <h2>{initialData ? 'Edit Math Formula' : 'Insert Math Formula'}</h2>
          <button
            className="math-dialog-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        <div className="math-dialog-body">
          {/* Format Selection */}
          <div className="math-format-section">
            <label className="math-format-label">Format:</label>
            <div className="math-format-options">
              <label className="math-format-option">
                <input
                  type="radio"
                  value="latex"
                  checked={format === 'latex'}
                  onChange={(e) => setFormat(e.target.value as 'latex')}
                />
                LaTeX
              </label>
              <label className="math-format-option">
                <input
                  type="radio"
                  value="mathml"
                  checked={format === 'mathml'}
                  onChange={(e) => setFormat(e.target.value as 'mathml')}
                />
                MathML
              </label>
            </div>
          </div>

          {/* Inline/Block Toggle */}
          <div className="math-inline-section">
            <label className="math-inline-label">
              <input
                type="checkbox"
                checked={inline}
                onChange={(e) => setInline(e.target.checked)}
              />
              Inline math (uncheck for block/display math)
            </label>
          </div>

          {/* Formula Input */}
          <div className="math-formula-section">
            <label className="math-formula-label">
              {format === 'latex' ? 'LaTeX Formula:' : 'MathML Formula:'}
            </label>
            <textarea
              className="math-formula-textarea"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                format === 'latex'
                  ? 'Enter LaTeX formula (e.g., \\frac{a}{b} + \\sqrt{c})'
                  : 'Enter MathML formula'
              }
              rows={6}
              autoFocus
            />
          </div>

          {/* Preview Section */}
          <div className="math-preview-section">
            <label className="math-preview-label">Preview:</label>
            <div
              className="math-preview-area"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
            {!formula.trim() && (
              <div className="math-preview-placeholder">
                Enter a formula above to see preview
              </div>
            )}
          </div>

          {/* Help Text */}
          <div className="math-help-section">
            <details className="math-help-details">
              <summary>Help & Examples</summary>
              <div className="math-help-content">
                {format === 'latex' ? (
                  <div>
                    <h4>LaTeX Examples:</h4>
                    <ul>
                      <li><code>\frac&#123;a&#125;&#123;b&#125;</code> - fraction</li>
                      <li><code>\sqrt&#123;x&#125;</code> - square root</li>
                      <li><code>x^2</code> - superscript</li>
                      <li><code>x_&#123;sub&#125;</code> - subscript</li>
                      <li><code>\int</code> - integral</li>
                      <li><code>\sum</code> - summation</li>
                    </ul>
                  </div>
                ) : (
                  <div>
                    <h4>MathML Examples:</h4>
                    <p>MathML is XML-based mathematical markup language.</p>
                    <p>Example: Fraction can be represented as &lt;mfrac&gt;&lt;mi&gt;a&lt;/mi&gt;&lt;mi&gt;b&lt;/mi&gt;&lt;/mfrac&gt;</p>
                  </div>
                )}
                <p><strong>Keyboard shortcut:</strong> Ctrl+Enter to insert</p>
              </div>
            </details>
          </div>
        </div>

        <div className="math-dialog-footer">
          <button
            className="math-dialog-button math-dialog-cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="math-dialog-button math-dialog-insert"
            onClick={handleInsert}
            disabled={!formula.trim()}
          >
            {initialData ? 'Update' : 'Insert'} Formula
          </button>
        </div>
      </div>
    </div>
  );
};
