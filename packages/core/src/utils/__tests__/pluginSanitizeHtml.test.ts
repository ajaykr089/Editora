import { describe, expect, it } from 'vitest';
// The helper lives with the plugins (it is bundled into code / preview / document-manager); the DOM
// environment it needs is set up here.
import { parseHtmlInert, sanitizeHtml } from '../../../../plugins/shared/sanitizeHtml';

const hostile: Array<[string, string]> = [
  ['script element', '<p>a</p><script>window.__x=1</script>'],
  ['img onerror', '<img src="x" onerror="window.__x=1">'],
  ['svg onload', '<svg onload="window.__x=1"><circle r="1"/></svg>'],
  ['javascript: link', '<a href="javascript:window.__x=1">go</a>'],
  ['javascript: with leading whitespace', '<a href=" \tjavascript:window.__x=1">go</a>'],
  ['javascript: mixed case', '<a href="JaVaScRiPt:window.__x=1">go</a>'],
  ['javascript: with embedded newline', '<a href="java\nscript:window.__x=1">go</a>'],
  ['data: html link', '<a href="data:text/html,<script>window.__x=1</script>">go</a>'],
  ['iframe srcdoc', '<iframe srcdoc="<script>window.__x=1</script>"></iframe>'],
  ['iframe javascript:', '<iframe src="javascript:window.__x=1"></iframe>'],
  ['object / embed', '<object data="x"></object><embed src="x">'],
  ['meta refresh', '<meta http-equiv="refresh" content="0;url=javascript:window.__x=1">'],
  ['base hijack', '<base href="https://evil.example/"><a href="/x">x</a>'],
  ['form action', '<form action="javascript:window.__x=1"><input type="submit"></form>'],
  ['style element', '<style>body{background:url(javascript:window.__x=1)}</style>'],
  ['mutation xss (noscript)', '<noscript><p title="</noscript><img src=x onerror=window.__x=1>"></noscript>'],
  ['math/svg namespace confusion', '<math><mtext><table><mglyph><style><img src=x onerror=window.__x=1>'],
];

describe('plugin sanitizeHtml', () => {
  for (const [name, payload] of hostile) {
    it(`neutralises: ${name}`, () => {
      const out = sanitizeHtml(payload);
      expect(out).not.toMatch(/<script/i);
      expect(out).not.toMatch(/\son\w+\s*=/i);
      expect(out).not.toMatch(/javascript:/i);
      expect(out).not.toMatch(/srcdoc/i);
      expect(out).not.toMatch(/<(iframe|object|embed|base|meta|form|style)\b/i);
      // And what is left must be inert when parsed.
      expect(parseHtmlInert(out).querySelector('script, [onerror], [onload]')).toBeNull();
    });
  }

  it('keeps ordinary document formatting', () => {
    const html =
      '<h2>Title</h2><p>Hello <strong>bold</strong> <em>it</em> <u>u</u> <a href="https://example.com/a?b=1" target="_blank">link</a></p>' +
      '<ul><li>one</li><li>two</li></ul><table><tbody><tr><td colspan="2">cell</td></tr></tbody></table>' +
      '<img src="data:image/png;base64,iVBORw0KGgo=" alt="pic"><blockquote>q</blockquote><pre><code>x</code></pre>';
    const out = sanitizeHtml(html);
    for (const needle of ['<h2>Title</h2>', '<strong>bold</strong>', '<em>it</em>', 'href="https://example.com/a?b=1"', 'target="_blank"', '<li>two</li>', 'colspan="2"', 'data:image/png;base64', 'alt="pic"', '<blockquote>q</blockquote>', '<code>x</code>']) {
      expect(out).toContain(needle);
    }
  });

  it('returns an empty string for empty input', () => {
    expect(sanitizeHtml('')).toBe('');
  });
});

describe('parseHtmlInert', () => {
  it('parses without executing handlers or loading anything', () => {
    (window as any).__inert = 0;
    const body = parseHtmlInert('<img src="x" onerror="window.__inert=1"><p>kept</p>');
    expect(body.querySelector('p')?.textContent).toBe('kept');
    expect((window as any).__inert).toBe(0);
    expect(body.ownerDocument).not.toBe(document);
  });

  it('exposes children for walking, like the detached <div> it replaces', () => {
    const body = parseHtmlInert('<h1>a</h1><p>b</p>');
    expect(Array.from(body.children).map((c) => c.tagName)).toEqual(['H1', 'P']);
  });
});
