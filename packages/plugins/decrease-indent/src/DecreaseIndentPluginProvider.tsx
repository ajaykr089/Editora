import React, { ReactNode } from 'react';

interface DecreaseIndentPluginProviderProps {
  children: ReactNode;
}

export const DecreaseIndentPluginProvider: React.FC<DecreaseIndentPluginProviderProps> = ({ children }) => {
  const registerCommand = (command: string, handler: () => void) => {
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.(command, handler);
    }
  };

  React.useEffect(() => {
    registerCommand('decreaseIndent', () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.insertNode(document.createTextNode('\u00A0'));
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });
  }, []);

  return <>{children}</>;
};
