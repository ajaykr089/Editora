import React, { ReactNode } from 'react';
import { insertPageBreakCommand } from './PageBreakPlugin';
import './PageBreakStyles.css';

interface PageBreakPluginProviderProps {
  children: ReactNode;
}

/**
 * PageBreakPluginProvider
 *
 * Registers page break commands and injects CSS for visual markers.
 * Also handles keyboard shortcuts for page break insertion.
 */
export const PageBreakPluginProvider: React.FC<PageBreakPluginProviderProps> = ({ children }) => {
  React.useEffect(() => {
    // Register page break insertion command
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.('insertPageBreak', insertPageBreakCommand);
    }

    // Optional: Register keyboard shortcut (Ctrl+Shift+P or Cmd+Shift+P)
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        insertPageBreakCommand();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return <>{children}</>;
};
