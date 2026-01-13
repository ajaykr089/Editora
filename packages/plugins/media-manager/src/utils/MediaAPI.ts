import { MediaManagerConfig, MediaUploadResponse, MediaLibraryItem } from '../types/media';

export class MediaAPI {
  private config: MediaManagerConfig;

  constructor(config: MediaManagerConfig) {
    this.config = config;
  }

  async upload(file: File): Promise<MediaUploadResponse> {
    if (file.size > this.config.maxFileSize) {
      throw new Error(`File size exceeds ${this.config.maxFileSize} bytes`);
    }

    if (!this.config.allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} not allowed`);
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(this.config.uploadUrl, {
      method: 'POST',
      headers: this.config.headers,
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  async fetchLibrary(page = 1, limit = 20): Promise<{ items: MediaLibraryItem[]; total: number }> {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));

    const response = await fetch(`${this.config.libraryUrl}?${params.toString()}`, {
      headers: this.config.headers
    });

    if (!response.ok) {
      throw new Error(`Fetch library failed: ${response.statusText}`);
    }

    return response.json();
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.config.libraryUrl}/${id}`, {
      method: 'DELETE',
      headers: this.config.headers
    });

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.statusText}`);
    }
  }
}
