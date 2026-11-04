/**
 * Chat panel for one editor: an instruction box with ready-made prompts, a
 * model picker, a live log of what the agent does, and Stop. The edits
 * themselves appear in the editor as ai-review suggestions.
 */
import type { AgentStep } from '../core/loop.js';
import type { AgentController } from './attach.js';
import { applyTheme, ensureStyles } from './styles.js';

export interface AgentPanelLabels {
  title: string;
  placeholder: string;
  run: string;
  stop: string;
  close: string;
  working: string;
  reviewFirst: string;
  noChanges: string;
  suggestions: (count: number) => string;
  conflicts: (count: number) => string;
  stopped: string;
  limit: string;
  presets: string[];
  tool: (name: string, args: Record<string, unknown>) => string;
}

export const DEFAULT_PANEL_LABELS: AgentPanelLabels = {
  title: 'Agent',
  placeholder: 'What should change? For example: "Make the headings sentence case and fix the tense."',
  run: 'Run',
  stop: 'Stop',
  close: 'Close',
  working: 'Working',
  reviewFirst: 'Review the suggestions in the editor first: accept or reject them, then ask again.',
  noChanges: 'The agent made no changes.',
  suggestions: (count) => `${count} suggestion${count === 1 ? '' : 's'} in the editor: accept or reject each, or use Accept all.`,
  conflicts: (count) => `${count} block${count === 1 ? ' was' : 's were'} edited while the agent worked and kept your text.`,
  stopped: 'Stopped. Nothing was changed.',
  limit: 'The agent used all its steps; its changes so far are shown as suggestions.',
  presets: ['Fix spelling and grammar', 'Make it more concise', 'Use sentence case for headings', 'Add a short summary at the top'],
  tool: (name, args) => {
    const id = typeof args.block_id === 'string' ? ` ${args.block_id}` : '';
    switch (name) {
      case 'get_document':
        return 'Reading the document';
      case 'get_selection':
        return 'Looking at your selection';
      case 'search':
        return `Searching for ${JSON.stringify(String(args.query ?? '')).slice(0, 60)}`;
      case 'replace_text':
        return `Editing${id}`;
      case 'rewrite_block':
        return `Rewriting${id}`;
      case 'insert_blocks':
        return `Adding ${Array.isArray(args.blocks) ? args.blocks.length : ''} block${Array.isArray(args.blocks) && args.blocks.length === 1 ? '' : 's'}`.replace('  ', ' ');
      case 'delete_blocks':
        return `Removing ${Array.isArray(args.block_ids) ? args.block_ids.join(', ') : 'blocks'}`;
      default:
        return name;
    }
  },
};

export interface AgentPanelOptions {
  labels?: Partial<AgentPanelLabels>;
  onClose?: () => void;
}

export interface AgentPanel {
  readonly open: boolean;
  show(anchor?: Element | null): void;
  close(): void;
  toggle(anchor?: Element | null): void;
  /** Fill the box and run (for commands and tests). */
  run(instruction: string): Promise<void>;
  destroy(): void;
}

const EDITOR_HOST = '[data-editora-editor], .rte-editor, .editora-editor, editora-editor';

function el<K extends keyof HTMLElementTagNameMap>(doc: Document, tag: K, className?: string, text?: string): HTMLElementTagNameMap[K] {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function createAgentPanel(controller: AgentController, options: AgentPanelOptions = {}): AgentPanel {
  const root = controller.root;
  const doc = root.ownerDocument;
  const win = doc.defaultView ?? window;
  const labels: AgentPanelLabels = { ...DEFAULT_PANEL_LABELS, ...options.labels };
  let panel: HTMLElement | null = null;
  let anchor: Element | null = null;
  let returnFocus: HTMLElement | null = null;
  let parts: { input: HTMLTextAreaElement; runButton: HTMLButtonElement; stopButton: HTMLButtonElement; log: HTMLUListElement; status: HTMLElement; picker: HTMLSelectElement | null } | null = null;
  const offs: Array<() => void> = [];

  const addLog = (text: string, kind: 'tool' | 'answer' | 'error' | 'note' | 'user') => {
    if (!parts) return;
    const item = el(doc, 'li', undefined, text);
    item.dataset.kind = kind;
    parts.log.append(item);
    item.scrollIntoView?.({ block: 'nearest' });
  };

  const setStatus = (text: string, busy = false) => {
    if (!parts) return;
    parts.status.textContent = text;
    parts.status.classList.toggle('eag-busy', busy);
  };

  const sync = () => {
    if (!parts) return;
    const busy = controller.busy;
    parts.runButton.hidden = busy;
    parts.stopButton.hidden = !busy;
    parts.runButton.disabled = controller.reviewing;
    parts.input.disabled = busy;
    if (parts.picker) parts.picker.disabled = busy;
    // A run's own report already says to review; this covers opening the panel mid-review.
    if (!busy && controller.reviewing && !parts.status.textContent) setStatus(labels.reviewFirst);
  };

  const onStep = (step: AgentStep) => {
    if (step.type === 'tool') addLog(step.isError ? `${labels.tool(step.name, step.arguments)}: ${step.result.replace(/^Error: /, '')}` : labels.tool(step.name, step.arguments), step.isError ? 'error' : 'tool');
  };

  const run = async (instruction: string) => {
    if (!parts || controller.busy) return;
    const text = instruction.trim();
    if (!text) return parts.input.focus();
    addLog(text, 'user');
    setStatus(labels.working, true);
    try {
      const summary = await controller.run(text, { choice: parts.picker?.value });
      const { result } = summary;
      if (result.stopped === 'aborted') return setStatus(labels.stopped);
      if (result.answer) addLog(result.answer, result.stopped === 'refusal' ? 'error' : 'answer');
      const notes = [summary.suggestions ? labels.suggestions(summary.suggestions) : labels.noChanges];
      if (summary.conflicts.length) notes.push(labels.conflicts(summary.conflicts.length));
      if (result.stopped === 'limit') notes.push(labels.limit);
      setStatus(notes.join(' '));
      parts.input.value = '';
    } catch (error) {
      addLog((error as Error)?.message ?? String(error), 'error');
      setStatus('');
    } finally {
      sync();
    }
  };

  const place = () => {
    if (!panel) return;
    const width = panel.offsetWidth;
    const height = panel.offsetHeight;
    const clampTop = (top: number) => `${Math.max(16, Math.min(top, win.innerHeight - height - 16))}px`;
    const editor = (root.closest(EDITOR_HOST) ?? root).getBoundingClientRect();
    if (win.innerWidth - editor.right >= width + 28) {
      panel.style.left = `${editor.right + 12}px`;
      panel.style.top = clampTop(editor.top);
      return;
    }
    const rect = (anchor ?? root).getBoundingClientRect();
    panel.style.left = `${Math.max(16, Math.min(rect.left, win.innerWidth - width - 16))}px`;
    panel.style.top = clampTop(rect.bottom + 6);
  };

  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      if (controller.busy) controller.stop();
      else api.close();
    }
  };

  const api: AgentPanel = {
    get open() {
      return Boolean(panel);
    },
    show(nextAnchor) {
      anchor = nextAnchor ?? null;
      if (panel) {
        place();
        parts?.input.focus();
        return;
      }
      ensureStyles(doc);
      returnFocus = doc.activeElement as HTMLElement | null;
      panel = el(doc, 'section', 'eag-panel');
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', labels.title);
      panel.setAttribute('data-air-ui', '');
      applyTheme(panel, root);

      const header = el(doc, 'header');
      const title = el(doc, 'h2', '', labels.title);
      const close = el(doc, 'button', 'eag-btn', labels.close);
      close.type = 'button';
      close.addEventListener('click', () => api.close());
      header.append(title, close);

      const presets = el(doc, 'div', 'eag-presets');
      for (const preset of labels.presets) {
        const chip = el(doc, 'button', 'eag-chip', preset);
        chip.type = 'button';
        chip.addEventListener('click', () => {
          if (!parts || controller.busy) return;
          parts.input.value = preset;
          void run(preset);
        });
        presets.append(chip);
      }

      const form = el(doc, 'form', 'eag-form');
      const input = el(doc, 'textarea');
      input.placeholder = labels.placeholder;
      input.setAttribute('aria-label', labels.placeholder);
      input.rows = 3;
      const row = el(doc, 'div', 'eag-row');
      let picker: HTMLSelectElement | null = null;
      if (controller.choices.length > 1) {
        picker = el(doc, 'select');
        picker.setAttribute('aria-label', 'Model');
        for (const choice of controller.choices) {
          const option = el(doc, 'option', undefined, choice.label);
          option.value = choice.id;
          picker.append(option);
        }
        row.append(picker);
      }
      row.append(el(doc, 'span', 'eag-spacer'));
      const stopButton = el(doc, 'button', 'eag-btn', labels.stop);
      stopButton.type = 'button';
      stopButton.hidden = true;
      stopButton.addEventListener('click', () => controller.stop());
      const runButton = el(doc, 'button', 'eag-btn eag-btn-primary', labels.run);
      runButton.type = 'submit';
      row.append(stopButton, runButton);
      form.append(input, row);
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        void run(input.value);
      });
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
          event.preventDefault();
          void run(input.value);
        }
      });

      const status = el(doc, 'p', 'eag-status');
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      const log = el(doc, 'ul', 'eag-log');
      log.setAttribute('aria-label', 'What the agent did');

      panel.append(header, presets, form, status, log);
      doc.body.appendChild(panel);
      parts = { input, runButton, stopButton, log, status, picker };
      offs.push(
        controller.on('state', sync),
        controller.on('step', onStep),
        controller.on('reviewEnd', () => setStatus('')),
      );
      panel.addEventListener('keydown', onKey);
      win.addEventListener('resize', place);
      sync();
      place();
      input.focus({ preventScroll: true });
    },
    close() {
      if (!panel) return;
      offs.splice(0).forEach((off) => off());
      win.removeEventListener('resize', place);
      const hadFocus = panel.contains(doc.activeElement);
      panel.remove();
      panel = null;
      parts = null;
      if (hadFocus && returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
      else if (hadFocus) root.focus({ preventScroll: true });
      options.onClose?.();
    },
    toggle(nextAnchor) {
      if (panel) api.close();
      else api.show(nextAnchor);
    },
    async run(instruction) {
      if (!panel) api.show();
      if (parts) parts.input.value = instruction;
      await run(instruction);
    },
    destroy() {
      api.close();
    },
  };
  return api;
}
