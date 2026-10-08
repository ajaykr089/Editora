import { describe, expect, it } from 'vitest';
import { markdownToEditorHtml, markdownToPreviewHtml } from '../markdown/markdownToHtml';

const parse = (html: string) => {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content;
};
const preview = (markdown: string, options?: Parameters<typeof markdownToPreviewHtml>[1]) =>
  parse(markdownToPreviewHtml(markdown, options));

describe('front matter', () => {
  const doc = '---\ntitle: A <post>\ntags: [a, b]\n---\n\n# Heading\n\nText';

  it('is shown as a collapsed, escaped block instead of a rule and a heading', () => {
    const fragment = preview(doc);
    const block = fragment.querySelector('details.md-front-matter')!;
    expect(block.hasAttribute('open')).toBe(false);
    expect(block.querySelector('summary')?.textContent).toBe('Front matter');
    expect(block.querySelector('code')?.textContent).toBe('title: A <post>\ntags: [a, b]');
    expect(block.querySelector('post')).toBeNull();
    expect(fragment.querySelector('hr')).toBeNull();
    expect(fragment.querySelectorAll('h1, h2')).toHaveLength(1);
    expect(fragment.querySelector('h1')?.textContent).toBe('Heading');
  });

  it('cannot inject markup through the YAML', () => {
    const fragment = preview('---\nname: <img src=x onerror=alert(1)>\n---\ntext');
    expect(fragment.querySelector('img')).toBeNull();
    expect(fragment.querySelector('.md-front-matter code')?.textContent).toBe('name: <img src=x onerror=alert(1)>');
  });

  it('keeps the line numbers of the blocks after it equal to their lines in the source', () => {
    const fragment = preview(doc);
    expect(fragment.querySelector('.md-front-matter')?.getAttribute('data-md-line')).toBe('0');
    expect(fragment.querySelector('h1')?.getAttribute('data-md-line')).toBe('5');
    expect(fragment.querySelector('p')?.getAttribute('data-md-line')).toBe('7');
  });

  it('uses the label it is given', () => {
    expect(preview(doc, { labels: { frontMatter: 'Metadatos' } }).querySelector('summary')?.textContent).toBe('Metadatos');
  });

  it('is left out of the rich pane, which would otherwise render and then rewrite it', () => {
    const html = markdownToEditorHtml(doc);
    expect(html).not.toContain('title');
    expect(html).toContain('<h1>Heading</h1>');
  });

  it('is only front matter at the start of the document', () => {
    const fragment = preview('text\n\n---\na: 1\n---\n\nmore');
    expect(fragment.querySelector('.md-front-matter')).toBeNull();
    expect(fragment.querySelector('hr')).not.toBeNull();
  });
});

describe('footnotes', () => {
  const doc = 'First[^a] and second[^b], then first again[^a].\n\n[^a]: The first note.\n[^b]: The second note\n    over two lines.\n\nAfter.';

  it('turns references into numbered links and puts the notes in a section at the end', () => {
    const fragment = preview(doc);
    const refs = Array.from(fragment.querySelectorAll('sup > a[data-footnote-ref]'));
    expect(refs.map((ref) => ref.textContent)).toEqual(['1', '2', '1']);
    expect(refs.map((ref) => ref.getAttribute('href'))).toEqual(['#footnote-a', '#footnote-b', '#footnote-a']);

    const section = fragment.querySelector('section.footnotes')!;
    expect(section.previousElementSibling?.textContent).toBe('After.');
    const notes = Array.from(section.querySelectorAll('ol > li'));
    expect(notes.map((note) => note.id)).toEqual(['footnote-a', 'footnote-b']);
    expect(notes[0].textContent).toContain('The first note.');
    expect(notes[1].textContent).toContain('The second note');
  });

  it('links each note back to every reference to it', () => {
    const back = Array.from(preview(doc).querySelectorAll('a[data-footnote-backref]'));
    expect(back.map((link) => link.getAttribute('href'))).toEqual(['#footnote-ref-a', '#footnote-ref-a-2', '#footnote-ref-b']);
    expect(back[0].getAttribute('aria-label')).toBe('Back to reference a');
  });

  it('is not printed as text, and a reference without a note stays text', () => {
    const fragment = preview('Missing[^zzz] here.\n\n[^a]: unused');
    expect(fragment.querySelector('sup')).toBeNull();
    expect(fragment.querySelector('section.footnotes')).toBeNull();
    expect(fragment.textContent).toContain('[^zzz]');
    expect(fragment.textContent).not.toContain('unused');
  });

  it('does not carry anything over from one document to the next', () => {
    const first = markdownToPreviewHtml(doc);
    expect(markdownToPreviewHtml('plain text')).not.toContain('footnote');
    expect(markdownToPreviewHtml(doc)).toBe(first);
    expect(markdownToPreviewHtml('A[^x]\n\n[^x]: note')).toContain('id="footnote-x"');
  });

  it('prefixes its ids so two editors on one page do not share them', () => {
    const fragment = preview(doc, { idPrefix: 'md7-' });
    const ids = Array.from(fragment.querySelectorAll('[id]')).map((element) => element.id);
    expect(ids.length).toBeGreaterThan(0);
    expect(ids.every((id) => id.startsWith('md7-footnote-'))).toBe(true);
    expect(fragment.querySelector('sup a')?.getAttribute('href')).toBe('#md7-footnote-a');
    expect(fragment.querySelector('a[data-footnote-backref]')?.getAttribute('href')).toBe('#md7-footnote-ref-a');
    expect(fragment.querySelector('[aria-describedby]')?.getAttribute('aria-describedby')).toBe('md7-footnote-label');
    expect(fragment.querySelector('#md7-footnote-label')).not.toBeNull();
  });

  it('uses the labels it is given', () => {
    const fragment = preview(doc, { labels: { footnotes: 'Notas', backToReference: 'Volver a {0}' } });
    expect(fragment.querySelector('section.footnotes h2')?.textContent).toBe('Notas');
    expect(fragment.querySelector('a[data-footnote-backref]')?.getAttribute('aria-label')).toBe('Volver a a');
  });

  it('survives the sanitiser: ids, in-page links and data attributes are kept, script is not', () => {
    const fragment = preview('Hi[^1] <script>alert(1)</script>\n\n[^1]: Note <img src=x onerror=alert(1)>');
    expect(fragment.querySelector('script')).toBeNull();
    expect(fragment.querySelector('img')?.hasAttribute('onerror') ?? false).toBe(false);
    expect(fragment.querySelector('#footnote-1')).not.toBeNull();
    expect(fragment.querySelector('a[data-footnote-ref]')?.getAttribute('href')).toBe('#footnote-1');
  });
});

describe('line anchors', () => {
  const lines = [
    '# Title', //                    0
    '', //                           1
    'First paragraph', //            2
    'continues here.', //            3
    '', //                           4
    '- one', //                      5
    '- two', //                      6
    '  - nested', //                 7
    '', //                           8
    '```js', //                      9
    'const a = 1;', //               10
    '', //                           11
    'const b = 2;', //               12
    '```', //                        13
    '', //                           14
    '> quoted', //                   15
    '', //                           16
    '| a | b |', //                  17
    '|---|---|', //                  18
    '| 1 | 2 |', //                  19
    '', //                           20
    '---', //                        21
    '', //                           22
    'Setext', //                     23
    '======', //                     24
    '', //                           25
    '1. first', //                   26
    '2. second', //                  27
    '', //                           28
    'Last[^n]', //                   29
    '', //                           30
    '[^n]: note', //                 31
  ];

  const anchors = (markdown: string) =>
    Array.from(preview(markdown).querySelectorAll('[data-md-line]')).map((element) => [
      element.tagName.toLowerCase(),
      Number(element.getAttribute('data-md-line')),
    ]);

  it('gives every top-level block the line of the markdown it starts on', () => {
    expect(anchors(lines.join('\n'))).toEqual([
      ['h1', 0],
      ['p', 2],
      ['ul', 5],
      ['pre', 9],
      ['blockquote', 15],
      ['table', 17],
      ['hr', 21],
      ['h1', 23],
      ['ol', 26],
      ['p', 29],
    ]);
  });

  it('puts the line on the block that starts there, whatever the text in it', () => {
    for (const [tag, line] of anchors(lines.join('\n'))) {
      const first = lines[line as number];
      expect(first, `${tag} at ${line}`).not.toBe('');
    }
  });

  it('does not give the footnotes section a line, since its text is not where the section is', () => {
    const section = preview(lines.join('\n')).querySelector('section.footnotes')!;
    expect(section.hasAttribute('data-md-line')).toBe(false);
  });

  it('counts blank lines and line endings between blocks, including a document that starts with blank lines', () => {
    expect(anchors('\n\n\nText\n\n\n\n# H')).toEqual([['p', 3], ['h1', 7]]);
    expect(anchors('a\r\n\r\nb')).toEqual([['p', 0], ['p', 2]]);
  });

  it('is not moved by the footnotes label, which is not text of the document', () => {
    // No reference, so the footnotes token stays at the start of the document.
    const fragment = preview('A\n\n[^1]: unused\n\nB', { labels: { footnotes: 'Foot\nnotes' } });
    const lines = Array.from(fragment.querySelectorAll('[data-md-line]')).map((element) => element.getAttribute('data-md-line'));
    expect(lines).toEqual(['0', '4']);
  });

  it('leaves nested blocks without a line, so only the top level is addressed', () => {
    const fragment = preview('- a\n\n  para in item\n\n> q1\n>\n> q2');
    expect(fragment.querySelectorAll('[data-md-line]')).toHaveLength(2);
  });

  it('is not added to raw HTML blocks, which can be anything', () => {
    expect(anchors('<div>raw</div>\n\ntext')).toEqual([['p', 2]]);
  });
});
