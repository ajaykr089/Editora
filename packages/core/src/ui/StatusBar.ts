/**
 * StatusBar - Editor status information display
 */

export interface StatusBarConfig {
  enabled?: boolean;
  position?: 'top' | 'bottom';
}

export interface StatusInfo {
  wordCount?: number;
  charCount?: number;
  lineCount?: number;
  language?: string;
  custom?: Record<string, string>;
}

export class StatusBar {
  private config: StatusBarConfig;
  private container?: HTMLElement;
  private statusInfo: StatusInfo = {};

  constructor(config: StatusBarConfig = {}) {
    this.config = config;
  }

  /**
   * Create and mount status bar
   */
  create(parentElement: HTMLElement): HTMLElement {
    const container = document.createElement('div');
    container.className = 'editora-statusbar';
    
    if (this.config.position) {
      container.classList.add(`editora-statusbar-${this.config.position}`);
    }
    
    this.container = container;
    parentElement.appendChild(container);
    
    return container;
  }

  /**
   * Update status information
   */
  update(info: StatusInfo): void {
    this.statusInfo = { ...this.statusInfo, ...info };
    this.render();
  }

  /**
   * Render status bar content
   */
  private render(): void {
    if (!this.container) return;
    
    this.container.innerHTML = '';
    
    const items: string[] = [];
    
    if (this.statusInfo.wordCount !== undefined) {
      items.push(`Words: ${this.statusInfo.wordCount}`);
    }
    
    if (this.statusInfo.charCount !== undefined) {
      items.push(`Characters: ${this.statusInfo.charCount}`);
    }
    
    if (this.statusInfo.lineCount !== undefined) {
      items.push(`Lines: ${this.statusInfo.lineCount}`);
    }
    
    if (this.statusInfo.language) {
      items.push(`Language: ${this.statusInfo.language}`);
    }
    
    if (this.statusInfo.custom) {
      Object.entries(this.statusInfo.custom).forEach(([key, value]) => {
        items.push(`${key}: ${value}`);
      });
    }
    
    items.forEach((item, index) => {
      const span = document.createElement('span');
      span.className = 'editora-statusbar-item';
      span.textContent = item;
      this.container!.appendChild(span);
      
      if (index < items.length - 1) {
        const separator = document.createElement('span');
        separator.className = 'editora-statusbar-separator';
        separator.textContent = '|';
        this.container!.appendChild(separator);
      }
    });
  }

  /**
   * Destroy status bar
   */
  destroy(): void {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = undefined;
  }
}
