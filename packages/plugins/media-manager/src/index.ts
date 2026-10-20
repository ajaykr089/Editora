export { MediaManagerPlugin } from './MediaManagerPlugin.native';
export { setMediaManagerConfig, getMediaManagerConfig } from './constants';
export { mediaSlashItems } from './slashItems';
export {
  createBase64Provider,
  createCallbackProvider,
  createRestProvider,
  MediaUploadError,
} from './providers';
export { parseEmbedUrl, youtube, vimeo } from './embeds/providers';
export type { EmbedProvider, EmbedSpec } from './embeds/providers';
export type {
  AltTextGenerator,
  StockPhoto,
  StockProvider,
  MediaItem,
  MediaManagerConfig,
  MediaPage,
  MediaProvider,
  MediaQuery,
  MediaUpdate,
  MediaUploadHandler,
  UploadContext,
  UploadProgress,
} from './types/media';
