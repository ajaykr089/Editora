import { notify } from '../../../shared/notify';
import { recordDomHistory } from '../../../shared/historyHelpers';
import { resolveMediaManagerConfig } from '../constants';
import { adoptFigure } from '../model/figure';
import type { MediaManagerConfig } from '../types/media';
import { UploadQueue, type QueueEntry } from '../uploadQueue';
import { validateFile } from '../uploadService';
import { buildMediaNode, insertBlocks } from './picker/insertMedia';
import { icons } from './picker/icons';
import { injectMediaDialogStyles } from './styles';

interface Pending {
  id: string;
  file: File;
  host: HTMLElement;
  /** What stands in the document while the file is on its way: an empty figure, with nothing in it to save. */
  placeholder: HTMLElement;
  /** What is drawn over it (preview, progress, cancel): on the body, so none of it is document content. */
  layer: HTMLElement;
  bar: HTMLElement;
  label: HTMLElement;
  config: Partial<MediaManagerConfig> | undefined;
}

const PENDING_ATTRIBUTE = 'data-rte-media-pending';
let counter = 0;
/** Unique across page loads too: a placeholder saved in a document must never look like a live one. */
const newPendingId = (): string => `pending-${Date.now().toString(36)}-${++counter}`;

const withoutPending = (html: string): string => {
  if (!html.includes(PENDING_ATTRIBUTE)) return html;
  const template = document.createElement('template');
  template.innerHTML = html;
  template.content.querySelectorAll(`[${PENDING_ATTRIBUTE}]`).forEach((node) => node.remove());
  return template.innerHTML;
};

/**
 * Images and videos pasted or dropped into the editor. Each file gets a placeholder at once, at the caret or
 * where it was dropped, with its own progress and a cancel button, and is swapped for the real media when it has
 * been stored. A file that is refused or fails takes its placeholder away and says why.
 */
export class PendingUploads {
  private readonly pending = new Map<string, Pending>();
  private readonly queues: UploadQueue[] = [];
  private timer: ReturnType<typeof setInterval> | undefined;

  get count(): number {
    return this.pending.size;
  }

  /**
   * @param range where to put them (a pasted image goes at the caret), or null for the end of the editor
   */
  start(files: File[], host: HTMLElement, range: Range | null, config?: Partial<MediaManagerConfig>): void {
    const resolved = resolveMediaManagerConfig(config);
    const accepted: File[] = [];
    for (const file of files) {
      try {
        validateFile(file, resolved);
        accepted.push(file);
      } catch (error) {
        notify(error instanceof Error ? error.message : `Couldn't upload ${file.name}.`, 'error');
      }
    }
    if (accepted.length === 0) return;
    injectMediaDialogStyles();

    const created = accepted.map((file) => this.createPending(file, host, config));
    const target =
      range && host.contains(range.startContainer)
        ? range
        : (() => {
            const end = document.createRange();
            end.selectNodeContents(host);
            end.collapse(false);
            return end;
          })();
    insertBlocks(target, host, created.map((item) => item.placeholder));
    host.dispatchEvent(new Event('input', { bubbles: true }));

    const queue = new UploadQueue({ config, onChange: () => this.sync() });
    this.queues.push(queue);
    const entries = queue.add(created.map((item) => item.file));
    entries.forEach((entry, index) => this.entryIds.set(entry.id, { pending: created[index], queue }));
    created.forEach((item) => {
      this.pending.set(item.id, item);
      document.body.appendChild(item.layer);
    });
    this.sync();
    this.ensureTimer();
  }

  /**
   * Remove placeholders in an editor that no upload is working on: what a document that was saved (or a tab that
   * was closed) in the middle of an upload still holds. Returns whether any went.
   */
  sweep(host: HTMLElement): boolean {
    let removed = false;
    host.querySelectorAll<HTMLElement>(`[${PENDING_ATTRIBUTE}]`).forEach((node) => {
      if (this.pending.has(node.getAttribute(PENDING_ATTRIBUTE) ?? '')) return;
      node.remove();
      removed = true;
    });
    return removed;
  }

  dispose(): void {
    this.queues.forEach((queue) => queue.dispose());
    this.queues.length = 0;
    this.pending.forEach((item) => this.release(item, true));
    this.pending.clear();
    this.entryIds.clear();
    this.stopTimer();
  }

  private readonly entryIds = new Map<string, { pending: Pending; queue: UploadQueue }>();

  private createPending(file: File, host: HTMLElement, config?: Partial<MediaManagerConfig>): Pending {
    const id = newPendingId();

    const placeholder = document.createElement('figure');
    placeholder.className = 'rte-media';
    placeholder.setAttribute(PENDING_ATTRIBUTE, id);
    placeholder.setAttribute('contenteditable', 'false');
    placeholder.style.cssText =
      'display: table; width: 100%; max-width: 360px; aspect-ratio: 16 / 10; margin: 1em 0; border-radius: 8px; background: rgba(127, 127, 127, 0.14);';

    const layer = document.createElement('div');
    layer.className = 'rte-mp-pending';
    layer.setAttribute('role', 'status');
    const bar = document.createElement('span');
    const track = document.createElement('div');
    track.className = 'rte-mp-pending-bar';
    track.append(bar);
    const label = document.createElement('span');
    label.className = 'rte-mp-pending-label';
    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.className = 'rte-mp-icon-btn';
    cancel.setAttribute('aria-label', `Cancel upload of ${file.name}`);
    cancel.innerHTML = icons.close;
    cancel.addEventListener('click', () => {
      const entry = [...this.entryIds.entries()].find(([, value]) => value.pending.id === id);
      if (entry) entry[1].queue.remove(entry[0]);
    });
    layer.append(label, track, cancel);

    return { id, file, host, placeholder, layer, bar, label, config };
  }

  private sync(): void {
    for (const [entryId, { pending, queue }] of this.entryIds) {
      const entry = queue.entries.find((candidate) => candidate.id === entryId);
      if (!entry) {
        // Cancelled.
        this.finish(entryId, pending, null);
        continue;
      }
      this.show(pending, entry);
      if (entry.status === 'done' && entry.item) this.finish(entryId, pending, entry);
      else if (entry.status === 'error') {
        notify(entry.error ?? `Couldn't upload ${pending.file.name}.`, 'error');
        this.finish(entryId, pending, null);
      }
    }
  }

  private show(pending: Pending, entry: QueueEntry): void {
    const percent = Math.round(entry.fraction * 100);
    pending.bar.style.width = `${percent}%`;
    pending.label.textContent = entry.status === 'queued' ? 'Waiting…' : `Uploading ${percent}%`;
    if (entry.previewUrl && !pending.layer.style.backgroundImage && pending.file.type.startsWith('image/')) {
      pending.layer.style.backgroundImage = `url("${entry.previewUrl}")`;
    }
    this.position(pending);
  }

  private position(pending: Pending): void {
    const { placeholder, layer } = pending;
    if (!placeholder.isConnected) {
      layer.style.display = 'none';
      return;
    }
    const rect = placeholder.getBoundingClientRect();
    layer.style.display = 'flex';
    layer.style.left = `${rect.left}px`;
    layer.style.top = `${rect.top}px`;
    layer.style.width = `${rect.width}px`;
    layer.style.height = `${rect.height}px`;
  }

  /** `entry` is the finished upload, or null when it was cancelled or failed. */
  private finish(entryId: string, pending: Pending, entry: QueueEntry | null): void {
    this.entryIds.delete(entryId);
    this.pending.delete(pending.id);
    const { placeholder, host } = pending;

    if (entry?.item && placeholder.isConnected) {
      const config = resolveMediaManagerConfig(pending.config);
      const node = buildMediaNode(
        { src: entry.item.src, type: entry.item.type, alt: entry.item.alt },
        { figure: config.wrapInFigure !== false },
      );
      if (node) {
        // Undo goes back to the document as it was without this file: what was typed meanwhile stays.
        const before = withoutPending(host.innerHTML);
        placeholder.replaceWith(node);
        if (node.tagName === 'FIGURE') adoptFigure(node);
        recordDomHistory(host, before, withoutPending(host.innerHTML));
        host.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
    this.release(pending, false);
    if (this.pending.size === 0) this.stopTimer();
  }

  private release(pending: Pending, dropPlaceholder: boolean): void {
    pending.layer.remove();
    if (pending.placeholder.isConnected && (dropPlaceholder || pending.placeholder.hasAttribute(PENDING_ATTRIBUTE))) {
      pending.placeholder.remove();
    }
  }

  private ensureTimer(): void {
    if (this.timer) return;
    // Typing above a placeholder moves it; follow it. (Cheap: a handful of rectangles, only while uploading.)
    this.timer = setInterval(() => this.pending.forEach((item) => this.position(item)), 120);
  }

  private stopTimer(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
  }
}
