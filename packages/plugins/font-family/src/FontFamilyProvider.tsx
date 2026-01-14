import React, { ReactNode } from 'react';
import { usePluginContext } from '../../../react/src/components/PluginManager';
import { setFontFamilyCommand } from './FontFamilyPlugin';

interface FontFamilyProviderProps {
  children: ReactNode;
}

export const FontFamilyProvider: React.FC<FontFamilyProviderProps> = ({ children }) => {
  const { registerCommand } = usePluginContext();

  React.useEffect(() => {
    registerCommand('setFontFamily', setFontFamilyCommand);
  }, [registerCommand]);

  return <>{children}</>;
};
