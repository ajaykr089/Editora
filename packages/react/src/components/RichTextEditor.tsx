import React, { useMemo } from 'react';
import { Editor, PluginManager, Plugin } from '@editora/core';
import { Toolbar } from './Toolbar';
import { EditorContent } from './EditorContent';
import { FloatingToolbar } from './FloatingToolbar';
import { DynamicProviderWrapper } from './DynamicProviderWrapper';

// Plugin Providers - These are now handled by DynamicProviderWrapper
// Each plugin can define its own provider through the context property
// Only essential providers are imported directly here

// Global command registry
const commandRegistry = new Map<string, (params?: any) => void>();

if (typeof window !== 'undefined') {
  (window as any).registerEditorCommand = (command: string, handler: (params?: any) => void) => {
    commandRegistry.set(command, handler);
  };

  (window as any).executeEditorCommand = (command: string, params?: any) => {
    const handler = commandRegistry.get(command);
    if (handler) {
      handler(params);
    } else {
      console.warn(`No handler registered for command: ${command}`);
    }
  };
}

interface RichTextEditorProps {
  plugins: Plugin[];
  className?: string;
  mediaConfig?: {
    uploadUrl: string;
    libraryUrl: string;
    maxFileSize: number;
    allowedTypes: string[];
  };
  floatingToolbar?: {
    enabled?: boolean;
  };
}

const EditorCore: React.FC<RichTextEditorProps> = ({ plugins, className, mediaConfig, floatingToolbar }) => {
  const editor = useMemo(() => {
    const pluginManager = new PluginManager();
    plugins.forEach(p => pluginManager.register(p));
    return new Editor(pluginManager);
  }, [plugins]);

  const floatingToolbarEnabled = floatingToolbar?.enabled !== false;

  return (
    <DynamicProviderWrapper plugins={plugins}>
        <div
          data-editora-editor
          className={`rte-editor ${className || ""}`}
        >
          <Toolbar editor={editor} />
          <EditorContent editor={editor} />
          <FloatingToolbar
            editor={editor}
            isEnabled={floatingToolbarEnabled}
          />
        </div>

    </DynamicProviderWrapper>
  );
};

export const RichTextEditor: React.FC<RichTextEditorProps> = (props) => {
  return <EditorCore {...props} />;
};
