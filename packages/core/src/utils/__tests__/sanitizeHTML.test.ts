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
