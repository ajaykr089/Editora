import { getApiHeaders, getApiUrl, resolveMediaManagerConfig } from '../constants';
import type { MediaManagerConfig, MediaProvider } from '../types/media';
import { createBase64Provider } from './base64';
import { createCallbackProvider } from './callback';
import { createRestProvider } from './rest';

export { createBase64Provider } from './base64';
export { createCallbackProvider } from './callback';
export { createRestProvider, mediaItemFromResponse } from './rest';
export { MediaUploadError, isAbort } from './errors';

/**
 * Picks where files go: an explicit `provider`, else the `uploadHandler`, else a REST backend when an API URL is
 * configured, else the document itself (data URLs).
 */
export const resolveProvider = (config: MediaManagerConfig = resolveMediaManagerConfig()): MediaProvider => {
  if (config.provider) return config.provider;
  if (config.uploadHandler) return createCallbackProvider(config.uploadHandler);

  const uploadUrl = getApiUrl('upload', config);
  if (uploadUrl) {
    return createRestProvider({
      uploadUrl,
      libraryUrl: getApiUrl('library', config),
      deleteUrl: getApiUrl('delete', config),
      headers: () => getApiHeaders(config),
      withCredentials: config.withCredentials,
      fieldName: config.uploadFieldName,
    });
  }
  return createBase64Provider();
};
