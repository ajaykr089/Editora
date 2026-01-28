import {
  PartialApiConfig,
  getGlobalApiConfig,
  getGlobalApiHeaders,
  buildApiUrl,
} from "../../src/shared-config";

/**
 * Media Manager Plugin Configuration
 *
 * This plugin communicates with external media management APIs.
 * Configure your API endpoints using setMediaManagerConfig().
 */

export interface MediaManagerConfig extends PartialApiConfig {
  /** API endpoints relative to the base URL */
  apiEndpoints: {
    upload: string;
    library: string;
    delete: string;
  };
  /** Maximum file size in bytes */
  maxFileSize: number;
  /** Allowed MIME types */
  allowedTypes: string[];
}

/**
 * Default configuration for development
 * IMPORTANT: Override this in production using setMediaManagerConfig()
 * Note: apiUrl is inherited from global config, only override if needed
 */
export const DEFAULT_CONFIG: MediaManagerConfig = {
  apiEndpoints: {
    upload: "/media/upload",
    library: "/media/library",
    delete: "/media/library",
  },
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "video/mp4",
    "video/webm",
  ],
  headers: {
    // Add default headers if needed (e.g., API key)
    // 'Authorization': 'Bearer YOUR_API_KEY',
    // 'X-API-Key': 'YOUR_API_KEY'
  },
};

/**
 * Global configuration instance
 * Modify this using setMediaManagerConfig() before using the plugin
 */
let globalConfig: MediaManagerConfig = { ...DEFAULT_CONFIG };

/**
 * Configure the Media Manager plugin with your API settings
 *
 * @example
 * ```typescript
 * import { setMediaManagerConfig } from '@editora/media-manager';
 *
 * setMediaManagerConfig({
 *   apiUrl: 'https://your-api.com',
 *   apiEndpoints: {
 *     upload: '/api/v1/media/upload',
 *     library: '/api/v1/media/library',
 *     delete: '/api/v1/media/library'
 *   },
 *   maxFileSize: 50 * 1024 * 1024, // 50MB
 *   allowedTypes: ['image/jpeg', 'image/png', 'video/mp4'],
 *   headers: {
 *     'Authorization': 'Bearer YOUR_TOKEN',
 *     'X-API-Key': 'YOUR_API_KEY'
 *   }
 * });
 * ```
 *
 * @param config - Configuration object with API URLs and endpoints
 */
export function setMediaManagerConfig(
  config: Partial<MediaManagerConfig>,
): void {
  globalConfig = { ...globalConfig, ...config };
}

/**
 * Get the current global configuration
 * @returns Current configuration object
 */
export function getMediaManagerConfig(): MediaManagerConfig {
  return { ...globalConfig };
}

/**
 * Get the full API URL for a specific endpoint
 * @param endpoint - The endpoint key
 * @returns Full URL for the endpoint
 */
export function getApiUrl(
  endpoint: keyof MediaManagerConfig["apiEndpoints"],
): string {
  const config = getMediaManagerConfig();
  const globalConfig = getGlobalApiConfig();
  const apiUrl = config.apiUrl || globalConfig.apiUrl;
  return buildApiUrl(apiUrl, config.apiEndpoints[endpoint]);
}

/**
 * Get headers for API requests
 * @returns Headers object for fetch requests (combines global and plugin-specific headers)
 */
export function getApiHeaders(): Record<string, string> {
  const globalHeaders = getGlobalApiHeaders();
  const pluginConfig = getMediaManagerConfig();
  const pluginHeaders = pluginConfig.headers || {};

  // Plugin-specific headers take precedence over global headers
  return { ...globalHeaders, ...pluginHeaders };
}
