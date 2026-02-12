import { Dialog } from '../Dialog';

export interface TableDialogConfig {
  onSubmit: (data: { rows: number; cols: number; headerRow: boolean }) => void;
  onCancel?: () => void;
}

/**
 * Native table insertion dialog
 * Framework-agnostic implementation using HTML <dialog>
 */
export class TableDialog {
  private dialog: Dialog;

  constructor(config: TableDialogConfig) {
    const { onSubmit, onCancel } = config;

    this.dialog = new Dialog({
      title: 'Insert Table',
      content: this.createFormHTML(),
      onSubmit: (formData) => {
        const rows = parseInt(formData.get('rows') as string, 10);
        const cols = parseInt(formData.get('cols') as string, 10);
        const headerRow = formData.get('headerRow') === 'on';

        if (rows < 1 || rows > 100) {
          alert('Please enter a valid number of rows (1-100)');
          return;
        }

        if (cols < 1 || cols > 20) {
          alert('Please enter a valid number of columns (1-20)');
          return;
        }

        onSubmit({ rows, cols, headerRow });
        this.dialog.close();
      },
      onCancel: () => {
        onCancel?.();
        this.dialog.close();
      },
      width: '400px'
    });
  }

  private createFormHTML(): string {
    return `
      <form class="table-dialog-form">
        <div class="form-group">
          <label for="table-rows">Rows</label>
          <input 
            type="number" 
            id="table-rows"
            name="rows" 
            min="1" 
            max="100" 
            value="3"
            required 
            autofocus
          />
          <small>Number of rows (1-100)</small>
        </div>

        <div class="form-group">
          <label for="table-cols">Columns</label>
          <input 
            type="number" 
            id="table-cols"
            name="cols" 
            min="1" 
            max="20" 
            value="3"
            required
          />
          <small>Number of columns (1-20)</small>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              name="headerRow"
              id="table-header"
              checked
            />
            <span>Include header row</span>
          </label>
        </div>

        <div class="table-preview">
          <strong>Preview:</strong>
          <div id="table-preview-content" style="margin-top: 8px; font-size: 12px; color: #666;">
            3 rows × 3 columns with header
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" data-action="cancel">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            Insert Table
          </button>
        </div>
      </form>
    `;
  }

  public show(): void {
    this.dialog.show();
    this.attachPreviewListeners();
  }

  public close(): void {
    this.dialog.close();
  }

  private attachPreviewListeners(): void {
    const form = document.querySelector('.table-dialog-form');
    if (!form) return;

    const rowsInput = form.querySelector('#table-rows') as HTMLInputElement;
    const colsInput = form.querySelector('#table-cols') as HTMLInputElement;
    const headerCheckbox = form.querySelector('#table-header') as HTMLInputElement;
    const preview = form.querySelector('#table-preview-content');

    const updatePreview = () => {
      const rows = parseInt(rowsInput?.value || '3', 10);
      const cols = parseInt(colsInput?.value || '3', 10);
      const hasHeader = headerCheckbox?.checked;

      if (preview) {
        preview.textContent = `${rows} rows × ${cols} columns${hasHeader ? ' with header' : ''}`;
      }
    };

    rowsInput?.addEventListener('input', updatePreview);
    colsInput?.addEventListener('input', updatePreview);
    headerCheckbox?.addEventListener('change', updatePreview);
  }
}
