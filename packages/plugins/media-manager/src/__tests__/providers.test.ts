import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  MediaUploadError,
  createBase64Provider,
  createCallbackProvider,
  createRestProvider,
  mediaItemFromResponse,
  resolveProvider,
} from '../providers';
import { setMediaManagerConfig } from '../constants';

const png = (name = 'cat.png', body = 'abc') => new File([body], name, { type: 'image/png' });

class FakeXhr {
  static last: FakeXhr;
  method = '';
  url = '';
  headers: Record<string, string> = {};
  withCredentials = false;
  upload: { onprogress: ((e: any) => void) | null } = { onprogress: null };
  status = 0;
  responseText = '';
  body: FormData | null = null;
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onabort: (() => void) | null = null;
  ontimeout: (() => void) | null = null;
  open(method: string, url: string) {
    this.method = method;
    this.url = url;
  }
  setRequestHeader(name: string, value: string) {
    this.headers[name] = value;
  }
  send(body: FormData) {
    this.body = body;
    FakeXhr.last = this;
  }
  abort() {
    this.onabort?.();
  }
  reply(status: number, json: unknown) {
    this.status = status;
    this.responseText = typeof json === 'string' ? json : JSON.stringify(json);
    this.onload?.();
  }
}

const reset = () =>
  setMediaManagerConfig({
    provider: undefined,
    uploadHandler: undefined,
    apiUrl: undefined,
    headers: {},
    withCredentials: undefined,
    uploadFieldName: undefined,
    fallbackToBase64: undefined,
  });

beforeEach(() => {
  vi.stubGlobal('XMLHttpRequest', FakeXhr);
  reset();
});
afterEach(() => {
  vi.unstubAllGlobals();
  reset();
});

describe('the base64 provider', () => {
  it('turns the file into a data URL and reports it as finished', async () => {
    const progress: number[] = [];
    const item = await createBase64Provider().upload(png(), { onProgress: (p) => progress.push(p.fraction) });
    expect(item.src).toMatch(/^data:image\/png;base64,/);
    expect(item.type).toBe('image');
    expect(item.name).toBe('cat.png');
    expect(progress.at(-1)).toBe(1);
  });

  it('refuses to start when already cancelled', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(createBase64Provider().upload(png(), { signal: controller.signal })).rejects.toMatchObject({
      code: 'aborted',
      name: 'AbortError',
    });
  });
});

describe('the callback provider', () => {
  it('accepts a plain URL', async () => {
    const item = await createCallbackProvider(async () => 'https://cdn.test/a.png').upload(png(), {});
    expect(item.src).toBe('https://cdn.test/a.png');
  });

  it('accepts an object with dimensions and passes the progress callback through', async () => {
    const onProgress = vi.fn();
    const handler = vi.fn(async (_file: File, ctx: any) => {
      ctx.onProgress({ loaded: 1, total: 2, fraction: 0.5 });
      return { url: 'https://cdn.test/b.png', width: 640, height: 480 };
    });
    const item = await createCallbackProvider(handler).upload(png(), { onProgress });
    expect(onProgress).toHaveBeenCalledWith({ loaded: 1, total: 2, fraction: 0.5 });
    expect(item).toMatchObject({ src: 'https://cdn.test/b.png', width: 640, height: 480 });
  });

  it('stops waiting when cancelled, even if the handler ignores the signal', async () => {
    const controller = new AbortController();
    const pending = createCallbackProvider(() => new Promise(() => {})).upload(png(), { signal: controller.signal });
    controller.abort();
    await expect(pending).rejects.toMatchObject({ code: 'aborted' });
  });

  it('turns a throwing handler into an error with its message, and an empty answer into invalid-response', async () => {
    await expect(
      createCallbackProvider(async () => {
        throw new Error('Quota exceeded');
      }).upload(png(), {}),
    ).rejects.toMatchObject({ code: 'server', message: 'Quota exceeded' });
    await expect(createCallbackProvider(async () => '').upload(png(), {})).rejects.toMatchObject({
      code: 'invalid-response',
    });
  });
});

describe('the REST provider', () => {
  const make = (extra = {}) =>
    createRestProvider({
      uploadUrl: 'https://api.test/media/upload',
      libraryUrl: 'https://api.test/media/library',
      headers: () => ({ Authorization: 'Bearer t', 'Content-Type': 'text/plain' }),
      ...extra,
    });

  it('posts the file as multipart with the headers (but not Content-Type), and reads the answer', async () => {
    const onProgress = vi.fn();
    const pending = make({ fieldName: 'upload', withCredentials: true }).upload(png(), { onProgress });
    const xhr = FakeXhr.last;
    expect(xhr.method).toBe('POST');
    expect(xhr.url).toBe('https://api.test/media/upload');
    expect(xhr.headers).toEqual({ Authorization: 'Bearer t' });
    expect(xhr.withCredentials).toBe(true);
    expect((xhr.body as FormData).get('upload')).toBeInstanceOf(File);

    xhr.upload.onprogress?.({ lengthComputable: true, loaded: 1, total: 4 });
    expect(onProgress).toHaveBeenCalledWith({ loaded: 1, total: 4, fraction: 0.25 });

    xhr.reply(200, { id: 'abc', url: 'https://cdn.test/cat.png', thumbnailUrl: 'https://cdn.test/t.png', width: 800, height: 600, size: 3, mimeType: 'image/png' });
    const item = await pending;
    expect(item).toMatchObject({ id: 'abc', src: 'https://cdn.test/cat.png', thumbnailUrl: 'https://cdn.test/t.png', width: 800, height: 600, type: 'image' });
  });

  it('uses the server message for a failure, and has words for the common statuses', async () => {
    let pending = make().upload(png(), {});
    FakeXhr.last.reply(400, { error: 'Unsupported file' });
    await expect(pending).rejects.toMatchObject({ code: 'server', message: 'Unsupported file', status: 400 });

    pending = make().upload(png(), {});
    FakeXhr.last.reply(413, '<html>too big</html>');
    await expect(pending).rejects.toMatchObject({ message: expect.stringMatching(/too large/i) });

    pending = make().upload(png(), {});
    FakeXhr.last.reply(401, {});
    await expect(pending).rejects.toMatchObject({ message: expect.stringMatching(/not allowed/i) });
  });

  it('reports a dropped connection and an answer without a URL', async () => {
    let pending = make().upload(png(), {});
    FakeXhr.last.onerror?.();
    await expect(pending).rejects.toMatchObject({ code: 'network' });

    pending = make().upload(png(), {});
    FakeXhr.last.reply(200, { success: true });
    await expect(pending).rejects.toMatchObject({ code: 'invalid-response' });

    pending = make().upload(png(), {});
    FakeXhr.last.reply(200, 'not json');
    await expect(pending).rejects.toMatchObject({ code: 'invalid-response' });
  });

  it('aborts the request when the signal fires', async () => {
    const controller = new AbortController();
    const pending = make().upload(png(), { signal: controller.signal });
    controller.abort();
    await expect(pending).rejects.toMatchObject({ code: 'aborted' });
  });

  it('lists, updates and deletes through the library URL', async () => {
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (init?.method === 'DELETE') return new Response(null, { status: 204 });
      if (init?.method === 'PATCH') return Response.json({ success: true });
      return Response.json({ items: [{ id: '1', url: 'https://cdn.test/1.png', name: 'one', alt_text: 'First', type: 'image', size: 10, width: 4, height: 3, createdAt: '2026-01-01T00:00:00Z' }], total: 41 });
    });
    vi.stubGlobal('fetch', fetchMock);
    const provider = make();

    const page = await provider.list!({ page: 2, limit: 20, search: 'cat', type: 'image' });
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.test/media/library?page=2&limit=20&q=cat&type=image');
    expect((fetchMock.mock.calls[0][1] as RequestInit).headers).toMatchObject({ Authorization: 'Bearer t' });
    expect(page.total).toBe(41);
    expect(page.items[0]).toMatchObject({ id: '1', src: 'https://cdn.test/1.png', name: 'one', width: 4, alt: 'First' });

    await provider.update!('a b', { name: 'renamed', alt: 'A cat' });
    expect(fetchMock.mock.calls[1][0]).toBe('https://api.test/media/library/a%20b');
    expect((fetchMock.mock.calls[1][1] as RequestInit).method).toBe('PATCH');
    expect(JSON.parse((fetchMock.mock.calls[1][1] as RequestInit).body as string)).toEqual({ title: 'renamed', alt_text: 'A cat' });

    await provider.delete!('a b');
    expect(fetchMock.mock.calls[2][0]).toBe('https://api.test/media/library/a%20b');
  });

  it('has no list when there is no library URL', () => {
    expect(createRestProvider({ uploadUrl: 'https://api.test/u' }).list).toBeUndefined();
  });
});

describe('reading a server answer', () => {
  it('takes url, src or TinyMCE-style location, and the snake_case fields of the repository API', () => {
    expect(mediaItemFromResponse({ src: 'a' }).src).toBe('a');
    expect(mediaItemFromResponse({ location: 'b' }).src).toBe('b');
    const item = mediaItemFromResponse({ url: 'c', thumbnail_url: 't', mime_type: 'video/mp4', original_filename: 'v.mp4' });
    expect(item).toMatchObject({ thumbnailUrl: 't', type: 'video', name: 'v.mp4' });
  });

  it('goes by the file that was sent for an upload, and by the server for a listing', () => {
    const sent = new File(['x'], 'tone.wav', { type: 'audio/wav' });
    expect(mediaItemFromResponse({ url: 'https://cdn.test/t.svg', type: 'image', mimeType: 'image/svg+xml' }, sent).type).toBe('audio');
    expect(mediaItemFromResponse({ url: 'https://cdn.test/t.svg', type: 'image' }).type).toBe('image');
    expect(mediaItemFromResponse({ url: 'https://cdn.test/t.mp3', type: 'audio' }).type).toBe('audio');
  });

  it('ignores a zero width or height, which the repository API sends when it did not measure', () => {
    expect(mediaItemFromResponse({ url: 'c', width: 0, height: 0 })).toMatchObject({ width: undefined, height: undefined });
  });

  it('throws without a URL', () => {
    expect(() => mediaItemFromResponse({})).toThrow(MediaUploadError);
  });
});

describe('choosing the provider', () => {
  it('uses the data URL provider with no configuration', () => {
    expect(resolveProvider().name).toBe('base64');
  });

  it('prefers an explicit provider, then a handler, then the REST backend', () => {
    setMediaManagerConfig({ apiUrl: 'https://api.test' });
    expect(resolveProvider().name).toBe('rest');
    setMediaManagerConfig({ uploadHandler: async () => 'x' });
    expect(resolveProvider().name).toBe('callback');
    setMediaManagerConfig({ provider: { name: 'mine', upload: async () => ({}) as any } });
    expect(resolveProvider().name).toBe('mine');
  });

  it('builds endpoint URLs from the base URL, merging apiEndpoints one key at a time', () => {
    setMediaManagerConfig({ apiUrl: 'https://api.test/', apiEndpoints: { upload: '/v2/up' } as any });
    resolveProvider().upload(png(), {});
    expect(FakeXhr.last.url).toBe('https://api.test/v2/up');
  });
});
