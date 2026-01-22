import React, { createContext, useContext, ReactNode } from 'react';
import { Plugin } from '@rte-editor/core';

// Plugin Context Types
interface PluginContextType {
  executeCommand: (command: string, params?: any) => void;
  registerCommand: (command: string, handler: (params?: any) => void) => void;
  getCommandHandler: (command: string) => ((params?: any) => void) | undefined;
}

const PluginContext = createContext<PluginContextType | null>(null);

export const usePluginContext = () => {
  const context = useContext(PluginContext);
  if (!context) {
    throw new Error('usePluginContext must be used within PluginProvider');
  }
  return context;
};

// Plugin Provider Component
interface PluginProviderProps {
  plugins: Plugin[];
  children: ReactNode;
}

export const PluginProvider: React.FC<PluginProviderProps> = ({ plugins, children }) => {
  const commandHandlers = new Map<string, (params?: any) => void>();

  const executeCommand = (command: string, params?: any) => {
    const handler = commandHandlers.get(command);
    if (handler) {
      handler(params);
    } else {
      console.warn(`No handler registered for command: ${command}`);
    }
  };

  const registerCommand = (command: string, handler: (params?: any) => void) => {
    commandHandlers.set(command, handler);
  };

  const getCommandHandler = (command: string) => {
    return commandHandlers.get(command);
  };

  const contextValue: PluginContextType = {
    executeCommand,
    registerCommand,
    getCommandHandler,
  };

  return (
    <PluginContext.Provider value={contextValue}>
      {children}
    </PluginContext.Provider>
  );
};

// Plugin providers have been isolated to their respective plugin directories
