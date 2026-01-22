import React, { ReactNode } from 'react';

interface UnderlinePluginProviderProps {
  children: ReactNode;
}

export const UnderlinePluginProvider: React.FC<UnderlinePluginProviderProps> = ({ children }) => {
  const registerCommand = (command: string, handler: () => void) => {
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.(command, handler);
    }
  };

  React.useEffect(() => {
    registerCommand('toggleUnderline', () => {
      document.execCommand('underline', false);
    });
  }, []);

  return <>{children}</>;
};
