import { ElementBase } from '../ElementBase';

type FileRejectReason = 'accept' | 'max-size' | 'max-files';

export type UIFileUploadRejectedFile = {
  file: File;
  reason: FileRejectReason;
};

export type UIFileUploadUploadState = 'pending' | 'uploading' | 'success' | 'error' | 'canceled';

export type UIFileUploadUploadContext = {
  file: File;
  files: File[];
  signal: AbortSignal;
  setProgress: (progress: number) => void;
};

export type UIFileUploadUploadRequest = (context: UIFileUploadUploadContext) => Promise<unknown> | unknown;

type UploadEntry = {
  state: UIFileUploadUploadState;
  progress: number | null;
  error?: string;
  result?: unknown;
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

  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 12px;
    border: 1px solid color-mix(in srgb, var(--ui-file-upload-border-color) 70%, transparent);
    border-radius: 14px;
    background: color-mix(in srgb, var(--ui-file-upload-bg) 97%, transparent);
  }

  .actions[hidden] {
    display: none;
  }

  .actions-summary {
    display: grid;
    gap: 2px;
    min-inline-size: 0;
  }

  .actions-title {
    font: 600 12px/1.3 "Inter", "IBM Plex Sans", sans-serif;
  }

  .actions-subtitle {
    color: var(--ui-file-upload-muted);
    font-size: 11px;
    line-height: 1.35;
  }

  .actions-row {
    display: inline-flex;
    flex-wrap: wrap;
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
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  .status {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-block-size: 22px;
    padding: 0 9px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--ui-file-upload-text) 8%, transparent);
    color: var(--ui-file-upload-muted);
    font: 600 10px/1 "Inter", sans-serif;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .status[data-state="pending"] {
    background: color-mix(in srgb, var(--ui-color-primary, #2563eb) 10%, transparent);
    color: color-mix(in srgb, var(--ui-color-primary, #2563eb) 82%, #0f172a 18%);
  }

  .status[data-state="uploading"] {
    background: color-mix(in srgb, var(--ui-color-primary, #2563eb) 14%, transparent);
    color: color-mix(in srgb, var(--ui-color-primary, #2563eb) 84%, #0f172a 16%);
  }

  .status[data-state="success"] {
    background: color-mix(in srgb, var(--ui-file-upload-success) 14%, transparent);
    color: color-mix(in srgb, var(--ui-file-upload-success) 86%, #052e16 14%);
  }

  .status[data-state="error"] {
    background: color-mix(in srgb, var(--ui-file-upload-danger) 14%, transparent);
    color: color-mix(in srgb, var(--ui-file-upload-danger) 88%, #450a0a 12%);
  }

  .status[data-state="canceled"] {
    background: color-mix(in srgb, var(--ui-file-upload-text) 8%, transparent);
    color: var(--ui-file-upload-muted);
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

  .file-remove[data-tone="danger"] {
    color: var(--ui-file-upload-danger);
  }

  .file-remove[data-variant="primary"] {
    background: color-mix(in srgb, var(--ui-color-primary, #2563eb) 12%, transparent);
    color: color-mix(in srgb, var(--ui-color-primary, #2563eb) 84%, #0f172a 16%);
  }

  .file-error {
    grid-column: 2 / 5;
    color: var(--ui-file-upload-danger);
    font-size: 11px;
    line-height: 1.35;
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
  :host([disabled]) .file-remove,
  :host([disabled]) .cta {
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
      'show-previews',
      'upload-on-select',
      'upload-button-text'
    ];
  }

  protected _files: File[] = [];
  uploadRequest: UIFileUploadUploadRequest | null = null;
  private _formUnregister: (() => void) | null = null;
  private _surfaceEl: HTMLElement | null = null;
  private _inputEl: HTMLInputElement | null = null;
  private _listEl: HTMLElement | null = null;
  private _errorEl: HTMLElement | null = null;
  private _actionsEl: HTMLElement | null = null;
  private _dragging = false;
  private _dragDepth = 0;
  private _previewUrls = new Map<string, string>();
  private _uploadState = new Map<string, UploadEntry>();
  private _uploadControllers = new Map<string, AbortController>();
  private _uploadSequence = 0;

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

  get uploading(): boolean {
    return Array.from(this._uploadState.values()).some((entry) => entry.state === 'uploading');
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
    this.cancelUploads();
    this._files = [];
    this._uploadState.clear();
    if (this._inputEl) this._inputEl.value = '';
    this._syncUi();
    this._emit('change', { files: [], source: 'clear' });
    this._emit('clear', {});
  }

  removeFile(index: number): void {
    if (this._disabled()) return;
    if (index < 0 || index >= this._files.length) return;
    const file = this._files[index];
    this.cancelUpload(this._fileKey(file));
    this._uploadState.delete(this._fileKey(file));
    this._files = this._files.filter((_, currentIndex) => currentIndex !== index);
    this._syncUi();
    this._emit('change', { files: this.files, source: 'remove' });
  }

  async startUpload(): Promise<void> {
    if (!this.uploadRequest || this._disabled()) return;
    const candidates = this._files.filter((file) => {
      const entry = this._uploadState.get(this._fileKey(file));
      return !entry || entry.state === 'pending' || entry.state === 'error' || entry.state === 'canceled';
    });
    if (!candidates.length) return;

    const requestId = ++this._uploadSequence;
    this._emit('upload-start', { files: candidates, requestId });
    await Promise.all(candidates.map((file) => this._runUpload(file, requestId)));
    this._emit('upload-complete', {
      files: this.files,
      requestId,
      statuses: Object.fromEntries(Array.from(this._uploadState.entries()).map(([key, value]) => [key, { ...value }]))
    });
    this._syncUi();
  }

  cancelUploads(): void {
    Array.from(this._uploadControllers.keys()).forEach((key) => this.cancelUpload(key));
  }

  cancelUpload(fileOrKey: string | File): void {
    const key = typeof fileOrKey === 'string' ? fileOrKey : this._fileKey(fileOrKey);
    const controller = this._uploadControllers.get(key);
    if (!controller) return;
    controller.abort();
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
        <div class="actions" part="actions" hidden>
          <div class="actions-summary">
            <div class="actions-title"></div>
            <div class="actions-subtitle"></div>
          </div>
          <div class="actions-row"></div>
        </div>
        <div class="list" part="list" hidden></div>
      </div>
    `);

    this._surfaceEl = this.root.querySelector('.surface');
    this._inputEl = this.root.querySelector('.input');
    this._listEl = this.root.querySelector('.list');
    this._errorEl = this.root.querySelector('.error');
    this._actionsEl = this.root.querySelector('.actions');

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

    if (replace) {
      this.cancelUploads();
      this._uploadState.clear();
    }

    this._files = [...current, ...accepted];
    if (!multiple && this._files.length > 1) {
      this._files = [this._files[this._files.length - 1]];
    }
    const activeKeys = new Set(this._files.map((file) => this._fileKey(file)));
    Array.from(this._uploadState.keys()).forEach((key) => {
      if (!activeKeys.has(key)) this._uploadState.delete(key);
    });
    this._files.forEach((file) => {
      const key = this._fileKey(file);
      if (!this._uploadState.has(key)) {
        this._uploadState.set(key, { state: 'pending', progress: null });
      }
    });
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
    if (accepted.length && this.hasAttribute('upload-on-select') && this.uploadRequest) {
      void this.startUpload();
    }
    this._syncUi();
  }

  private _emit(name: string, detail: Record<string, unknown>): void {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  private _fileKey(file: File): string {
    return `${file.name}::${file.size}::${file.lastModified}`;
  }

  private _setUploadEntry(fileKey: string, next: UploadEntry): void {
    this._uploadState.set(fileKey, next);
    this._syncUi();
  }

  private async _runUpload(file: File, requestId: number): Promise<void> {
    if (!this.uploadRequest) return;
    const fileKey = this._fileKey(file);
    const controller = new AbortController();
    this._uploadControllers.set(fileKey, controller);
    this._setUploadEntry(fileKey, { state: 'uploading', progress: 0 });

    const setProgress = (progress: number) => {
      const current = this._uploadState.get(fileKey);
      if (!current || current.state !== 'uploading') return;
      const nextProgress = Number.isFinite(progress) ? Math.max(0, Math.min(100, progress)) : 0;
      this._uploadState.set(fileKey, { ...current, progress: nextProgress });
      this._emit('upload-progress', { file, fileKey, progress: nextProgress, requestId });
      this._syncUi();
    };

    try {
      const result = await this.uploadRequest({
        file,
        files: this.files,
        signal: controller.signal,
        setProgress
      });
      if (controller.signal.aborted) {
        this._uploadState.set(fileKey, { state: 'canceled', progress: null });
        this._emit('upload-cancel', { file, fileKey, requestId });
      } else {
        this._uploadState.set(fileKey, { state: 'success', progress: 100, result });
        this._emit('upload-success', { file, fileKey, requestId, result });
      }
    } catch (error) {
      if (controller.signal.aborted) {
        this._uploadState.set(fileKey, { state: 'canceled', progress: null });
        this._emit('upload-cancel', { file, fileKey, requestId });
      } else {
        const message = error instanceof Error ? error.message : 'Upload failed';
        this._uploadState.set(fileKey, { state: 'error', progress: null, error: message });
        this._emit('upload-error', { file, fileKey, requestId, error: message });
      }
    } finally {
      this._uploadControllers.delete(fileKey);
      this._syncUi();
    }
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

  private _statusLabel(state: UIFileUploadUploadState): string {
    switch (state) {
      case 'uploading':
        return 'Uploading';
      case 'success':
        return 'Uploaded';
      case 'error':
        return 'Failed';
      case 'canceled':
        return 'Canceled';
      default:
        return 'Pending';
    }
  }

  private _actionSummary(): { title: string; subtitle: string } {
    const entries = this._files.map((file) => this._uploadState.get(this._fileKey(file)) || { state: 'pending', progress: null });
    const uploading = entries.filter((entry) => entry.state === 'uploading').length;
    const failed = entries.filter((entry) => entry.state === 'error').length;
    const complete = entries.filter((entry) => entry.state === 'success').length;
    if (uploading > 0) {
      return {
        title: 'Upload in progress',
        subtitle: `${uploading} file${uploading === 1 ? '' : 's'} still uploading`
      };
    }
    if (failed > 0) {
      return {
        title: 'Retry required',
        subtitle: `${failed} file${failed === 1 ? '' : 's'} failed to upload`
      };
    }
    if (complete > 0 && complete === this._files.length) {
      return {
        title: 'Uploads complete',
        subtitle: `${complete} file${complete === 1 ? '' : 's'} uploaded successfully`
      };
    }
    return {
      title: 'Ready to upload',
      subtitle: `${this._files.length} file${this._files.length === 1 ? '' : 's'} queued`
    };
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
    if (!this._surfaceEl || !this._inputEl || !this._listEl || !this._errorEl || !this._actionsEl) return;

    const label = (this.getAttribute('label') || '').trim();
    const description = (this.getAttribute('description') || '').trim();
    const required = this.hasAttribute('required');
    const disabled = this._disabled();
    const dropLabel = this.getAttribute('drop-label') || 'Drag files here or browse from your device';
    const buttonText = this.getAttribute('button-text') || 'Choose files';
    const uploadButtonText = this.getAttribute('upload-button-text') || 'Start upload';
    const error = (this.getAttribute('data-error') || '').trim();
    const progressByFile = this._parseProgress();

    const labelEl = this.root.querySelector('.label') as HTMLElement;
    const descriptionEl = this.root.querySelector('.description') as HTMLElement;
    const metaEl = this.root.querySelector('.meta') as HTMLElement;
    const headlineEl = this.root.querySelector('.headline') as HTMLElement;
    const sublineEl = this.root.querySelector('.subline') as HTMLElement;
    const ctaEl = this.root.querySelector('.cta') as HTMLButtonElement;
    const requiredEl = this.root.querySelector('.required') as HTMLElement;
    const actionsTitleEl = this.root.querySelector('.actions-title') as HTMLElement;
    const actionsSubtitleEl = this.root.querySelector('.actions-subtitle') as HTMLElement;
    const actionsRowEl = this.root.querySelector('.actions-row') as HTMLElement;

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

    const canUpload = !!this.uploadRequest && this._files.length > 0;
    const summary = this._actionSummary();
    this._actionsEl.hidden = !canUpload;
    actionsTitleEl.textContent = summary.title;
    actionsSubtitleEl.textContent = summary.subtitle;
    actionsRowEl.replaceChildren();
    if (canUpload) {
      const pendingOrFailed = this._files.some((file) => {
        const state = this._uploadState.get(this._fileKey(file))?.state || 'pending';
        return state === 'pending' || state === 'error' || state === 'canceled';
      });
      const startButton = document.createElement('button');
      startButton.type = 'button';
      startButton.className = 'file-remove';
      startButton.dataset.variant = 'primary';
      startButton.textContent = this.uploading ? 'Uploading…' : pendingOrFailed ? uploadButtonText : 'Upload complete';
      startButton.disabled = disabled || this.uploading || !pendingOrFailed;
      startButton.addEventListener('click', (event) => {
        event.stopPropagation();
        void this.startUpload();
      });
      actionsRowEl.append(startButton);

      if (this.uploading) {
        const cancelAllButton = document.createElement('button');
        cancelAllButton.type = 'button';
        cancelAllButton.className = 'file-remove';
        cancelAllButton.dataset.tone = 'danger';
        cancelAllButton.textContent = 'Cancel uploads';
        cancelAllButton.disabled = disabled;
        cancelAllButton.addEventListener('click', (event) => {
          event.stopPropagation();
          this.cancelUploads();
        });
        actionsRowEl.append(cancelAllButton);
      }
    }

    const activePreviewKeys = new Set<string>();
    this._listEl.hidden = this._files.length === 0;
    this._listEl.replaceChildren(...this._files.map((file, index) => {
      const row = document.createElement('div');
      row.className = 'file';
      const fileKey = this._fileKey(file);
      activePreviewKeys.add(fileKey);
      const uploadEntry = this._uploadState.get(fileKey) || { state: 'pending', progress: null };

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
      const statusEl = document.createElement('span');
      statusEl.className = 'status';
      statusEl.dataset.state = uploadEntry.state;
      statusEl.textContent = this._statusLabel(uploadEntry.state);
      metaEl.append(statusEl);
      nameEl.append(fileNameEl, metaEl);

      const actionEl = document.createElement('button');
      actionEl.type = 'button';
      actionEl.className = 'file-remove';
      actionEl.disabled = disabled;
      if (uploadEntry.state === 'uploading') {
        actionEl.textContent = 'Cancel';
        actionEl.dataset.tone = 'danger';
        actionEl.addEventListener('click', (event) => {
          event.stopPropagation();
          this.cancelUpload(fileKey);
        });
      } else if (uploadEntry.state === 'error') {
        actionEl.textContent = 'Retry';
        actionEl.dataset.variant = 'primary';
        actionEl.addEventListener('click', (event) => {
          event.stopPropagation();
          this._uploadState.set(fileKey, { state: 'pending', progress: null });
          this._syncUi();
          void this.startUpload();
        });
      } else {
        actionEl.textContent = 'Remove';
        actionEl.addEventListener('click', (event) => {
          event.stopPropagation();
          this.removeFile(index);
        });
      }

      row.append(preview, nameEl, actionEl);

      const progressValue = typeof uploadEntry.progress === 'number'
        ? uploadEntry.progress
        : (progressByFile[fileKey] ?? progressByFile[file.name]);
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
        text.textContent = uploadEntry.state === 'success'
          ? 'Upload complete'
          : uploadEntry.state === 'error'
            ? (uploadEntry.error || 'Upload failed')
            : uploadEntry.state === 'canceled'
              ? 'Upload canceled'
              : `Uploading ${Math.round(progressValue)}%`;

        progressWrap.append(track, text);
        row.append(progressWrap);
      } else if (uploadEntry.state === 'error' && uploadEntry.error) {
        const errorEl = document.createElement('div');
        errorEl.className = 'file-error';
        errorEl.textContent = uploadEntry.error;
        row.append(errorEl);
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
