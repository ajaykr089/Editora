import { ElementBase } from '../ElementBase';

type FileRejectReason = 'accept' | 'max-size' | 'max-files';

export type UIFileUploadRejectedFile = {
  file: File;
  reason: FileRejectReason;
};

const style = `
  :host {
    --ui-file-upload-border-color: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent);
    --ui-file-upload-border: 1px solid var(--ui-file-upload-border-color);
    --ui-file-upload-radius: var(--ui-radius, 12px);
    --ui-file-upload-bg: var(--ui-color-surface, #ffffff);
    --ui-file-upload-text: var(--ui-color-text, #0f172a);
    --ui-file-upload-muted: var(--ui-color-muted, #64748b);
    --ui-file-upload-focus: var(--ui-color-focus-ring, #2563eb);
    --ui-file-upload-danger: var(--ui-color-danger, #dc2626);
    --ui-file-upload-success: var(--ui-color-success, #16a34a);
    display: block;
    inline-size: 100%;
    min-inline-size: 0;
    color: var(--ui-file-upload-text);
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color-scheme: light dark;
  }

  .root {
    display: grid;
    gap: 10px;
    min-inline-size: 0;
  }

  .meta {
    display: grid;
    gap: 4px;
  }

  .label {
    margin: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--ui-file-upload-text);
    font: 600 13px/1.35 "IBM Plex Sans", "Inter", sans-serif;
  }

  .required {
    color: var(--ui-file-upload-danger);
    font-size: 12px;
    line-height: 1;
  }

  .description,
  .error,
  .hint {
    margin: 0;
    color: var(--ui-file-upload-muted);
    font-size: 12px;
    line-height: 1.4;
    letter-spacing: 0.01em;
  }

  .error {
    color: var(--ui-file-upload-danger);
  }

  .surface {
    position: relative;
    display: grid;
    gap: 12px;
    align-items: center;
    justify-items: start;
    min-inline-size: 0;
    min-block-size: 72px;
    padding: 14px 16px;
    border: var(--ui-file-upload-border);
    border-radius: var(--ui-file-upload-radius);
    background: var(--ui-file-upload-bg);
    transition: border-color 170ms ease, box-shadow 170ms ease, background-color 170ms ease, transform 170ms ease;
    cursor: pointer;
    box-sizing: border-box;
  }

  .surface[data-dragging="true"] {
    border-color: color-mix(in srgb, var(--ui-file-upload-focus) 62%, transparent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-file-upload-focus) 18%, transparent);
    transform: translateY(-1px);
  }

  :host([surface="dropzone"]) .surface {
    border-style: dashed;
    justify-items: center;
    text-align: center;
    min-block-size: 168px;
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-file-upload-bg) 94%, #ffffff 6%),
        var(--ui-file-upload-bg)
      );
  }

  .headline {
    font: 600 14px/1.35 "Inter", "IBM Plex Sans", sans-serif;
  }

  .subline {
    color: var(--ui-file-upload-muted);
    font-size: 12px;
    line-height: 1.45;
  }

  .cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 999px;
    padding: 8px 12px;
    background: color-mix(in srgb, var(--ui-color-primary, #2563eb) 12%, transparent);
    color: color-mix(in srgb, var(--ui-color-primary, #2563eb) 82%, #0f172a 18%);
    font: 600 12px/1 "Inter", "IBM Plex Sans", sans-serif;
    cursor: pointer;
  }

  .list {
    display: grid;
    gap: 8px;
  }

  .file {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto auto;
    gap: 10px;
    align-items: center;
    padding: 10px 12px;
    border: 1px solid color-mix(in srgb, var(--ui-file-upload-border-color) 76%, transparent);
    border-radius: 12px;
    background: color-mix(in srgb, var(--ui-file-upload-bg) 94%, transparent);
  }

  .preview {
    inline-size: 38px;
    block-size: 38px;
    border-radius: 10px;
    background: color-mix(in srgb, var(--ui-file-upload-text) 8%, transparent);
    overflow: hidden;
    display: inline-grid;
    place-items: center;
    color: var(--ui-file-upload-muted);
    font: 700 10px/1 "Inter", sans-serif;
  }

  .preview img {
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
    display: block;
  }

  .file-text {
    min-inline-size: 0;
    display: grid;
    gap: 4px;
  }

  .file-name {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
    font-weight: 600;
  }

  .file-meta {
    color: var(--ui-file-upload-muted);
    font-size: 11px;
    white-space: nowrap;
  }

  .progress {
    grid-column: 2 / 5;
    display: grid;
    gap: 4px;
  }

  .progress-track {
    inline-size: 100%;
    block-size: 6px;
    overflow: hidden;
    border-radius: 999px;
    background: color-mix(in srgb, var(--ui-file-upload-text) 10%, transparent);
  }

  .progress-bar {
    block-size: 100%;
    border-radius: inherit;
    background: color-mix(in srgb, var(--ui-file-upload-success) 74%, transparent);
  }

  .progress-text {
    color: var(--ui-file-upload-muted);
    font-size: 11px;
    line-height: 1.2;
  }

  .file-remove {
    border: none;
    border-radius: 999px;
    padding: 6px 9px;
    background: color-mix(in srgb, currentColor 8%, transparent);
    color: inherit;
    cursor: pointer;
    font: 600 11px/1 "Inter", sans-serif;
  }

  .input {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    opacity: 0;
    pointer-events: none;
  }

  .label[hidden],
  .description[hidden],
  .error[hidden],
  .meta[hidden],
  .list[hidden] {
    display: none;
  }

  :host([disabled]) .surface,
  :host([disabled]) .file-remove {
    cursor: not-allowed;
    opacity: 0.68;
  }
`;

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function matchesAccept(file: File, accept: string): boolean {
  if (!accept.trim()) return true;
  const rules = accept.split(',').map((entry) => entry.trim()).filter(Boolean);
  if (!rules.length) return true;
  const name = file.name.toLowerCase();
  const type = (file.type || '').toLowerCase();
  return rules.some((rule) => {
    const normalized = rule.toLowerCase();
    if (normalized.startsWith('.')) return name.endsWith(normalized);
    if (normalized.endsWith('/*')) return type.startsWith(normalized.slice(0, -1));
    return type === normalized;
  });
}

export class UIFileUpload extends ElementBase {
  static get observedAttributes() {
    return [
      'name',
      'label',
      'description',
      'accept',
      'multiple',
      'disabled',
      'required',
      'max-files',
      'max-size',
      'button-text',
      'drop-label',
      'surface',
      'data-error',
      'progress',
      'show-previews'
    ];
  }

  protected _files: File[] = [];
  private _formUnregister: (() => void) | null = null;
  private _surfaceEl: HTMLElement | null = null;
  private _inputEl: HTMLInputElement | null = null;
  private _listEl: HTMLElement | null = null;
  private _errorEl: HTMLElement | null = null;
  private _dragging = false;
  private _dragDepth = 0;
  private _previewUrls = new Map<string, string>();

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onInputChange = this._onInputChange.bind(this);
    this._onDragEnter = this._onDragEnter.bind(this);
    this._onDragLeave = this._onDragLeave.bind(this);
    this._onDragOver = this._onDragOver.bind(this);
    this._onDrop = this._onDrop.bind(this);
  }

  get files(): File[] {
    return [...this._files];
  }

  setFiles(files: File[]): void {
    this._applyFiles(files, 'api', true);
  }

  openPicker(): void {
    if (this._disabled()) return;
    this._inputEl?.click();
  }

  clearFiles(): void {
    if (!this._files.length) return;
    this._files = [];
    if (this._inputEl) this._inputEl.value = '';
    this._syncUi();
    this._emit('change', { files: [], source: 'clear' });
    this._emit('clear', {});
  }

  removeFile(index: number): void {
    if (this._disabled()) return;
    if (index < 0 || index >= this._files.length) return;
    this._files = this._files.filter((_, currentIndex) => currentIndex !== index);
    this._syncUi();
    this._emit('change', { files: this.files, source: 'remove' });
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._registerWithForm();
  }

  override disconnectedCallback(): void {
    if (this._formUnregister) {
      this._formUnregister();
      this._formUnregister = null;
    }
    this._revokePreviewUrls();
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'name' && this.isConnected) this._registerWithForm();
    if (this._surfaceEl) this._syncUi();
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    return false;
  }

  protected override render(): void {
    this.setContent(`
      <style>${style}</style>
      <div class="root">
        <div class="meta" hidden>
          <div class="label" hidden><span class="label-text"></span><span class="required" hidden>*</span></div>
          <div class="description" hidden></div>
        </div>
        <div class="surface" part="surface" tabindex="0" data-dragging="false">
          <div class="headline"></div>
          <div class="subline"></div>
          <button class="cta" part="trigger" type="button"></button>
          <input class="input" part="input" type="file" />
        </div>
        <div class="error" part="error" hidden></div>
        <div class="list" part="list" hidden></div>
      </div>
    `);

    this._surfaceEl = this.root.querySelector('.surface');
    this._inputEl = this.root.querySelector('.input');
    this._listEl = this.root.querySelector('.list');
    this._errorEl = this.root.querySelector('.error');

    this._surfaceEl?.addEventListener('click', this._onClick);
    this._surfaceEl?.addEventListener('keydown', this._onKeyDown);
    this._surfaceEl?.addEventListener('dragenter', this._onDragEnter);
    this._surfaceEl?.addEventListener('dragleave', this._onDragLeave);
    this._surfaceEl?.addEventListener('dragover', this._onDragOver);
    this._surfaceEl?.addEventListener('drop', this._onDrop);
    this._inputEl?.addEventListener('change', this._onInputChange);

    this._syncUi();
  }

  protected _disabled(): boolean {
    return this.hasAttribute('disabled') && this.getAttribute('disabled') !== 'false';
  }

  protected _maxFiles(): number | null {
    const raw = this.getAttribute('max-files');
    if (!raw) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : null;
  }

  protected _maxSize(): number | null {
    const raw = this.getAttribute('max-size');
    if (!raw) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  protected _appendFiles(inputFiles: File[], source: string): void {
    this._applyFiles(inputFiles, source, false);
  }

  private _applyFiles(inputFiles: File[], source: string, replace: boolean): void {
    const multiple = this.hasAttribute('multiple');
    const current = replace ? [] : (multiple ? [...this._files] : []);
    const accepted: File[] = [];
    const rejected: UIFileUploadRejectedFile[] = [];
    const accept = this.getAttribute('accept') || '';
    const maxFiles = this._maxFiles();
    const maxSize = this._maxSize();

    const seen = new Set(current.map((file) => this._fileKey(file)));
    inputFiles.forEach((file) => {
      const key = this._fileKey(file);
      if (seen.has(key)) return;
      if (!matchesAccept(file, accept)) {
        rejected.push({ file, reason: 'accept' });
        return;
      }
      if (maxSize != null && file.size > maxSize) {
        rejected.push({ file, reason: 'max-size' });
        return;
      }
      if (maxFiles != null && current.length + accepted.length >= maxFiles) {
        rejected.push({ file, reason: 'max-files' });
        return;
      }
      seen.add(key);
      accepted.push(file);
    });

    this._files = [...current, ...accepted];
    if (!multiple && this._files.length > 1) {
      this._files = [this._files[this._files.length - 1]];
    }
    this._syncUi();
    this._emit('change', { files: this.files, source });
    if (rejected.length) {
      this._emit('reject', { rejected, source });
      this.setAttribute('data-error', rejected[0].reason === 'accept'
        ? 'One or more files do not match the accepted types'
        : rejected[0].reason === 'max-size'
          ? 'One or more files exceed the size limit'
          : 'Too many files selected');
    } else {
      this.removeAttribute('data-error');
    }
    this._syncUi();
  }

  private _emit(name: string, detail: Record<string, unknown>): void {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  private _fileKey(file: File): string {
    return `${file.name}::${file.size}::${file.lastModified}`;
  }

  private _parseProgress(): Record<string, number> {
    const raw = this.getAttribute('progress');
    if (!raw) return {};
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
      return Object.fromEntries(
        Object.entries(parsed).map(([key, value]) => {
          const numeric = Number(value);
          return [key, Number.isFinite(numeric) ? Math.max(0, Math.min(100, numeric)) : 0];
        })
      );
    } catch {
      return {};
    }
  }

  private _getPreviewUrl(file: File): string | null {
    if (!this.hasAttribute('show-previews')) return null;
    if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') return null;
    if (!file.type.startsWith('image/')) return null;
    const key = this._fileKey(file);
    const existing = this._previewUrls.get(key);
    if (existing) return existing;
    const next = URL.createObjectURL(file);
    this._previewUrls.set(key, next);
    return next;
  }

  private _revokePreviewUrls(activeKeys: Set<string> = new Set()): void {
    this._previewUrls.forEach((url, key) => {
      if (activeKeys.has(key)) return;
      try {
        URL.revokeObjectURL(url);
      } catch {
        // ignore unsupported envs
      }
      this._previewUrls.delete(key);
    });
  }

  private _syncUi(): void {
    if (!this._surfaceEl || !this._inputEl || !this._listEl || !this._errorEl) return;

    const label = (this.getAttribute('label') || '').trim();
    const description = (this.getAttribute('description') || '').trim();
    const required = this.hasAttribute('required');
    const disabled = this._disabled();
    const dropLabel = this.getAttribute('drop-label') || 'Drag files here or browse from your device';
    const buttonText = this.getAttribute('button-text') || 'Choose files';
    const error = (this.getAttribute('data-error') || '').trim();
    const progressByFile = this._parseProgress();

    const labelEl = this.root.querySelector('.label') as HTMLElement;
    const descriptionEl = this.root.querySelector('.description') as HTMLElement;
    const metaEl = this.root.querySelector('.meta') as HTMLElement;
    const headlineEl = this.root.querySelector('.headline') as HTMLElement;
    const sublineEl = this.root.querySelector('.subline') as HTMLElement;
    const ctaEl = this.root.querySelector('.cta') as HTMLButtonElement;
    const requiredEl = this.root.querySelector('.required') as HTMLElement;

    labelEl.hidden = !label;
    labelEl.querySelector('.label-text')!.textContent = label;
    requiredEl.hidden = !required;
    descriptionEl.hidden = !description;
    descriptionEl.textContent = description;
    metaEl.hidden = !label && !description;

    headlineEl.textContent = this._files.length ? `${this._files.length} file${this._files.length === 1 ? '' : 's'} selected` : dropLabel;
    sublineEl.textContent = this._files.length
      ? this._files.map((file) => file.name).join(', ')
      : (this.getAttribute('accept') ? `Accepted: ${this.getAttribute('accept')}` : 'Supports click, keyboard, and drag-and-drop upload');
    ctaEl.textContent = buttonText;
    ctaEl.disabled = disabled;
    this._surfaceEl.setAttribute('data-dragging', this._dragging ? 'true' : 'false');
    this._surfaceEl.setAttribute('aria-disabled', disabled ? 'true' : 'false');

    this._inputEl.disabled = disabled;
    this._inputEl.multiple = this.hasAttribute('multiple');
    this._inputEl.name = this.getAttribute('name') || '';
    this._inputEl.accept = this.getAttribute('accept') || '';

    this._errorEl.hidden = !error;
    this._errorEl.textContent = error;

    const activePreviewKeys = new Set<string>();
    this._listEl.hidden = this._files.length === 0;
    this._listEl.replaceChildren(...this._files.map((file, index) => {
      const row = document.createElement('div');
      row.className = 'file';
      const fileKey = this._fileKey(file);
      activePreviewKeys.add(fileKey);

      const preview = document.createElement('div');
      preview.className = 'preview';
      const previewUrl = this._getPreviewUrl(file);
      if (previewUrl) {
        const image = document.createElement('img');
        image.src = previewUrl;
        image.alt = '';
        preview.append(image);
      } else {
        preview.textContent = file.name.split('.').pop()?.slice(0, 4).toUpperCase() || 'FILE';
      }

      const nameEl = document.createElement('div');
      nameEl.className = 'file-text';
      const fileNameEl = document.createElement('div');
      fileNameEl.className = 'file-name';
      fileNameEl.textContent = file.name;

      const metaEl = document.createElement('div');
      metaEl.className = 'file-meta';
      metaEl.textContent = formatBytes(file.size);
      nameEl.append(fileNameEl, metaEl);

      const removeEl = document.createElement('button');
      removeEl.type = 'button';
      removeEl.className = 'file-remove';
      removeEl.textContent = 'Remove';
      removeEl.disabled = disabled;
      removeEl.addEventListener('click', (event) => {
        event.stopPropagation();
        this.removeFile(index);
      });

      row.append(preview, nameEl, metaEl, removeEl);

      const progressValue = progressByFile[fileKey] ?? progressByFile[file.name];
      if (typeof progressValue === 'number') {
        const progressWrap = document.createElement('div');
        progressWrap.className = 'progress';

        const track = document.createElement('div');
        track.className = 'progress-track';
        const bar = document.createElement('div');
        bar.className = 'progress-bar';
        bar.style.inlineSize = `${progressValue}%`;
        track.append(bar);

        const text = document.createElement('div');
        text.className = 'progress-text';
        text.textContent = progressValue >= 100 ? 'Upload complete' : `Uploading ${Math.round(progressValue)}%`;

        progressWrap.append(track, text);
        row.append(progressWrap);
      }
      return row;
    }));
    this._revokePreviewUrls(activePreviewKeys);
  }

  private _registerWithForm(): void {
    if (this._formUnregister) {
      this._formUnregister();
      this._formUnregister = null;
    }

    try {
      const rootNode = this.getRootNode() as Document | ShadowRoot;
      const host = (rootNode as ShadowRoot).host as HTMLElement | undefined;
      const formFromHost = host?.closest?.('ui-form') || null;
      const parentForm = formFromHost || this.closest('ui-form');
      const name = this.getAttribute('name');
      if (parentForm && typeof (parentForm as any).registerField === 'function' && name) {
        this._formUnregister = (parentForm as any).registerField(name, {
          name,
          getValue: () => this.files,
          setValue: (next: any) => {
            if (Array.isArray(next) && next.every((entry) => entry instanceof File)) {
              this.setFiles(next as File[]);
            }
          },
          validate: async () => {
            if (this.hasAttribute('required') && this._files.length === 0) {
              return { valid: false, message: 'At least one file is required' };
            }
            return { valid: true };
          },
          setError: (message?: string) => {
            if (message) this.setAttribute('data-error', message);
            else this.removeAttribute('data-error');
            this._syncUi();
          }
        });
      }
    } catch {
      // ignore registration failures outside ui-form
    }
  }

  private _onClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('.file-remove')) return;
    this.openPicker();
  }

  private _onKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this.openPicker();
  }

  private _onInputChange(): void {
    const files = Array.from(this._inputEl?.files || []);
    if (!files.length) return;
    this._appendFiles(files, 'picker');
    if (this._inputEl) this._inputEl.value = '';
  }

  private _onDragEnter(event: DragEvent): void {
    if (this._disabled()) return;
    event.preventDefault();
    this._dragDepth += 1;
    this._dragging = true;
    this._syncUi();
  }

  private _onDragLeave(event: DragEvent): void {
    if (!this._surfaceEl) return;
    const related = event.relatedTarget as Node | null;
    if (related && this._surfaceEl.contains(related)) return;
    this._dragDepth = Math.max(0, this._dragDepth - 1);
    if (this._dragDepth > 0) return;
    this._dragging = false;
    this._syncUi();
  }

  private _onDragOver(event: DragEvent): void {
    if (this._disabled()) return;
    event.preventDefault();
  }

  private _onDrop(event: DragEvent): void {
    if (this._disabled()) return;
    event.preventDefault();
    this._dragDepth = 0;
    this._dragging = false;
    const files = Array.from(event.dataTransfer?.files || []);
    if (files.length) this._appendFiles(files, 'drop');
    this._syncUi();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-file-upload': UIFileUpload;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-file-upload')) {
  customElements.define('ui-file-upload', UIFileUpload);
}
