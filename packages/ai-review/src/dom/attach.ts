import { REWRITE_PRESETS, type RewritePreset } from '../core/prompt';
import { runRewrite } from '../core/run';
import { AIProviderError, type AIProvider } from '../providers/types';
import { createDomReview, type DomReview, type ReviewEndInfo, type ReviewLabels } from './overlay';
import { DEFAULT_SETTINGS, describeSettings, loadSettings, openSettingsDialog, providerFromSettings, type UserSettingsConfig } from './settings';
import { applyTheme, ensureStyles, ICONS } from './styles';
import { buildTextMap, targetsForRange, textBlocks, type ReviewTarget } from './text';

export interface MenuLabels {
  menu: string;
  placeholder: string;
  run: string;
  settings: string;
  noTarget: string;
  connectionHelp: string;
}

export const DEFAULT_MENU_LABELS: MenuLabels = {
  menu: 'Ask AI to edit',
  placeholder: 'Ask AI to edit the selection…',
  run: 'Rewrite',
  settings: 'Model settings',
  noTarget: 'Put the cursor in a paragraph or select some text first.',
  connectionHelp: 'Check the model settings.',
};

export interface AttachOptions {
  /** A fixed provider (or a function returning one). When set, users cannot change it unless `userSettings` is also given. */
  provider?: AIProvider | (() => AIProvider | Promise<AIProvider>);
  /** Let users pick the provider and model and enter their own key. On by default when no `provider` is given. */
  userSettings?: boolean | UserSettingsConfig;
  presets?: RewritePreset[];
  /** House style rules added to every prompt. */
  guidelines?: string;
  /** Characters of surrounding text sent as read-only context (default 1200, 0 to send none). */
  contextChars?: number;
  temperature?: number;
  labels?: Partial<ReviewLabels & MenuLabels>;
  /** Where to put the review bar; by default right before the editable element. */
  barHost?: (root: HTMLElement) => { parent: Node; before: Node | null };
  onEnd?: (info: ReviewEndInfo) => void;
  onError?: (error: unknown) => void;
}

export interface AIReviewController {
  /** Rewrite the current selection (or `range`) with `instruction`, a preset id or free text. */
  rewrite(instruction: string, range?: Range | null): Promise<void>;
  /** Open the "Ask AI" menu next to `anchor` (an element or a rect), or under the selection. */
  openMenu(anchor?: Element | DOMRect | null): void;
  closeMenu(): void;
  openSettings(): Promise<void>;
  /** The review being shown, if any. */
  readonly current: DomReview | null;
  /** Stop the model and drop its suggestions. */
  cancel(): void;
  destroy(): void;
}

let menuUid = 0;

export function attachAIReview(root: HTMLElement, options: AttachOptions = {}): AIReviewController {
  ensureStyles(root.ownerDocument);
  const doc = root.ownerDocument;
  const view = doc.defaultView ?? window;
  const labels = { ...DEFAULT_MENU_LABELS, ...options.labels };
  const presets = options.presets ?? REWRITE_PRESETS;
  const settingsConfig: UserSettingsConfig | null =
    options.userSettings === false || (options.userSettings === undefined && options.provider)
      ? null
      : typeof options.userSettings === 'object'
        ? options.userSettings
        : {};

  let current: DomReview | null = null;
  let abort: AbortController | null = null;
  let savedRange: Range | null = null;
  let menu: HTMLElement | null = null;
  let menuCleanup: (() => void) | null = null;
  let highlighted: HTMLElement[] = [];

  const rememberSelection = () => {
    const selection = doc.getSelection();
    if (selection && selection.rangeCount > 0 && root.contains(selection.getRangeAt(0).commonAncestorContainer)) {
      savedRange = selection.getRangeAt(0).cloneRange();
    }
  };
  doc.addEventListener('selectionchange', rememberSelection);

  const settings = () => (settingsConfig ? loadSettings(settingsConfig) ?? DEFAULT_SETTINGS : null);

  const resolveProvider = async (): Promise<AIProvider> => {
    const saved = settingsConfig ? loadSettings(settingsConfig) : null;
    if (saved) return providerFromSettings(saved, settingsConfig ?? undefined);
    if (options.provider) return typeof options.provider === 'function' ? options.provider() : options.provider;
    return providerFromSettings(DEFAULT_SETTINGS, settingsConfig ?? undefined);
  };

  const providerLabel = () => {
    const saved = settingsConfig ? loadSettings(settingsConfig) : null;
    if (saved) return describeSettings(saved, settingsConfig ?? undefined);
    if (options.provider && typeof options.provider !== 'function') {
      return [options.provider.id, options.provider.model].filter(Boolean).join(' · ');
    }
    return options.provider ? '' : describeSettings(DEFAULT_SETTINGS);
  };

  const contextFor = (targets: ReviewTarget[]): string | undefined => {
    const limit = options.contextChars ?? 1200;
    if (limit <= 0) return undefined;
    const blocks = textBlocks(root);
    const first = blocks.indexOf(targets[0].block);
    const last = blocks.indexOf(targets[targets.length - 1].block);
    const parts: string[] = [];
    const partial = targets.some((target) => target.start > 0 || target.end < buildTextMap(target.block).text.length);
    // A partial selection is best understood with its whole paragraph.
    if (partial) targets.forEach((target) => parts.push(buildTextMap(target.block).text));
    if (first > 0) parts.unshift(buildTextMap(blocks[first - 1]).text);
    if (last >= 0 && last < blocks.length - 1) parts.push(buildTextMap(blocks[last + 1]).text);
    const text = parts.join('\n\n');
    return text ? text.slice(0, limit) : undefined;
  };

  const describeError = (error: unknown): string => {
    const text = error instanceof Error ? error.message : String(error);
    const connection = error instanceof AIProviderError && (!error.status || error.status === 401 || error.status === 403 || error.status === 404);
    return connection && settingsConfig ? `${text} ${labels.connectionHelp}` : text;
  };

  function cancel(): void {
    abort?.abort();
    abort = null;
    if (current && !current.ended) current.discard();
    current = null;
  }

  async function rewrite(instruction: string, range: Range | null = null): Promise<void> {
    closeMenu();
    cancel();

    const preset = presets.find((candidate) => candidate.id === instruction);
    const text = preset?.instruction ?? instruction.trim();
    if (!text) return;

    const targets = targetsForRange(root, range ?? savedRange);
    if (targets.length === 0) {
      const error = new Error(labels.noTarget);
      options.onError?.(error);
      throw error;
    }

    const controller = new AbortController();
    abort = controller;
    const review = createDomReview({
      root,
      targets,
      labels: options.labels,
      barHost: options.barHost?.(root),
      onStop: () => cancel(),
      onEnd: (info) => {
        if (current === review) current = null;
        options.onEnd?.(info);
      },
    });
    current = review;

    try {
      const provider = await resolveProvider();
      await runRewrite({
        provider,
        review: review.review,
        instruction: text,
        context: contextFor(targets),
        guidelines: options.guidelines,
        temperature: options.temperature,
        signal: controller.signal,
      });
    } catch (error) {
      if (controller.signal.aborted) return;
      review.fail(describeError(error));
      options.onError?.(error);
    } finally {
      if (abort === controller) abort = null;
    }
  }

  // ---- menu ------------------------------------------------------------------
  function closeMenu(): void {
    menuCleanup?.();
    menuCleanup = null;
    menu?.remove();
    menu = null;
    highlighted.forEach((block) => block.removeAttribute('data-air-active-block'));
    highlighted = [];
  }

  function openMenu(anchor: Element | DOMRect | null = null): void {
    closeMenu();
    rememberSelection();
    const range = savedRange;
    const targets = targetsForRange(root, range);
    highlighted = targets.map((target) => target.block);
    highlighted.forEach((block) => block.setAttribute('data-air-active-block', ''));

    const id = `air-menu-${(menuUid += 1)}`;
    menu = doc.createElement('div');
    menu.className = 'air-ui air-menu';
    menu.setAttribute('data-air-ui', '');
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-label', labels.menu);

    const form = doc.createElement('form');
    const input = doc.createElement('input');
    input.className = 'air-input';
    input.type = 'text';
    input.placeholder = labels.placeholder;
    input.setAttribute('aria-label', labels.placeholder);
    input.setAttribute('aria-describedby', `${id}-note`);
    input.autocomplete = 'off';
    const run = doc.createElement('button');
    run.type = 'submit';
    run.className = 'air-btn air-btn-primary air-btn-icon';
    run.title = labels.run;
    run.innerHTML = `${ICONS.sparkle}<span class="air-sr">${labels.run}</span>`;
    form.append(input, run);

    const list = doc.createElement('ul');
    list.className = 'air-menu-list';
    const items: HTMLButtonElement[] = presets.map((preset) => {
      const li = doc.createElement('li');
      const item = doc.createElement('button');
      item.type = 'button';
      item.className = 'air-menu-item';
      item.textContent = preset.label;
      item.addEventListener('click', () => void rewrite(preset.id, range).catch(() => undefined));
      li.appendChild(item);
      list.appendChild(li);
      return item;
    });

    const foot = doc.createElement('div');
    foot.className = 'air-menu-foot';
    const note = doc.createElement('span');
    note.id = `${id}-note`;
    note.textContent = targets.length === 0 ? labels.noTarget : providerLabel();
    foot.appendChild(note);
    if (settingsConfig) {
      const gear = doc.createElement('button');
      gear.type = 'button';
      gear.className = 'air-link';
      gear.textContent = labels.settings;
      gear.addEventListener('click', () => {
        closeMenu();
        void openSettings();
      });
      foot.appendChild(gear);
    }

    menu.append(form, list, foot);
    applyTheme(menu, root);
    doc.body.appendChild(menu);

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (input.value.trim()) void rewrite(input.value, range).catch(() => undefined);
    });

    const focusables = () => [input, ...items, ...Array.from(foot.querySelectorAll<HTMLElement>('button'))];
    menu.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        root.focus();
        if (range) {
          const selection = doc.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
        return;
      }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        const all = focusables();
        const index = all.indexOf(doc.activeElement as HTMLElement);
        const next = all[(index + (event.key === 'ArrowDown' ? 1 : -1) + all.length) % all.length];
        event.preventDefault();
        next.focus();
      }
    });

    // Position under the anchor, or under the selection.
    let rect: DOMRect | null = null;
    if (anchor instanceof Element) rect = anchor.getBoundingClientRect();
    else if (anchor) rect = anchor;
    else if (range) rect = range.getBoundingClientRect();
    if (!rect || (rect.width === 0 && rect.height === 0)) rect = (targets[0]?.block ?? root).getBoundingClientRect();
    const width = menu.offsetWidth || 340;
    const left = Math.max(8, Math.min(rect.left, view.innerWidth - width - 8));
    menu.style.left = `${left + view.scrollX}px`;
    menu.style.top = `${rect.bottom + view.scrollY + 6}px`;

    const onOutside = (event: Event) => {
      if (menu && !menu.contains(event.target as Node)) closeMenu();
    };
    view.setTimeout(() => doc.addEventListener('mousedown', onOutside, true), 0);
    menuCleanup = () => doc.removeEventListener('mousedown', onOutside, true);

    input.focus();
  }

  async function openSettings(): Promise<void> {
    if (!settingsConfig) return;
    await openSettingsDialog(settings() ?? DEFAULT_SETTINGS, settingsConfig, root);
  }

  return {
    rewrite,
    openMenu,
    closeMenu,
    openSettings,
    get current() {
      return current;
    },
    cancel,
    destroy() {
      cancel();
      closeMenu();
      doc.removeEventListener('selectionchange', rememberSelection);
    },
  };
}
