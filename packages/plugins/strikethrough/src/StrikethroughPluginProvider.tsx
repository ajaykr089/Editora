import React, { ReactNode } from 'react';

interface StrikethroughPluginProviderProps {
  children: ReactNode;
}

export const StrikethroughPluginProvider: React.FC<StrikethroughPluginProviderProps> = ({ children }) => {
  const registerCommand = (command: string, handler: () => void) => {
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.(command, handler);
    }
  };

  React.useEffect(() => {
    registerCommand('toggleStrikethrough', () => {
      document.execCommand('strikeThrough', false);
    });
  }, []);

  return <>{children}</>;
};
