import { StorageProvider, MediaItem, MediaManagerConfig } from '../../types/media';

/**
 * API-backed storage provider
 */
export class ApiStorage implements StorageProvider {
  private config: MediaManagerConfig;
  private baseUrl: string;

  constructor(config: MediaManagerConfig) {
    this.config = config;
    this.baseUrl = config.storage?.apiUrl || '/api/media';
  }

  async upload(file: File): Promise<MediaItem> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      body: formData,
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return this.mapToMediaItem(data);
  }

  async list(filter?: { type?: string; limit?: number }): Promise<MediaItem[]> {
    const params = new URLSearchParams();
    if (filter?.type) params.append('type', filter.type);
    if (filter?.limit) params.append('limit', filter.limit.toString());

    const response = await fetch(`${this.baseUrl}/list?${params}`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch library: ${response.statusText}`);
    }

    const data = await response.json();
    return (data.items || []).map(item => this.mapToMediaItem(item));
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to delete media: ${response.statusText}`);
    }
  }

  async get(id: string): Promise<MediaItem | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) return null;

      const data = await response.json();
      return this.mapToMediaItem(data);
    } catch {
      return null;
    }
  }

  async update(id: string, updates: Partial<MediaItem>): Promise<MediaItem> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error(`Failed to update media: ${response.statusText}`);
    }

    const data = await response.json();
    return this.mapToMediaItem(data);
  }

  private mapToMediaItem(data: any): MediaItem {
    return {
      id: data.id,
      name: data.name || 'Untitled',
      type: data.type || 'file',
      src: data.src || data.url,
      size: data.size || 0,
      width: data.width,
      height: data.height,
      duration: data.duration,
      mime: data.mime || data.mimeType || '',
      createdAt: data.createdAt ? new Date(data.createdAt).getTime() : Date.now(),
      metadata: data.metadata || {},
      thumbnailUrl: data.thumbnailUrl
    };
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      ...this.config.storage?.headers
    };
    return headers;
  }
}
