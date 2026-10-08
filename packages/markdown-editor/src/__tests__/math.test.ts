import { describe, expect, it, vi } from 'vitest';
import { markdownToPreviewHtml } from '../markdown/markdownToHtml';

const parse = (html: string) => {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content;
};

// A stand-in typesetter that shows what it was asked to do.
const typesetter = vi.fn((tex: string, display: boolean) => `<span class="tex">${display ? 'D' : 'I'}[${tex}]</span>`);
const math = (markdown: string, renderMath = typesetter) => parse(markdownToPreviewHtml(markdown, { renderMath }));
const asked = () => typesetter.mock.calls.map(([tex, display]) => [tex, display]);

describe('math in the preview', () => {
  it('is off unless a renderer is given: a dollar sign is a dollar sign', () => {
    const html = markdownToPreviewHtml('Euler: $e^{i\\pi} + 1 = 0$ and\n\n$$\nx\n$$');
    expect(html).toContain('$e^{i\\pi} + 1 = 0$');
    expect(html).not.toContain('md-math');
  });

  it('typesets inline math and wraps it so it can be styled', () => {
    typesetter.mockClear();
    const fragment = math('Euler: $e^{i\\pi} + 1 = 0$ is neat.');
    expect(asked()).toEqual([['e^{i\\pi} + 1 = 0', false]]);
    const formula = fragment.querySelector('span.md-math.md-math-inline')!;
    expect(formula.textContent).toBe('I[e^{i\\pi} + 1 = 0]');
    expect(fragment.querySelector('p')!.textContent).toBe('Euler: I[e^{i\\pi} + 1 = 0] is neat.');
  });

  it('typesets $$...$$ inside a paragraph as a display formula', () => {
    typesetter.mockClear();
    const fragment = math('Before $$a + b$$ after');
    expect(asked()).toEqual([['a + b', true]]);
    expect(fragment.querySelector('span.md-math-display')!.textContent).toBe('D[a + b]');
  });

  it('typesets a $$ fence on its own lines as a display block, which can interrupt a paragraph', () => {
    typesetter.mockClear();
    const fragment = math('Text\n$$\n\\int_0^1 x\\,dx\n= \\tfrac12\n$$\nAfter');
    expect(asked()).toEqual([['\\int_0^1 x\\,dx\n= \\tfrac12', true]]);
    const block = fragment.querySelector('div.md-math-display')!;
    expect(block.textContent).toBe('D[\\int_0^1 x\\,dx\n= \\tfrac12]');
    expect(block.previousElementSibling!.textContent).toBe('Text');
    expect(block.nextElementSibling!.textContent).toBe('After');
  });

  describe('what is and is not a formula', () => {
    const formulas = (markdown: string) => {
      typesetter.mockClear();
      math(markdown);
      return asked().map(([tex]) => tex);
    };

    it('leaves prices alone', () => {
      expect(formulas('It costs $5 and $6 today.')).toEqual([]);
      expect(formulas('Between $5.50 and $10')).toEqual([]);
    });

    it('needs no space inside the dollar signs', () => {
      expect(formulas('a $ x$ b')).toEqual([]);
      expect(formulas('a $x $ b')).toEqual([]);
      expect(formulas('a $x$ b')).toEqual(['x']);
      expect(formulas('a $x$b')).toEqual(['x']);
    });

    it('does not end a formula before a digit', () => {
      expect(formulas('$x$1')).toEqual([]);
    });

    it('takes an escaped dollar sign as a dollar sign, inside a formula or out of it', () => {
      expect(formulas('\\$x\\$')).toEqual([]);
      expect(formulas('$a \\$ b$')).toEqual(['a \\$ b']);
    });

    it('leaves code alone, inline and fenced', () => {
      expect(formulas('use `$x$` here')).toEqual([]);
      expect(formulas('```\n$$\nx\n$$\n```')).toEqual([]);
      expect(formulas('    $x$ indented')).toEqual([]);
    });

    it('does not run across blank lines or an unclosed dollar', () => {
      expect(formulas('$a\n\nb$')).toEqual([]);
      expect(formulas('a $b')).toEqual([]);
      expect(formulas('$$\nnever closed')).toEqual([]);
    });

    it('finds several in a paragraph, in a list and in a table', () => {
      expect(formulas('$a$ and $b$')).toEqual(['a', 'b']);
      expect(formulas('- $a$\n- $b$')).toEqual(['a', 'b']);
      expect(formulas('| h |\n|---|\n| $c$ |')).toEqual(['c']);
      expect(formulas('**$d$** and *$e$*')).toEqual(['d', 'e']);
    });
  });

  describe('when it cannot be typeset', () => {
    it('shows the source as written, escaped, instead of failing', () => {
      const failing = vi.fn(() => {
        throw new Error('bad tex');
      });
      const fragment = math('See $a<b$ and\n\n$$\nx & y\n$$', failing as any);
      expect(failing).toHaveBeenCalledTimes(2);
      expect(fragment.querySelector('code.md-math-source')!.textContent).toBe('$a<b$');
      expect(fragment.querySelector('pre.md-math-source')!.textContent).toBe('$$x & y$$');
      expect(fragment.querySelector('b')).toBeNull();
    });

    it('does the same when the renderer returns nothing', () => {
      const fragment = math('$x$', () => '');
      expect(fragment.querySelector('code.md-math-source')!.textContent).toBe('$x$');
    });
  });

  it('sanitises what the renderer returns, like the rest of the preview', () => {
    const hostile = () => '<img src=x onerror="alert(1)"><script>alert(2)</script><span class="ok">fine</span>';
    const fragment = math('$x$', hostile);
    expect(fragment.querySelector('script')).toBeNull();
    expect(fragment.querySelector('img')?.hasAttribute('onerror') ?? false).toBe(false);
    expect(fragment.querySelector('.ok')!.textContent).toBe('fine');
  });

  describe('what a typesetter may put in the page', () => {
    // The shape of KaTeX's output for a square root: spans, with the radical drawn as an SVG path.
    const katexLike = () =>
      '<span class="katex"><span class="katex-html" aria-hidden="true"><span class="mord sqrt">' +
      '<span class="hide-tail" style="min-width:0.853em;height:1.08em;">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="400em" height="1.08em" viewBox="0 0 400000 1080" preserveAspectRatio="xMinYMin slice">' +
      '<path d="M95,702c-2.7,0-7.17-2.7-13.5-8" fill="currentColor"></path></svg></span></span></span></span>';

    it('keeps the SVG that radicals and arrows are drawn with, which the rest of the preview strips', () => {
      const fragment = math('A root: $\\sqrt{x}$ and plain <svg><path d="M0 0"/></svg>', katexLike);
      const formula = fragment.querySelector('.md-math')!;
      expect(formula.querySelector('svg')!.getAttribute('viewBox')).toBe('0 0 400000 1080');
      expect(formula.querySelector('svg')!.getAttribute('preserveAspectRatio')).toBe('xMinYMin slice');
      expect(formula.querySelector('path')!.getAttribute('d')).toContain('M95,702');
      expect(formula.querySelector('.hide-tail')!.getAttribute('style')).toContain('min-width');
      expect(formula.querySelector('[aria-hidden="true"]')).not.toBeNull();
      // Only the typeset formula gets that: an SVG in the document itself is still removed.
      expect(fragment.querySelectorAll('svg')).toHaveLength(1);
    });

    it('removes everything else from a formula: scripts, links, images, handlers, foreign content', () => {
      const hostile = () =>
        '<span class="ok" onclick="alert(1)">fine</span>' +
        '<a href="javascript:alert(2)">link</a><img src=x onerror="alert(3)">' +
        '<svg onload="alert(4)" viewBox="0 0 1 1"><script>alert(5)</script><use href="#x"></use>' +
        '<foreignObject><div>html</div></foreignObject><style>*{display:none}</style>' +
        '<path d="M0 0" onmouseover="alert(6)"></path><animate attributeName="x"></animate></svg>';
      const fragment = math('$x$', hostile);
      const html = fragment.querySelector('.md-math')!.innerHTML;
      for (const bad of ['script', '<a', '<img', 'onclick', 'onload', 'onerror', 'onmouseover', '<use', 'foreignobject', '<style', 'animate', 'javascript:']) {
        expect(html.toLowerCase(), bad).not.toContain(bad);
      }
      expect(fragment.querySelector('.ok')!.textContent).toBe('fine');
      expect(fragment.querySelector('svg path')).not.toBeNull();
    });

    it('shows the source when nothing is left of a formula once it is sanitised', () => {
      const fragment = math('$x<y$', () => '<script>alert(1)</script>');
      expect(fragment.querySelector('code.md-math-source')!.textContent).toBe('$x<y$');
      expect(fragment.querySelector('script')).toBeNull();
    });

    it('leaves no placeholder behind, and cannot be tricked into filling one the document wrote itself', () => {
      // An index that is not one of this document's formulas is dropped; one that is gets that (sanitised) formula.
      const html = markdownToPreviewHtml('$a$ <span class="md-math" data-md-math="7"></span> and <div data-md-math="0"></div>', {
        renderMath: typesetter,
      });
      expect(html).not.toContain('data-md-math');
      expect(parse(html).querySelectorAll('.tex')).toHaveLength(2);
      expect(markdownToPreviewHtml('$a$ $b$', { renderMath: typesetter })).not.toContain('data-md-math');
    });

    it('keeps the class and scroll line of a block formula', () => {
      const element = math('x\n\n$$\ny\n$$').querySelector('div.md-math-display')!;
      expect(element.getAttribute('data-md-line')).toBe('2');
    });
  });

  it('keeps the formulas of one document out of the next, and the setting per call', () => {
    typesetter.mockClear();
    math('$a$');
    expect(markdownToPreviewHtml('$a$')).not.toContain('md-math');
    expect(typesetter).toHaveBeenCalledTimes(1);
    // A renderer that throws mid-parse does not leave itself installed.
    math('$a$', () => {
      throw new Error('x');
    });
    expect(markdownToPreviewHtml('$a$')).not.toContain('md-math');
  });

  it('gives a display block the line it starts on, for scroll sync', () => {
    const fragment = math('# T\n\ntext\n\n$$\nx\n$$\n\nend');
    const lines = Array.from(fragment.querySelectorAll('[data-md-line]')).map((element) => [element.tagName.toLowerCase(), element.getAttribute('data-md-line')]);
    expect(lines).toEqual([['h1', '0'], ['p', '2'], ['div', '4'], ['p', '8']]);
  });

  it('works together with footnotes and front matter', () => {
    const fragment = math('---\na: 1\n---\n\nSee $x$[^1]\n\n[^1]: Note with $y$.');
    expect(fragment.querySelectorAll('.md-math')).toHaveLength(2);
    expect(fragment.querySelector('a[data-footnote-ref]')).not.toBeNull();
    expect(fragment.querySelector('.md-front-matter')).not.toBeNull();
  });
});
