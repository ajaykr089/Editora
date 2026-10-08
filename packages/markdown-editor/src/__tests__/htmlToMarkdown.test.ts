import { describe, expect, it } from 'vitest';
import { htmlToMarkdown } from '../markdown/htmlToMarkdown';

describe('htmlToMarkdown', () => {
  it('returns an empty string for empty or whitespace-only input', () => {
    expect(htmlToMarkdown('')).toBe('');
    expect(htmlToMarkdown('  \n ')).toBe('');
    expect(htmlToMarkdown('<p><br></p>')).toBe('');
  });

  describe('inline formatting', () => {
    it('converts bold, italic and strikethrough', () => {
      expect(htmlToMarkdown('<p>a <strong>b</strong> <em>c</em> <del>d</del> <s>e</s></p>')).toBe(
        'a **b** *c* ~~d~~ ~~e~~',
      );
      expect(htmlToMarkdown('<p><b>b</b> <i>i</i> <strike>s</strike></p>')).toBe('**b** *i* ~~s~~');
    });

    it('keeps emphasis markers against the text, moving surrounding spaces outside', () => {
      expect(htmlToMarkdown('<p>x<strong> bold </strong>y</p>')).toBe('x **bold** y');
    });

    it('drops empty formatting elements', () => {
      expect(htmlToMarkdown('<p>a<strong></strong>b<em> </em>c</p>')).toBe('ab c');
    });

    it('keeps underline and sub/superscript as inline HTML, since markdown has no syntax for them', () => {
      expect(htmlToMarkdown('<p><u>u</u> x<sup>2</sup> H<sub>2</sub>O</p>')).toBe(
        '<u>u</u> x<sup>2</sup> H<sub>2</sub>O',
      );
    });

    it('converts inline code, choosing a fence longer than any backtick run inside', () => {
      expect(htmlToMarkdown('<p><code>a</code></p>')).toBe('`a`');
      expect(htmlToMarkdown('<p><code>a`b</code></p>')).toBe('``a`b``');
      expect(htmlToMarkdown('<p><code>`a</code></p>')).toBe('`` `a ``');
    });

    it('turns <br> into a line break and collapses source whitespace', () => {
      expect(htmlToMarkdown('<p>one<br>two</p>')).toBe('one\ntwo');
      expect(htmlToMarkdown('<p>one<br>\ntwo</p>')).toBe('one\ntwo');
      expect(htmlToMarkdown('<p>a \n   b</p>')).toBe('a b');
    });

    it('normalises non-breaking spaces and strips zero-width characters', () => {
      expect(htmlToMarkdown('<p>a&nbsp;&nbsp;b\u200bc</p>')).toBe('a bc');
    });
  });

  describe('links and images', () => {
    it('keeps link destinations and titles', () => {
      expect(htmlToMarkdown('<p><a href="https://e.com" title="Hi">x</a></p>')).toBe('[x](https://e.com "Hi")');
    });

    it('wraps destinations that contain spaces or parentheses', () => {
      expect(htmlToMarkdown('<p><a href="/a b">x</a></p>')).toBe('[x](</a b>)');
      expect(htmlToMarkdown('<p><a href="/a(1)">x</a></p>')).toBe('[x](</a(1)>)');
    });

    it('keeps only the text of an anchor without an href (e.g. a named anchor)', () => {
      expect(htmlToMarkdown('<p><a id="top">x</a></p>')).toBe('x');
    });

    it('keeps formatting inside link text', () => {
      expect(htmlToMarkdown('<p><a href="/x"><strong>b</strong> t</a></p>')).toBe('[**b** t](/x)');
    });

    it('converts images, escaping brackets in the alt text', () => {
      expect(htmlToMarkdown('<p><img src="/a.png" alt="a [b]" title="T"></p>')).toBe('![a \\[b\\]](/a.png "T")');
      expect(htmlToMarkdown('<img src="/a.png">')).toBe('![](/a.png)');
      expect(htmlToMarkdown('<p><img alt="no src"></p>')).toBe('');
    });
  });

  describe('headings', () => {
    it('converts each level', () => {
      expect(htmlToMarkdown('<h1>a</h1><h3>b</h3><h6>c</h6>')).toBe('# a\n\n### b\n\n###### c');
    });

    it('keeps inline formatting and flattens line breaks', () => {
      expect(htmlToMarkdown('<h2>a <em>b</em><br>c</h2>')).toBe('## a *b* c');
    });

    it('does not let a trailing # become a closing sequence', () => {
      expect(htmlToMarkdown('<h2>Issue #</h2>')).toBe('## Issue \\#');
    });

    it('skips empty headings', () => {
      expect(htmlToMarkdown('<h2></h2><p>x</p>')).toBe('x');
    });
  });

  describe('lists', () => {
    it('converts bullet and ordered lists', () => {
      expect(htmlToMarkdown('<ul><li>a</li><li>b</li></ul>')).toBe('- a\n- b');
      expect(htmlToMarkdown('<ol><li>a</li><li>b</li></ol>')).toBe('1. a\n2. b');
    });

    it('honours the start number of an ordered list', () => {
      expect(htmlToMarkdown('<ol start="5"><li>a</li><li>b</li></ol>')).toBe('5. a\n6. b');
    });

    it('nests lists, indenting under the parent marker', () => {
      expect(htmlToMarkdown('<ul><li>a<ul><li>b<ul><li>c</li></ul></li></ul></li><li>d</li></ul>')).toBe(
        '- a\n  - b\n    - c\n- d',
      );
      expect(htmlToMarkdown('<ol><li>a<ul><li>b</li></ul></li></ol>')).toBe('1. a\n   - b');
    });

    it('keeps a loose item with several paragraphs inside the item', () => {
      expect(htmlToMarkdown('<ul><li><p>a</p><p>b</p></li><li>c</li></ul>')).toBe('- a\n\n  b\n\n- c');
    });

    it('treats a single <p> per item as a tight list (marked wraps items of loose lists that way)', () => {
      expect(htmlToMarkdown('<ul><li><p>a</p></li><li><p>b</p></li></ul>')).toBe('- a\n- b');
    });

    it('converts the checklist plugin structure to task items', () => {
      expect(
        htmlToMarkdown(
          '<ul data-type="checklist"><li data-type="checklist-item" data-checked="true"><p>done</p></li>' +
            '<li data-type="checklist-item" data-checked="false"><p>todo</p></li></ul>',
        ),
      ).toBe('- [x] done\n- [ ] todo');
    });

    it('converts checkbox inputs (markdown rendered elsewhere) to task items', () => {
      expect(
        htmlToMarkdown('<ul><li><input type="checkbox" checked disabled> a</li><li><input type="checkbox"> b</li></ul>'),
      ).toBe('- [x] a\n- [ ] b');
    });

    it('skips empty lists and writes empty items without trailing spaces', () => {
      expect(htmlToMarkdown('<ul></ul>')).toBe('');
      expect(htmlToMarkdown('<ul><li></li><li>a</li></ul>')).toBe('-\n- a');
    });
  });

  describe('blockquotes', () => {
    it('prefixes every line, including nested blocks', () => {
      expect(htmlToMarkdown('<blockquote><p>a</p><p>b</p></blockquote>')).toBe('> a\n>\n> b');
      expect(htmlToMarkdown('<blockquote><p>a</p><blockquote><p>b</p></blockquote></blockquote>')).toBe(
        '> a\n>\n> > b',
      );
    });

    it('works with bare text inside the quote', () => {
      expect(htmlToMarkdown('<blockquote>a<br>b</blockquote>')).toBe('> a\n> b');
    });
  });

  describe('code blocks', () => {
    it('converts <pre><code> with the language from the class', () => {
      expect(htmlToMarkdown('<pre><code class="language-ts">const a = 1;\n</code></pre>')).toBe(
        '```ts\nconst a = 1;\n```',
      );
    });

    it('converts the code-sample plugin block, reading data-lang', () => {
      expect(
        htmlToMarkdown('<pre class="rte-code-block" data-type="code-block" data-lang="python"><code>print(1)</code></pre>'),
      ).toBe('```python\nprint(1)\n```');
    });

    it('omits the language for plain text', () => {
      expect(htmlToMarkdown('<pre data-lang="plaintext"><code>x</code></pre>')).toBe('```\nx\n```');
      expect(htmlToMarkdown('<pre><code>x</code></pre>')).toBe('```\nx\n```');
    });

    it('keeps blank lines and markup characters inside code verbatim', () => {
      expect(htmlToMarkdown('<pre><code>a *b*\n\n# c &lt;d&gt;</code></pre>')).toBe('```\na *b*\n\n# c <d>\n```');
    });

    it('uses a longer fence when the code contains one', () => {
      expect(htmlToMarkdown('<pre><code>```\nx\n```</code></pre>')).toBe('````\n```\nx\n```\n````');
    });
  });

  describe('tables', () => {
    it('converts a table with a header row', () => {
      expect(
        htmlToMarkdown(
          '<table><thead><tr><th>a</th><th>b</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table>',
        ),
      ).toBe('| a | b |\n| --- | --- |\n| 1 | 2 |');
    });

    it('uses the first row as the header when there is no <thead>', () => {
      expect(htmlToMarkdown('<table><tr><td>a</td><td>b</td></tr><tr><td>1</td><td>2</td></tr></table>')).toBe(
        '| a | b |\n| --- | --- |\n| 1 | 2 |',
      );
    });

    it('keeps column alignment, escapes pipes and pads short rows', () => {
      expect(
        htmlToMarkdown(
          '<table><tr><th align="left">a</th><th style="text-align:center">b</th><th align="right">c</th></tr>' +
            '<tr><td>x|y</td></tr></table>',
        ),
      ).toBe('| a | b | c |\n| :--- | :---: | ---: |\n| x\\|y |  |  |');
    });

    it('ignores the editor wrapper and resize handle around a table', () => {
      expect(
        htmlToMarkdown(
          '<div class="rte-table-wrapper"><table><tr><th>a</th></tr><tr><td>1</td></tr></table>' +
            '<div class="table-resize-handle"></div></div>',
        ),
      ).toBe('| a |\n| --- |\n| 1 |');
    });
  });

  describe('rules and structure', () => {
    it('converts horizontal rules', () => {
      expect(htmlToMarkdown('<p>a</p><hr><p>b</p>')).toBe('a\n\n---\n\nb');
    });

    it('treats bare text and inline runs between blocks as paragraphs', () => {
      expect(htmlToMarkdown('loose <b>text</b><p>para</p>tail')).toBe('loose **text**\n\npara\n\ntail');
    });

    it('looks through transparent containers', () => {
      expect(htmlToMarkdown('<div><section><p>a</p></section><div>b</div></div>')).toBe('a\n\nb');
    });

    it('ignores scripts, styles and inputs', () => {
      expect(htmlToMarkdown('<p>a<script>alert(1)</script><style>p{}</style><input>b</p>')).toBe('ab');
    });
  });

  describe('text is not read back as markup', () => {
    it('decodes entities instead of leaking them into the markdown', () => {
      expect(htmlToMarkdown('<p>5 &lt; 6 &amp;&amp; 7 &gt; 3</p>')).toBe('5 < 6 && 7 > 3');
    });

    it('escapes markdown punctuation typed as text', () => {
      expect(htmlToMarkdown('<p>*not italic* and `not code` and [not](a link)</p>')).toBe(
        '\\*not italic\\* and \\`not code\\` and \\[not\\](a link)',
      );
      expect(htmlToMarkdown('<p>back\\slash</p>')).toBe('back\\\\slash');
    });

    it('escapes underscores except inside words', () => {
      expect(htmlToMarkdown('<p>snake_case _emphasis_ a__b</p>')).toBe('snake_case \\_emphasis\\_ a__b');
    });

    it('escapes a < only where it could open a tag', () => {
      expect(htmlToMarkdown('<p>a &lt; b &lt;b&gt; &lt;/i&gt;</p>')).toBe('a < b \\<b> \\</i>');
    });

    it('keeps typed entity text as text', () => {
      expect(htmlToMarkdown('<p>&amp;amp; and &amp;#39; and R&amp;D</p>')).toBe('\\&amp; and \\&#39; and R&D');
    });

    it('escapes tildes that would form strikethrough', () => {
      expect(htmlToMarkdown('<p>~~x~~ and ~y~</p>')).toBe('\\~\\~x\\~\\~ and ~y~');
    });

    it('escapes block syntax at the start of a line', () => {
      expect(htmlToMarkdown('<p># not a heading</p>')).toBe('\\# not a heading');
      expect(htmlToMarkdown('<p>- not a bullet</p>')).toBe('\\- not a bullet');
      expect(htmlToMarkdown('<p>+ not a bullet</p>')).toBe('\\+ not a bullet');
      expect(htmlToMarkdown('<p>1. not a list</p>')).toBe('1\\. not a list');
      expect(htmlToMarkdown('<p>&gt; not a quote</p>')).toBe('\\> not a quote');
      expect(htmlToMarkdown('<p>text<br>---</p>')).toBe('text\n\\---');
      expect(htmlToMarkdown('<p>text<br>===</p>')).toBe('text\n\\===');
    });

    it('does not escape those characters in the middle of a line', () => {
      expect(htmlToMarkdown('<p>a # b - c 1. d > e</p>')).toBe('a # b - c 1. d > e');
    });

    it('escapes at the start of list items too', () => {
      expect(htmlToMarkdown('<ul><li>- not nested</li></ul>')).toBe('- \\- not nested');
    });
  });
});
