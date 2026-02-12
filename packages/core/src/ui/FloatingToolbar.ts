/**
 * FloatingToolbar - Context-sensitive floating toolbar
 */

export interface FloatingToolbarConfig {
  enabled?: boolean;
  items?: string;
  anchorToSelection?: boolean;
}

export class FloatingToolbar {
  private config: FloatingToolbarConfig;
  private container?: HTMLElement;
  private visible: boolean = false;

  constructor(config: FloatingToolbarConfig) {
    this.config = config;
  }

  /**
   * Create and mount floating toolbar
   */
  create(parentElement: HTMLElement): HTMLElement {
    const container = document.createElement('div');
    container.className = 'editora-floating-toolbar';
    container.style.display = 'none';
    container.style.position = 'absolute';
    container.style.zIndex = '1000';
    
    this.container = container;
    parentElement.appendChild(container);
    
    return container;
  }

  /**
   * Show toolbar at position
   */
  show(x: number, y: number): void {
    if (!this.container) return;
    
    this.container.style.display = 'block';
    this.container.style.left = `${x}px`;
    this.container.style.top = `${y}px`;
    this.visible = true;
  }

  /**
   * Hide toolbar
   */
  hide(): void {
    if (!this.container) return;
    
    this.container.style.display = 'none';
    this.visible = false;
  }

  /**
   * Update position
   */
  updatePosition(x: number, y: number): void {
    if (!this.container || !this.visible) return;
    
    this.container.style.left = `${x}px`;
    this.container.style.top = `${y}px`;
  }

  /**
   * Check if visible
   */
  isVisible(): boolean {
    return this.visible;
  }

  /**
   * Destroy floating toolbar
   */
  destroy(): void {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = undefined;
    this.visible = false;
  }
}
