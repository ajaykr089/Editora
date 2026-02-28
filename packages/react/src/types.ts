/**
 * Production-grade Rich Text Editor Types
 * Designed for enterprise-level configurability
 */

import { Plugin } from '@editora/core';

/**
 * Core EditorAPI - must be passed to onInit callback
 */
export interface EditorAPI {
  // Content manipulation
  getHTML(): string;
  setHTML(html: string): void;
  
  // Command execution
  execCommand(name: string, value?: any): void;
  registerCommand(name: string, fn: (params?: any) => void): void;
  
  // Focus management
  focus(): void;
  blur(): void;
  
  // Lifecycle
  destroy(): void;
  
  // Editor state
  onChange(fn: (html: string) => void): () => void;
  getState(): any;
  
  // Plugin-contributed APIs (extensible)
  toolbar?: {
    items?: any[];
  };
  menubar?: any;
  contextMenu?: any;
  media?: any;
  paste?: any;
  history?: any;
  language?: any;
  spellcheck?: any;
  autosave?: any;
  accessibility?: any;
  performance?: any;
  content?: any;
  security?: any;
  
  // Security
  secureInput?(html: string, opts: any): string;
}

/**
 * Main editor props - production-grade configuration surface
 */
export interface RichTextEditorProps {
  // Identity & styling
  id?: string;
  className?: string;

  // Content control
  value?: string;
  defaultValue?: string;
  readonly?: boolean;
  placeholder?: string;
  onChange?: (html: string) => void;
  onInit?: (editor: EditorAPI) => void;
  onDestroy?: () => void;

  // Plugins
  plugins?: Plugin[] | string[];
  pluginConfig?: Record<string, unknown>;

  // Toolbar configuration
  toolbar?: {
    items?: string[] | any[]; // Support both string refs and full item objects
    floating?: boolean;
    sticky?: boolean;
    showMoreOptions?: boolean;
  };

  // Status bar
  statusbar?: {
    enabled?: boolean;
    position?: 'top' | 'bottom';
  };

  // Menubar
  menubar?: {
    enabled: boolean;
    items?: string[];
  };

  // Context menu
  contextMenu?: {
    enabled?: boolean;
  };

  // Media upload & library
  media?: {
    uploadUrl?: string;
    libraryUrl?: string;
    maxFileSize?: number;
    allowedTypes?: string[];
    headers?: Record<string, string>;
    withCredentials?: boolean;
  };

  // Paste handling
  paste?: {
    clean?: boolean;
    keepFormatting?: boolean;
    convertWord?: boolean;
  };

  // History (undo/redo)
  history?: {
    maxSteps?: number;
    debounceMs?: number;
  };

  // Language & localization
  language?: {
    locale?: string;
    direction?: 'ltr' | 'rtl';
  };

  // Spell check
  spellcheck?: {
    enabled?: boolean;
    provider?: 'browser' | 'local' | 'api';
    apiUrl?: string;
    apiHeaders?: Record<string, string>;
  };

  // Autosave
  autosave?: {
    enabled?: boolean;
    intervalMs?: number;
    storageKey?: string;
    provider?: 'localStorage' | 'api';
    apiUrl?: string;
  };

  // Accessibility
  accessibility?: {
    enableARIA?: boolean;
    keyboardNavigation?: boolean;
    checker?: boolean;
  };

  // Performance tuning
  performance?: {
    debounceInputMs?: number;
    viewportOnlyScan?: boolean;
  };

  // Content filtering
  content?: {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
    sanitize?: boolean;
    autoHeight?: boolean;
    minHeight?: number;
    maxHeight?: number;
  };

  // Security
  security?: {
    sanitizeOnPaste?: boolean;
    sanitizeOnInput?: boolean;
  };

  // Legacy/compatibility - keep current prop support
  floatingToolbar?: boolean | {
    enabled?: boolean;
  };
  mediaConfig?: {
    uploadUrl: string;
    libraryUrl: string;
    maxFileSize: number;
    allowedTypes: string[];
  };
}

/**
 * Internal merged configuration (after defaults applied)
 */
export interface EditorConfig extends Required<Omit<RichTextEditorProps, 'id' | 'className' | 'value' | 'defaultValue' | 'onChange' | 'onInit' | 'onDestroy' | 'plugins' | 'pluginConfig' | 'floatingToolbar' | 'mediaConfig'>> {
  id?: string;
  className?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (html: string) => void;
  onInit?: (editor: EditorAPI) => void;
  onDestroy?: () => void;
  plugins: Plugin[];
  pluginConfig: Record<string, unknown>;
}
