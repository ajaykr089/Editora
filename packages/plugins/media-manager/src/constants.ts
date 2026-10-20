import {
  getGlobalApiConfig,
  getGlobalApiHeaders,
  buildApiUrl,
} from "../../src/shared-config";
import type { MediaManagerConfig } from "./types/media";

/**
 * Media Manager Plugin Configuration
 *
 * Without any configuration the plugin keeps files in the document as data URLs. To store them on a server,
 * give it an `uploadHandler`, a complete `provider`, or a REST backend through `setMediaManagerConfig()`.
 */

export const DEFAULT_ENDPOINTS: NonNullable<MediaManagerConfig["apiEndpoints"]> = {
  upload: "/media/upload",
  library: "/media/library",
  delete: "/media/library",
};

/** What the plugin accepts when nothing else is said. `image/*` style wildcards are understood. */
export const DEFAULT_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
  "video/ogg",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/mp4",
  "audio/aac",
  "audio/webm",
];

export const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Default configuration for development
 * IMPORTANT: Override this in production using setMediaManagerConfig()
 * Note: apiUrl is inherited from global config, only override if needed
 */
export const DEFAULT_CONFIG: MediaManagerConfig = {
  apiEndpoints: { ...DEFAULT_ENDPOINTS },
  maxFileSize: DEFAULT_MAX_FILE_SIZE,
  allowedTypes: [...DEFAULT_ALLOWED_TYPES],
  headers: {},
};

/**
 * Global configuration instance
 * Modify this using setMediaManagerConfig() before using the plugin
 */
let globalConfig: MediaManagerConfig = { ...DEFAULT_CONFIG };

/**
 * Configure the Media Manager plugin.
 *
 * @example
 * ```typescript
 * import { setMediaManagerConfig } from '@editora/media-manager';
 *
 * // A REST backend
 * setMediaManagerConfig({
 *   apiUrl: 'https://your-api.com',
 *   apiEndpoints: { upload: '/api/v1/media/upload', library: '/api/v1/media/library', delete: '/api/v1/media/library' },
 *   maxFileSize: 50 * 1024 * 1024,
 *   headers: { Authorization: 'Bearer YOUR_TOKEN' },
 * });
 *
 * // Or just a function
 * setMediaManagerConfig({
 *   uploadHandler: async (file, { onProgress, signal }) => (await myUpload(file, onProgress, signal)).url,
 * });
 * ```
 *
 * Settings are merged into what was set before, `apiEndpoints` one key at a time.
 */
export function setMediaManagerConfig(
  config: Partial<MediaManagerConfig>,
): void {
  globalConfig = {
    ...globalConfig,
    ...config,
    apiEndpoints: { ...DEFAULT_ENDPOINTS, ...globalConfig.apiEndpoints, ...config.apiEndpoints },
  };
}

/**
 * Get the current global configuration
 * @returns Current configuration object
 */
export function getMediaManagerConfig(): MediaManagerConfig {
  return { ...globalConfig, apiEndpoints: { ...DEFAULT_ENDPOINTS, ...globalConfig.apiEndpoints } };
}

/**
 * The settings in force for one use: the global ones, with whatever the plugin was created with on top.
 */
export function resolveMediaManagerConfig(overrides?: Partial<MediaManagerConfig>): MediaManagerConfig {
  const base = getMediaManagerConfig();
  if (!overrides) return base;
  return {
    ...base,
    ...overrides,
    apiEndpoints: { ...base.apiEndpoints!, ...overrides.apiEndpoints },
    headers: { ...base.headers, ...overrides.headers },
  };
}

/**
 * Get the full API URL for a specific endpoint
 * @param endpoint - The endpoint key
 * @returns Full URL for the endpoint, or an empty string when no API is configured
 */
export function getApiUrl(
  endpoint: keyof NonNullable<MediaManagerConfig["apiEndpoints"]>,
  config: MediaManagerConfig = getMediaManagerConfig(),
): string {
  // `??`, not `||`: an empty apiUrl set on the plugin means "no API" and must not fall back to the global one.
  const apiUrl = config.apiUrl ?? getGlobalApiConfig().apiUrl;
  return buildApiUrl(apiUrl, (config.apiEndpoints ?? DEFAULT_ENDPOINTS)[endpoint]);
}

/**
 * Get headers for API requests
 * @returns Headers object for fetch requests (combines global and plugin-specific headers)
 */
export function getApiHeaders(config: MediaManagerConfig = getMediaManagerConfig()): Record<string, string> {
  // Plugin-specific headers take precedence over global headers
  return { ...getGlobalApiHeaders(), ...(config.headers || {}) };
}
