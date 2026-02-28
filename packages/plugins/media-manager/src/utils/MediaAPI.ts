import { MediaManagerConfig, MediaUploadResponse, MediaLibraryItem } from '../types/media';
import { buildApiUrl, getGlobalApiConfig } from '../../../src/shared-config';

export class MediaAPI {
  private config: MediaManagerConfig;

  constructor(config: MediaManagerConfig) {
    this.config = config;
  }

  /**
   * Convert file to base64 data URL
   */
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Get image dimensions from file
   */
  private async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.onerror = () => {
          resolve({ width: 0, height: 0 });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  private getHeaders(): Record<string, string> {
    return this.config.storage?.headers || {};
  }

  private getApiUrl(): string {
    return this.config.storage?.apiUrl || getGlobalApiConfig().apiUrl;
  }

  async upload(file: File): Promise<MediaUploadResponse> {
    if (file.size > this.config.maxFileSize) {
      throw new Error(`File size exceeds ${this.config.maxFileSize} bytes`);
    }

    if (!this.config.allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} not allowed`);
    }

    // If forced to use base64, skip server upload
    if (this.config.offline?.useBase64Permanently) {
      const dataUrl = await this.fileToBase64(file);
      const dimensions = await this.getImageDimensions(file);
      return {
        url: dataUrl,
        width: dimensions.width,
        height: dimensions.height,
        size: file.size,
        mimeType: file.type,
        thumbnailUrl: dataUrl
      };
    }

    // DEFAULT: Try base64/offline first (offline-first strategy)
    // Try custom upload URL if provided
    if (this.config.offline?.customUploadUrl) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', file.name);

        const response = await fetch(this.config.offline.customUploadUrl, {
          method: 'POST',
          headers: this.config.offline.customUploadHeaders || {},
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          // Expected response: { url: string, width?: number, height?: number }
          const dimensions = data.width && data.height
            ? { width: data.width, height: data.height }
            : await this.getImageDimensions(file);
          
          return {
            url: data.url,
            width: dimensions.width,
            height: dimensions.height,
            size: file.size,
            mimeType: file.type,
            thumbnailUrl: data.thumbnailUrl || data.url
          };
        }
      } catch (error) {
        console.warn('Custom upload failed, trying base64:', error);
        const dataUrl = await this.fileToBase64(file);
        const dimensions = await this.getImageDimensions(file);
        return {
          url: dataUrl,
          width: dimensions.width,
          height: dimensions.height,
          size: file.size,
          mimeType: file.type,
          thumbnailUrl: dataUrl
        };
      }
    }

    // If no custom server, use base64 directly (offline-first default)
    const dataUrl = await this.fileToBase64(file);
    const dimensions = await this.getImageDimensions(file);
    
    // Optionally try API upload if configured and offline not disabled
    if (this.config.apiEndpoints?.upload && this.config.offline?.enabled !== false) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const uploadUrl = buildApiUrl(this.getApiUrl(), this.config.apiEndpoints.upload);
        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: this.getHeaders(),
          body: formData
        });

        if (response.ok) {
          return response.json();
        }
      } catch (error) {
        console.warn('API upload optional, returning base64:', error);
      }
    }

    // Return base64 as default fallback
    return {
      url: dataUrl,
      width: dimensions.width,
      height: dimensions.height,
      size: file.size,
      mimeType: file.type,
      thumbnailUrl: dataUrl
    };
  }

  async fetchLibrary(page = 1, limit = 20): Promise<{ items: MediaLibraryItem[]; total: number }> {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));

    const libraryUrl = buildApiUrl(this.getApiUrl(), this.config.apiEndpoints.library);
    const response = await fetch(`${libraryUrl}?${params.toString()}`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Fetch library failed: ${response.statusText}`);
    }

    return response.json();
  }

  async delete(id: string): Promise<void> {
    const libraryUrl = buildApiUrl(this.getApiUrl(), this.config.apiEndpoints.library);
    const deleteUrl = `${libraryUrl}/${id}`;

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.statusText}`);
    }
  }

  async fetchFolders(): Promise<any[]> {
    const foldersUrl = buildApiUrl(this.getApiUrl(), 'media/folders');
    const response = await fetch(foldersUrl, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Fetch folders failed: ${response.statusText}`);
    }

    return response.json();
  }

  async createFolder(name: string, parentId?: string | null): Promise<any> {
    const foldersUrl = buildApiUrl(this.getApiUrl(), 'media/folders');
    const response = await fetch(foldersUrl, {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        parent_id: parentId || null
      })
    });

    if (!response.ok) {
      throw new Error(`Create folder failed: ${response.statusText}`);
    }

    return response.json();
  }

  async updateMedia(id: string, updates: Record<string, any>): Promise<void> {
    const libraryUrl = buildApiUrl(this.getApiUrl(), this.config.apiEndpoints.library);
    const updateUrl = `${libraryUrl}/${id}`;

    const response = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        ...this.getHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error(`Update media failed: ${response.statusText}`);
    }
  }
}
