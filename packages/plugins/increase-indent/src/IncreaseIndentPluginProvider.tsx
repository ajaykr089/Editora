import React, { ReactNode } from 'react';

interface IncreaseIndentPluginProviderProps {
  children: ReactNode;
}

export const IncreaseIndentPluginProvider: React.FC<IncreaseIndentPluginProviderProps> = ({ children }) => {
  const registerCommand = (command: string, handler: () => void) => {
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.(command, handler);
    }
  };

  React.useEffect(() => {
    registerCommand('increaseIndent', () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.insertNode(document.createTextNode('\t'));
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });
  }, []);

  return <>{children}</>;
};
