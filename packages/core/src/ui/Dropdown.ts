/**
 * Native Dropdown System
 * Framework-agnostic dropdown component
 */

export interface DropdownOption {
  label: string;
  value: string;
  icon?: string;
}

export interface DropdownConfig {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  width?: string;
}

export class Dropdown {
  private element: HTMLDivElement;
  private config: DropdownConfig;
  private isOpen = false;
  private selectedValue?: string;

  constructor(config: DropdownConfig) {
    this.config = config;
    this.selectedValue = config.value;
    this.element = this.createElement();
    this.attachEventListeners();
  }

  private createElement(): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'editora-dropdown';
    if (this.config.width) {
      container.style.width = this.config.width;
    }

    const selected = this.config.options.find(o => o.value === this.selectedValue);
    const displayText = selected?.label || this.config.placeholder || 'Select...';

    container.innerHTML = `
      <button class="editora-dropdown-toggle" type="button">
        <span class="editora-dropdown-label">${displayText}</span>
        <span class="editora-dropdown-arrow">▼</span>
      </button>
      <div class="editora-dropdown-menu" style="display: none;">
        ${this.config.options.map(opt => `
          <div class="editora-dropdown-item" data-value="${opt.value}">
            ${opt.icon ? `<span class="editora-dropdown-icon">${opt.icon}</span>` : ''}
            <span>${opt.label}</span>
          </div>
        `).join('')}
      </div>
    `;

    return container;
  }

  private attachEventListeners(): void {
    const toggle = this.element.querySelector('.editora-dropdown-toggle') as HTMLButtonElement;
    const menu = this.element.querySelector('.editora-dropdown-menu') as HTMLDivElement;

    // Toggle dropdown
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.isOpen = !this.isOpen;
      menu.style.display = this.isOpen ? 'block' : 'none';
    });

    // Select option
    const items = this.element.querySelectorAll('.editora-dropdown-item');
    items.forEach(item => {
      item.addEventListener('click', () => {
        const value = item.getAttribute('data-value');
        if (value) {
          this.setValue(value);
          this.config.onChange?.(value);
          this.close();
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!this.element.contains(e.target as Node)) {
        this.close();
      }
    });
  }

  setValue(value: string): void {
    this.selectedValue = value;
    const selected = this.config.options.find(o => o.value === value);
    const label = this.element.querySelector('.editora-dropdown-label');
    if (label && selected) {
      label.textContent = selected.label;
    }
  }

  getValue(): string | undefined {
    return this.selectedValue;
  }

  close(): void {
    this.isOpen = false;
    const menu = this.element.querySelector('.editora-dropdown-menu') as HTMLDivElement;
    if (menu) {
      menu.style.display = 'none';
    }
  }

  getElement(): HTMLDivElement {
    return this.element;
  }

  destroy(): void {
    this.element.remove();
  }
}
