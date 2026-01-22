import React, { ReactNode } from 'react';
import { setTextAlignmentCommand } from './TextAlignmentPlugin';

interface TextAlignmentProviderProps {
  children: ReactNode;
}

export const TextAlignmentProvider: React.FC<TextAlignmentProviderProps> = ({ children }) => {
  React.useEffect(() => {
    // Register commands with global system
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.('setTextAlignment', setTextAlignmentCommand);
    }
  }, []);

  return <>{children}</>;
};
