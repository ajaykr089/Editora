import React, { ReactNode } from 'react';
import { usePluginContext } from '../../../react/src/components/PluginManager';
import {
  decreaseFontSizeCommand,
  increaseFontSizeCommand,
  setFontSizeCommand
} from './FontSizePlugin';

interface FontSizeProviderProps {
  children: ReactNode;
}

export const FontSizeProvider: React.FC<FontSizeProviderProps> = ({ children }) => {
  const { registerCommand } = usePluginContext();

  React.useEffect(() => {
    registerCommand('decreaseFontSize', decreaseFontSizeCommand);
    registerCommand('increaseFontSize', increaseFontSizeCommand);
    registerCommand('setFontSize', setFontSizeCommand);
  }, [registerCommand]);

  return <>{children}</>;
};
