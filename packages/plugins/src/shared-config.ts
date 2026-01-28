/**
 * Shared API Configuration for Rich Text Editor Plugins
 *
 * This file provides common configuration interfaces and utilities
 * for plugins that communicate with external APIs.
 */

export interface ApiConfig {
  /** Base URL of the API */
  apiUrl: string;
  /** Optional headers for API requests (e.g., authentication) */
  headers?: Record<string, string>;
}

/**
 * Partial API config for plugins that can inherit from global config
 */
export interface PartialApiConfig extends Partial<ApiConfig> {}

/**
 * Default API configuration
 * IMPORTANT: Override this in production using plugin-specific configuration functions
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  apiUrl: "http://localhost:3001/api/", // Replace with your production API URL
  headers: {
    // Add default headers if needed (e.g., API key)
    // 'Authorization': 'Bearer YOUR_API_KEY',
    // 'X-API-Key': 'YOUR_API_KEY'
  },
};

/**
 * Global API configuration instance
 * This can be modified by users to customize API settings for all plugins
 */
let globalApiConfig: ApiConfig = { ...DEFAULT_API_CONFIG };

/**
 * Set the global API configuration for all plugins
 *
 * @example
 * ```typescript
 * import { setGlobalApiConfig } from '@editora/plugins';
 *
 * setGlobalApiConfig({
 *   apiUrl: 'https://your-api.com',
 *   headers: {
 *     'Authorization': 'Bearer YOUR_TOKEN',
 *     'X-API-Key': 'YOUR_API_KEY'
 *   }
 * });
 * ```
 *
 * @param config - Global API configuration
 */
export function setGlobalApiConfig(config: Partial<ApiConfig>): void {
  globalApiConfig = { ...globalApiConfig, ...config };
}

/**
 * Get the current global API configuration
 * @returns Current global API configuration
 */
export function getGlobalApiConfig(): ApiConfig {
  return { ...globalApiConfig };
}

/**
 * Get headers for API requests
 * @returns Headers object for fetch requests
 */
export function getGlobalApiHeaders(): Record<string, string> {
  const config = getGlobalApiConfig();
  return config.headers || {};
}

/**
 * Create a full API URL from base URL and path
 * @param baseUrl - Base API URL
 * @param path - API endpoint path
 * @returns Full API URL
 */
export function buildApiUrl(baseUrl: string, path: string): string {
  // Remove trailing slash from baseUrl and leading slash from path
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const cleanPath = path.replace(/^\//, '');
  return `${cleanBaseUrl}/${cleanPath}`;
}
