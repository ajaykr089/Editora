/**
 * Advanced image manipulation engine
 * Uses Canvas API for transformations
 */

export interface ImageTransformOptions {
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
    aspectRatio?: number;
  };
  resize?: {
    width?: number;
    height?: number;
    maintainAspect?: boolean;
  };
  rotate?: {
    degrees: number; // 90, 180, 270
  };
  flip?: {
    horizontal?: boolean;
    vertical?: boolean;
  };
  compress?: {
    quality: number; // 0-1
    format?: 'jpeg' | 'png' | 'webp';
  };
}

export class ImageManipulator {
  /**
   * Load image from URL or File
   */
  static async loadImage(source: string | File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));

      if (typeof source === 'string') {
        img.src = source;
      } else {
        img.src = URL.createObjectURL(source);
      }
    });
  }

  /**
   * Apply transformations to image
   */
  static async transform(
    source: string | File,
    options: ImageTransformOptions
  ): Promise<Blob> {
    const img = await this.loadImage(source);
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d')!;

    canvas.width = img.width;
    canvas.height = img.height;

    // Draw original image
    ctx.drawImage(img, 0, 0);

    // Apply crop
    if (options.crop) {
      canvas = this.applyCrop(canvas, img, options.crop);
      ctx = canvas.getContext('2d')!;
    }

    // Apply resize
    if (options.resize) {
      canvas = this.applyResize(canvas, options.resize);
      ctx = canvas.getContext('2d')!;
    }

    // Apply rotation
    if (options.rotate) {
      canvas = this.applyRotate(canvas, options.rotate.degrees);
      ctx = canvas.getContext('2d')!;
    }

    // Apply flip
    if (options.flip) {
      canvas = this.applyFlip(canvas, options.flip);
      ctx = canvas.getContext('2d')!;
    }

    // Apply compression
    const format = options.compress?.format || 'jpeg';
    const quality = options.compress?.quality ?? 0.8;

    return new Promise(resolve => {
      canvas.toBlob(
        blob => {
          if (!blob) throw new Error('Canvas conversion failed');
          resolve(blob);
        },
        `image/${format}`,
        quality
      );
    });
  }

  /**
   * Generate thumbnail
   */
  static async generateThumbnail(
    source: string | File,
    maxSize: number = 200
  ): Promise<Blob> {
    const img = await this.loadImage(source);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // Calculate thumbnail dimensions
    const ratio = img.width / img.height;
    const width = ratio > 1 ? maxSize : maxSize * ratio;
    const height = ratio > 1 ? maxSize / ratio : maxSize;

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);

    return new Promise(resolve => {
      canvas.toBlob(blob => {
        if (!blob) throw new Error('Thumbnail generation failed');
        resolve(blob);
      }, 'image/jpeg', 0.7);
    });
  }

  /**
   * Generate responsive variants
   */
  static async generateVariants(
    source: string | File,
    sizes: number[] = [320, 640, 1024]
  ): Promise<Map<number, Blob>> {
    const variants = new Map<number, Blob>();

    for (const size of sizes) {
      const variant = await this.transform(source, {
        resize: { width: size, maintainAspect: true }
      });
      variants.set(size, variant);
    }

    return variants;
  }

  private static applyCrop(
    canvas: HTMLCanvasElement,
    img: HTMLImageElement,
    crop: ImageTransformOptions['crop']
  ): HTMLCanvasElement {
    if (!crop) return canvas;

    const newCanvas = document.createElement('canvas');
    const ctx = newCanvas.getContext('2d')!;

    newCanvas.width = crop.width;
    newCanvas.height = crop.height;

    ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

    return newCanvas;
  }

  private static applyResize(
    canvas: HTMLCanvasElement,
    resize: ImageTransformOptions['resize']
  ): HTMLCanvasElement {
    if (!resize) return canvas;

    const { width, height, maintainAspect } = resize;
    const newCanvas = document.createElement('canvas');
    const ctx = newCanvas.getContext('2d')!;

    let newWidth = width || canvas.width;
    let newHeight = height || canvas.height;

    if (maintainAspect && width && height) {
      const ratio = canvas.width / canvas.height;
      if (ratio > width / height) {
        newHeight = newWidth / ratio;
      } else {
        newWidth = newHeight * ratio;
      }
    } else if (maintainAspect && width) {
      newHeight = newWidth / (canvas.width / canvas.height);
    } else if (maintainAspect && height) {
      newWidth = newHeight * (canvas.width / canvas.height);
    }

    newCanvas.width = newWidth;
    newCanvas.height = newHeight;

    ctx.drawImage(canvas, 0, 0, newWidth, newHeight);
    return newCanvas;
  }

  private static applyRotate(canvas: HTMLCanvasElement, degrees: number): HTMLCanvasElement {
    const newCanvas = document.createElement('canvas');
    const ctx = newCanvas.getContext('2d')!;

    const radians = (degrees * Math.PI) / 180;
    const sin = Math.abs(Math.sin(radians));
    const cos = Math.abs(Math.cos(radians));

    newCanvas.width = Math.floor(canvas.width * cos + canvas.height * sin);
    newCanvas.height = Math.floor(canvas.width * sin + canvas.height * cos);

    ctx.translate(newCanvas.width / 2, newCanvas.height / 2);
    ctx.rotate(radians);
    ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

    return newCanvas;
  }

  private static applyFlip(
    canvas: HTMLCanvasElement,
    flip: ImageTransformOptions['flip']
  ): HTMLCanvasElement {
    const newCanvas = document.createElement('canvas');
    const ctx = newCanvas.getContext('2d')!;

    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;

    ctx.save();

    if (flip.horizontal) {
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
    }

    if (flip.vertical) {
      ctx.scale(1, -1);
      ctx.translate(0, -canvas.height);
    }

    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    return newCanvas;
  }
}
