import React, { useRef, useEffect } from 'react';
import { Editor, KeyboardShortcutManager } from '@editora/core';
import { useAutosave } from '../hooks/useAutosave';
import { sanitizePastedHTML, sanitizeInputHTML } from '../utils/sanitizeHTML';

interface EditorContentProps {
  editor: Editor;
  defaultValue?: string;
  value?: string;
  onChange?: (html: string) => void;
  pasteConfig?: {
    clean?: boolean;
    keepFormatting?: boolean;
    convertWord?: boolean;
  };
  contentConfig?: {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
    sanitize?: boolean;
  };
  securityConfig?: {
    sanitizeOnPaste?: boolean;
    sanitizeOnInput?: boolean;
  };
  performanceConfig?: {
    debounceInputMs?: number;
    viewportOnlyScan?: boolean;
  };
  autosaveConfig?: {
    enabled?: boolean;
    intervalMs?: number;
    storageKey?: string;
    provider?: 'localStorage' | 'api';
    apiUrl?: string;
  };
}

export const EditorContent: React.FC<EditorContentProps> = ({ 
  editor, 
  defaultValue,
  value,
  onChange,
  pasteConfig,
  contentConfig,
  securityConfig,
  performanceConfig,
  autosaveConfig
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const isControlled = value !== undefined;
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  // Autosave setup
  const { restore } = useAutosave(
    () => contentRef.current?.innerHTML || '',
    autosaveConfig
  );

  // Set initial content
  useEffect(() => {
    if (!contentRef.current) return;
    
    // Try to restore autosaved content first
    const restoredContent = restore();
    const initialContent = restoredContent || value || defaultValue;
    
    if (initialContent && contentRef.current.innerHTML !== initialContent) {
      contentRef.current.innerHTML = initialContent;
      
      if (restoredContent && onChange) {
        // Notify parent of restored content
        onChange(restoredContent);
      }
    }
  }, []); // Only run on mount

  // Handle controlled value changes
  useEffect(() => {
    if (!contentRef.current || !isControlled) return;
    
    if (value !== contentRef.current.innerHTML) {
      contentRef.current.innerHTML = value;
    }
  }, [value, isControlled]);

  useEffect(() => {
    if (!contentRef.current) return;

    const handleInput = () => {
      if (!contentRef.current || !onChange) return;
      
      let html = contentRef.current.innerHTML;
      
      // Sanitize input if enabled
      if (securityConfig?.sanitizeOnInput !== false && contentConfig?.sanitize !== false) {
        html = sanitizeInputHTML(html, contentConfig, securityConfig);
        
        // Update content if sanitization changed it
        if (html !== contentRef.current.innerHTML) {
          // Save selection
          const selection = window.getSelection();
          const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
          
          contentRef.current.innerHTML = html;
          
          // Restore selection
          if (range && selection) {
            try {
              selection.removeAllRanges();
              selection.addRange(range);
            } catch (e) {
              // Selection restoration failed, ignore
            }
          }
        }
      }
      
      // Debounce onChange if performance config specified
      if (performanceConfig?.debounceInputMs) {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
          onChange(html);
        }, performanceConfig.debounceInputMs);
      } else {
        onChange(html);
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      
      // Get pasted content
      let pastedHTML = e.clipboardData?.getData('text/html');
      const pastedText = e.clipboardData?.getData('text/plain');
      
      // If clean paste is enabled, strip formatting
      if (pasteConfig?.clean || !pasteConfig?.keepFormatting) {
        if (pastedText) {
          document.execCommand('insertText', false, pastedText);
        }
        return;
      }
      
      // Sanitize pasted HTML if enabled
      if (pastedHTML) {
        if (securityConfig?.sanitizeOnPaste !== false && contentConfig?.sanitize !== false) {
          pastedHTML = sanitizePastedHTML(pastedHTML, contentConfig, securityConfig);
        }
        
        // Insert sanitized HTML
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = pastedHTML;
          
          const fragment = document.createDocumentFragment();
          while (tempDiv.firstChild) {
            fragment.appendChild(tempDiv.firstChild);
          }
          
          range.insertNode(fragment);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } else if (pastedText) {
        // Fallback to plain text
        document.execCommand('insertText', false, pastedText);
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
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      el.removeEventListener('input', handleInput);
      el.removeEventListener('paste', handlePaste);
      el.removeEventListener('click', handleClick);
    };
  }, [editor, onChange, pasteConfig, contentConfig, securityConfig, performanceConfig]);

  useEffect(() => {
    if (!contentRef.current || typeof window === 'undefined') return;

    const manager = new KeyboardShortcutManager();
    const el = contentRef.current;

    const handleKeyDown = (event: KeyboardEvent) => {
      manager.handleKeyDown(event, (command, params) => {
        if (typeof window !== 'undefined' && (window as any).executeEditorCommand) {
          (window as any).executeEditorCommand(command, params);
        }
      });
    };

    el.addEventListener('keydown', handleKeyDown as any);

    return () => {
      el.removeEventListener('keydown', handleKeyDown as any);
    };
  }, []);

  return (
    <div
      ref={contentRef}
      contentEditable
      suppressContentEditableWarning
      className="rte-content"
      style={{
        minHeight: "200px",
        maxHeight: "100%",
        padding: "16px",
        outline: "none",
        border: "1px solid #ddd",
        borderRadius: "0px 0px 4px 4px",
        fontSize: "14px",
        lineHeight: "1.5",
        overflow: "auto",
        flex: 1,
        boxSizing: "border-box",
        wordWrap: "break-word",
        overflowWrap: "break-word",
      }}
    >
      <p>
        <br />
      </p>
    </div>
  );
};
