/**
 * Native Dialog System
 * Framework-agnostic dialog using HTML <dialog> element
 */

export interface DialogConfig {
  buttons?: Array<{
    label: string;
    primary?: boolean;
    type?: 'primary' | 'secondary' | 'danger';
    onClick?: () => void;
  }>;
  title: string;
  content: string | HTMLElement;
  width?: string;
  height?: string;
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  onSubmit?: (data: FormData) => void;
  onCancel?: () => void;
}

export class Dialog {
  private element: HTMLDialogElement;
  private config: DialogConfig;
  private formElement?: HTMLFormElement;

  constructor(config: DialogConfig) {
    this.config = {
      closeOnEscape: true,
      closeOnBackdrop: true,
      ...config
    };
    this.element = this.createElement();
    this.attachEventListeners();
  }

  private createElement(): HTMLDialogElement {
    const dialog = document.createElement('dialog');
    dialog.className = 'editora-dialog';
    
    if (this.config.width) {
      dialog.style.width = this.config.width;
    }
    if (this.config.height) {
      dialog.style.height = this.config.height;
    }

    const footerButtons = (this.config.buttons && this.config.buttons.length > 0)
      ? this.config.buttons.map((button, index) => {
        const variantClass = button.type === 'danger'
          ? 'editora-btn-danger'
          : button.type === 'primary'
            ? 'editora-btn-primary'
            : button.primary
              ? 'editora-btn-primary'
            : 'editora-btn-cancel';
        return `<button type="button" class="editora-btn ${variantClass}" data-dialog-button="${index}">${button.label}</button>`;
      }).join('')
      : `
          <button type="button" class="editora-btn editora-btn-cancel" data-dialog-default="cancel">Cancel</button>
          <button type="button" class="editora-btn editora-btn-primary" data-dialog-default="ok">OK</button>
        `;

    dialog.innerHTML = `
      <div class="editora-dialog-container">
        <div class="editora-dialog-header">
          <h3>${this.config.title}</h3>
          <button class="editora-dialog-close" aria-label="Close">&times;</button>
        </div>
        <div class="editora-dialog-body">
          ${typeof this.config.content === 'string' ? this.config.content : ''}
        </div>
        <div class="editora-dialog-footer">
          ${footerButtons}
        </div>
      </div>
    `;

    // If content is HTMLElement, append it
    if (typeof this.config.content !== 'string') {
      const body = dialog.querySelector('.editora-dialog-body');
      if (body) {
        body.innerHTML = '';
        body.appendChild(this.config.content);
      }
    }

    return dialog;
  }

  private attachEventListeners(): void {
    // Close button
    const closeBtn = this.element.querySelector('.editora-dialog-close');
    closeBtn?.addEventListener('click', () => this.close());

    if (this.config.buttons && this.config.buttons.length > 0) {
      const buttons = this.element.querySelectorAll<HTMLButtonElement>('[data-dialog-button]');
      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const index = Number(btn.getAttribute('data-dialog-button'));
          const configButton = this.config.buttons?.[index];
          configButton?.onClick?.();
        });
      });
    } else {
      // Cancel button
      const cancelBtn = this.element.querySelector('[data-dialog-default="cancel"]');
      cancelBtn?.addEventListener('click', () => {
        this.config.onCancel?.();
        this.close();
      });

      // OK button
      const okBtn = this.element.querySelector('[data-dialog-default="ok"]');
      okBtn?.addEventListener('click', () => this.handleSubmit());
    }

    // ESC key
    if (this.config.closeOnEscape) {
      this.element.addEventListener('cancel', (e) => {
        e.preventDefault();
        this.close();
      });
    }

    // Backdrop click
    if (this.config.closeOnBackdrop) {
      this.element.addEventListener('click', (e) => {
        const rect = this.element.getBoundingClientRect();
        if (
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        ) {
          this.close();
        }
      });
    }
  }

  private handleSubmit(): void {
    const form = this.element.querySelector('form');
    if (form) {
      const formData = new FormData(form);
      this.config.onSubmit?.(formData);
    } else {
      // Collect all inputs
      const inputs = this.element.querySelectorAll('input, select, textarea');
      const formData = new FormData();
      inputs.forEach((input: any) => {
        if (input.name) {
          formData.append(input.name, input.value);
        }
      });
      this.config.onSubmit?.(formData);
    }
    this.close();
  }

  show(): void {
    document.body.appendChild(this.element);
    this.element.showModal();
  }

  close(): void {
    this.element.close();
    this.element.remove();
  }

  destroy(): void {
    this.close();
  }
}
