export interface MediaSource {
  url: string;
  type: 'image' | 'video';
  width?: number;
  height?: number;
  alt?: string;
  title?: string;
  caption?: string;
}

export interface ImageAttrs {
  src: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
}

export interface VideoAttrs {
  src: string;
  poster?: string;
  width?: number;
  height?: number;
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
}

export interface MediaUploadResponse {
  url: string;
  thumbnailUrl?: string;
  width: number;
  height: number;
  size: number;
  mimeType: string;
}

export interface MediaLibraryItem {
  id: string;
  url: string;
  thumbnailUrl: string;
  type: 'image' | 'video';
  name: string;
  size: number;
  width: number;
  height: number;
  createdAt: string;
  folder_id?: string | null;
}

export interface MediaManagerConfig {
  uploadUrl: string;
  libraryUrl: string;
  maxFileSize: number;
  allowedTypes: string[];
  headers?: Record<string, string>;
}
