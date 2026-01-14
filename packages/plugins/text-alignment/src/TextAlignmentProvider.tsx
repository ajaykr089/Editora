import React, { ReactNode } from 'react';
import { usePluginContext } from '../../../react/src/components/PluginManager';
import { setTextAlignmentCommand } from './TextAlignmentPlugin';

interface TextAlignmentProviderProps {
  children: ReactNode;
}

export const TextAlignmentProvider: React.FC<TextAlignmentProviderProps> = ({ children }) => {
  const { registerCommand } = usePluginContext();

  React.useEffect(() => {
    registerCommand('setTextAlignment', setTextAlignmentCommand);
  }, [registerCommand]);

  return <>{children}</>;
};
