interface ResizeHandle {
  element: HTMLElement;
  position: 'nw' | 'ne' | 'sw' | 'se';
}

export class ImageResizer {
  private currentMedia: HTMLImageElement | HTMLVideoElement | null = null;
  private handles: ResizeHandle[] = [];
  private isResizing = false;
  private currentHandle: ResizeHandle | null = null;
  private startX = 0;
  private startY = 0;
  private startWidth = 0;
  private startHeight = 0;
  private aspectRatio = 1;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.init();
  }

  private init() {
    // Create resize handles
    const positions: Array<'nw' | 'ne' | 'sw' | 'se'> = ['nw', 'ne', 'sw', 'se'];
    positions.forEach(pos => {
      const handle = document.createElement('div');
      handle.className = `image-resize-handle image-resize-handle-${pos}`;
      handle.style.position = 'absolute';
      handle.style.width = '8px';
      handle.style.height = '8px';
      handle.style.background = '#007bff';
      handle.style.border = '1px solid white';
      handle.style.borderRadius = '50%';
      handle.style.cursor = `${pos}-resize`;
      handle.style.zIndex = '1000';
      handle.style.display = 'none';

      handle.addEventListener('mousedown', (e) => this.startResize(e, pos));
      this.handles.push({ element: handle, position: pos });
      document.body.appendChild(handle);
    });

    // Listen for media selection
    this.container.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        this.selectMedia(target as HTMLImageElement);
      } else if (target.tagName === 'VIDEO') {
        this.selectMedia(target as HTMLVideoElement);
      } else {
        this.deselectMedia();
      }
    });

    // Global mouse events for resizing
    document.addEventListener('mousemove', (e) => this.resize(e));
    document.addEventListener('mouseup', () => this.stopResize());
  }

  private selectMedia(media: HTMLImageElement | HTMLVideoElement) {
    this.deselectMedia();
    this.currentMedia = media;

    // Add selected class for styling
    media.classList.add('image-selected');

    // Calculate aspect ratio (for images, use natural dimensions; for videos, use current dimensions)
    if (media.tagName === 'IMG') {
      const img = media as HTMLImageElement;
      this.aspectRatio = img.naturalWidth / img.naturalHeight;
    } else {
      // For videos, use current dimensions as aspect ratio reference
      this.aspectRatio = media.offsetWidth / media.offsetHeight;
    }

    // Position resize handles
    this.updateHandles();
  }

  private deselectMedia() {
    if (this.currentMedia) {
      this.currentMedia.classList.remove('image-selected');
      this.currentMedia = null;
    }

    // Hide all handles
    this.handles.forEach(handle => {
      handle.element.style.display = 'none';
    });
  }

  private updateHandles() {
    if (!this.currentMedia) return;

    const rect = this.currentMedia.getBoundingClientRect();

    const handlePositions = {
      nw: { x: rect.left - 4, y: rect.top - 4 },
      ne: { x: rect.right - 4, y: rect.top - 4 },
      sw: { x: rect.left - 4, y: rect.bottom - 4 },
      se: { x: rect.right - 4, y: rect.bottom - 4 }
    };

    this.handles.forEach(handle => {
      const pos = handlePositions[handle.position];
      handle.element.style.left = `${pos.x}px`;
      handle.element.style.top = `${pos.y}px`;
      handle.element.style.display = 'block';
    });
  }

  private startResize(e: MouseEvent, position: 'nw' | 'ne' | 'sw' | 'se') {
    if (!this.currentMedia) return;

    e.preventDefault();
    e.stopPropagation();

    console.log(`Starting resize on handle: ${position}`);

    this.isResizing = true;
    this.currentHandle = this.handles.find(h => h.position === position) || null;
    this.startX = e.clientX;
    this.startY = e.clientY;

    // Get the actual displayed size of the media
    const rect = this.currentMedia.getBoundingClientRect();
    this.startWidth = rect.width;
    this.startHeight = rect.height;

    console.log(`Initial size: ${this.startWidth}x${this.startHeight}`);

    // Prevent text selection during resize
    document.body.style.userSelect = 'none';
  }

  private resize(e: MouseEvent) {
    if (!this.isResizing || !this.currentMedia || !this.currentHandle) return;

    const deltaX = e.clientX - this.startX;
    const deltaY = e.clientY - this.startY;

    let newWidth = this.startWidth;
    let newHeight = this.startHeight;

    // Calculate new dimensions based on handle position
    switch (this.currentHandle.position) {
      case 'se': // bottom-right
        newWidth = this.startWidth + deltaX;
        newHeight = this.startHeight + deltaY;
        break;
      case 'sw': // bottom-left
        newWidth = this.startWidth - deltaX;
        newHeight = this.startHeight + deltaY;
        break;
      case 'ne': // top-right
        newWidth = this.startWidth + deltaX;
        newHeight = this.startHeight - deltaY;
        break;
      case 'nw': // top-left
        newWidth = this.startWidth - deltaX;
        newHeight = this.startHeight - deltaY;
        break;
    }

    // Maintain aspect ratio if shift key is held
    if (e.shiftKey) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        newHeight = newWidth / this.aspectRatio;
      } else {
        newWidth = newHeight * this.aspectRatio;
      }
    }

    // Apply minimum size constraints
    newWidth = Math.max(50, newWidth);
    newHeight = Math.max(50, newHeight);

    console.log(`Resizing media: ${newWidth}x${newHeight} (handle: ${this.currentHandle.position})`);

    // Update media dimensions - use style properties to override CSS
    this.currentMedia.style.width = `${newWidth}px`;
    this.currentMedia.style.height = `${newHeight}px`;
    this.currentMedia.setAttribute('width', newWidth.toString());
    this.currentMedia.setAttribute('height', newHeight.toString());

    // Update handle positions
    this.updateHandles();
  }

  private stopResize() {
    if (!this.isResizing) return;

    this.isResizing = false;
    this.currentHandle = null;
    document.body.style.userSelect = '';

    // Update the editor content with new dimensions
    if (this.currentMedia) {
      // Trigger input event to notify editor of changes
      const inputEvent = new Event('input', { bubbles: true });
      this.currentMedia.dispatchEvent(inputEvent);
    }
  }

  destroy() {
    // Remove event listeners and handles
    this.handles.forEach(handle => {
      document.body.removeChild(handle.element);
    });
    this.handles = [];
  }
}

// Legacy function for backward compatibility
export function makeMediaResizable(container?: HTMLElement) {
  if (container) {
    return new ImageResizer(container);
  }

  // Fallback for old usage
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
      target.setAttribute('contenteditable', 'false');
      target.style.resize = 'both';
      target.style.overflow = 'auto';
      target.style.display = 'inline-block';
    }
  });
}
