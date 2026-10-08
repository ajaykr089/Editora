import { describe, expect, it } from 'vitest';
import { htmlToMarkdown } from '../markdown/htmlToMarkdown';
import { markdownToEditorHtml } from '../markdown/markdownToHtml';

/** What the component does to a document the moment the rich editor reports a change. */
const throughEditor = (markdown: string) => htmlToMarkdown(markdownToEditorHtml(markdown));

describe('markdown -> editor HTML -> markdown', () => {
  // Written the way the converter writes markdown, so editing must not change them at all.
  const canonical: Record<string, string> = {
    headings: '# One\n\n## Two\n\n### Three',
    'inline formatting': 'Some **bold**, *italic* and ~~struck~~ text with `code`.',
    'link with title': 'See [the docs](https://example.com/a?b=c "Docs") now.',
    image: '![A cat](https://example.com/cat.png "Cat")',
    'bullet list': '- one\n- two\n- three',
    'ordered list': '1. first\n2. second\n3. third',
    'ordered list with a start': '5. five\n6. six',
    'nested lists': '- a\n  - b\n    - c\n- d\n\n1. x\n   - y',
    'task list': '- [x] done\n- [ ] open',
    blockquote: '> quoted\n>\n> second paragraph',
    'fenced code': '```ts\nconst a = 1;\n\nconsole.log(a);\n```',
    'fenced code without a language': '```\nplain\n```',
    'fenced code containing a fence': '````md\n```js\nx\n```\n````',
    table: '| a | b |\n| --- | --- |\n| 1 | 2 |',
    'table with alignment': '| a | b | c |\n| :--- | :---: | ---: |\n| 1 | 2 | 3 |',
    'horizontal rule': 'before\n\n---\n\nafter',
    'literal markdown characters': 'not \\*italic\\* and \\`code\\` and \\[a link\\](x), snake_case, 5 < 6',
    'line breaks': 'line one\nline two',
    'underline and superscript': '<u>under</u> and x<sup>2</sup>',
    'a document with everything': [
      '# Title',
      '',
      'Intro with **bold**, a [link](https://example.com) and `code`.',
      '',
      '- [x] ship',
      '- [ ] test',
      '',
      '> note',
      '',
      '```json',
      '{"a": 1}',
      '```',
      '',
      '| k | v |',
      '| --- | --- |',
      '| a | 1 |',
    ].join('\n'),
  };

  for (const [name, markdown] of Object.entries(canonical)) {
    it(`leaves ${name} unchanged`, () => {
      expect(throughEditor(markdown)).toBe(markdown);
    });
  }

  // Hand-written variants are normalised once, then stay put.
  const variants: Record<string, [input: string, normalised: string]> = {
    'star bullets and loose spacing': ['* a\n* b\n\n\n\ntext', '- a\n- b\n\ntext'],
    'underscore emphasis': ['_i_ and __b__', '*i* and **b**'],
    'setext headings': ['Title\n=====\n\nSub\n---', '# Title\n\n## Sub'],
    'indented code': ['    indented()\n', '```\nindented()\n```'],
    'a loose list': ['- a\n\n- b', '- a\n- b'],
    'numbering that does not count up': ['1. a\n1. b\n1. c', '1. a\n2. b\n3. c'],
  };

  for (const [name, [input, normalised]] of Object.entries(variants)) {
    it(`normalises ${name} once and is stable afterwards`, () => {
      const once = throughEditor(input);
      expect(once).toBe(normalised);
      expect(throughEditor(once)).toBe(once);
    });
  }

  it('does not turn a literal entity or tag typed in the editor into markup on the way back', () => {
    const html = '<p>R&amp;D &amp;amp; &lt;b&gt;bold&lt;/b&gt; &lt;script&gt;</p>';
    const markdown = htmlToMarkdown(html);
    const reparsed = htmlToMarkdown(markdownToEditorHtml(markdown));
    expect(reparsed).toBe(markdown);
    // ...and the editor shows the same text it started with.
    const host = document.createElement('div');
    host.innerHTML = markdownToEditorHtml(markdown);
    expect(host.textContent!.trim()).toBe('R&D &amp; <b>bold</b> <script>');
  });
});
