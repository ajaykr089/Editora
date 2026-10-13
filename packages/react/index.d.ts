import * as React from "react";
import type {
  Plugin,
  Editor,
  ToolbarItem,
  KeyboardShortcutConfig,
} from "@editora/core";

export interface EditorAPI {
  getHTML(): string;
  setHTML(html: string): void;
  execCommand(name: string, value?: unknown): void;
  registerCommand(name: string, fn: (params?: unknown) => void): void;
  focus(): void;
  blur(): void;
  destroy(): void;
  onChange(fn: (html: string) => void): () => void;
  getState(): unknown;
  toolbar?: { items?: unknown[] };
  menubar?: unknown;
  contextMenu?: unknown;
  media?: unknown;
  paste?: unknown;
  history?: unknown;
  language?: unknown;
  spellcheck?: unknown;
  autosave?: unknown;
  accessibility?: unknown;
  performance?: unknown;
  content?: unknown;
  security?: unknown;
  secureInput?(html: string, opts: unknown): string;
}

export interface RichTextEditorProps {
  id?: string;
  className?: string;
  value?: string;
  defaultValue?: string;
  readonly?: boolean;
  placeholder?: string;
  onChange?: (html: string) => void;
  onInit?: (editor: EditorAPI) => void;
  onDestroy?: () => void;
  plugins?: Plugin[] | string[];
  pluginConfig?: Record<string, unknown>;
  toolbar?: {
    items?: string | string[] | ToolbarItem[];
    floating?: boolean;
    sticky?: boolean;
    showMoreOptions?: boolean;
  };
  statusbar?: {
    enabled?: boolean;
    position?: "top" | "bottom";
  };
  menubar?: {
    enabled: boolean;
    items?: string[];
  };
  contextMenu?: {
    enabled?: boolean;
  };
  media?: {
    uploadUrl?: string;
    libraryUrl?: string;
    maxFileSize?: number;
    allowedTypes?: string[];
    headers?: Record<string, string>;
    withCredentials?: boolean;
  };
  paste?: {
    clean?: boolean;
    keepFormatting?: boolean;
    convertWord?: boolean;
  };
  history?: {
    maxSteps?: number;
    debounceMs?: number;
  };
  language?: {
    locale?: string;
    direction?: "ltr" | "rtl";
  };
  spellcheck?: {
    enabled?: boolean;
    provider?: "browser" | "local" | "api";
    apiUrl?: string;
    apiHeaders?: Record<string, string>;
  };
  autosave?: {
    enabled?: boolean;
    intervalMs?: number;
    storageKey?: string;
    provider?: "localStorage" | "api";
    apiUrl?: string;
  };
  accessibility?: {
    enableARIA?: boolean;
    keyboardNavigation?: boolean;
    checker?: boolean;
  };
  performance?: {
    debounceInputMs?: number;
    viewportOnlyScan?: boolean;
  };
  content?: {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
    sanitize?: boolean;
    autoHeight?: boolean;
    minHeight?: number;
    maxHeight?: number;
  };
  security?: {
    sanitizeOnPaste?: boolean;
    sanitizeOnInput?: boolean;
  };
  floatingToolbar?: boolean | { enabled?: boolean };
  mediaConfig?: {
    uploadUrl?: string;
    libraryUrl?: string;
    maxFileSize?: number;
    allowedTypes?: string[];
    offline?: {
      enabled?: boolean;
      useBase64Permanently?: boolean;
      fallbackToBase64?: boolean;
      customUploadUrl?: string;
      customUploadHeaders?: Record<string, string>;
    };
  };
}

export interface EditorConfig extends RichTextEditorProps {
  plugins: Plugin[];
  pluginConfig: Record<string, unknown>;
}

export interface InlineMenuOption {
  label: string;
  value: string;
}

export interface InlineMenuProps {
  isOpen: boolean;
  options: InlineMenuOption[];
  onSelect: (value: string) => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  className?: string;
}

export interface UseKeyboardShortcutsOptions extends KeyboardShortcutConfig {
  onCommand?: (command: string, params?: unknown) => void;
  editorElement?: HTMLElement | null;
}

export interface ToolbarProps {
  editor: Editor;
  position?: "top" | "bottom";
  sticky?: boolean;
  floating?: boolean;
  readonly?: boolean;
  showMoreOptions?: boolean;
  itemsOverride?: string | string[] | ToolbarItem[];
}

export interface EditorContentProps {
  editor: Editor;
  defaultValue?: string;
  value?: string;
  readonly?: boolean;
  placeholder?: string;
  onChange?: (html: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps>;
export const EditoraEditor: React.FC<RichTextEditorProps>;
export const Toolbar: React.FC<ToolbarProps>;
export const EditorContent: React.FC<EditorContentProps>;
export const InlineMenu: React.FC<InlineMenuProps>;

export function useKeyboardShortcuts(options?: UseKeyboardShortcutsOptions): {
  getShortcuts: () => unknown[];
  getShortcutForCommand: (command: string) => unknown;
  getShortcutsHelp: () => string;
  enable: () => void;
  disable: () => void;
  isEnabled: () => boolean;
};

export function mergeConfig(props: RichTextEditorProps): EditorConfig;
