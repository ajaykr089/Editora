/**
 * HTML Sanitization Utility
 *
 * Wraps DOMPurify rather than hand-rolling tag/attribute filtering. The
 * previous implementation (a from-scratch allowlist walker) had several real
 * gaps found during a security audit: it allowed <iframe> by default with an
 * unrestricted src, allowed the `style` attribute globally with zero content
 * validation, and validated href/src schemes with a naive
 * `value.startsWith('javascript:')` check - vulnerable to the well-known
 * embedded-whitespace bypass (`href="jav&#9;ascript:alert(1)"`), since
 * browsers strip embedded tab/newline characters from a URL's scheme before
 * evaluating it, but that check never did. DOMPurify's own URI-scheme
 * validation (ALLOWED_URI_REGEXP) is specifically hardened against this
 * class of bypass, and its tag/attribute filtering has years of adversarial
 * testing behind it that a bespoke implementation in an editor library
 * can't realistically match.
 *
 * Public API (function signatures and config shape) is unchanged from the
 * previous implementation, so callers - webcomponent/RichTextEditor.ts, and
 * any consuming app passing its own contentConfig/security options - don't
 * need to change.
 */
import DOMPurify from 'dompurify';

export interface SanitizationConfig {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  sanitize?: boolean;
}

export interface SecurityConfig {
  sanitizeOnPaste?: boolean;
  sanitizeOnInput?: boolean;
}

const DEFAULT_ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 's', 'strike', 'del', 'b', 'i',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'a', 'img', 'video', 'audio',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'blockquote', 'pre', 'code',
  'span', 'div', 'section',
  'sup', 'sub',
  'hr'
  // 'iframe' is deliberately not in the default allowlist. Arbitrary pasted
  // or typed content should not be able to silently embed an iframe - that's
  // a real vector (e.g. pasting from a compromised page). The editor's
  // embed-iframe plugin inserts iframes through its own explicit,
  // user-initiated dialog, a different trust boundary that never calls
  // through this sanitizer. A consumer that genuinely wants iframes in
  // pasted/typed content can still opt in via a custom allowedTags list.
];

const DEFAULT_ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  '*': ['class', 'style', 'id', 'data-*', 'role', 'aria-*', 'tabindex', 'contenteditable', 'spellcheck', 'dir', 'lang'],
  a: ['href', 'target', 'rel', 'title'],
  img: ['src', 'alt', 'width', 'height', 'loading'],
  video: ['src', 'controls', 'width', 'height', 'autoplay', 'loop', 'muted'],
  audio: ['src', 'controls', 'autoplay', 'loop', 'muted'],
  table: ['border', 'cellpadding', 'cellspacing'],
  td: ['colspan', 'rowspan', 'align', 'valign'],
  th: ['colspan', 'rowspan', 'align', 'valign'],
  // 'iframe' itself is still excluded from DEFAULT_ALLOWED_TAGS above, so this
  // entry is inert for ordinary input/paste - it only takes effect for the
  // embed-iframe plugin's trust-marked insertions (see sanitizeInputHTML's
  // additionalAllowedTags), restoring the attributes that make an inserted
  // iframe actually usable (src, sizing, fullscreen, scrolling/border).
  iframe: ['src', 'width', 'height', 'name', 'title', 'frameborder', 'scrolling', 'allowfullscreen', 'longdesc', 'allow'],
};

export function sanitizeHTML(
  html: string,
  contentConfig?: SanitizationConfig,
  _securityConfig?: SecurityConfig,
  additionalAllowedTags?: string[],
): string {
  if (contentConfig?.sanitize === false) {
    return html;
  }

  const baseAllowedTags = contentConfig?.allowedTags && contentConfig.allowedTags.length > 0
    ? contentConfig.allowedTags
    : DEFAULT_ALLOWED_TAGS;
  const allowedTags = additionalAllowedTags?.length
    ? Array.from(new Set([...baseAllowedTags, ...additionalAllowedTags]))
    : baseAllowedTags;

  const hasCustomAllowedAttributes =
    !!contentConfig?.allowedAttributes &&
    Object.keys(contentConfig.allowedAttributes).length > 0;
  const allowedAttributes = hasCustomAllowedAttributes
    ? (contentConfig!.allowedAttributes as Record<string, string[]>)
    : DEFAULT_ALLOWED_ATTRIBUTES;

  // DOMPurify's ALLOWED_ATTR is a single flat list applied across every
  // allowed tag - it has no native "this attribute only on that tag"
  // concept, unlike the config shape this function accepts. Union
  // everything into the flat list DOMPurify needs. This is a minor semantic
  // relaxation versus the old per-tag restriction (e.g. `colspan` becomes
  // technically permitted on <a> too, not just <td>/<th>) but not a security
  // regression: the attributes that actually matter for exploitation - on*
  // event handlers, href/src/etc URI schemes - are validated by DOMPurify
  // itself regardless of which tag they appear on, which is the protection
  // that was actually missing before.
  const flatAttrs = new Set<string>();
  for (const attrs of Object.values(allowedAttributes)) {
    for (const attr of attrs) flatAttrs.add(attr);
  }

  // Note: DOMPurify's handling of the `style` attribute's CSS content is
  // best-effort (it strips obviously dangerous constructs but isn't a full
  // CSS validator) - this is a known, documented DOMPurify limitation, not
  // something specific to this wrapper. It is still materially safer than
  // the previous implementation, which did not inspect style content at
  // all. A consumer with a high-security requirement around inline styles
  // (e.g. preventing data exfiltration via `background: url(...)`) should
  // exclude 'style' from its own allowedAttributes config.
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: Array.from(flatAttrs),
  });
}

export function sanitizePastedHTML(
  html: string,
  contentConfig?: SanitizationConfig,
  securityConfig?: SecurityConfig,
): string {
  if (securityConfig?.sanitizeOnPaste === false) {
    return html;
  }

  return sanitizeHTML(html, contentConfig, securityConfig);
}

export function sanitizeInputHTML(
  html: string,
  contentConfig?: SanitizationConfig,
  securityConfig?: SecurityConfig,
  // Lets a specific, already-in-the-trusted-DOM mutation (e.g. the
  // embed-iframe plugin's own explicit, user-initiated dialog) keep a tag
  // this editor's default allowlist otherwise excludes, without reopening
  // that tag to arbitrary pasted content - sanitizePastedHTML never accepts
  // this parameter, so paste stays on the strict, config-only allowlist.
  additionalAllowedTags?: string[],
): string {
  if (securityConfig?.sanitizeOnInput === false) {
    return html;
  }

  return sanitizeHTML(html, contentConfig, securityConfig, additionalAllowedTags);
}
