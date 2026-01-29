import React, { ReactNode } from 'react';
import { printDocument } from './PrintPlugin';

interface PrintPluginProviderProps {
  children: ReactNode;
}

/**
 * PrintPluginProvider
 *
 * Registers the print command with the editor's command system.
 * This provider ensures that the print functionality is available
 * regardless of where the Print plugin is used in the component tree.
 */
export const PrintPluginProvider: React.FC<PrintPluginProviderProps> = ({ children }) => {
  React.useEffect(() => {
    // Register print command with global system
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.('print', () => {
        printDocument();
      });
    }
  }, []);

  return <>{children}</>;
};
