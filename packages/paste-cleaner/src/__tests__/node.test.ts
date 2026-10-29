// @vitest-environment node
import { cleanPaste } from '../clean';

// On a server there is no DOMParser. Plain text and Markdown need no HTML parser, so they must work without one;
// only HTML input needs `parse`.
describe('without a DOM', () => {
  it('converts Markdown', () => {
    expect(cleanPaste({ text: '## Plan\n\n- one\n- two' })).toEqual({
      html: '<h2>Plan</h2><ul><li>one</li><li>two</li></ul>',
      text: '## Plan\n\n- one\n- two',
      source: 'markdown',
      inline: false,
      images: [],
      warnings: [],
    });
  });

  it('converts plain text, and keeps a phrase inline', () => {
    expect(cleanPaste({ text: 'First\r\n\r\nSecond line' })).toMatchObject({ html: '<p>First</p><p>Second line</p>', text: 'First\n\nSecond line', source: 'plain', inline: false });
    expect(cleanPaste({ text: 'just a phrase' })).toMatchObject({ html: 'just a phrase', inline: true });
    expect(cleanPaste({ text: '# Not a heading' }, { plainText: true }).html).toBe('# Not a heading');
  });

  it('asks for a parser only when there is HTML to parse', () => {
    expect(() => cleanPaste('<p>hi</p>')).toThrow(/Pass `parse`/);
  });
});
