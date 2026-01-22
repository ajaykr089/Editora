import React, { ReactNode } from 'react';

interface TextAlignmentProviderProps {
  children: ReactNode;
}

export const TextAlignmentProvider: React.FC<TextAlignmentProviderProps> = ({ children }) => {
  React.useEffect(() => {
    // Register commands with global system
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.('setTextAlignment', (alignment: string) => {
        console.log('Set text alignment command triggered', alignment);
      });
    }
  }, []);

  return <>{children}</>;
};
