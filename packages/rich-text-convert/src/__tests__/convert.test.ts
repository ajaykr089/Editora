import { convert, detectFormat, FORMATS, read, write, type Doc, type Format } from '../index';
import { Report } from '../report';

// One document using everything every format can hold.
const sample: Doc = {
  type: 'doc',
  children: [
    { type: 'heading', level: 1, children: [{ type: 'text', text: 'Release notes' }] },
    {
      type: 'paragraph',
      children: [
        { type: 'text', text: 'Plain, ' },
        { type: 'text', text: 'bold', marks: ['bold'] },
        { type: 'text', text: ', ' },
        { type: 'text', text: 'italic', marks: ['italic'] },
        { type: 'text', text: ', ' },
        { type: 'text', text: 'code', marks: ['code'] },
        { type: 'text', text: ' and ' },
        { type: 'text', text: 'a link', link: { href: 'https://example.com' } },
        { type: 'text', text: '.' },
      ],
    },
    { type: 'heading', level: 2, children: [{ type: 'text', text: 'Changes' }] },
    {
      type: 'list',
      ordered: false,
      items: [
        { children: [{ type: 'paragraph', children: [{ type: 'text', text: 'First' }] }] },
        {
          children: [
            { type: 'paragraph', children: [{ type: 'text', text: 'Second' }] },
            { type: 'list', ordered: true, items: [{ children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Nested' }] }] }] },
          ],
        },
      ],
    },
    { type: 'blockquote', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'A quote' }] }] },
    { type: 'code', language: 'js', text: 'const a = 1;\nconsole.log(a);' },
  ],
};

const lossless: Format[] = ['html', 'markdown', 'tiptap', 'prosemirror', 'lexical', 'slate', 'plate', 'portable-text', 'editorjs', 'ast'];

describe('round trips', () => {
  for (const format of lossless) {
    it(`keeps the sample through ${format}`, () => {
      const report = new Report();
      const output = write(sample, format, {}, report);
      const back = read(output, format, new Report());
      if (format === 'editorjs') {
        // Editor.js's code tool has no language, nested lists take the parent's style, and inline code needs a plugin.
        expect(report.warnings).toEqual([
          'Editor.js keeps "code" only when the InlineCode (@editorjs/inline-code) inline tool is registered',
          'Editor.js nested lists share their parent list style; mixed bullet/numbered nesting was unified',
          'The Editor.js code tool has no language; it was dropped',
        ]);
        const expected = JSON.parse(JSON.stringify(sample));
        expected.children[3].items[1].children[1].ordered = false;
        delete expected.children[5].language;
        expect(back).toEqual(expected);
        return;
      }
      expect(back).toEqual(sample);
      expect(report.warnings).toEqual([]);
    });
  }

  const media: Doc = {
    type: 'doc',
    children: [
      { type: 'image', src: 'https://example.com/a.png', alt: 'A chart' },
      { type: 'rule' },
      {
        type: 'table',
        rows: [
          { cells: [{ header: true, children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Name' }] }] }, { header: true, children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Score' }] }] }] },
          { cells: [{ children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Ada', marks: ['bold'] }] }] }, { children: [{ type: 'paragraph', children: [{ type: 'text', text: '10' }] }] }] },
        ],
      },
    ],
  };

  for (const format of ['html', 'markdown', 'tiptap', 'prosemirror', 'slate', 'plate', 'editorjs'] as Format[]) {
    it(`keeps images, rules and tables through ${format}`, () => {
      const report = new Report();
      expect(read(write(media, format, {}, report), format)).toEqual(media);
      expect(report.warnings).toEqual([]);
    });
  }

  it('keeps tables and rules through Lexical, and images with imageNodes', () => {
    expect(read(write(media, 'lexical', { lexical: { imageNodes: true } }), 'lexical')).toEqual(media);
  });

  it('converts every pair without throwing', () => {
    for (const from of FORMATS) {
      const input = write(sample, from);
      for (const to of FORMATS) expect(() => convert(input, { from, to })).not.toThrow();
    }
  });
});

describe('detectFormat', () => {
  it.each([
    ['<p>Hi</p>', 'html'],
    ['# Hi', 'markdown'],
    [{ type: 'doc', content: [{ type: 'paragraph' }] }, 'tiptap'],
    [{ type: 'doc', content: [{ type: 'bullet_list', content: [] }] }, 'prosemirror'],
    [{ root: { type: 'root', children: [] } }, 'lexical'],
    [[{ type: 'paragraph', children: [{ text: 'Hi' }] }], 'slate'],
    [[{ type: 'p', children: [{ text: 'Hi' }] }], 'plate'],
    [[{ _type: 'block', children: [] }], 'portable-text'],
    [{ time: 1, blocks: [] }, 'editorjs'],
    [{ type: 'doc', children: [] }, 'ast'],
    ['{"root":{"type":"root","children":[]}}', 'lexical'],
  ])('detects %j as %s', (input, format) => {
    expect(detectFormat(input)).toBe(format);
  });
});

describe('Markdown', () => {
  const md = (source: string) => read(source, 'markdown').children;

  it('reads GFM tables, task lists and strikethrough', () => {
    const doc = read('| A | B |\n| - | - |\n| 1 | ~~2~~ |\n\n- [x] done\n- [ ] todo\n', 'markdown');
    expect(doc.children[0]).toMatchObject({ type: 'table', rows: [{ cells: [{ header: true }, { header: true }] }, { cells: [{}, { children: [{ children: [{ text: '2', marks: ['strike'] }] }] }] }] });
    expect(doc.children[1]).toMatchObject({ type: 'list', items: [{ checked: true }, { checked: false }] });
  });

  it('does not treat snake_case as emphasis', () => {
    expect(md('use snake_case_names here')).toEqual([{ type: 'paragraph', children: [{ type: 'text', text: 'use snake_case_names here' }] }]);
  });

  it('escapes Markdown characters in text', () => {
    const { output } = convert('<p>2 * 3 = 6 and [not a link]</p>', { to: 'markdown' });
    expect(output).toBe('2 \\* 3 = 6 and \\[not a link\\]\n');
    expect(convert(output, { from: 'markdown', to: 'html' }).output).toBe('<p>2 * 3 = 6 and [not a link]</p>');
  });

  it('fences code that contains backticks', () => {
    const { output } = convert({ type: 'doc', children: [{ type: 'code', text: 'a\n```\nb' }] }, { from: 'ast', to: 'markdown' });
    expect(output).toBe('````\na\n```\nb\n````\n');
  });

  it('keeps marks Markdown lacks as inline HTML', () => {
    const { output } = convert('<p><u>under</u> H<sub>2</sub>O</p>', { to: 'markdown' });
    expect(output).toBe('<u>under</u> H<sub>2</sub>O\n');
    expect(read(output, 'markdown').children[0]).toMatchObject({ children: [{ marks: ['underline'] }, { text: ' H' }, { marks: ['subscript'] }, { text: 'O' }] });
  });

  it('warns when a table cell has to be flattened', () => {
    const { warnings } = convert('<table><tr><td><p>a</p><p>b</p></td></tr></table>', { to: 'markdown' });
    expect(warnings.join(' ')).toMatch(/table/i);
  });
});

describe('HTML', () => {
  it('reads common markup and drops scripts', () => {
    const { output } = convert('<h2>T</h2><p><b>b</b><i>i</i></p><script>x()</script><ul><li>one<ul><li>two</li></ul></li></ul>', { to: 'ast' });
    expect((output as Doc).children.map((block) => block.type)).toEqual(['heading', 'paragraph', 'list']);
    expect(JSON.stringify(output)).not.toContain('x()');
  });

  it('warns about embeds it drops', () => {
    expect(convert('<p>a</p><iframe src="https://v.test"></iframe>', { to: 'markdown' }).warnings).toEqual(['Embedded <iframe> was dropped']);
  });

  it('reads Lexical-style code: data-language and <br> between lines', () => {
    expect(read('<pre data-language="js"><span>let a = 1;</span><br><span>a++;</span></pre>', 'html').children[0]).toEqual({ type: 'code', language: 'js', text: 'let a = 1;\na++;' });
  });

  it('reads code language classes', () => {
    expect(read('<pre><code class="language-ts">let a</code></pre>', 'html').children[0]).toEqual({ type: 'code', language: 'ts', text: 'let a' });
  });

  it('escapes text and attributes', () => {
    const { output } = convert({ type: 'doc', children: [{ type: 'paragraph', children: [{ type: 'text', text: '<b>&', link: { href: 'https://x.test/?a="1"' } }] }] }, { from: 'ast', to: 'html' });
    expect(output).toBe('<p><a href="https://x.test/?a=&quot;1&quot;">&lt;b&gt;&amp;</a></p>');
  });
});

describe('format specifics', () => {
  it('writes Lexical text formats as a bitmask', () => {
    const { output } = convert('<p><b><i>x</i></b></p>', { to: 'lexical' });
    expect((output as any).root.children[0].children[0]).toMatchObject({ type: 'text', text: 'x', format: 3 });
  });

  it('numbers Lexical nested-list holder items like the item after them, as Lexical does', () => {
    const { output } = convert('<ul><li>One<ul><li>Nested</li></ul></li><li>Two</li></ul>', { to: 'lexical' });
    expect((output as any).root.children[0].children.map((item: any) => item.value)).toEqual([1, 2, 2]);
  });

  it('drops images for Lexical with a warning unless imageNodes is set', () => {
    const html = '<p><img src="a.png" alt="A"></p>';
    expect(convert(html, { to: 'lexical' }).warnings.join(' ')).toMatch(/image/);
    const { output, warnings } = convert(html, { to: 'lexical', lexical: { imageNodes: true } });
    expect(warnings).toEqual([]);
    expect(JSON.stringify(output)).toContain('"src":"a.png"');
  });

  it('writes Tiptap images as blocks', () => {
    const { output } = convert('<p>before <img src="a.png"> after</p>', { to: 'tiptap' });
    expect((output as any).content.map((node: any) => node.type)).toEqual(['paragraph', 'image', 'paragraph']);
  });

  it('warns about marks the basic ProseMirror schema lacks', () => {
    const { warnings } = convert('<p><u>u</u></p>', { to: 'prosemirror' });
    expect(warnings.join(' ')).toMatch(/underline/);
  });

  it('writes Portable Text links as mark definitions with stable keys', () => {
    const first = convert('<p><a href="https://a.test">a</a></p>', { to: 'portable-text' });
    const second = convert('<p><a href="https://a.test">a</a></p>', { to: 'portable-text' });
    expect(first.output).toEqual(second.output);
    const [block] = first.output as any[];
    expect(block.markDefs).toEqual([{ _key: expect.any(String), _type: 'link', href: 'https://a.test' }]);
    expect(block.children[0].marks).toEqual([block.markDefs[0]._key]);
  });

  it('warns that Portable Text lists lose their start number', () => {
    expect(convert('<ol start="3"><li>c</li></ol>', { to: 'portable-text' }).warnings).toEqual(['Portable Text lists have no start number; the numbering restarts at 1']);
  });

  it('rebuilds nested lists from Portable Text levels', () => {
    const blocks = [
      { _type: 'block', listItem: 'bullet', level: 1, children: [{ _type: 'span', text: 'a' }] },
      { _type: 'block', listItem: 'bullet', level: 2, children: [{ _type: 'span', text: 'b' }] },
      { _type: 'block', listItem: 'bullet', level: 1, children: [{ _type: 'span', text: 'c' }] },
    ];
    expect(convert(blocks, { to: 'markdown' }).output).toBe('- a\n  - b\n- c\n');
  });

  it('warns which Editor.js inline tools the marks need, as Editor.js strips tags no tool allows', () => {
    const { output, warnings } = convert('<p><b>b</b> <u>u</u> <mark>m</mark> <code>c</code> <s>s</s></p>', { to: 'editorjs' });
    expect((output as any).blocks[0].data.text).toBe('<b>b</b> <u class="cdx-underline">u</u> <mark class="cdx-marker">m</mark> <code class="inline-code">c</code> <s>s</s>');
    expect(warnings).toEqual([
      'Editor.js keeps "underline" only when the Underline (@editorjs/underline) inline tool is registered',
      'Editor.js keeps "highlight" only when the Marker (@editorjs/marker) inline tool is registered',
      'Editor.js keeps "code" only when the InlineCode (@editorjs/inline-code) inline tool is registered',
      'Editor.js has no official "strike" inline tool; the mark is lost unless you register one that allows <s>',
    ]);
  });

  it('reads Editor.js nested and string lists', () => {
    const nested = { blocks: [{ type: 'list', data: { style: 'ordered', items: [{ content: 'a', meta: {}, items: [{ content: '<b>b</b>', meta: {}, items: [] }] }] } }] };
    expect(convert(nested, { to: 'markdown' }).output).toBe('1. a\n   1. **b**\n');
    const strings = { blocks: [{ type: 'list', data: { style: 'unordered', items: ['x', 'y'] } }] };
    expect(convert(strings, { to: 'markdown' }).output).toBe('- x\n- y\n');
  });

  it('groups Slate check-list items into one list', () => {
    const value = [
      { type: 'check-list-item', checked: true, children: [{ text: 'a' }] },
      { type: 'check-list-item', checked: false, children: [{ text: 'b' }] },
    ];
    expect(convert(value, { to: 'markdown' }).output).toBe('- [x] a\n- [ ] b\n');
    expect(convert(convert(value, { to: 'ast' }).output, { from: 'ast', to: 'slate' }).output).toEqual(value);
  });

  it('gives every Slate element a text child', () => {
    const { output } = convert('<hr><p><img src="a.png"></p>', { to: 'plate' });
    const walk = (nodes: any[]): void => nodes.forEach((node) => node.type && (expect(node.children.length).toBeGreaterThan(0), walk(node.children)));
    walk(output as any[]);
  });

  it('reports unknown nodes instead of failing', () => {
    const { output, warnings } = convert({ type: 'doc', content: [{ type: 'callout', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'hi' }] }] }] }, { to: 'html' });
    expect(output).toBe('<p>hi</p>');
    expect(warnings).toEqual(['Unsupported block "callout" was unwrapped']);
  });
});

it('collapses repeated warnings', () => {
  const report = new Report();
  report.warn('x');
  report.warn('x');
  report.warn('y');
  expect(report.warnings).toEqual(['x (2 times)', 'y']);
});
