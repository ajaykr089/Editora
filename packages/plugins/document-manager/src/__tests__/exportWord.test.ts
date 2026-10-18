import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { exportToWord } from '../documentManager';
import { DEFAULT_CONFIG, getApiUrl, setDocumentManagerConfig } from '../constants';
import { DEFAULT_API_CONFIG, getGlobalApiConfig, setGlobalApiConfig } from '../../../src/shared-config';
import { getApiUrl as getMediaApiUrl, setMediaManagerConfig } from '../../../media-manager/src/constants';

// Export used to ask http://localhost:3001 first, on every visitor's machine, whatever the page was.
let fetchSpy: ReturnType<typeof vi.fn>;
let downloaded: string[];
const original = { fetch: globalThis.fetch, createObjectURL: URL.createObjectURL, revokeObjectURL: URL.revokeObjectURL };

beforeEach(() => {
  fetchSpy = vi.fn(() => Promise.reject(new Error('network down')));
  globalThis.fetch = fetchSpy as unknown as typeof fetch;
  URL.createObjectURL = vi.fn(() => 'blob:fake');
  URL.revokeObjectURL = vi.fn();
  downloaded = [];
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
    downloaded.push(this.download);
  });
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'info').mockImplementation(() => {});
  setGlobalApiConfig({ apiUrl: DEFAULT_API_CONFIG.apiUrl });
  setDocumentManagerConfig({ ...DEFAULT_CONFIG, apiUrl: undefined });
});

afterEach(() => {
  globalThis.fetch = original.fetch;
  URL.createObjectURL = original.createObjectURL;
  URL.revokeObjectURL = original.revokeObjectURL;
  vi.restoreAllMocks();
});

describe('the default configuration', () => {
  it('has no server in it, least of all one on the visitor\'s own machine', () => {
    expect(DEFAULT_API_CONFIG.apiUrl).toBe('');
    expect(JSON.stringify(DEFAULT_API_CONFIG)).not.toMatch(/localhost|127\.0\.0\.1/);
  });

  it('builds no URL when there is no API, rather than one relative to the page', () => {
    expect(getApiUrl('exportWord')).toBe('');
    expect(getMediaApiUrl('upload' as never)).toBe('');
  });
});

describe('Word export', () => {
  it('builds the file in the browser and sends no request when no API is configured', async () => {
    await exportToWord('<p>Hello</p>', 'notes.docx');

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(downloaded).toEqual(['notes.docx']);
  });

  it('uses the API when one is configured, at the configured address', async () => {
    fetchSpy.mockImplementation(() => Promise.resolve(new Response(new Blob(['docx']), { status: 200 })));
    setDocumentManagerConfig({ apiUrl: 'https://api.example.com' });

    await exportToWord('<p>Hello</p>', 'notes.docx');

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy.mock.calls[0][0]).toBe('https://api.example.com/documents/export-word');
    expect(downloaded).toEqual(['notes.docx']);
  });

  it('uses a global API address too', async () => {
    fetchSpy.mockImplementation(() => Promise.resolve(new Response(new Blob(['docx']), { status: 200 })));
    setGlobalApiConfig({ apiUrl: 'https://global.example.com/api/' });

    await exportToWord('<p>Hello</p>');

    expect(fetchSpy.mock.calls[0][0]).toBe('https://global.example.com/api/documents/export-word');
  });

  it('falls back to the browser when the configured API fails', async () => {
    setDocumentManagerConfig({ apiUrl: 'https://api.example.com' });

    await exportToWord('<p>Hello</p>', 'notes.docx');

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(downloaded).toEqual(['notes.docx']);
  });

  it('does not fall back when that is turned off, and says why', async () => {
    setDocumentManagerConfig({ apiUrl: 'https://api.example.com', useClientSideFallback: false });

    await expect(exportToWord('<p>Hello</p>')).rejects.toThrow(/via API/);
    expect(downloaded).toEqual([]);
  });

  it('honours an empty apiUrl on the plugin as "no API", even when a global one is set', async () => {
    setGlobalApiConfig({ apiUrl: 'https://global.example.com/api/' });
    setDocumentManagerConfig({ apiUrl: '' });

    await exportToWord('<p>Hello</p>', 'notes.docx');

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(downloaded).toEqual(['notes.docx']);
  });

  it('says what is wrong when there is no API and the browser export is turned off', async () => {
    setDocumentManagerConfig({ useClientSideFallback: false });

    await expect(exportToWord('<p>Hello</p>')).rejects.toThrow(/no API is configured/);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe('the media manager reads its address in the same way', () => {
  it('honours an empty apiUrl and uses a configured one', () => {
    setGlobalApiConfig({ apiUrl: 'https://global.example.com/api/' });
    setMediaManagerConfig({ apiUrl: '' } as never);
    expect(getMediaApiUrl('upload' as never)).toBe('');

    setMediaManagerConfig({ apiUrl: 'https://media.example.com' } as never);
    expect(getMediaApiUrl('upload' as never).startsWith('https://media.example.com/')).toBe(true);
    expect(getGlobalApiConfig().apiUrl).toBe('https://global.example.com/api/');
  });
});
