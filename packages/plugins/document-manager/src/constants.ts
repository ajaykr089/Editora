import { PartialApiConfig, getGlobalApiConfig, getGlobalApiHeaders, buildApiUrl } from '../../src/shared-config';

/**
 * Document Manager Plugin Configuration
 *
 * This plugin communicates with external document processing APIs.
 * Configure your API endpoints using setDocumentManagerConfig().
 */

export interface DocumentManagerConfig extends PartialApiConfig {
  /** API endpoints relative to the base URL */
  apiEndpoints: {
    exportWord: string;
  };
  /** 
   * Enable client-side fallback for Word export when API is unavailable
   * @default true
   */
  useClientSideFallback?: boolean;
}

/**
 * Default configuration for development
 * IMPORTANT: Override this in production using setDocumentManagerConfig()
 * Note: apiUrl is inherited from global config, only override if needed
 */
export const DEFAULT_CONFIG: DocumentManagerConfig = {
  apiEndpoints: {
    exportWord: '/documents/export-word'
  },
  headers: {
    // Add default headers if needed (e.g., API key)
    // 'Authorization': 'Bearer YOUR_API_KEY',
    // 'X-API-Key': 'YOUR_API_KEY'
  },
  useClientSideFallback: true // Enable fallback by default
};

/**
 * Global configuration instance
 * Modify this using setDocumentManagerConfig() before using the plugin
 */
let globalConfig: DocumentManagerConfig = { ...DEFAULT_CONFIG };

/**
 * Configure the Document Manager plugin with your API settings
 *
 * @example
 * ```typescript
 * import { setDocumentManagerConfig } from '@editora/document-manager';
 *
 * // With API backend (recommended for production)
 * setDocumentManagerConfig({
 *   apiUrl: 'https://your-api.com',
 *   apiEndpoints: {
 *     exportWord: '/api/v1/documents/export-word'
 *   },
 *   headers: {
 *     'Authorization': 'Bearer YOUR_TOKEN',
 *     'X-API-Key': 'YOUR_API_KEY'
 *   },
 *   useClientSideFallback: true // Falls back to client-side if API fails
 * });
 *
 * // Client-side only (no backend required)
 * setDocumentManagerConfig({
 *   useClientSideFallback: true,
 *   apiUrl: '' // Empty to trigger immediate fallback
 * });
 * ```
 *
 * @param config - Configuration object with API URLs and endpoints
 */
export function setDocumentManagerConfig(config: Partial<DocumentManagerConfig>): void {
  globalConfig = { ...globalConfig, ...config };
}

/**
 * Get the current global configuration
 * @returns Current configuration object
 */
export function getDocumentManagerConfig(): DocumentManagerConfig {
  return { ...globalConfig };
}

/**
 * Get the full API URL for a specific endpoint
 * @param endpoint - The endpoint key
 * @returns Full URL for the endpoint
 */
export function getApiUrl(endpoint: keyof DocumentManagerConfig['apiEndpoints']): string {
  const config = getDocumentManagerConfig();
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
  const pluginConfig = getDocumentManagerConfig();
  const pluginHeaders = pluginConfig.headers || {};

  // Plugin-specific headers take precedence over global headers
  return { ...globalHeaders, ...pluginHeaders };
}
