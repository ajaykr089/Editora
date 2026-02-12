import { Dialog } from '../Dialog';

export interface LinkDialogConfig {
  initialUrl?: string;
  initialText?: string;
  onSubmit: (data: { url: string; text: string; openInNewTab: boolean }) => void;
  onCancel?: () => void;
}

/**
 * Native link insertion dialog
 * Framework-agnostic implementation using HTML <dialog>
 */
export class LinkDialog {
  private dialog: Dialog;

  constructor(config: LinkDialogConfig) {
    const { initialUrl = '', initialText = '', onSubmit, onCancel } = config;

    this.dialog = new Dialog({
      title: 'Insert/Edit Link',
      content: this.createFormHTML(initialUrl, initialText),
      onSubmit: (formData) => {
        const url = (formData.get('url') as string || '').trim();
        const text = (formData.get('text') as string || '').trim();
        const openInNewTab = formData.get('openInNewTab') === 'on';

        if (!url) {
          alert('Please enter a URL');
          return;
        }

        onSubmit({ url, text, openInNewTab });
        this.dialog.close();
      },
      onCancel: () => {
        onCancel?.();
        this.dialog.close();
      },
      width: '500px'
    });
  }

  private createFormHTML(initialUrl: string, initialText: string): string {
    return `
      <form class="link-dialog-form">
        <div class="form-group">
          <label for="link-url">URL</label>
          <input 
            type="url" 
            id="link-url"
            name="url" 
            placeholder="https://example.com"
            value="${this.escapeHtml(initialUrl)}"
            required 
            autofocus
          />
          <small>Enter the web address (URL) for the link</small>
        </div>

        <div class="form-group">
          <label for="link-text">Link Text</label>
          <input 
            type="text" 
            id="link-text"
            name="text" 
            placeholder="Click here"
            value="${this.escapeHtml(initialText)}"
          />
          <small>Text to display for the link (leave empty to use URL)</small>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              name="openInNewTab"
              id="link-new-tab"
            />
            <span>Open link in new tab</span>
          </label>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" data-action="cancel">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            Insert Link
          </button>
        </div>
      </form>
    `;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  public show(): void {
    this.dialog.show();
  }

  public close(): void {
    this.dialog.close();
  }
}
