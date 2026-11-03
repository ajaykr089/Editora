import { announceProvenance, attachAuthorship, type AuthorshipController } from '../dom/attach';
import { detectPasteSource } from '../dom/detect';
import { buildDocMap, createDocMapper, offsetOfPoint, rangeFor } from '../dom/text';

function editor(html: string): HTMLElement {
  document.body.innerHTML = `<div class="host"><div class="toolbar"><button data-command="insertEmoji">😀</button></div><div class="editora-content" contenteditable="true">${html}</div></div>`;
  return document.querySelector<HTMLElement>('.editora-content')!;
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

/** What the browser does for a keystroke: beforeinput, the DOM change, input. */
function type(root: HTMLElement, textNode: Text, at: number, data: string) {
  root.dispatchEvent(new InputEvent('beforeinput', { inputType: 'insertText', data, bubbles: true, cancelable: true }));
  textNode.insertData(at, data);
  root.dispatchEvent(new InputEvent('input', { inputType: 'insertText', data, bubbles: true }));
}

function paste(root: HTMLElement, html: string, apply: () => void) {
  const data = new DataTransfer();
  data.setData('text/html', html);
  data.setData('text/plain', html.replace(/<[^>]+>/g, ''));
  root.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true }));
  apply();
  root.dispatchEvent(new InputEvent('input', { inputType: 'insertFromPaste', bubbles: true }));
}

function kinds(controller: AuthorshipController): string {
  const text = controller.getText();
  return Array.from(text, (_, i) => controller.originAt(i)?.kind[0] ?? '?').join('');
}

// jsdom has no DataTransfer / ClipboardEvent with data; a small stand-in is enough here.
class FakeDataTransfer {
  private data = new Map<string, string>();
  get types() {
    return [...this.data.keys()];
  }
  setData(type: string, value: string) {
    this.data.set(type, value);
  }
  getData(type: string) {
    return this.data.get(type) ?? '';
  }
}
(globalThis as any).DataTransfer ??= FakeDataTransfer;
if (typeof (globalThis as any).ClipboardEvent === 'undefined' || !('clipboardData' in new (globalThis as any).ClipboardEvent('paste'))) {
  (globalThis as any).ClipboardEvent = class extends Event {
    clipboardData: unknown;
    constructor(type: string, init: EventInit & { clipboardData?: unknown } = {}) {
      super(type, init);
      this.clipboardData = init.clipboardData ?? null;
    }
  };
}

describe('doc map', () => {
  it('reads blocks, breaks and islands', () => {
    const root = editor('<h2>Title</h2><p>One <b>two</b><br>three <span contenteditable="false">@Ann</span></p><ul><li>a</li><li>b</li></ul><p><br></p>');
    expect(buildDocMap(root).text).toBe('Title\nOne two\nthree ￼\na\nb');
  });

  it('maps offsets to DOM ranges and back', () => {
    const root = editor('<p>Hello <b>bold</b> world</p><p>Next</p>');
    const map = buildDocMap(root);
    const range = rangeFor(map, 6, 10)!;
    expect(range.toString()).toBe('bold');
    expect(offsetOfPoint(map, range.endContainer, range.endOffset)).toBe(10);
    const p = root.querySelector('p')!;
    expect(offsetOfPoint(map, p, p.childNodes.length)).toBe(16);
  });
});

describe('detectPasteSource', () => {
  it('recognises common apps', () => {
    expect(detectPasteSource('<b id="docs-internal-guid-1234"><p>x</p></b>', 'x').source).toBe('google-docs');
    expect(detectPasteSource('<p class=MsoNormal>x</p>', 'x').source).toBe('word');
    expect(detectPasteSource('<p>x</p>', 'x').source).toBe('web');
    expect(detectPasteSource('', 'x').source).toBe('plain');
  });
});

describe('attachAuthorship', () => {
  it('records nothing until started', async () => {
    const root = editor('<p>Hi</p>');
    const controller = attachAuthorship(root, { author: 'Ana' });
    type(root, root.querySelector('p')!.firstChild as Text, 2, '!');
    await flush();
    expect(controller.getText()).toBe('');
    controller.destroy();
  });

  it('labels existing, typed and pasted text', async () => {
    const root = editor('<p>Hi</p>');
    const controller = attachAuthorship(root, { author: 'Ana', autoStart: true });
    const text = root.querySelector('p')!.firstChild as Text;
    type(root, text, 2, ' there');
    paste(root, '<b id="docs-internal-guid-1"><span>PASTED</span></b>', () => text.parentElement!.insertAdjacentHTML('beforeend', ' <span>PASTED</span>'));
    await flush();
    expect(controller.getText()).toBe('Hi there PASTED');
    expect(kinds(controller)).toBe('eettttttppppppp');
    expect(controller.originAt(10)).toMatchObject({ kind: 'pasted', source: 'google-docs', author: 'Ana' });
    controller.destroy();
  });

  it('labels text inside data-provenance markers and announced inserts', async () => {
    const root = editor('<p>Start</p>');
    const controller = attachAuthorship(root, { author: 'Ana', autoStart: true });
    const p = root.querySelector('p')!;
    p.insertAdjacentHTML('beforeend', '<ins data-provenance="ai" data-provenance-model="gemma4">AI</ins>');
    await flush();
    expect(controller.originAt(5)).toMatchObject({ kind: 'ai', model: 'gemma4', author: 'Ana' });

    announceProvenance(p, { kind: 'collaborator', author: 'Bo' });
    p.append(' remote');
    await flush();
    expect(controller.originAt(9)).toMatchObject({ kind: 'collaborator', author: 'Bo' });
    controller.destroy();
  });

  it('labels changes right after a toolbar click as tool, otherwise external', async () => {
    const root = editor('<p>A</p>');
    const controller = attachAuthorship(root, { author: 'Ana', autoStart: true });
    const p = root.querySelector('p')!;
    document.querySelector('button')!.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    p.append('😀');
    await flush();
    expect(controller.originAt(1)).toMatchObject({ kind: 'tool', source: 'insertEmoji' });

    await new Promise((resolve) => setTimeout(resolve, 900));
    p.append('?');
    await flush();
    expect(controller.originAt(controller.getText().length - 1)?.kind).toBe('external');
    controller.destroy();
  });

  it('keeps origins when undo restores an earlier text', async () => {
    const root = editor('<p>Keep</p>');
    const controller = attachAuthorship(root, { author: 'Ana', autoStart: true });
    const p = root.querySelector('p')!;
    paste(root, '<p>PASTE</p>', () => p.append(' PASTE'));
    await flush();
    const before = p.innerHTML;
    p.textContent = 'Keep';
    await flush();
    // History plugin restores the HTML after Mod+Z.
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, metaKey: true, bubbles: true }));
    p.innerHTML = before;
    await flush();
    expect(controller.originAt(6)?.kind).toBe('pasted');
    controller.destroy();
  });

  it('keeps origins when text is cut and pasted back', async () => {
    const root = editor('<p>one two</p>');
    const controller = attachAuthorship(root, { author: 'Ana', autoStart: true });
    const p = root.querySelector('p')!;
    paste(root, '<p>AI TEXT</p>', () => p.append(' AI TEXT'));
    await flush();
    // Delete it (the fragment is remembered), then paste the same text elsewhere.
    p.textContent = 'one two';
    await flush();
    paste(root, '<p>AI TEXT</p>', () => (p.textContent = 'AI TEXT one two'));
    await flush();
    expect(controller.originAt(0)?.kind).toBe('pasted');
    expect(controller.getReport().pastes).toHaveLength(1);
    controller.destroy();
  });

  it('serializes and restores for the same content', async () => {
    const root = editor('<p>Hi</p>');
    const controller = attachAuthorship(root, { author: 'Ana', autoStart: true });
    type(root, root.querySelector('p')!.firstChild as Text, 2, '!!');
    await flush();
    const state = JSON.parse(JSON.stringify(controller.serialize()));
    controller.destroy();

    const again = attachAuthorship(root, { author: 'Ana' });
    again.start(state);
    expect(kinds(again)).toBe('eett');
    again.destroy();
  });
});

describe('attachAuthorship edge cases', () => {
  it('treats a click on a page button outside the editor as external, not a tool', async () => {
    const root = editor('<p>A</p>');
    const outside = document.createElement('button');
    document.body.append(outside);
    const controller = attachAuthorship(root, { author: 'Ana', autoStart: true });
    outside.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    root.querySelector('p')!.append('B');
    await flush();
    expect(controller.originAt(1)?.kind).toBe('external');
    controller.destroy();
  });

  it('reports a failing witness through flush and the error event only', async () => {
    const root = editor('<p>A</p>');
    const unhandled: unknown[] = [];
    const onUnhandled = (reason: unknown) => unhandled.push(reason);
    process.on('unhandledRejection', onUnhandled);
    const errors: Error[] = [];
    const controller = attachAuthorship(root, {
      author: 'Ana',
      autoStart: true,
      witness: { url: '/w', doc: 'd', intervalMs: 60_000, fetch: (async () => new Response('nope', { status: 500 })) as typeof fetch },
    });
    controller.on('error', (error) => errors.push(error));
    type(root, root.querySelector('p')!.firstChild as Text, 1, 'b');
    await expect(controller.flush()).rejects.toThrow(/Witness answered 500/);
    await new Promise((resolve) => setTimeout(resolve, 20));
    process.off('unhandledRejection', onUnhandled);
    expect(errors).toHaveLength(1);
    expect(unhandled).toEqual([]);
    controller.destroy();
  });
});

describe('createDocMapper', () => {
  it('matches a full read after random edits', async () => {
    const root = editor('<h2>T</h2><p>one <b>two</b></p><ul><li>a</li><li>b<br>c</li></ul><p><br></p><div><p>x</p>y</div>');
    const mapper = createDocMapper(root);
    const observer = new MutationObserver((records) => mapper.invalidate(records));
    observer.observe(root, { childList: true, characterData: true, subtree: true, attributes: true });
    mapper.build();
    const edits: Array<() => void> = [
      () => (root.querySelector('b')!.firstChild as Text).appendData('!'),
      () => root.querySelector('li')!.append(' more'),
      () => root.insertAdjacentHTML('beforeend', '<p>new <i>para</i></p>'),
      () => root.querySelector('p')!.remove(),
      () => root.querySelector('ul')!.insertAdjacentHTML('afterbegin', '<li>first</li>'),
      () => root.querySelector('div')!.setAttribute('contenteditable', 'false'),
      () => root.querySelector('div')!.removeAttribute('contenteditable'),
      () => root.append(document.createTextNode('loose')),
      () => root.querySelector('h2')!.replaceChildren('Title'),
    ];
    for (let round = 0; round < 3; round += 1) {
      for (const edit of edits) {
        try {
          edit();
        } catch {
          // An element an earlier edit removed.
        }
        mapper.invalidate(observer.takeRecords());
        const cached = mapper.build();
        const fresh = buildDocMap(root);
        expect(cached.text).toBe(fresh.text);
        expect(cached.segments.map((s) => [s.start, s.end])).toEqual(fresh.segments.map((s) => [s.start, s.end]));
      }
    }
    observer.disconnect();
  });
});

describe('paste inserted by the editor itself', () => {
  it('stays pasted when the insert fires a typing beforeinput (WebKit execCommand)', async () => {
    const root = editor('<p>A</p>');
    const controller = attachAuthorship(root, { author: 'Ana', autoStart: true });
    const p = root.querySelector('p')!;
    paste(root, '<b id="docs-internal-guid-2">B</b>', () => {
      root.dispatchEvent(new InputEvent('beforeinput', { inputType: 'insertText', data: 'B', bubbles: true }));
      p.append('B');
    });
    await flush();
    expect(controller.originAt(1)).toMatchObject({ kind: 'pasted', source: 'google-docs' });
    controller.destroy();
  });
});
