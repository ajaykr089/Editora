/**
 * Configuration merger with safe defaults
 * Ensures all config options have sensible defaults
 */

import { RichTextEditorProps, EditorConfig } from '../types';
import { Plugin } from '@editora/core';

type PluginFactory = () => Plugin;

const warnedUnresolvedPlugins = new Set<string>();
const warnedMissingA11yChecker = new Set<string>();

const isPlugin = (value: unknown): value is Plugin => {
  return !!value && typeof value === 'object' && typeof (value as Plugin).name === 'string';
};

const getPluginFactories = (pluginConfig?: Record<string, unknown>): Record<string, PluginFactory> => {
  const fromConfig = (pluginConfig as any)?.pluginFactories as Record<string, PluginFactory> | undefined;
  const fromGlobal =
    typeof window !== 'undefined'
      ? ((window as any).EditoraReactPlugins as Record<string, PluginFactory> | undefined)
      : undefined;

  return {
    ...(fromGlobal || {}),
    ...(fromConfig || {}),
  };
};

const resolvePlugins = (
  plugins: RichTextEditorProps['plugins'],
  pluginConfig?: Record<string, unknown>,
): Plugin[] => {
  if (!Array.isArray(plugins)) return [];

  const factories = getPluginFactories(pluginConfig);
  const resolved: Plugin[] = [];
  const unresolvedNames: string[] = [];

  plugins.forEach((entry) => {
    if (isPlugin(entry)) {
      resolved.push(entry);
      return;
    }

    if (typeof entry !== 'string') return;
    const factory = factories[entry];
    if (typeof factory === 'function') {
      try {
        const plugin = factory();
        if (isPlugin(plugin)) {
          resolved.push(plugin);
          return;
        }
      } catch {
        // Fall through to unresolved warning.
      }
    }

    unresolvedNames.push(entry);
  });

  if (unresolvedNames.length > 0) {
    const key = unresolvedNames.slice().sort().join('|');
    if (!warnedUnresolvedPlugins.has(key)) {
      warnedUnresolvedPlugins.add(key);
      console.warn(
        `[Editora React] Unresolved string plugin names: ${unresolvedNames.join(
          ', ',
        )}. Pass plugin instances or provide plugin factories via "pluginConfig.pluginFactories" or "window.EditoraReactPlugins".`,
      );
    }
  }

  return resolved;
};

const ensureAccessibilityChecker = (
  plugins: Plugin[],
  accessibility: RichTextEditorProps['accessibility'],
  pluginConfig?: Record<string, unknown>,
): Plugin[] => {
  if (!accessibility?.checker) return plugins;
  if (plugins.some((plugin) => plugin?.name === 'a11yChecker')) return plugins;

  const factory = getPluginFactories(pluginConfig).a11yChecker;
  if (typeof factory === 'function') {
    try {
      const plugin = factory();
      if (isPlugin(plugin)) {
        return [...plugins, plugin];
      }
    } catch {
      // Fall through to warning below.
    }
  }

  const warnKey = 'accessibility.checker';
  if (!warnedMissingA11yChecker.has(warnKey)) {
    warnedMissingA11yChecker.add(warnKey);
    console.warn(
      '[Editora React] accessibility.checker=true requires an "a11yChecker" plugin instance or factory.',
    );
  }
  return plugins;
};

/**
 * Default configuration - production-ready defaults
 */
const DEFAULT_CONFIG: Omit<EditorConfig, 'id' | 'className' | 'value' | 'defaultValue' | 'onChange' | 'onInit' | 'onDestroy' | 'plugins' | 'pluginConfig'> = {
  readonly: false,
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
    autoHeight: false,
    minHeight: 200,
    maxHeight: 0,
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
    readonly: props.readonly,
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
    plugins: ensureAccessibilityChecker(
      resolvePlugins(props.plugins, props.pluginConfig),
      props.accessibility,
      props.pluginConfig,
    ),
    pluginConfig: props.pluginConfig || {},
  };

  return fullConfig;
}
