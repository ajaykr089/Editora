import React, { ReactNode } from 'react';

interface ListPluginProviderProps {
  children: ReactNode;
}

export const ListPluginProvider: React.FC<ListPluginProviderProps> = ({ children }) => {
  const registerCommand = (command: string, handler: () => void) => {
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.(command, handler);
    }
  };

  React.useEffect(() => {
    registerCommand('toggleBulletList', () => {
      document.execCommand('insertUnorderedList', false);
    });

    registerCommand('toggleOrderedList', () => {
      document.execCommand('insertOrderedList', false);
    });
  }, []);

  return <>{children}</>;
};
