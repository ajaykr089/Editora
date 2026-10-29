import { createOllamaProvider, OLLAMA_CLOUD_MODELS, OLLAMA_LOCAL_URL, ollamaLocalCloudTag, DEFAULT_OLLAMA_MODEL } from '../providers/ollama';
import { createOpenAICompatibleProvider, OPENAI_COMPATIBLE_PRESETS, type OpenAICompatiblePreset } from '../providers/openai';
import { createProxyProvider } from '../providers/proxy';
import type { AIProvider } from '../providers/types';
import { applyTheme, ensureStyles } from './styles';

/** A provider your server offers through `createAIReviewHandler`. */
export interface ProxyChoice {
  /** The provider name registered in the handler's `providers`. */
  id: string;
  label: string;
  /** Ask the user for their own key (the handler needs `allowClientKeys`). */
  needsKey?: boolean;
  /** The server has a key of its own, so the user's key is optional and this can be the default. */
  keyOptional?: boolean;
  models?: string[];
  defaultModel?: string;
}

/** Ollama's hosted models on https://ollama.com, through your server (`ollamaCloudProvider` in `@editora/ai-review/server`). */
export const OLLAMA_CLOUD_CHOICE: ProxyChoice = {
  id: 'ollama-cloud',
  label: 'Ollama Cloud (ollama.com)',
  needsKey: true,
  models: OLLAMA_CLOUD_MODELS.map((model) => model.id),
  defaultModel: 'gemma4:31b',
};

export interface UserSettingsConfig {
  /** localStorage/sessionStorage key prefix. */
  storageKey?: string;
  /**
   * Your server endpoint (`createAIReviewHandler`) and the providers it offers.
   * `providers` defaults to Ollama Cloud, the online option for users without
   * a local Ollama: ollama.com does not accept requests straight from web
   * pages, so it needs this endpoint.
   */
  proxy?: { url: string; providers?: ProxyChoice[] };
  /** Offer "OpenAI-compatible API" with a key typed in the browser. Default true. */
  allowDirectKeys?: boolean;
}

export type ProviderKind = 'ollama-local' | 'openai-compatible' | 'proxy';

export interface AISettings {
  kind: ProviderKind;
  model: string;
  baseUrl?: string;
  preset?: OpenAICompatiblePreset;
  /** For `proxy`: which of the server's providers. */
  proxyProvider?: string;
  apiKey?: string;
  rememberKey?: boolean;
}

export const DEFAULT_SETTINGS: AISettings = { kind: 'ollama-local', model: DEFAULT_OLLAMA_MODEL, baseUrl: OLLAMA_LOCAL_URL };

export function proxyChoicesFor(config?: UserSettingsConfig | null): ProxyChoice[] {
  if (!config?.proxy) return [];
  return config.proxy.providers ?? [OLLAMA_CLOUD_CHOICE];
}

/** What a user gets before choosing: a server provider that has its own key, else Ollama on their computer. */
export function defaultSettingsFor(config?: UserSettingsConfig | null): AISettings {
  const ready = proxyChoicesFor(config).find((choice) => choice.keyOptional || !choice.needsKey);
  if (ready) return { kind: 'proxy', proxyProvider: ready.id, model: ready.defaultModel ?? ready.models?.[0] ?? '' };
  return DEFAULT_SETTINGS;
}

/** Whether an Ollama server answers at `baseUrl` (from this page). */
export async function isOllamaRunning(baseUrl: string = OLLAMA_LOCAL_URL, timeoutMs = 1500): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${baseUrl.replace(/\/+$/, '')}/api/tags`, { signal: controller.signal });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

const storageKeyFor = (config?: UserSettingsConfig) => config?.storageKey ?? 'editora-ai-review';

function storage(kind: 'local' | 'session'): Storage | null {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function loadSettings(config?: UserSettingsConfig): AISettings | null {
  const key = storageKeyFor(config);
  try {
    const raw = storage('local')?.getItem(key);
    if (!raw) return null;
    const settings = JSON.parse(raw) as AISettings;
    const apiKey = storage('local')?.getItem(`${key}:key`) ?? storage('session')?.getItem(`${key}:key`) ?? undefined;
    return { ...settings, apiKey: apiKey || undefined };
  } catch {
    return null;
  }
}

/** Settings go to localStorage; the key to sessionStorage, or localStorage when `rememberKey` is set. */
export function saveSettings(settings: AISettings, config?: UserSettingsConfig): void {
  const key = storageKeyFor(config);
  const { apiKey, ...rest } = settings;
  try {
    storage('local')?.setItem(key, JSON.stringify(rest));
    storage('local')?.removeItem(`${key}:key`);
    storage('session')?.removeItem(`${key}:key`);
    if (apiKey) storage(settings.rememberKey ? 'local' : 'session')?.setItem(`${key}:key`, apiKey);
  } catch {
    // Storage blocked (private mode): settings last for this page only.
  }
}

export function providerFromSettings(settings: AISettings, config?: UserSettingsConfig): AIProvider {
  switch (settings.kind) {
    case 'openai-compatible':
      return createOpenAICompatibleProvider({
        baseUrl: settings.baseUrl,
        preset: settings.preset,
        apiKey: settings.apiKey,
        model: settings.model,
      });
    case 'proxy': {
      if (!config?.proxy) throw new Error('No AI server is configured for this editor.');
      return createProxyProvider({
        url: config.proxy.url,
        provider: settings.proxyProvider,
        model: settings.model || undefined,
        apiKey: settings.apiKey,
      });
    }
    default:
      return createOllamaProvider({ baseUrl: settings.baseUrl || OLLAMA_LOCAL_URL, model: settings.model || DEFAULT_OLLAMA_MODEL });
  }
}

export function describeSettings(settings: AISettings, config?: UserSettingsConfig): string {
  if (settings.kind === 'proxy') {
    const choice = proxyChoicesFor(config).find((provider) => provider.id === settings.proxyProvider);
    return [choice?.label ?? 'Server', settings.model].filter(Boolean).join(' · ');
  }
  if (settings.kind === 'openai-compatible') {
    const preset = settings.preset ? OPENAI_COMPATIBLE_PRESETS[settings.preset]?.label : null;
    return [preset ?? 'OpenAI-compatible', settings.model].filter(Boolean).join(' · ');
  }
  return `Ollama · ${settings.model}`;
}

let uid = 0;

/** A modal form to pick the provider and model and enter a key. Resolves with the saved settings, or null if cancelled. */
export function openSettingsDialog(current: AISettings, config: UserSettingsConfig = {}, themeFrom?: Element): Promise<AISettings | null> {
  ensureStyles();
  const id = `air-settings-${(uid += 1)}`;
  const allowDirect = config.allowDirectKeys !== false;
  const proxyChoices = proxyChoicesFor(config);

  const dialog = document.createElement('dialog');
  dialog.className = 'air-ui air-dialog';
  dialog.setAttribute('data-air-ui', '');
  dialog.setAttribute('aria-labelledby', `${id}-title`);
  if (themeFrom) applyTheme(dialog, themeFrom);

  const providerOptions = [
    ...proxyChoices.map((choice) => `<option value="proxy:${escapeAttr(choice.id)}">${escapeHtml(choice.label)}</option>`),
    `<option value="ollama-local">Ollama on this computer (${escapeHtml(OLLAMA_LOCAL_URL.replace(/^https?:\/\//, ''))})</option>`,
    allowDirect ? `<option value="openai-compatible">OpenAI-compatible API (your key)</option>` : '',
  ].join('');

  const presetOptions = (Object.keys(OPENAI_COMPATIBLE_PRESETS) as OpenAICompatiblePreset[])
    .map((preset) => `<option value="${preset}">${escapeHtml(OPENAI_COMPATIBLE_PRESETS[preset].label)}</option>`)
    .join('');

  dialog.innerHTML = `
    <form method="dialog" novalidate>
      <h2 id="${id}-title">AI model</h2>
      <div class="air-field">
        <label for="${id}-provider">Provider</label>
        <select class="air-select" id="${id}-provider" name="provider">${providerOptions}</select>
        <p class="air-hint" id="${id}-provider-hint"></p>
      </div>
      <div class="air-field" data-field="preset">
        <label for="${id}-preset">Service</label>
        <select class="air-select" id="${id}-preset" name="preset">${presetOptions}</select>
      </div>
      <div class="air-field" data-field="baseUrl">
        <label for="${id}-url">Base URL</label>
        <input class="air-input" id="${id}-url" name="baseUrl" type="url" spellcheck="false" autocomplete="off" />
      </div>
      <div class="air-field" data-field="model">
        <label for="${id}-model">Model</label>
        <input class="air-input" id="${id}-model" name="model" list="${id}-models" spellcheck="false" autocomplete="off" required />
        <datalist id="${id}-models"></datalist>
      </div>
      <div class="air-field" data-field="apiKey">
        <label for="${id}-key">API key</label>
        <input class="air-input" id="${id}-key" name="apiKey" type="password" spellcheck="false" autocomplete="off" aria-describedby="${id}-key-hint" />
        <p class="air-hint" id="${id}-key-hint"></p>
        <label class="air-check"><input type="checkbox" name="rememberKey" /> Remember the key on this device</label>
      </div>
      <p class="air-hint" role="alert" data-error></p>
      <div class="air-dialog-actions">
        <button type="button" class="air-btn" value="cancel" data-cancel>Cancel</button>
        <button type="submit" class="air-btn air-btn-primary" value="save">Save</button>
      </div>
    </form>`;

  const form = dialog.querySelector('form')!;
  const field = <T extends HTMLElement>(name: string) => form.elements.namedItem(name) as unknown as T;
  const providerSelect = field<HTMLSelectElement>('provider');
  const presetSelect = field<HTMLSelectElement>('preset');
  const urlInput = field<HTMLInputElement>('baseUrl');
  const modelInput = field<HTMLInputElement>('model');
  const keyInput = field<HTMLInputElement>('apiKey');
  const rememberInput = field<HTMLInputElement>('rememberKey');
  const datalist = dialog.querySelector('datalist')!;
  const providerHint = dialog.querySelector<HTMLElement>(`#${id}-provider-hint`)!;
  const keyHint = dialog.querySelector<HTMLElement>(`#${id}-key-hint`)!;
  const errorText = dialog.querySelector<HTMLElement>('[data-error]')!;
  const show = (name: string, visible: boolean) => {
    dialog.querySelector<HTMLElement>(`[data-field="${name}"]`)!.hidden = !visible;
  };

  const setModels = (models: string[]) => {
    datalist.innerHTML = models.map((model) => `<option value="${escapeAttr(model)}"></option>`).join('');
  };

  const host = (url: string) => {
    try {
      return new URL(url).host;
    } catch {
      return url;
    }
  };

  const link = (href: string, text: string) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  const hasCloud = proxyChoices.some((choice) => choice.id === OLLAMA_CLOUD_CHOICE.id);

  // Is Ollama running where the user said? Checked when the local option is shown or its URL changes.
  let probe = 0;
  const checkLocal = () => {
    const ticket = (probe += 1);
    const url = urlInput.value.trim() || OLLAMA_LOCAL_URL;
    providerHint.textContent = `Checking for Ollama at ${url}\u2026`;
    void isOllamaRunning(url).then((running) => {
      if (ticket !== probe || providerSelect.value !== 'ollama-local') return;
      providerHint.innerHTML = running
        ? `Ollama is running at ${escapeHtml(url)}. Its cloud models are free to try after <code>ollama signin</code>; local models never leave this computer.`
        : `Ollama is not running at ${escapeHtml(url)}. ${link('https://ollama.com/download', 'Install Ollama')} and start it, then run <code>ollama signin</code> to use its free cloud models${
            hasCloud ? ', or choose Ollama Cloud above to use ollama.com without installing anything.' : '.'
          }`;
    });
  };

  let previousKind = '';
  const sync = (initial = false) => {
    const value = providerSelect.value;
    const proxyChoice = value.startsWith('proxy:') ? proxyChoices.find((choice) => `proxy:${choice.id}` === value) : undefined;
    const changed = !initial && previousKind !== value;
    previousKind = value;

    show('preset', value === 'openai-compatible');
    show('baseUrl', value === 'ollama-local' || value === 'openai-compatible');
    show('apiKey', value === 'openai-compatible' || Boolean(proxyChoice?.needsKey));

    if (value === 'ollama-local') {
      setModels(OLLAMA_CLOUD_MODELS.map((model) => ollamaLocalCloudTag(model.id)));
      if (changed) {
        urlInput.value = OLLAMA_LOCAL_URL;
        modelInput.value = DEFAULT_OLLAMA_MODEL;
      }
      if (changed || initial) checkLocal();
    } else if (value === 'openai-compatible') {
      providerHint.textContent = 'OpenAI, OpenRouter, Groq and other services with an OpenAI-style API. Requests go from this browser straight to the service.';
      setModels([]);
      if (changed) {
        urlInput.value = OPENAI_COMPATIBLE_PRESETS[presetSelect.value as OpenAICompatiblePreset].baseUrl;
        modelInput.value = '';
      }
      keyHint.textContent = `Stored in this browser only and sent to ${host(urlInput.value)}.`;
    } else if (proxyChoice) {
      const cloud = proxyChoice.id === OLLAMA_CLOUD_CHOICE.id;
      providerHint.innerHTML = cloud
        ? `Runs Ollama's models on ${link('https://ollama.com', 'ollama.com')}, nothing to install. Requests go through this site's server, because ollama.com does not accept them straight from web pages.`
        : 'Runs through this site\'s server.';
      setModels(proxyChoice.models ?? []);
      if (changed) modelInput.value = proxyChoice.defaultModel ?? proxyChoice.models?.[0] ?? '';
      keyHint.innerHTML = `${cloud ? `Create one at ${link('https://ollama.com/settings/keys', 'ollama.com/settings/keys')}. ` : ''}${
        proxyChoice.keyOptional ? 'Optional: this site has a key of its own. ' : ''
      }Stored in this browser only; sent to this site's server with each request and not saved there.`;
    }
  };

  // Fill from the current settings.
  providerSelect.value = current.kind === 'proxy' ? `proxy:${current.proxyProvider}` : current.kind;
  if (!providerSelect.value) providerSelect.value = 'ollama-local';
  if (current.preset) presetSelect.value = current.preset;
  urlInput.value = current.baseUrl ?? (current.kind === 'ollama-local' ? OLLAMA_LOCAL_URL : '');
  modelInput.value = current.model ?? '';
  keyInput.value = current.apiKey ?? '';
  rememberInput.checked = Boolean(current.rememberKey);
  previousKind = providerSelect.value;
  sync(true);

  providerSelect.addEventListener('change', () => sync());
  presetSelect.addEventListener('change', () => {
    urlInput.value = OPENAI_COMPATIBLE_PRESETS[presetSelect.value as OpenAICompatiblePreset].baseUrl;
    sync();
  });
  let urlTimer: ReturnType<typeof setTimeout> | undefined;
  urlInput.addEventListener('input', () => {
    sync();
    if (providerSelect.value === 'ollama-local') {
      clearTimeout(urlTimer);
      urlTimer = setTimeout(checkLocal, 400);
    }
  });

  document.body.appendChild(dialog);
  const opener = document.activeElement as HTMLElement | null;

  return new Promise((resolve) => {
    let result: AISettings | null = null;

    dialog.querySelector('[data-cancel]')!.addEventListener('click', () => dialog.close());
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const value = providerSelect.value;
      const model = modelInput.value.trim();
      const needsKey = !dialog.querySelector<HTMLElement>('[data-field="apiKey"]')!.hidden;
      if (!model) {
        errorText.textContent = 'Enter a model name.';
        modelInput.focus();
        return;
      }
      if (value === 'openai-compatible' && !/^https?:\/\//.test(urlInput.value.trim())) {
        errorText.textContent = 'Enter the service\'s base URL, starting with https://.';
        urlInput.focus();
        return;
      }

      const settings: AISettings = value.startsWith('proxy:')
        ? { kind: 'proxy', proxyProvider: value.slice(6), model }
        : value === 'openai-compatible'
          ? { kind: 'openai-compatible', preset: presetSelect.value as OpenAICompatiblePreset, baseUrl: urlInput.value.trim(), model }
          : { kind: 'ollama-local', baseUrl: urlInput.value.trim() || OLLAMA_LOCAL_URL, model };
      if (needsKey && keyInput.value.trim()) {
        settings.apiKey = keyInput.value.trim();
        settings.rememberKey = rememberInput.checked;
      }
      saveSettings(settings, config);
      result = settings;
      dialog.close();
    });

    dialog.addEventListener('close', () => {
      dialog.remove();
      opener?.focus?.();
      resolve(result);
    });

    dialog.showModal();
    providerSelect.focus();
  });
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

const escapeAttr = escapeHtml;
