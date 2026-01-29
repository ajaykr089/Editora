import React, { ReactNode } from 'react';
import { insertFootnoteCommand, renumberAllFootnotes } from './FootnotePlugin';
import './FootnoteStyles.css';

interface FootnotePluginProviderProps {
  children: ReactNode;
}

/**
 * FootnotePluginProvider
 *
 * Registers footnote commands, handles footnote content editing,
 * and maintains footnote numbering consistency.
 */
export const FootnotePluginProvider: React.FC<FootnotePluginProviderProps> = ({ children }) => {
  React.useEffect(() => {
    // Register footnote insertion command
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.('insertFootnote', (content?: string) => {
        insertFootnoteCommand(content || '');
      });
    }

    // Monitor footnote container for changes
    const observer = new MutationObserver((mutations) => {
      // Check if any footnote items were added/removed
      const hasFootnoteChanges = mutations.some(m => {
        return Array.from(m.addedNodes).some(n => 
          (n as HTMLElement).classList?.contains?.('rte-footnote-item')
        ) || Array.from(m.removedNodes).some(n =>
          (n as HTMLElement).classList?.contains?.('rte-footnote-item')
        );
      });

      if (hasFootnoteChanges) {
        renumberAllFootnotes();
      }
    });

    // Start observing the document for changes
    const editor = document.querySelector('[data-editora-editor]');
    if (editor) {
      observer.observe(editor, {
        childList: true,
        subtree: true
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return <>{children}</>;
};
