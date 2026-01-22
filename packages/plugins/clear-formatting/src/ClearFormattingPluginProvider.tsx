import React, { ReactNode } from 'react';

interface ClearFormattingPluginProviderProps {
  children: ReactNode;
}

export const ClearFormattingPluginProvider: React.FC<ClearFormattingPluginProviderProps> = ({ children }) => {
  const registerCommand = (command: string, handler: () => void) => {
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.(command, handler);
    }
  };

  React.useEffect(() => {
    registerCommand('clearFormatting', () => {
      document.execCommand('removeFormat', false);
      document.execCommand('unlink', false);
    });
  }, []);

  return <>{children}</>;
};
