import { Dialog } from '../Dialog';

export interface ImageDialogConfig {
  onSubmit: (data: { src: string; alt: string; width?: string; height?: string }) => void;
  onCancel?: () => void;
  allowUpload?: boolean;
  uploadUrl?: string;
}

/**
 * Native image insertion dialog
 * Framework-agnostic implementation using HTML <dialog>
 */
export class ImageDialog {
  private dialog: Dialog;
  private config: ImageDialogConfig;

  constructor(config: ImageDialogConfig) {
    this.config = config;
    const { onSubmit, onCancel } = config;

    this.dialog = new Dialog({
      title: 'Insert Image',
      content: this.createFormHTML(),
      onSubmit: (formData) => {
        const src = (formData.get('src') as string || '').trim();
        const alt = (formData.get('alt') as string || '').trim();
        const width = (formData.get('width') as string || '').trim();
        const height = (formData.get('height') as string || '').trim();

        if (!src) {
          alert('Please enter an image URL or upload an image');
          return;
        }

        onSubmit({ 
          src, 
          alt, 
          width: width || undefined, 
          height: height || undefined 
        });
        this.dialog.close();
      },
      onCancel: () => {
        onCancel?.();
        this.dialog.close();
      },
      width: '500px'
    });
  }

  private createFormHTML(): string {
    const uploadSection = this.config.allowUpload ? `
      <div class="form-group">
        <label for="image-upload">Upload Image</label>
        <input 
          type="file" 
          id="image-upload"
          accept="image/*"
        />
        <small>Or upload an image from your computer</small>
      </div>
      <div class="form-divider">OR</div>
    ` : '';

    return `
      <form class="image-dialog-form">
        ${uploadSection}

        <div class="form-group">
          <label for="image-src">Image URL</label>
          <input 
            type="url" 
            id="image-src"
            name="src" 
            placeholder="https://example.com/image.jpg"
            ${!this.config.allowUpload ? 'required autofocus' : ''}
          />
          <small>Enter the web address (URL) of the image</small>
        </div>

        <div class="form-group">
          <label for="image-alt">Alt Text</label>
          <input 
            type="text" 
            id="image-alt"
            name="alt" 
            placeholder="Description of the image"
          />
          <small>Alternative text for accessibility (recommended)</small>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="image-width">Width</label>
            <input 
              type="text" 
              id="image-width"
              name="width" 
              placeholder="auto"
            />
          </div>

          <div class="form-group">
            <label for="image-height">Height</label>
            <input 
              type="text" 
              id="image-height"
              name="height" 
              placeholder="auto"
            />
          </div>
        </div>

        <div class="image-preview" id="image-preview" style="display: none;">
          <strong>Preview:</strong>
          <img id="preview-img" style="max-width: 100%; max-height: 200px; margin-top: 8px;" />
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" data-action="cancel">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            Insert Image
          </button>
        </div>
      </form>
    `;
  }

  public show(): void {
    this.dialog.show();
    this.attachImagePreview();
    this.attachFileUpload();
  }

  public close(): void {
    this.dialog.close();
  }

  private attachImagePreview(): void {
    const form = document.querySelector('.image-dialog-form');
    if (!form) return;

    const srcInput = form.querySelector('#image-src') as HTMLInputElement;
    const previewContainer = form.querySelector('#image-preview') as HTMLElement;
    const previewImg = form.querySelector('#preview-img') as HTMLImageElement;

    srcInput?.addEventListener('input', () => {
      const url = srcInput.value.trim();
      if (url && this.isValidImageUrl(url)) {
        previewImg.src = url;
        previewContainer.style.display = 'block';
        previewImg.onerror = () => {
          previewContainer.style.display = 'none';
        };
      } else {
        previewContainer.style.display = 'none';
      }
    });
  }

  private attachFileUpload(): void {
    if (!this.config.allowUpload) return;

    const form = document.querySelector('.image-dialog-form');
    if (!form) return;

    const fileInput = form.querySelector('#image-upload') as HTMLInputElement;
    const srcInput = form.querySelector('#image-src') as HTMLInputElement;

    fileInput?.addEventListener('change', async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // For now, convert to data URL (base64)
      // In production, this should upload to uploadUrl
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        srcInput.value = dataUrl;
        srcInput.dispatchEvent(new Event('input'));
      };
      reader.readAsDataURL(file);
    });
  }

  private isValidImageUrl(url: string): boolean {
    try {
      new URL(url);
      return /\.(jpg|jpeg|png|gif|svg|webp|bmp)$/i.test(url) || url.startsWith('data:image/');
    } catch {
      return false;
    }
  }
}
