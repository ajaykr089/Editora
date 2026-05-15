/**
 * HTML Sanitization Utility
 * Provides safe HTML cleaning based on allowed tags and attributes
 */

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
  'a', 'img', 'video', 'audio', 'iframe',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'blockquote', 'pre', 'code',
  'span', 'div', 'section',
  'sup', 'sub',
  'hr'
];

const DEFAULT_ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  '*': ['class', 'style', 'id', 'data-*', 'role', 'aria-*', 'tabindex', 'contenteditable', 'spellcheck', 'dir', 'lang'],
  a: ['href', 'target', 'rel', 'title'],
  img: ['src', 'alt', 'width', 'height', 'loading'],
  video: ['src', 'controls', 'width', 'height', 'autoplay', 'loop', 'muted'],
  audio: ['src', 'controls', 'autoplay', 'loop', 'muted'],
  iframe: ['src', 'width', 'height', 'name', 'title', 'longdesc', 'allow', 'allowfullscreen', 'frameborder', 'scrolling', 'loading', 'referrerpolicy'],
  table: ['border', 'cellpadding', 'cellspacing'],
  td: ['colspan', 'rowspan', 'align', 'valign'],
  th: ['colspan', 'rowspan', 'align', 'valign'],
};

export function sanitizeHTML(
  html: string,
  contentConfig?: SanitizationConfig,
  _securityConfig?: SecurityConfig,
): string {
  if (contentConfig?.sanitize === false) {
    return html;
  }

  const allowedTags = contentConfig?.allowedTags && contentConfig.allowedTags.length > 0
    ? contentConfig.allowedTags
    : DEFAULT_ALLOWED_TAGS;

  const hasCustomAllowedAttributes =
    !!contentConfig?.allowedAttributes &&
    Object.keys(contentConfig.allowedAttributes).length > 0;
  const allowedAttributes = hasCustomAllowedAttributes
    ? (contentConfig!.allowedAttributes as Record<string, string[]>)
    : DEFAULT_ALLOWED_ATTRIBUTES;

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  sanitizeNode(tempDiv, allowedTags, allowedAttributes);
  return tempDiv.innerHTML;
}

function sanitizeNode(
  node: Node,
  allowedTags: string[],
  allowedAttributes: Record<string, string[]>,
): void {
  const children = Array.from(node.childNodes);

  for (const child of children) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const element = child as Element;
      const tagName = element.tagName.toLowerCase();

      if (!allowedTags.includes(tagName)) {
        while (element.firstChild) {
          node.insertBefore(element.firstChild, element);
        }
        node.removeChild(element);
        continue;
      }

      sanitizeAttributes(element, allowedAttributes);
      sanitizeNode(element, allowedTags, allowedAttributes);
    } else if (child.nodeType !== Node.TEXT_NODE) {
      node.removeChild(child);
    }
  }
}

function sanitizeAttributes(
  element: Element,
  allowedAttributes: Record<string, string[]>,
): void {
  const tagName = element.tagName.toLowerCase();
  const attributes = Array.from(element.attributes);

  const tagAllowedAttrs = allowedAttributes[tagName] || [];
  const globalAllowedAttrs = allowedAttributes['*'] || [];
  const combined = [...tagAllowedAttrs, ...globalAllowedAttrs];

  for (const attr of attributes) {
    const attrName = attr.name.toLowerCase();
    let isAllowed = false;

    if (combined.includes(attrName)) {
      isAllowed = true;
    }

    for (const pattern of combined) {
      if (pattern.endsWith('*')) {
        const prefix = pattern.slice(0, -1);
        if (attrName.startsWith(prefix)) {
          isAllowed = true;
          break;
        }
      }
    }

    if (
      attrName.startsWith('on') ||
      attrName === 'javascript:' ||
      (attrName === 'href' && attr.value.trim().toLowerCase().startsWith('javascript:')) ||
      (attrName === 'src' && attr.value.trim().toLowerCase().startsWith('javascript:'))
    ) {
      isAllowed = false;
    }

    if (attrName === 'dir' && !['ltr', 'rtl', 'auto'].includes(attr.value.trim().toLowerCase())) {
      isAllowed = false;
    }

    if (!isAllowed) {
      element.removeAttribute(attr.name);
    }
  }

  if (element.hasAttribute('href')) {
    const href = element.getAttribute('href') || '';
    if (href.trim().toLowerCase().startsWith('javascript:')) {
      element.removeAttribute('href');
    }
  }

  if (element.hasAttribute('src')) {
    const src = element.getAttribute('src') || '';
    if (src.trim().toLowerCase().startsWith('javascript:')) {
      element.removeAttribute('src');
    }
  }
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
): string {
  if (securityConfig?.sanitizeOnInput === false) {
    return html;
  }

  return sanitizeHTML(html, contentConfig, securityConfig);
}
