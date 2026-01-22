import React, { ReactNode } from 'react';

interface BoldPluginProviderProps {
  children: ReactNode;
}

export const BoldPluginProvider: React.FC<BoldPluginProviderProps> = ({ children }) => {
  const registerCommand = (command: string, handler: () => void) => {
    // Register command with the global command system
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.(command, handler);
    }
  };

  React.useEffect(() => {
    registerCommand('toggleBold', () => {
      document.execCommand('bold', false);
    });
  }, []);

  return <>{children}</>;
};
