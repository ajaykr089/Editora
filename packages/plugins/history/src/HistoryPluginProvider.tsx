import React, { ReactNode } from 'react';

interface HistoryPluginProviderProps {
  children: ReactNode;
}

export const HistoryPluginProvider: React.FC<HistoryPluginProviderProps> = ({ children }) => {
  const registerCommand = (command: string, handler: () => void) => {
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.(command, handler);
    }
  };

  React.useEffect(() => {
    registerCommand('undo', () => {
      document.execCommand('undo', false);
    });

    registerCommand('redo', () => {
      document.execCommand('redo', false);
    });
  }, []);

  return <>{children}</>;
};
