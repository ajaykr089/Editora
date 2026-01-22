import React, { ReactNode } from 'react';

interface BlockquotePluginProviderProps {
  children: ReactNode;
}

export const BlockquotePluginProvider: React.FC<BlockquotePluginProviderProps> = ({ children }) => {
  const registerCommand = (command: string, handler: () => void) => {
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.(command, handler);
    }
  };

  React.useEffect(() => {
    registerCommand('toggleBlockquote', () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const currentBlock =
          range.commonAncestorContainer.nodeType === Node.TEXT_NODE
            ? range.commonAncestorContainer.parentElement
            : range.commonAncestorContainer;

        const blockquote = (currentBlock as Element)?.closest?.("blockquote");
        if (blockquote) {
          document.execCommand("formatBlock", false, "p");
        } else {
          document.execCommand("formatBlock", false, "blockquote");
        }
      }
    });
  }, []);

  return <>{children}</>;
};
