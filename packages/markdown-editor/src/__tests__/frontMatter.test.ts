import { describe, expect, it } from 'vitest';
import { frontMatterText, joinFrontMatter, splitFrontMatter } from '../markdown/frontMatter';

describe('splitFrontMatter', () => {
  it('splits a YAML block off the start of the document, keeping the fences and the line break', () => {
    const doc = '---\ntitle: A post\ntags:\n  - one\n  - two\n---\n\n# Heading\n';
    expect(splitFrontMatter(doc)).toEqual({
      frontMatter: '---\ntitle: A post\ntags:\n  - one\n  - two\n---\n',
      body: '\n# Heading\n',
    });
  });

  it('accepts what real front matter contains: comments, lists, quoted keys, urls, blank and indented lines', () => {
    const doc = '---\n# a comment\n"quoted: key": value\nurl: https://example.com/a\n- item\n\ndescription: |\n  free text: with colons\n\n  and a blank line\n---\nbody';
    const { frontMatter, body } = splitFrontMatter(doc);
    expect(body).toBe('body');
    expect(frontMatter).toBe(doc.slice(0, doc.length - 'body'.length));
  });

  it('allows an empty block, "..." as the closing fence, a missing final newline and a byte order mark', () => {
    expect(splitFrontMatter('---\n---\nx')).toEqual({ frontMatter: '---\n---\n', body: 'x' });
    expect(splitFrontMatter('---\na: 1\n...\nx')).toEqual({ frontMatter: '---\na: 1\n...\n', body: 'x' });
    expect(splitFrontMatter('---\na: 1\n---')).toEqual({ frontMatter: '---\na: 1\n---', body: '' });
    expect(splitFrontMatter('﻿---\na: 1\n---\nx').body).toBe('x');
  });

  it('reads CRLF line endings', () => {
    const doc = '---\r\na: 1\r\n---\r\nbody';
    expect(splitFrontMatter(doc)).toEqual({ frontMatter: '---\r\na: 1\r\n---\r\n', body: 'body' });
  });

  it('is not front matter unless it starts the document', () => {
    for (const doc of ['\n---\na: 1\n---\nx', 'text\n\n---\na: 1\n---\nx', ' ---\na: 1\n---\nx']) {
      expect(splitFrontMatter(doc)).toEqual({ frontMatter: '', body: doc });
    }
  });

  it('is not front matter when the block is never closed, or is prose between two rules', () => {
    for (const doc of [
      '---\na: 1\nno closing fence',
      '---\n',
      '---\nJust some prose\nbetween two rules\n---\nafter',
      '----\na: 1\n----\n',
      '---\na: 1\n-x\n---\n',
    ]) {
      expect(splitFrontMatter(doc)).toEqual({ frontMatter: '', body: doc });
    }
  });

  it('never loses or adds a character: frontMatter + body is the original', () => {
    for (const doc of ['', '---', '---\n---', '---\na: 1\n---\n\n\nx', 'plain', '---\n\n---\n---\nx', '---\na: 1\n---\n---\nx']) {
      const { frontMatter, body } = splitFrontMatter(doc);
      expect(frontMatter + body).toBe(doc);
    }
  });

  it('ends at the first closing fence', () => {
    expect(splitFrontMatter('---\na: 1\n---\n---\nx')).toEqual({ frontMatter: '---\na: 1\n---\n', body: '---\nx' });
  });
});

describe('frontMatterText', () => {
  it('is the YAML without its fences', () => {
    expect(frontMatterText('---\na: 1\nb:\n  - x\n---\n')).toBe('a: 1\nb:\n  - x');
    expect(frontMatterText('---\r\na: 1\r\n---')).toBe('a: 1');
    expect(frontMatterText('---\n---\n')).toBe('');
  });
});

describe('joinFrontMatter', () => {
  it('puts the front matter back with a blank line before the markdown', () => {
    expect(joinFrontMatter('---\na: 1\n---\n', '# T')).toBe('---\na: 1\n---\n\n# T');
    expect(joinFrontMatter('---\na: 1\n---', '# T')).toBe('---\na: 1\n---\n\n# T');
  });

  it('leaves markdown alone when there is no front matter, and keeps front matter when the body is empty', () => {
    expect(joinFrontMatter('', '# T')).toBe('# T');
    expect(joinFrontMatter('---\na: 1\n---\n', '')).toBe('---\na: 1\n---\n');
  });

  it('round-trips with splitFrontMatter', () => {
    const { frontMatter, body } = splitFrontMatter('---\na: 1\n---\n\n# T\n\ntext');
    expect(joinFrontMatter(frontMatter, body.trimStart())).toBe('---\na: 1\n---\n\n# T\n\ntext');
  });
});
