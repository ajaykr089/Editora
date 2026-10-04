import { describe, expect, it } from 'vitest';
import { sanitizeHTML, sanitizeInputHTML, sanitizePastedHTML } from '../sanitizeHTML';

describe('sanitizeHTML', () => {
  it('strips <script> tags entirely', () => {
    const result = sanitizeHTML('<p>hi</p><script>alert(1)</script>');
    expect(result).not.toContain('<script');
    expect(result).not.toContain('alert(1)');
    expect(result).toContain('<p>hi</p>');
  });

  it('strips on* event handler attributes', () => {
    const result = sanitizeHTML('<img src="x.png" onerror="alert(1)">');
    expect(result).not.toContain('onerror');
    expect(result).not.toContain('alert(1)');
  });

  it('blocks javascript: URLs in href', () => {
    const result = sanitizeHTML('<a href="javascript:alert(1)">click</a>');
    expect(result).not.toContain('javascript:');
  });

  it('blocks javascript: URLs that use embedded whitespace to bypass naive startsWith checks', () => {
    // Browsers strip embedded tab/newline characters from a URL scheme before
    // evaluating it, so `jav\tascript:` is equivalent to `javascript:`. A
    // naive `href.startsWith('javascript:')` check misses this; DOMPurify's
    // ALLOWED_URI_REGEXP does not.
    const result = sanitizeHTML('<a href="jav&#9;ascript:alert(1)">click</a>');
    expect(result.toLowerCase()).not.toContain('javascript:');
  });

  it('removes <iframe> by default', () => {
    const result = sanitizeHTML('<iframe src="https://example.com"></iframe><p>kept</p>');
    expect(result).not.toContain('<iframe');
    expect(result).toContain('<p>kept</p>');
  });

  it('allows <iframe> when explicitly opted into via a custom allowedTags list', () => {
    const result = sanitizeHTML('<iframe src="https://example.com"></iframe>', {
      allowedTags: ['iframe'],
    });
    expect(result).toContain('<iframe');
  });

  it('allows safe http(s) URLs and common data: image URLs', () => {
    const httpResult = sanitizeHTML('<a href="https://example.com">link</a>');
    expect(httpResult).toContain('href="https://example.com"');

    const dataImgResult = sanitizeHTML('<img src="data:image/png;base64,iVBORw0KGgo=">');
    expect(dataImgResult).toContain('data:image/png;base64,iVBORw0KGgo=');
  });

  it('preserves allowed structural and formatting tags', () => {
    const html = '<h1>Title</h1><p>Some <strong>bold</strong> and <em>italic</em> text.</p><ul><li>one</li></ul>';
    const result = sanitizeHTML(html);
    expect(result).toBe(html);
  });

  it('passes html through unmodified when sanitize is explicitly disabled', () => {
    const html = '<script>alert(1)</script>';
    const result = sanitizeHTML(html, { sanitize: false });
    expect(result).toBe(html);
  });

  it('honors a custom allowedTags allowlist, dropping tags outside it', () => {
    const result = sanitizeHTML('<p>keep</p><h1>drop</h1>', { allowedTags: ['p'] });
    expect(result).toContain('<p>keep</p>');
    expect(result).not.toContain('<h1>');
  });
});

describe('sanitizePastedHTML', () => {
  it('sanitizes by default', () => {
    const result = sanitizePastedHTML('<script>alert(1)</script><p>ok</p>');
    expect(result).not.toContain('<script');
  });

  it('skips sanitization when sanitizeOnPaste is false', () => {
    const html = '<script>alert(1)</script>';
    const result = sanitizePastedHTML(html, undefined, { sanitizeOnPaste: false });
    expect(result).toBe(html);
  });
});

describe('sanitizeInputHTML', () => {
  it('sanitizes by default', () => {
    const result = sanitizeInputHTML('<img src=x onerror=alert(1)>');
    expect(result).not.toContain('onerror');
  });

  it('skips sanitization when sanitizeOnInput is false', () => {
    const html = '<img src=x onerror=alert(1)>';
    const result = sanitizeInputHTML(html, undefined, { sanitizeOnInput: false });
    expect(result).toBe(html);
  });
});

describe('trusted embed iframes (input path only)', () => {
  const marked = '<iframe data-editora-embed="true" src="https://example.com/embed" width="100%" height="400"></iframe>';

  it('keeps an iframe the embed plugin marked, so a later edit does not delete it', () => {
    const result = sanitizeInputHTML(`<p>text</p>${marked}`);
    expect(result).toContain('<iframe');
    expect(result).toContain('src="https://example.com/embed"');
  });

  it('still removes an unmarked iframe on the input path', () => {
    const result = sanitizeInputHTML('<p>text</p><iframe src="https://example.com/embed"></iframe>');
    expect(result).not.toContain('<iframe');
  });

  it('never keeps a marked iframe on the paste path', () => {
    expect(sanitizePastedHTML(marked)).not.toContain('<iframe');
    expect(sanitizeHTML(marked)).not.toContain('<iframe');
  });

  it('does not let the exemption leak into a later paste sanitize', () => {
    sanitizeInputHTML(marked);
    expect(sanitizePastedHTML(marked)).not.toContain('<iframe');
  });

  it('removes a marked iframe whose src is not a plain http(s) URL', () => {
    for (const src of ['javascript:alert(1)', 'data:text/html,<b>x</b>', 'ftp://example.com', 'https://', 'http://a b']) {
      const result = sanitizeInputHTML(`<iframe data-editora-embed="true" src="${src}"></iframe>`);
      expect(result).not.toContain('<iframe');
    }
  });

  it('strips srcdoc and event handlers from a kept iframe', () => {
    const result = sanitizeInputHTML(
      '<iframe data-editora-embed="true" src="https://example.com/embed" srcdoc="<script>alert(1)</script>" onload="alert(2)"></iframe>',
    );
    expect(result).toContain('<iframe');
    expect(result).not.toContain('srcdoc');
    expect(result).not.toContain('onload');
  });
});

describe('trusted embed iframes mixed with other iframes in one document', () => {
  const marked = '<iframe data-editora-embed="true" src="https://example.com/embed"></iframe>';
  const unmarked = '<iframe src="https://evil.example/frame"></iframe>';
  const unsafeMarked = '<iframe data-editora-embed="true" src="javascript:alert(1)"></iframe>';
  const count = (html: string) => (html.match(/<iframe/g) || []).length;

  it('does not let one trusted embed unlock the unmarked iframes after it', () => {
    const result = sanitizeInputHTML(`${marked}${unmarked}`);
    expect(count(result)).toBe(1);
    expect(result).toContain('example.com/embed');
    expect(result).not.toContain('evil.example');
  });

  it('drops an unmarked iframe regardless of the order', () => {
    const result = sanitizeInputHTML(`${unmarked}${marked}${unmarked}`);
    expect(count(result)).toBe(1);
    expect(result).not.toContain('evil.example');
  });

  it('drops a marked iframe with an unsafe src instead of leaving a src-less frame', () => {
    const result = sanitizeInputHTML(`${marked}${unsafeMarked}`);
    expect(count(result)).toBe(1);
    expect(result).not.toContain('javascript');
  });

  it('keeps several genuinely trusted embeds', () => {
    const second = '<iframe data-editora-embed="true" src="https://example.org/two"></iframe>';
    expect(count(sanitizeInputHTML(`${marked}<p>x</p>${second}`))).toBe(2);
  });

  it('still honours an allowlist that explicitly includes iframe', () => {
    const result = sanitizeInputHTML(`${marked}${unmarked}`, { allowedTags: ['p', 'iframe'] });
    expect(count(result)).toBe(2);
  });
});
