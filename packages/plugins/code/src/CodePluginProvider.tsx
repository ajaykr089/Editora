import React, { ReactNode } from 'react';

interface CodePluginProviderProps {
  children: ReactNode;
}

export const CodePluginProvider: React.FC<CodePluginProviderProps> = ({ children }) => {
  const registerCommand = (command: string, handler: () => void) => {
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.(command, handler);
    }
  };

  React.useEffect(() => {
    registerCommand('toggleCode', () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const code = document.createElement('code');
        range.surroundContents(code);
      }
    });
  }, []);

  return <>{children}</>;
};
