import React, { useRef, useEffect } from 'react';
import { Editor } from '@rte-editor/core';

interface EditorContentProps {
  editor: Editor;
}

export const EditorContent: React.FC<EditorContentProps> = ({ editor }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const handleInput = () => {
      // Let browser handle everything natively
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData?.getData('text/plain');
      if (text) {
        document.execCommand('insertText', false, text);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
        target.style.resize = 'both';
        target.style.overflow = 'auto';
        target.style.display = 'inline-block';
      }
    };

    const el = contentRef.current;
    el.addEventListener('input', handleInput);
    el.addEventListener('paste', handlePaste);
    el.addEventListener('click', handleClick);

    // Set focus to editor
    el.focus();

    return () => {
      el.removeEventListener('input', handleInput);
      el.removeEventListener('paste', handlePaste);
      el.removeEventListener('click', handleClick);
    };
  }, [editor]);

  return (
    <div
      ref={contentRef}
      contentEditable
      suppressContentEditableWarning
      className="rte-content"
      style={{
        minHeight: '200px',
        padding: '16px',
        outline: 'none',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px', // Default font size
        lineHeight: '1.5'
      }}
    >
      <p><br /></p>
    </div>
  );
};
