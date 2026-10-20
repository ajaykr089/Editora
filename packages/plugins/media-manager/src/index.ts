export { MediaManagerPlugin } from './MediaManagerPlugin.native';
export { setMediaManagerConfig, getMediaManagerConfig } from './constants';
export {
  createBase64Provider,
  createCallbackProvider,
  createRestProvider,
  MediaUploadError,
} from './providers';
export type {
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
