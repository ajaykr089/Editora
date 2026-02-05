import React, { useMemo, useEffect, useRef } from 'react';
import { Editor, PluginManager, Plugin } from '@editora/core';
import { Toolbar } from './Toolbar';
import { EditorContent } from './EditorContent';
import { FloatingToolbar } from './FloatingToolbar';
import { DynamicProviderWrapper } from './DynamicProviderWrapper';
import { RichTextEditorProps, EditorAPI } from '../types';
import { mergeConfig } from '../utils/mergeConfig';

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

const EditorCore: React.FC<RichTextEditorProps> = (props) => {
  const config = useMemo(() => mergeConfig(props), [
    props.id,
    props.className,
    props.value,
    props.defaultValue,
    props.plugins,
    props.toolbar,
    props.menubar,
    props.contextMenu,
    props.media,
    props.paste,
    props.history,
    props.language,
    props.spellcheck,
    props.autosave,
    props.accessibility,
    props.performance,
    props.content,
    props.security,
    props.floatingToolbar,
    props.mediaConfig,
  ]);
  
  const editorRef = useRef<Editor | null>(null);
  const apiRef = useRef<EditorAPI | null>(null);
  const onInitRef = useRef(props.onInit);
  const onDestroyRef = useRef(props.onDestroy);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  
  // Keep callback refs up to date
  useEffect(() => {
    onInitRef.current = props.onInit;
    onDestroyRef.current = props.onDestroy;
  });

  const editor = useMemo(() => {
    const pluginManager = new PluginManager();
    config.plugins.forEach(p => pluginManager.register(p));
    const editorInstance = new Editor(pluginManager);
    editorRef.current = editorInstance;
    return editorInstance;
  }, [config.plugins]);

  // Build EditorAPI - only run once on mount
  useEffect(() => {
    const api: EditorAPI = {
      getHTML: () => {
        const contentEl = editorContainerRef.current?.querySelector('.rte-content') as HTMLElement;
        return contentEl?.innerHTML || '';
      },
      setHTML: (html: string) => {
        const contentEl = editorContainerRef.current?.querySelector('.rte-content') as HTMLElement;
        if (contentEl) {
          contentEl.innerHTML = html;
        }
      },
      execCommand: (name: string, value?: any) => {
        if (typeof window !== 'undefined' && (window as any).executeEditorCommand) {
          (window as any).executeEditorCommand(name, value);
        }
      },
      registerCommand: (name: string, fn: (params?: any) => void) => {
        if (typeof window !== 'undefined' && (window as any).registerEditorCommand) {
          (window as any).registerEditorCommand(name, fn);
        }
      },
      focus: () => {
        const contentEl = editorContainerRef.current?.querySelector('.rte-content') as HTMLElement;
        contentEl?.focus();
      },
      blur: () => {
        const contentEl = editorContainerRef.current?.querySelector('.rte-content') as HTMLElement;
        contentEl?.blur();
      },
      destroy: () => {
        // Cleanup logic
        if (onDestroyRef.current) {
          onDestroyRef.current();
        }
      },
      onChange: (fn: (html: string) => void) => {
        // Subscribe to changes and return unsubscribe function
        return () => {};
      },
      getState: () => ({
        plugins: config.plugins,
        config,
      }),
      toolbar: { 
        items: (editor as any).toolbar?.items || [],
      },
    };
    
    apiRef.current = api;
    
    // Call onInit if provided
    if (onInitRef.current) {
      onInitRef.current(api);
    }
    
    return () => {
      if (onDestroyRef.current) {
        onDestroyRef.current();
      }
    };
  }, []); // Empty deps - only run once on mount

  const floatingToolbarEnabled = config.toolbar.floating ?? false;
  const toolbarPosition = (config.toolbar as any).position || 'top';
  const stickyToolbar = config.toolbar.sticky ?? false;

  return (
    <DynamicProviderWrapper plugins={config.plugins}>
      <div
        ref={editorContainerRef}
        id={config.id}
        data-editora-editor
        className={`rte-editor ${config.className || ""}`}
        dir={config.language.direction}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        {toolbarPosition !== 'bottom' && (
          <Toolbar 
            editor={editor}
            position={toolbarPosition}
            sticky={stickyToolbar}
            floating={floatingToolbarEnabled}
          />
        )}
        <EditorContent 
          editor={editor}
          defaultValue={config.defaultValue}
          value={config.value}
          onChange={config.onChange}
          pasteConfig={config.paste}
          contentConfig={config.content}
          securityConfig={config.security}
          performanceConfig={config.performance}
          autosaveConfig={config.autosave}
        />
        {toolbarPosition === 'bottom' && (
          <Toolbar 
            editor={editor}
            position={toolbarPosition}
            sticky={stickyToolbar}
            floating={floatingToolbarEnabled}
          />
        )}
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
