import { ElementBase } from '../ElementBase';
import { escapeHtml } from '../primitives/escape-html';

/**
 * A file or image attachment: preview, name, size or status, upload progress and actions. For
 * chat composers, message threads and upload lists.
 *
 *   <ui-attachment name="report.pdf" bytes="482133" state="uploading" progress="40" removable></ui-attachment>
 *   <ui-attachment name="photo.jpg" orientation="vertical" href="/files/photo.jpg">
 *     <img slot="media" src="/thumbs/photo.jpg" alt="" />
 *   </ui-attachment>
 *
 * Without media it shows an icon for the file's kind (from `type`, a MIME type, or the
 * extension of `name`). The description is `description`, else the kind and formatted `bytes`,
 * else the state ("Uploading 40%", "Processing…"); in the error state put the reason in
 * `description` (it is not shown by colour alone). `href` makes the card open the file: the whole
 * card is the link (named "Open <name>") and actions stay separate buttons on top of it.
 *
 * Attributes: `name`, `description`, `type`, `bytes`, `state` (idle | uploading | processing |
 * error | done; default done), `progress` (0-100 while uploading; without it the bar is
 * indeterminate), `size` (md | sm | xs), `orientation` (horizontal | vertical), `media-variant`
 * (icon | image), `href`, `target`, `removable`, `remove-label`. Slots: `media`, `actions`.
 * Events: `remove` (detail: { name }) when the remove button is pressed.
 */
const style = `
  :host {
    --ui-attachment-bg: var(--ui-color-surface, #ffffff);
    --ui-attachment-border: var(--ui-color-border, color-mix(in srgb, var(--ui-color-text, #0f172a) 14%, transparent));
    --ui-attachment-radius: var(--ui-radius, 10px);
    --ui-attachment-media: 36px;
    --ui-attachment-pad: 8px;
    --ui-attachment-width: 240px;
    --ui-attachment-accent: var(--ui-color-primary, #2563eb);
    color-scheme: light dark;
    display: inline-block;
    vertical-align: top;
    inline-size: var(--ui-attachment-width);
    max-inline-size: 100%;
    min-inline-size: 0;
    font-family: var(--ui-font-family, "Inter", system-ui, -apple-system, "Segoe UI", sans-serif);
  }
  :host([hidden]) { display: none; }
  :host([size="sm"]) { --ui-attachment-media: 28px; --ui-attachment-pad: 6px; --ui-attachment-width: 200px; }
  :host([size="xs"]) { --ui-attachment-media: 20px; --ui-attachment-pad: 4px; --ui-attachment-width: 160px; }
  :host([orientation="vertical"]) { --ui-attachment-width: 160px; }

  .card {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    box-sizing: border-box;
    min-inline-size: 0;
    padding: var(--ui-attachment-pad);
    padding-inline-end: calc(var(--ui-attachment-pad) + 2px);
    border: 1px solid var(--ui-attachment-border);
    border-radius: var(--ui-attachment-radius);
    background: var(--ui-attachment-bg);
    overflow: hidden;
  }
  :host([orientation="vertical"]) .card { flex-direction: column; align-items: stretch; padding: 0; gap: 0; }
  :host([state="error"]) .card { border-color: color-mix(in srgb, var(--ui-color-danger, #dc2626) 55%, transparent); }
  :host([href]) .card:hover { border-color: var(--ui-color-line-strong, color-mix(in srgb, var(--ui-color-text, #0f172a) 28%, transparent)); }

  .media {
    position: relative;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    inline-size: var(--ui-attachment-media);
    block-size: var(--ui-attachment-media);
    overflow: hidden;
    border-radius: calc(var(--ui-attachment-radius) - 4px);
    background: var(--ui-color-fill, color-mix(in srgb, var(--ui-color-text, #0f172a) 6%, transparent));
    color: var(--ui-color-text-secondary, var(--ui-color-text, #334155));
  }
  .media svg { inline-size: 55%; block-size: 55%; }
  .fallback-icon { display: contents; }
  .fallback-icon[hidden] { display: none; }
  :host([orientation="vertical"]) .media {
    inline-size: 100%;
    block-size: auto;
    aspect-ratio: 4 / 3;
    border-radius: 0;
  }
  ::slotted([slot="media"]) {
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
  }
  .kind-label {
    position: absolute;
    inset-block-end: 2px;
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .content {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-inline-size: 0;
  }
  :host([orientation="vertical"]) .content { padding: 8px 10px; }

  .title {
    overflow: hidden;
    color: var(--ui-color-text-strong, var(--ui-color-text, #0f172a));
    font-size: var(--ui-font-size-sm, 0.8125rem);
    font-weight: 550;
    line-height: 1.35;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .description {
    overflow: hidden;
    color: var(--ui-color-muted, #526175);
    font-size: 0.75rem;
    line-height: 1.35;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  :host([state="error"]) .description { color: var(--ui-color-danger-text, var(--ui-color-danger, #b91c1c)); white-space: normal; }
  :host([size="xs"]) .description { display: none; }

  :host([state="uploading"]) .title,
  :host([state="processing"]) .title {
    background: linear-gradient(90deg, currentColor 0%, currentColor 40%, color-mix(in srgb, currentColor 35%, transparent) 50%, currentColor 60%, currentColor 100%);
    background-size: 220% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ui-attachment-shimmer 2s linear infinite;
  }
  @keyframes ui-attachment-shimmer { from { background-position: 100% 0; } to { background-position: -120% 0; } }

  .progress {
    position: absolute;
    inset-inline: 0;
    inset-block-end: 0;
    block-size: 2px;
    overflow: hidden;
    background: color-mix(in srgb, var(--ui-attachment-accent) 15%, transparent);
  }
  .progress[hidden] { display: none; }
  .bar {
    block-size: 100%;
    inline-size: var(--ui-attachment-progress, 30%);
    background: var(--ui-attachment-accent);
    transition: inline-size 200ms ease;
  }
  .progress[data-indeterminate] .bar { animation: ui-attachment-indeterminate 1.2s ease-in-out infinite; }
  @keyframes ui-attachment-indeterminate { from { transform: translateX(-100%); } to { transform: translateX(340%); } }

  .actions {
    position: relative;
    z-index: 1;
    flex: none;
    display: flex;
    align-items: center;
    gap: 2px;
  }
  :host([orientation="vertical"]) .actions { position: absolute; inset-block-start: 6px; inset-inline-end: 6px; }
  .actions[data-empty] { display: none; }

  .remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: 24px;
    block-size: 24px;
    padding: 0;
    border: 0;
    border-radius: var(--ui-control-radius-1, 4px);
    background: transparent;
    color: var(--ui-color-muted, #526175);
    cursor: pointer;
  }
  :host([orientation="vertical"]) .remove { background: var(--ui-attachment-bg); box-shadow: 0 1px 3px rgba(15, 23, 42, 0.18); }
  .remove:hover { background: var(--ui-color-fill-hover, color-mix(in srgb, var(--ui-color-text, #0f172a) 8%, transparent)); color: var(--ui-color-text, #0f172a); }
  .remove svg { inline-size: 14px; block-size: 14px; }

  /* The link covers the card; actions sit above it so neither blocks the other. */
  .trigger {
    position: absolute;
    inset: 0;
    z-index: 0;
    border-radius: inherit;
  }
  .remove:focus-visible,
  .trigger:focus-visible {
    outline: var(--ui-ring-width, 2px) solid var(--ui-ring-color, var(--ui-color-focus-ring, #2563eb));
    outline-offset: -2px;
  }

  .sr {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  @media (prefers-reduced-motion: reduce) {
    :host([state]) .title { animation: none !important; background: none !important; -webkit-text-fill-color: currentColor !important; }
    .progress[data-indeterminate] .bar { animation: none; inline-size: 100%; opacity: 0.5; }
  }
  @media (forced-colors: active) {
    .card { border-color: CanvasText; }
    .bar { background: Highlight; }
  }
`;

type Kind = 'image' | 'video' | 'audio' | 'pdf' | 'archive' | 'code' | 'sheet' | 'doc' | 'file';

const ICONS: Record<Kind, string> = {
  image: '<path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h11A1.5 1.5 0 0 1 17 4.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 15.5Z"/><circle cx="7.5" cy="7.5" r="1.5"/><path d="m3.5 14 4-4 3 3 2-2 4 4"/>',
  video: '<rect x="2.5" y="4.5" width="11" height="11" rx="1.5"/><path d="m13.5 8.5 4-2.5v8l-4-2.5"/>',
  audio: '<path d="M8 14.5V5l8-1.5v9.5"/><circle cx="6" cy="14.5" r="2"/><circle cx="14" cy="13" r="2"/>',
  pdf: '<path d="M5 2.5h6.5L15 6v11.5H5Z"/><path d="M11.5 2.5V6H15"/>',
  archive: '<path d="M5 2.5h6.5L15 6v11.5H5Z"/><path d="M9 4v1.5M9 7v1.5M9 10v1.5"/>',
  code: '<path d="m7 6-4 4 4 4M13 6l4 4-4 4"/>',
  sheet: '<path d="M4 3.5h12v13H4Z"/><path d="M4 8h12M4 12.5h12M9 3.5v13"/>',
  doc: '<path d="M5 2.5h6.5L15 6v11.5H5Z"/><path d="M7.5 9.5h5M7.5 12h5M7.5 14.5h3"/>',
  file: '<path d="M5 2.5h6.5L15 6v11.5H5Z"/><path d="M11.5 2.5V6H15"/>',
};

const EXTENSIONS: Record<string, Kind> = {
  png: 'image', jpg: 'image', jpeg: 'image', gif: 'image', webp: 'image', avif: 'image', svg: 'image', heic: 'image',
  mp4: 'video', mov: 'video', webm: 'video', mkv: 'video',
  mp3: 'audio', wav: 'audio', ogg: 'audio', m4a: 'audio', flac: 'audio',
  pdf: 'pdf',
  zip: 'archive', gz: 'archive', tar: 'archive', rar: 'archive', '7z': 'archive',
  js: 'code', ts: 'code', tsx: 'code', jsx: 'code', json: 'code', py: 'code', rb: 'code', go: 'code', rs: 'code', java: 'code', css: 'code', html: 'code', sh: 'code', yml: 'code', yaml: 'code',
  csv: 'sheet', xls: 'sheet', xlsx: 'sheet', numbers: 'sheet',
  doc: 'doc', docx: 'doc', txt: 'doc', md: 'doc', rtf: 'doc', pages: 'doc', odt: 'doc',
};

export function attachmentKind(name: string, type: string): Kind {
  const mime = (type || '').toLowerCase();
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('audio/')) return 'audio';
  if (mime === 'application/pdf') return 'pdf';
  if (/zip|compressed|tar|gzip/.test(mime)) return 'archive';
  if (/spreadsheet|excel|csv/.test(mime)) return 'sheet';
  if (/word|document|text\/plain|markdown|rtf/.test(mime)) return 'doc';
  if (/javascript|json|typescript|x-python|x-sh|html|css/.test(mime)) return 'code';
  const ext = /\.([a-z0-9]+)$/i.exec(name || '')?.[1]?.toLowerCase();
  return (ext && EXTENSIONS[ext]) || 'file';
}

/** 482133 -> "471 KB" (binary units, the way file managers on most platforms show sizes). */
export function formatBytes(value: number): string {
  if (!Number.isFinite(value) || value < 0) return '';
  if (value < 1024) return `${Math.round(value)} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let size = value / 1024;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size >= 10 ? Math.round(size) : Math.round(size * 10) / 10} ${units[unit]}`;
}

const KIND_LABEL: Record<Kind, string> = { image: 'Image', video: 'Video', audio: 'Audio', pdf: 'PDF', archive: 'Archive', code: 'Code', sheet: 'Spreadsheet', doc: 'Document', file: 'File' };
const REMOVE_ICON = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="m4.5 4.5 7 7m0-7-7 7"/></svg>';

export class UIAttachment extends ElementBase {
  static get observedAttributes() {
    return ['name', 'description', 'type', 'bytes', 'state', 'progress', 'href', 'target', 'removable', 'remove-label', 'media-variant', 'orientation'];
  }

  constructor() {
    super();
    this.root.addEventListener('slotchange', () => this.syncSlots());
    this.root.addEventListener('click', (event) => {
      if (!(event.target as Element | null)?.closest?.('.remove')) return;
      event.preventDefault();
      this.dispatchEvent(new CustomEvent('remove', { detail: { name: this.getAttribute('name') || '' }, bubbles: true, composed: true }));
    });
  }

  protected override shouldRenderOnAttributeChange(name: string): boolean {
    if (name === 'progress') {
      this.syncProgress();
      return false;
    }
    return true;
  }

  private stateText(): string {
    const state = this.getAttribute('state');
    const progress = this.progressValue();
    if (state === 'uploading') return progress == null ? 'Uploading…' : `Uploading ${Math.round(progress)}%`;
    if (state === 'processing') return 'Processing…';
    if (state === 'error') return 'Upload failed';
    if (state === 'idle') return 'Waiting to upload';
    return '';
  }

  private progressValue(): number | null {
    const raw = this.getAttribute('progress');
    if (raw == null || raw === '') return null;
    const value = Number(raw);
    return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : null;
  }

  private syncProgress(): void {
    const progress = this.root.querySelector('.progress') as HTMLElement | null;
    if (!progress) return;
    const value = this.progressValue();
    progress.toggleAttribute('data-indeterminate', value == null);
    if (value == null) {
      progress.removeAttribute('aria-valuenow');
      this.style.removeProperty('--ui-attachment-progress');
    } else {
      progress.setAttribute('aria-valuenow', String(Math.round(value)));
      this.style.setProperty('--ui-attachment-progress', `${value}%`);
    }
    // Without an explicit description the text follows the percentage.
    if (!this.hasAttribute('description')) {
      const description = this.root.querySelector('.description');
      const text = this.describe();
      if (description && description.textContent !== text) description.textContent = text;
    }
  }

  private describe(): string {
    const explicit = this.getAttribute('description');
    if (explicit) return explicit;
    const state = this.getAttribute('state');
    if (state && state !== 'done') return this.stateText();
    const kind = attachmentKind(this.getAttribute('name') || '', this.getAttribute('type') || '');
    const bytes = Number(this.getAttribute('bytes'));
    return [KIND_LABEL[kind], this.hasAttribute('bytes') ? formatBytes(bytes) : ''].filter(Boolean).join(' · ');
  }

  private syncSlots(): void {
    const media = this.root.querySelector('slot[name="media"]') as HTMLSlotElement | null;
    const hasMedia = !!media && media.assignedNodes().length > 0;
    this.root.querySelector('.fallback-icon')?.toggleAttribute('hidden', hasMedia);
    const actions = this.root.querySelector('slot[name="actions"]') as HTMLSlotElement | null;
    const hasActions = (!!actions && actions.assignedNodes().length > 0) || this.hasAttribute('removable');
    this.root.querySelector('.actions')?.toggleAttribute('data-empty', !hasActions);
  }

  protected override render(): void {
    const name = this.getAttribute('name') || 'Untitled';
    const state = this.getAttribute('state') || 'done';
    const kind = attachmentKind(name, this.getAttribute('type') || '');
    const href = this.getAttribute('href');
    const target = this.getAttribute('target');
    const busy = state === 'uploading' || state === 'processing';
    const ext = /\.([a-z0-9]{1,4})$/i.exec(name)?.[1] || '';
    const removeLabel = this.getAttribute('remove-label') || `Remove ${name}`;

    if (!this.hasAttribute('role')) this.setAttribute('role', 'group');
    this.setAttribute('aria-label', [name, this.stateText()].filter(Boolean).join(', '));
    if (busy) this.setAttribute('aria-busy', 'true');
    else this.removeAttribute('aria-busy');

    const fallback = `<span class="fallback-icon" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${ICONS[kind]}</svg>${kind === 'file' || kind === 'pdf' || kind === 'archive' ? `<span class="kind-label">${escapeHtml(ext)}</span>` : ''}</span>`;

    this.setContent(`
      <style>${style}</style>
      <div class="card" part="card">
        ${href ? `<a class="trigger" part="trigger" href="${escapeHtml(href)}"${target ? ` target="${escapeHtml(target)}" rel="noopener noreferrer"` : ''}><span class="sr">Open ${escapeHtml(name)}${target === '_blank' ? ' (opens in a new tab)' : ''}</span></a>` : ''}
        <span class="media" part="media">${fallback}<slot name="media"></slot></span>
        <span class="content" part="content">
          <span class="title" part="title" title="${escapeHtml(name)}">${escapeHtml(name)}</span>
          <span class="description" part="description">${escapeHtml(this.describe())}</span>
        </span>
        <span class="actions" part="actions">
          <slot name="actions"></slot>
          ${this.hasAttribute('removable') ? `<button type="button" class="remove" part="remove-button" aria-label="${escapeHtml(removeLabel)}">${REMOVE_ICON}</button>` : ''}
        </span>
        <span class="progress" part="progress" role="progressbar" aria-label="${escapeHtml(`Upload progress for ${name}`)}" aria-valuemin="0" aria-valuemax="100"${state === 'uploading' ? '' : ' hidden'}><span class="bar"></span></span>
      </div>
    `);
    this.syncSlots();
    this.syncProgress();
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-attachment')) {
  customElements.define('ui-attachment', UIAttachment);
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-attachment': UIAttachment;
  }
}
