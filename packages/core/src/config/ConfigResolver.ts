/**
 * ConfigResolver - Configuration resolution with priority handling
 * Priority: Explicit JS config > Web Component attributes > Plugin defaults > Editor defaults
 */

export interface EditorConfigDefaults {
  height?: number | string;
  width?: number | string;
  readonly?: boolean;
  disabled?: boolean;
  menubar?: boolean | { enabled?: boolean; items?: string[] };
  toolbar?:
    | string
    | boolean
    | {
        items?: string | string[];
        floating?: boolean;
        sticky?: boolean;
        showMoreOptions?: boolean;
      };
  plugins?: string | string[] | any[];
  pluginConfig?: Record<string, unknown>;
  theme?: string;
  content?: string;
  placeholder?: string;
  autofocus?: boolean;
  autosave?:
    | boolean
    | {
        enabled?: boolean;
        interval?: number;
        intervalMs?: number;
        storageKey?: string;
        provider?: 'localStorage' | 'api';
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
  spellcheck?:
    | boolean
    | {
        enabled?: boolean;
        provider?: 'browser' | 'local' | 'api';
        mode?: 'local' | 'api' | 'hybrid';
        apiUrl?: string;
        apiHeaders?: Record<string, string>;
      };
  language?: string | { locale?: string; direction?: 'ltr' | 'rtl' };
  contextMenu?: { enabled?: boolean } | boolean;
  contentConfig?: {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
    sanitize?: boolean;
  };
  paste?: {
    clean?: boolean;
    keepFormatting?: boolean;
    convertWord?: boolean;
  };
  security?: {
    sanitizeOnPaste?: boolean;
    sanitizeOnInput?: boolean;
  };
  statusbar?: boolean | { enabled?: boolean; position?: 'top' | 'bottom' };
  [key: string]: any;
}

export interface ConfigSource {
  jsConfig?: EditorConfigDefaults;
  attributes?: Record<string, string>;
  pluginDefaults?: EditorConfigDefaults;
  editorDefaults?: EditorConfigDefaults;
}

export class ConfigResolver {
  private static readonly EDITOR_DEFAULTS: EditorConfigDefaults = {
    height: 400,
    width: '100%',
    readonly: false,
    disabled: false,
    menubar: true,
    toolbar: true,
    plugins: [],
    theme: 'light',
    content: '',
    placeholder: 'Start typing...',
    autofocus: false,
    autosave: false,
    accessibility: {
      enableARIA: true,
      keyboardNavigation: true,
      checker: false,
    },
    performance: {
      debounceInputMs: 100,
      viewportOnlyScan: true,
    },
    spellcheck: {
      enabled: false,
      provider: 'browser',
      apiUrl: '',
    },
    language: {
      locale: 'en',
      direction: 'ltr',
    },
    contextMenu: {
      enabled: true,
    },
    contentConfig: {
      allowedTags: [],
      allowedAttributes: {},
      sanitize: true,
    },
    paste: {
      clean: true,
      keepFormatting: false,
      convertWord: true,
    },
    security: {
      sanitizeOnPaste: true,
      sanitizeOnInput: true,
    },
    statusbar: false,
  };

  /**
   * Resolve configuration from multiple sources with priority
   */
  static resolve(sources: ConfigSource): EditorConfigDefaults {
    const config: EditorConfigDefaults = {};
    
    // Start with editor defaults
    Object.assign(config, this.EDITOR_DEFAULTS);
    
    // Apply plugin defaults
    if (sources.pluginDefaults) {
      Object.assign(config, sources.pluginDefaults);
    }
    
    // Apply web component attributes
    if (sources.attributes) {
      const parsedAttributes = this.parseAttributes(sources.attributes);
      Object.assign(config, parsedAttributes);
    }
    
    // Apply explicit JS config (highest priority)
    if (sources.jsConfig) {
      Object.assign(config, sources.jsConfig);
    }

    return this.normalizeConfig(config);
  }

  /**
   * Normalize mixed legacy/new config shapes
   */
  private static normalizeConfig(config: EditorConfigDefaults): EditorConfigDefaults {
    const normalized = { ...config };

    // Bridge flattened toolbar attributes into toolbar object config.
    if (normalized.toolbarFloating !== undefined || normalized.toolbarSticky !== undefined) {
      const toolbarObject: Record<string, any> =
        typeof normalized.toolbar === 'object' && normalized.toolbar
          ? { ...(normalized.toolbar as Record<string, any>) }
          : typeof normalized.toolbar === 'string'
            ? { items: normalized.toolbar }
            : {};

      if (normalized.toolbarFloating !== undefined) {
        toolbarObject.floating = Boolean(normalized.toolbarFloating);
      }
      if (normalized.toolbarSticky !== undefined) {
        toolbarObject.sticky = Boolean(normalized.toolbarSticky);
      }

      normalized.toolbar = toolbarObject;
    }

    if (normalized.toolbarItems !== undefined && typeof normalized.toolbar === 'object' && normalized.toolbar) {
      (normalized.toolbar as Record<string, any>).items = normalized.toolbarItems;
    }

    // autosave: boolean -> object, and bridge flattened attributes.
    if (
      normalized.autosaveEnabled !== undefined ||
      normalized.autosaveIntervalMs !== undefined ||
      normalized.autosaveStorageKey !== undefined ||
      normalized.autosaveProvider !== undefined ||
      normalized.autosaveApiUrl !== undefined
    ) {
      const autosaveObject =
        typeof normalized.autosave === 'object' && normalized.autosave
          ? { ...(normalized.autosave as Record<string, any>) }
          : {};

      if (normalized.autosaveEnabled !== undefined) autosaveObject.enabled = Boolean(normalized.autosaveEnabled);
      if (normalized.autosaveIntervalMs !== undefined) autosaveObject.intervalMs = Number(normalized.autosaveIntervalMs);
      if (normalized.autosaveStorageKey !== undefined) autosaveObject.storageKey = normalized.autosaveStorageKey;
      if (normalized.autosaveProvider !== undefined) autosaveObject.provider = normalized.autosaveProvider;
      if (normalized.autosaveApiUrl !== undefined) autosaveObject.apiUrl = normalized.autosaveApiUrl;

      normalized.autosave = autosaveObject;
    }

    const autosaveDefault = {
      enabled: false,
      intervalMs: 30000,
      storageKey: 'rte-autosave',
      provider: 'localStorage' as const,
      apiUrl: '',
    };
    if (typeof normalized.autosave === 'boolean') {
      normalized.autosave = {
        ...autosaveDefault,
        enabled: normalized.autosave,
      };
    } else if (typeof normalized.autosave === 'object' && normalized.autosave) {
      const merged = {
        ...autosaveDefault,
        ...normalized.autosave,
      } as Record<string, any>;

      if (merged.intervalMs === undefined && merged.interval !== undefined) {
        merged.intervalMs = Number(merged.interval);
      }

      if (merged.enabled === undefined) {
        merged.enabled = true;
      }

      if (!Number.isFinite(merged.intervalMs) || merged.intervalMs <= 0) {
        merged.intervalMs = autosaveDefault.intervalMs;
      }

      normalized.autosave = merged;
    } else {
      normalized.autosave = autosaveDefault;
    }

    // language: string -> object
    if (normalized.languageLocale !== undefined || normalized.languageDirection !== undefined) {
      const languageObject =
        typeof normalized.language === 'object' && normalized.language
          ? { ...(normalized.language as Record<string, any>) }
          : {};

      if (normalized.languageLocale !== undefined) {
        languageObject.locale = normalized.languageLocale;
      }
      if (normalized.languageDirection !== undefined) {
        languageObject.direction = normalized.languageDirection;
      }

      normalized.language = languageObject;
    }

    const languageDefault = { locale: 'en', direction: 'ltr' as const };
    if (typeof normalized.language === 'string') {
      normalized.language = {
        locale: normalized.language,
        direction: languageDefault.direction,
      };
    } else if (typeof normalized.language === 'object' && normalized.language) {
      normalized.language = {
        ...languageDefault,
        ...normalized.language,
      };
    } else {
      normalized.language = languageDefault;
    }

    // spellcheck: boolean -> object, and infer enabled when object is provided
    if (
      normalized.spellcheckEnabled !== undefined ||
      normalized.spellcheckProvider !== undefined ||
      normalized.spellcheckApiUrl !== undefined
    ) {
      const spellcheckObject =
        typeof normalized.spellcheck === 'object' && normalized.spellcheck
          ? { ...(normalized.spellcheck as Record<string, any>) }
          : {};

      if (normalized.spellcheckEnabled !== undefined) {
        spellcheckObject.enabled = Boolean(normalized.spellcheckEnabled);
      }
      if (normalized.spellcheckProvider !== undefined) {
        spellcheckObject.provider = normalized.spellcheckProvider;
      }
      if (normalized.spellcheckApiUrl !== undefined) {
        spellcheckObject.apiUrl = normalized.spellcheckApiUrl;
      }

      normalized.spellcheck = spellcheckObject;
    }

    const spellcheckDefault = {
      enabled: false,
      provider: 'browser' as const,
      apiUrl: '',
    };
    if (typeof normalized.spellcheck === 'boolean') {
      normalized.spellcheck = {
        ...spellcheckDefault,
        enabled: normalized.spellcheck,
      };
    } else if (typeof normalized.spellcheck === 'object' && normalized.spellcheck) {
      const merged = {
        ...spellcheckDefault,
        ...normalized.spellcheck,
      } as Record<string, any>;

      if (!merged.provider && merged.mode) {
        merged.provider = merged.mode === 'local' ? 'browser' : 'api';
      }

      if (merged.enabled === undefined) {
        merged.enabled = Boolean(merged.mode || merged.provider || merged.apiUrl);
      }
      normalized.spellcheck = merged;
    } else {
      normalized.spellcheck = spellcheckDefault;
    }

    // contextMenu: boolean -> object
    if (normalized.contextMenuEnabled !== undefined) {
      normalized.contextMenu = {
        enabled: Boolean(normalized.contextMenuEnabled),
      };
    }

    if (typeof normalized.contextMenu === 'boolean') {
      normalized.contextMenu = { enabled: normalized.contextMenu };
    } else if (typeof normalized.contextMenu === 'object' && normalized.contextMenu) {
      normalized.contextMenu = {
        enabled: normalized.contextMenu.enabled !== false,
      };
    } else {
      normalized.contextMenu = { enabled: true };
    }

    // paste defaults
    if (
      normalized.pasteClean !== undefined ||
      normalized.pasteKeepFormatting !== undefined ||
      normalized.pasteConvertWord !== undefined
    ) {
      normalized.paste = {
        ...(normalized.paste || {}),
        ...(normalized.pasteClean !== undefined ? { clean: Boolean(normalized.pasteClean) } : {}),
        ...(normalized.pasteKeepFormatting !== undefined
          ? { keepFormatting: Boolean(normalized.pasteKeepFormatting) }
          : {}),
        ...(normalized.pasteConvertWord !== undefined
          ? { convertWord: Boolean(normalized.pasteConvertWord) }
          : {}),
      };
    }

    normalized.paste = {
      clean: true,
      keepFormatting: false,
      convertWord: true,
      ...(normalized.paste || {}),
    };

    // content config defaults
    normalized.contentConfig = {
      allowedTags: [],
      allowedAttributes: {},
      sanitize: true,
      ...(normalized.contentConfig || {}),
    };

    // security: bridge flattened attributes + defaults
    if (
      normalized.securitySanitizeOnPaste !== undefined ||
      normalized.securitySanitizeOnInput !== undefined
    ) {
      normalized.security = {
        ...(normalized.security || {}),
        ...(normalized.securitySanitizeOnPaste !== undefined
          ? { sanitizeOnPaste: Boolean(normalized.securitySanitizeOnPaste) }
          : {}),
        ...(normalized.securitySanitizeOnInput !== undefined
          ? { sanitizeOnInput: Boolean(normalized.securitySanitizeOnInput) }
          : {}),
      };
    }

    normalized.security = {
      sanitizeOnPaste: true,
      sanitizeOnInput: true,
      ...(normalized.security || {}),
    };

    // accessibility defaults + flattened attribute bridge
    if (
      normalized.accessibilityEnableAria !== undefined ||
      normalized.accessibilityKeyboardNavigation !== undefined ||
      normalized.accessibilityChecker !== undefined
    ) {
      normalized.accessibility = {
        ...(normalized.accessibility || {}),
        ...(normalized.accessibilityEnableAria !== undefined
          ? { enableARIA: Boolean(normalized.accessibilityEnableAria) }
          : {}),
        ...(normalized.accessibilityKeyboardNavigation !== undefined
          ? { keyboardNavigation: Boolean(normalized.accessibilityKeyboardNavigation) }
          : {}),
        ...(normalized.accessibilityChecker !== undefined
          ? { checker: Boolean(normalized.accessibilityChecker) }
          : {}),
      };
    }

    if (typeof normalized.accessibility === 'boolean') {
      normalized.accessibility = {
        enableARIA: normalized.accessibility,
        keyboardNavigation: normalized.accessibility,
        checker: false,
      };
    }

    normalized.accessibility = {
      enableARIA: true,
      keyboardNavigation: true,
      checker: false,
      ...(normalized.accessibility || {}),
    };

    // performance defaults + flattened attribute bridge
    if (
      normalized.performanceDebounceInputMs !== undefined ||
      normalized.performanceViewportOnlyScan !== undefined
    ) {
      normalized.performance = {
        ...(normalized.performance || {}),
        ...(normalized.performanceDebounceInputMs !== undefined
          ? { debounceInputMs: Number(normalized.performanceDebounceInputMs) }
          : {}),
        ...(normalized.performanceViewportOnlyScan !== undefined
          ? { viewportOnlyScan: Boolean(normalized.performanceViewportOnlyScan) }
          : {}),
      };
    }

    if (typeof normalized.performance === 'boolean') {
      normalized.performance = {
        debounceInputMs: 100,
        viewportOnlyScan: normalized.performance,
      };
    }

    normalized.performance = {
      debounceInputMs: 100,
      viewportOnlyScan: true,
      ...(normalized.performance || {}),
    };

    if (
      typeof (normalized.performance as any).debounceInputMs !== 'number' ||
      !Number.isFinite((normalized.performance as any).debounceInputMs) ||
      (normalized.performance as any).debounceInputMs < 0
    ) {
      (normalized.performance as any).debounceInputMs = 100;
    }

    return normalized;
  }

  /**
   * Parse web component attributes
   */
  private static parseAttributes(attributes: Record<string, string>): EditorConfigDefaults {
    const config: EditorConfigDefaults = {};
    
    for (const [key, value] of Object.entries(attributes)) {
      const camelKey = this.kebabToCamel(key);
      config[camelKey] = this.parseAttributeValue(value);
    }
    
    return config;
  }

  /**
   * Parse attribute value to appropriate type
   */
  private static parseAttributeValue(value: string): any {
    // Boolean
    if (value === 'true') return true;
    if (value === 'false') return false;
    
    // Number
    if (/^\d+$/.test(value)) return parseInt(value, 10);
    if (/^\d+\.\d+$/.test(value)) return parseFloat(value);
    
    // JSON
    if (value.startsWith('{') || value.startsWith('[')) {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    
    // String
    return value;
  }

  /**
   * Convert kebab-case to camelCase
   */
  private static kebabToCamel(str: string): string {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  /**
   * Validate configuration
   */
  static validate(config: EditorConfigDefaults): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Validate height
    if (config.height !== undefined) {
      if (typeof config.height === 'number' && config.height < 0) {
        errors.push('height must be a positive number');
      }
    }
    
    // Validate width
    if (config.width !== undefined) {
      if (typeof config.width === 'number' && config.width < 0) {
        errors.push('width must be a positive number');
      }
    }
    
    // Validate plugins
    if (config.plugins !== undefined) {
      if (!Array.isArray(config.plugins) && typeof config.plugins !== 'string') {
        errors.push('plugins must be an array or string');
      }
    }
    
    // Validate theme
    if (config.theme !== undefined) {
      if (typeof config.theme !== 'string') {
        errors.push('theme must be a string');
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get default configuration
   */
  static getDefaults(): EditorConfigDefaults {
    return { ...this.EDITOR_DEFAULTS };
  }

  /**
   * Merge configurations (deep merge)
   */
  static merge(...configs: EditorConfigDefaults[]): EditorConfigDefaults {
    const result: EditorConfigDefaults = {};
    
    for (const config of configs) {
      for (const [key, value] of Object.entries(config)) {
        if (value !== undefined && value !== null) {
          if (typeof value === 'object' && !Array.isArray(value) && result[key]) {
            // Deep merge objects
            result[key] = this.merge(result[key], value);
          } else {
            result[key] = value;
          }
        }
      }
    }
    
    return result;
  }
}
