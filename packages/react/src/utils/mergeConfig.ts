/**
 * Configuration merger with safe defaults
 * Ensures all config options have sensible defaults
 */

import { RichTextEditorProps, EditorConfig } from '../types';
import { Plugin } from '@editora/core';

/**
 * Default configuration - production-ready defaults
 */
const DEFAULT_CONFIG: Omit<EditorConfig, 'id' | 'className' | 'value' | 'defaultValue' | 'onChange' | 'onInit' | 'onDestroy' | 'plugins' | 'pluginConfig'> = {
  placeholder: '',
  toolbar: {
    items: [],
    floating: false,
    sticky: false,
    showMoreOptions: true,
  },
  statusbar: {
    enabled: false,
    position: 'bottom',
  },
  menubar: {
    enabled: false,
    items: [],
  },
  contextMenu: {
    enabled: true,
  },
  media: {
    uploadUrl: '',
    libraryUrl: '',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    headers: {},
    withCredentials: false,
  },
  paste: {
    clean: true,
    keepFormatting: false,
    convertWord: true,
  },
  history: {
    maxSteps: 100,
    debounceMs: 300,
  },
  language: {
    locale: 'en',
    direction: 'ltr',
  },
  spellcheck: {
    enabled: false,
    provider: 'browser',
    apiUrl: '',
    apiHeaders: {},
  },
  autosave: {
    enabled: false,
    intervalMs: 30000, // 30 seconds
    storageKey: 'rte-autosave',
    provider: 'localStorage',
    apiUrl: '',
  },
  accessibility: {
    enableARIA: true,
    keyboardNavigation: true,
    checker: false,
  },
  performance: {
    debounceInputMs: 100,
    viewportOnlyScan: true,
  },
  content: {
    allowedTags: [],
    allowedAttributes: {},
    sanitize: true,
  },
  security: {
    sanitizeOnPaste: true,
    sanitizeOnInput: true,
  },
};

/**
 * Deep merge helper
 */
function deepMerge<T>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = result[key];
    
    if (sourceValue !== undefined) {
      if (
        typeof sourceValue === 'object' &&
        sourceValue !== null &&
        !Array.isArray(sourceValue) &&
        typeof targetValue === 'object' &&
        targetValue !== null &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(targetValue, sourceValue as any);
      } else {
        result[key] = sourceValue as any;
      }
    }
  }
  
  return result;
}

/**
 * Merge user props with defaults
 * Non-breaking: supports both new and legacy props
 */
export function mergeConfig(props: RichTextEditorProps): EditorConfig {
  // Start with defaults
  const config = deepMerge(DEFAULT_CONFIG, {
    placeholder: props.placeholder,
    toolbar: props.toolbar,
    statusbar: props.statusbar,
    menubar: props.menubar,
    contextMenu: props.contextMenu,
    media: props.media,
    paste: props.paste,
    history: props.history,
    language: props.language,
    spellcheck: props.spellcheck,
    autosave: props.autosave,
    accessibility: props.accessibility,
    performance: props.performance,
    content: props.content,
    security: props.security,
  });

  // Legacy compatibility: merge floatingToolbar into toolbar
  if (props.floatingToolbar !== undefined) {
    const floatingFromLegacy =
      typeof props.floatingToolbar === 'boolean'
        ? props.floatingToolbar
        : props.floatingToolbar.enabled;

    config.toolbar = {
      ...config.toolbar,
      floating: floatingFromLegacy ?? config.toolbar.floating,
    };
  }

  // Legacy compatibility: merge mediaConfig into media
  if (props.mediaConfig) {
    config.media = {
      ...config.media,
      uploadUrl: props.mediaConfig.uploadUrl || config.media.uploadUrl,
      libraryUrl: props.mediaConfig.libraryUrl || config.media.libraryUrl,
      maxFileSize: props.mediaConfig.maxFileSize || config.media.maxFileSize,
      allowedTypes: props.mediaConfig.allowedTypes || config.media.allowedTypes,
    };
  }

  // Build full config
  const fullConfig: EditorConfig = {
    ...config,
    id: props.id,
    className: props.className,
    value: props.value,
    defaultValue: props.defaultValue,
    onChange: props.onChange,
    onInit: props.onInit,
    onDestroy: props.onDestroy,
    plugins: Array.isArray(props.plugins) 
      ? props.plugins.filter((p): p is Plugin => typeof p !== 'string') 
      : [],
    pluginConfig: props.pluginConfig || {},
  };

  return fullConfig;
}
