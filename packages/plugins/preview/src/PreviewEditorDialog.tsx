import React, { useState, useEffect, useRef } from 'react';
import './PreviewEditorDialog.css';

interface PreviewEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialHtml: string;
}

export const PreviewEditorDialog: React.FC<PreviewEditorDialogProps> = ({
  isOpen,
  onClose,
  initialHtml,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const originalHtmlRef = useRef(initialHtml);


  // Update editor content when initialHtml changes
  useEffect(() => {
    if (isOpen) {
      originalHtmlRef.current = initialHtml;
      console.log("Setting editor content to initialHtml:", initialHtml);
      if (editorRef.current) {
        editorRef.current.innerHTML = initialHtml;
      }
    }
  }, [initialHtml, isOpen]);


  if (!isOpen) return null;

  return (
    <div
      className={`rte-preview-editor-overlay`}
    >
      <div
        className="rte-preview-editor-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-editor-title"
      >
        <div className="rte-preview-editor-header">
          <h2 id="preview-editor-title">Preview Editor</h2>
          <div className="rte-preview-editor-header-actions">
            <button
              onClick={onClose}
              className="rte-preview-editor-close-btn"
              aria-label="Close preview editor"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="rte-preview-editor-body">

          <div className="rte-preview-editor-content">
            <div
              ref={editorRef}
              className="rte-preview-editor-light-editor"
              style={{ height: "400px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
