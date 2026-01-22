import React, { ReactNode } from 'react';

interface ItalicPluginProviderProps {
  children: ReactNode;
}

export const ItalicPluginProvider: React.FC<ItalicPluginProviderProps> = ({ children }) => {
  const registerCommand = (command: string, handler: () => void) => {
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.(command, handler);
    }
  };

  React.useEffect(() => {
    registerCommand('toggleItalic', () => {
      document.execCommand('italic', false);
    });
  }, []);

  return <>{children}</>;
};
