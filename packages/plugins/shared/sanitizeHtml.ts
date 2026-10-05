import DOMPurify from 'dompurify';

/**
 * Make an HTML string safe to hand to `innerHTML`, for plugins that take markup from somewhere other
 * than the user's own typing: a converted .docx, the source-view textarea, a preview of the document.
 *
 * Uses DOMPurify's HTML profile (formatting, tables, lists, links and images are kept; scripts, event
 * handlers, `javascript:`/`vbscript:`/non-image `data:` URLs, `srcdoc`, SVG/MathML payloads, etc. are not),
 * and parses in DOMPurify's own inert document. Do not hand-roll this with a detached
 * `document.createElement('div')`: assigning to its innerHTML still starts image loads, so an
 * `<img src=x onerror=...>` runs *while you are "cleaning" it*, and blacklist checks such as
 * `href.startsWith('javascript:')` are bypassed by leading whitespace or mixed case.
 *
 * The editor's stricter allowlist (core's `sanitizeInputHTML`) still runs on the next input event; this
 * is the layer that stops anything executing before that.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    // <style> can restyle or exfiltrate through CSS; <form> and friends have no place in document content.
    FORBID_TAGS: ['style', 'form', 'input', 'button', 'textarea', 'select', 'option', 'base', 'meta', 'link'],
    ADD_ATTR: ['target'],
  });
}

/**
 * Parse HTML without running anything, for code that only needs to walk or read it (exports, text
 * extraction). `DOMParser` documents have no browsing context, so nothing loads and no handler fires.
 */
export function parseHtmlInert(html: string): HTMLElement {
  return new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html').body;
}
