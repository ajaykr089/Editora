import { afterEach, describe, expect, it, vi } from 'vitest';
import { markdownToEditorHtml, markdownToPreviewHtml } from '../markdown/markdownToHtml';
import { highlightCode } from '../markdown/highlight';

const parse = (html: string) => {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content;
};

describe('markdownToPreviewHtml', () => {
  it('renders GFM: headings, emphasis, strikethrough, tables and line breaks', () => {
    const doc = parse(markdownToPreviewHtml('# T\n\n**b** *i* ~~s~~\n\nline1\nline2\n\n| a | b |\n|---|---|\n| 1 | 2 |'));
    expect(doc.querySelector('h1')?.textContent).toBe('T');
    expect(doc.querySelector('strong')?.textContent).toBe('b');
    expect(doc.querySelector('em')?.textContent).toBe('i');
    expect(doc.querySelector('del')?.textContent).toBe('s');
    expect(doc.querySelectorAll('p')[1].innerHTML).toContain('<br>');
    expect(doc.querySelectorAll('td')).toHaveLength(2);
  });

  it('opens links in a new tab without handing over window.opener', () => {
    const link = parse(markdownToPreviewHtml('[x](https://example.com "T")')).querySelector('a')!;
    expect(link.getAttribute('href')).toBe('https://example.com');
    expect(link.getAttribute('title')).toBe('T');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('renders task items as checkbox-role spans, which survive the sanitiser (an <input> does not)', () => {
    const doc = parse(markdownToPreviewHtml('- [x] done\n- [ ] todo\n- plain'));
    const boxes = Array.from(doc.querySelectorAll('.md-task-box'));
    expect(boxes.map((box) => box.getAttribute('aria-checked'))).toEqual(['true', 'false']);
    expect(boxes.every((box) => box.getAttribute('role') === 'checkbox')).toBe(true);
    expect(doc.querySelector('input')).toBeNull();
  });

  describe('code', () => {
    it('highlights fenced code and tags the block with its language', () => {
      const code = parse(markdownToPreviewHtml("```ts\nconst a = 'x'; // hi\n```")).querySelector('pre.md-code-block > code')!;
      expect(code.className).toBe('language-ts');
      expect(code.textContent).toBe("const a = 'x'; // hi");
      expect(code.querySelector('.md-token-keyword')?.textContent).toBe('const');
      expect(code.querySelector('.md-token-string')?.textContent).toBe("'x'");
      expect(code.querySelector('.md-token-comment')?.textContent).toBe('// hi');
    });

    it('does not corrupt its own markup (regression: stray <span class="&lt;span"> and a split &#39;)', () => {
      const html = markdownToPreviewHtml('```ts\nconst greeting = "Hello"; const n = \'1\';\n```');
      expect(html).not.toContain('&lt;span');
      expect(html).not.toMatch(/&#<span/);
      expect(parse(html).querySelector('code')!.textContent).toBe('const greeting = "Hello"; const n = \'1\';');
    });

    it('renders inline code escaped', () => {
      const code = parse(markdownToPreviewHtml('use `<b>x</b>` here')).querySelector('code.md-inline-code')!;
      expect(code.textContent).toBe('<b>x</b>');
      expect(code.querySelector('b')).toBeNull();
    });

    it('falls back to a txt class for fences without a language', () => {
      expect(parse(markdownToPreviewHtml('```\nx\n```')).querySelector('code')!.className).toBe('language-txt');
    });
  });

  describe('sanitising', () => {
    it('removes event handlers, scripts and javascript: URLs', () => {
      const html = markdownToPreviewHtml(
        '<img src=x onerror="window.__pwned=1">\n\n<script>window.__pwned=2</script>\n\n[a](javascript:window.__pwned=3)\n\n<svg onload="window.__pwned=4"></svg>',
      );
      const doc = parse(html);
      expect(html).not.toMatch(/onerror|onload|<script/i);
      expect(Array.from(doc.querySelectorAll('a')).every((a) => !/^javascript:/i.test(a.getAttribute('href') || ''))).toBe(true);
    });

    it('cannot be broken out of through a fence info string', () => {
      const doc = parse(markdownToPreviewHtml('```x"onmouseover="alert(1)\ncode\n```'));
      const code = doc.querySelector('code')!;
      expect(code.getAttributeNames()).toEqual(['class']);
      expect(code.className).not.toMatch(/["\s(]/);
    });

    it('cannot be broken out of through link text, titles or destinations', () => {
      const html = markdownToPreviewHtml('[x" onmouseover="alert(1)](https://e.com "t\\" onfocus=\\"alert(2)")');
      const link = parse(html).querySelector('a');
      expect(link?.getAttributeNames().sort()).toEqual(['href', 'rel', 'target', 'title']);
    });

    describe('without a DOM (a server render)', () => {
      afterEach(() => {
        vi.unstubAllGlobals();
      });

      it('returns nothing instead of unsanitised HTML', () => {
        vi.stubGlobal('window', undefined);
        expect(markdownToPreviewHtml('<img src=x onerror=alert(1)>')).toBe('');
        expect(markdownToEditorHtml('<img src=x onerror=alert(1)>')).toBe('');
      });
    });
  });
});

describe('markdownToEditorHtml', () => {
  it('renders fences as the code-sample plugin block, keeping the code and language', () => {
    const pre = parse(markdownToEditorHtml('```ts\nconst a = 1 < 2;\n```')).querySelector('pre')!;
    expect(pre.classList.contains('rte-code-block')).toBe(true);
    expect(pre.getAttribute('data-type')).toBe('code-block');
    expect(pre.getAttribute('data-lang')).toBe('ts');
    expect(pre.getAttribute('contenteditable')).toBe('false');
    expect(pre.querySelector('code')!.textContent).toBe('const a = 1 < 2;');
  });

  it('uses the plaintext language when a fence has none', () => {
    expect(parse(markdownToEditorHtml('```\nx\n```')).querySelector('pre')!.getAttribute('data-lang')).toBe('plaintext');
  });

  it('renders a task list as the checklist plugin structure', () => {
    const doc = parse(markdownToEditorHtml('- [x] done\n- [ ] todo'));
    const list = doc.querySelector('ul')!;
    expect(list.getAttribute('data-type')).toBe('checklist');
    const items = Array.from(list.querySelectorAll('li'));
    expect(items.map((item) => item.getAttribute('data-type'))).toEqual(['checklist-item', 'checklist-item']);
    expect(items.map((item) => item.getAttribute('data-checked'))).toEqual(['true', 'false']);
    expect(items[0].querySelector('p')?.textContent).toBe('done');
  });

  it('keeps a nested list out of the checklist item paragraph, and never nests <p> in <p>', () => {
    const doc = parse(markdownToEditorHtml('- [ ] a\n  - [x] b\n\n- [ ] loose\n\n  more'));
    expect(doc.querySelector('p p')).toBeNull();
    expect(doc.querySelector('p ul')).toBeNull();
    expect(doc.querySelector('li > ul[data-type="checklist"]')).not.toBeNull();
  });

  it('leaves mixed lists as ordinary lists and keeps the start number', () => {
    const doc = parse(markdownToEditorHtml('3. a\n4. b'));
    expect(doc.querySelector('ol')!.getAttribute('start')).toBe('3');
    expect(parse(markdownToEditorHtml('- [x] a\n- b')).querySelector('ul')!.hasAttribute('data-type')).toBe(false);
  });

  it('sanitises the same way as the preview', () => {
    const html = markdownToEditorHtml('<img src=x onerror="window.__pwned=1"> [a](javascript:alert(1))');
    expect(html).not.toMatch(/onerror/i);
    expect(html).not.toMatch(/javascript:/i);
  });
});

describe('highlightCode', () => {
  const text = (html: string) => {
    const host = document.createElement('div');
    host.innerHTML = html;
    return host.textContent;
  };

  it('never changes the visible text, whatever the language', () => {
    const samples = [
      ['json', '{"a": "b", "c": [1, 2.5, true, null]}'],
      ['ts', "const x = 'a' + \"b\" + `c`; // <tag> & done\n/* multi\nline */ let y = 0x1F;"],
      ['python', "def f(x):  # comment with 'quote'\n    return \"s\" if x else None"],
      ['bash', "echo \"hi $USER\" # greet"],
      ['unknown', '<div class="x">&amp;</div>'],
      [undefined, 'a < b && c > d'],
    ] as const;
    for (const [language, code] of samples) {
      expect(text(highlightCode(code, language))).toBe(code);
    }
  });

  it('escapes everything it emits', () => {
    expect(highlightCode('<script>"x"</script>', 'ts')).not.toMatch(/<script/);
    expect(highlightCode('a & b', 'unknown')).toBe('a &amp; b');
  });

  it('marks json keys, strings, numbers and literals separately', () => {
    const host = document.createElement('div');
    host.innerHTML = highlightCode('{"k": "v", "n": -1.5e3, "t": true, "z": null}', 'json');
    const tokens = (kind: string) => Array.from(host.querySelectorAll(`.md-token-${kind}`)).map((el) => el.textContent);
    expect(tokens('key')).toEqual(['"k"', '"n"', '"t"', '"z"']);
    expect(tokens('string')).toEqual(['"v"']);
    expect(tokens('number')).toEqual(['-1.5e3']);
    expect(tokens('boolean')).toEqual(['true', 'null']);
  });

  it('does not treat keywords or numbers inside strings and comments as tokens', () => {
    const host = document.createElement('div');
    host.innerHTML = highlightCode('const s = "return 42"; // if 1', 'js');
    expect(Array.from(host.querySelectorAll('.md-token-keyword')).map((el) => el.textContent)).toEqual(['const']);
    expect(host.querySelector('.md-token-number')).toBeNull();
  });

  it('uses # comments for script languages and leaves unknown languages unhighlighted', () => {
    const host = document.createElement('div');
    host.innerHTML = highlightCode('x = 1  # note', 'py');
    expect(host.querySelector('.md-token-comment')?.textContent).toBe('# note');
    expect(highlightCode('const a = 1', 'brainfuck')).toBe('const a = 1');
  });

  it('copes with an unterminated string or comment', () => {
    expect(text(highlightCode('const s = "oops\nnext', 'ts'))).toBe('const s = "oops\nnext');
    expect(text(highlightCode('/* never closed', 'ts'))).toBe('/* never closed');
  });
});
