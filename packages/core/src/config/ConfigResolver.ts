/**
 * ConfigResolver - Configuration resolution with priority handling
 * Priority: Explicit JS config > Web Component attributes > Plugin defaults > Editor defaults
 */

export interface EditorConfigDefaults {
  height?: number | string;
  width?: number | string;
  readonly?: boolean;
  disabled?: boolean;
  menubar?: boolean;
  toolbar?: string | boolean;
  plugins?: string | string[];
  theme?: string;
  content?: string;
  placeholder?: string;
  autofocus?: boolean;
  autosave?: boolean | { interval?: number };
  spellcheck?: boolean | { mode?: 'local' | 'api' | 'hybrid'; apiUrl?: string };
  language?: string;
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
    spellcheck: false,
    language: 'en',
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
    
    return config;
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
