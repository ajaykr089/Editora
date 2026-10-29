import { createDomReview } from '../dom/overlay';
import { defaultSettingsFor, OLLAMA_CLOUD_CHOICE, openSettingsDialog, proxyChoicesFor, DEFAULT_SETTINGS } from '../dom/settings';
import { buildTextMap } from '../dom/text';

// jsdom has no <dialog> behaviour.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
});

afterEach(() => {
  document.querySelectorAll('dialog').forEach((dialog) => dialog.remove());
  vi.unstubAllGlobals();
});

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('online and local choices', () => {
  it('offers Ollama Cloud whenever the site has a server endpoint', () => {
    expect(proxyChoicesFor({})).toEqual([]);
    expect(proxyChoicesFor({ proxy: { url: '/api/ai-review' } })).toEqual([OLLAMA_CLOUD_CHOICE]);
    expect(OLLAMA_CLOUD_CHOICE.models).toContain('gpt-oss:120b');
  });

  it('defaults to a server provider only when it can run without the user\'s key', () => {
    expect(defaultSettingsFor({ proxy: { url: '/x' } })).toEqual(DEFAULT_SETTINGS);
    expect(defaultSettingsFor({ proxy: { url: '/x', providers: [{ ...OLLAMA_CLOUD_CHOICE, keyOptional: true }] } })).toEqual({
      kind: 'proxy',
      proxyProvider: 'ollama-cloud',
      model: 'gemma4:31b',
    });
    expect(defaultSettingsFor(null)).toEqual(DEFAULT_SETTINGS);
  });

  it('lists the online option first and names the local URL', () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}')));
    void openSettingsDialog(DEFAULT_SETTINGS, { proxy: { url: '/api/ai-review' } });
    const options = Array.from(document.querySelectorAll('select[name="provider"] option')).map((option) => option.textContent);
    expect(options).toEqual(['Ollama Cloud (ollama.com)', 'Ollama on this computer (localhost:11434)', 'OpenAI-compatible API (your key)']);
  });

  it('tells users without a local Ollama how to install it or use the online option', async () => {
    const fetchMock = vi.fn(async () => {
      throw new TypeError('Failed to fetch');
    });
    vi.stubGlobal('fetch', fetchMock);
    void openSettingsDialog(DEFAULT_SETTINGS, { proxy: { url: '/api/ai-review' } });
    await flush();
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:11434/api/tags', expect.anything());
    const hint = document.querySelector('[id$="-provider-hint"]')!;
    expect(hint.textContent).toMatch(/Ollama is not running at http:\/\/localhost:11434/);
    expect(hint.textContent).toMatch(/choose Ollama Cloud above/);
    expect(hint.querySelector('a')!.getAttribute('href')).toBe('https://ollama.com/download');
  });

  it('confirms when Ollama is running', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{"models":[]}')));
    void openSettingsDialog(DEFAULT_SETTINGS, {});
    await flush();
    expect(document.querySelector('[id$="-provider-hint"]')!.textContent).toMatch(/Ollama is running at http:\/\/localhost:11434/);
  });

  it('explains the online option and where to get a key', () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}')));
    void openSettingsDialog({ kind: 'proxy', proxyProvider: 'ollama-cloud', model: 'gemma4:31b' }, { proxy: { url: '/api/ai-review' } });
    const dialog = document.querySelector('dialog')!;
    expect(dialog.querySelector('[id$="-provider-hint"]')!.textContent).toMatch(/ollama\.com, nothing to install.*this site's server/);
    expect(dialog.querySelector('[data-field="apiKey"]')!.hasAttribute('hidden')).toBe(false);
    expect(dialog.querySelector('[id$="-key-hint"] a')!.getAttribute('href')).toBe('https://ollama.com/settings/keys');
    expect(dialog.querySelector('[data-field="baseUrl"]')!.hasAttribute('hidden')).toBe(true);
  });
});

describe('error with an action', () => {
  it('offers a button that ends the review and runs the action', () => {
    document.body.innerHTML = '<div><div contenteditable="true"><p>Some text.</p></div></div>';
    const root = document.querySelector<HTMLElement>('[contenteditable]')!;
    const block = root.querySelector('p')!;
    const run = vi.fn();
    const dom = createDomReview({ root, targets: [{ block, start: 0, end: buildTextMap(block).text.length }] });
    dom.fail('Ollama is not running on this computer.', { label: 'Model settings', run });
    const button = Array.from(document.querySelectorAll<HTMLButtonElement>('.air-bar button')).find((candidate) => candidate.textContent === 'Model settings')!;
    expect(document.activeElement).toBe(button);
    button.click();
    expect(run).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.air-bar')).toBeNull();
    expect(root.innerHTML).toBe('<p>Some text.</p>');
  });
});
