import React, { ReactNode } from 'react';
import * as _rte_editor_core from '@rte-editor/core';
import { Plugin, ToolbarItem, EditorState, Editor } from '@rte-editor/core';

/**
 * Props for the RichTextEditor component.
 */
interface RichTextEditorProps {
    /** Initial content or controlled value */
    value?: string;
    /** Callback when content changes */
    onChange?: (content: string) => void;
    /** List of plugins to enable */
    plugins?: Plugin[];
    /** Theme name */
    theme?: 'light' | 'dark' | string;
    /** Whether the editor is read-only */
    readOnly?: boolean;
    /** Placeholder text */
    placeholder?: string;
    /** Additional CSS class */
    className?: string;
    /** Whether to show the toolbar */
    showToolbar?: boolean;
    /** Additional props passed to container */
    [key: string]: any;
}
/**
 * Main Rich Text Editor component.
 * This is the primary component users interact with.
 */
declare const RichTextEditor: React.FC<RichTextEditorProps>;

/**
 * Props for the Toolbar component.
 */
interface ToolbarProps {
    className?: string;
    items?: ToolbarItem[];
}
/**
 * Toolbar component that renders editor controls.
 */
declare const Toolbar: React.FC<ToolbarProps>;
/**
 * Props for the ToolbarButton component.
 */
interface ToolbarButtonProps {
    item: ToolbarItem;
    state: any;
    onCommand: (command: string, commandArgs?: any[]) => void;
}
/**
 * Individual toolbar button component.
 */
declare const ToolbarButton: React.FC<ToolbarButtonProps>;

/**
 * Props for the EditorContent component.
 */
interface EditorContentProps {
    className?: string;
    placeholder?: string;
    readOnly?: boolean;
    autoFocus?: boolean;
    spellCheck?: boolean;
}
/**
 * EditorContent component that renders the editable document area.
 */
declare const EditorContent: React.FC<EditorContentProps>;

/**
 * Editor context value interface.
 */
interface EditorContextValue {
    state: EditorState;
    dispatch: (tr: any) => void;
    plugins: readonly Plugin[];
    editor: Editor;
    view?: any;
}
/**
 * Hook to access the current editor context.
 * Must be used within an EditorProvider.
 */
declare const useEditorContext: () => EditorContextValue;
/**
 * Props for the EditorProvider component.
 */
interface EditorProviderProps {
    state: EditorState;
    dispatch: (tr: any) => void;
    plugins?: readonly Plugin[];
    editor: Editor;
    view?: any;
    children: ReactNode;
}
/**
 * Provider component that makes editor state available to child components.
 */
declare const EditorProvider: React.FC<EditorProviderProps>;

/**
 * Hook to access the current editor state.
 */
declare const useEditor: () => _rte_editor_core.EditorState;
/**
 * Hook to get the dispatch function for sending transactions.
 */
declare const useDispatch: () => (tr: any) => void;
/**
 * Hook to access the current selection.
 */
declare const useSelection: () => _rte_editor_core.Selection;
/**
 * Hook to check if the editor is in a focused state.
 */
declare const useFocused: () => boolean;
/**
 * Hook to get the current schema.
 */
declare const useSchema: () => _rte_editor_core.Schema;
/**
 * Hook to get the list of active plugins.
 */
declare const usePlugins: () => readonly _rte_editor_core.Plugin[];
/**
 * Hook to check if a command can be executed.
 */
declare const useCommandEnabled: (commandName: string) => boolean;
/**
 * Hook to execute a command.
 */
declare const useCommand: (commandName: string) => () => void;
/**
 * Hook to get editor view instance.
 */
declare const useView: () => any;

export { EditorContent, EditorProvider, RichTextEditor, Toolbar, ToolbarButton, RichTextEditor as default, useCommand, useCommandEnabled, useDispatch, useEditor, useEditorContext, useFocused, usePlugins, useSchema, useSelection, useView };
export type { EditorContentProps, EditorContextValue, EditorProviderProps, RichTextEditorProps, ToolbarProps };
