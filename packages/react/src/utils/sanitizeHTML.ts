/**
 * HTML Sanitization Utility
 * Provides safe HTML cleaning based on allowed tags and attributes
 */

interface SanitizationConfig {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  sanitize?: boolean;
}

interface SecurityConfig {
  sanitizeOnPaste?: boolean;
  sanitizeOnInput?: boolean;
}

/**
 * Default safe HTML tags (based on common rich text editor needs)
 */
const DEFAULT_ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 's', 'strike', 'del', 'b', 'i',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'a', 'img', 'video', 'audio',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'blockquote', 'pre', 'code',
  'span', 'div',
  'sup', 'sub',
  'hr'
];

/**
 * Default safe attributes per tag
 */
const DEFAULT_ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  '*': ['class', 'style', 'id', 'data-*'],
  'a': ['href', 'target', 'rel', 'title'],
  'img': ['src', 'alt', 'width', 'height', 'loading'],
  'video': ['src', 'controls', 'width', 'height', 'autoplay', 'loop', 'muted'],
  'audio': ['src', 'controls', 'autoplay', 'loop', 'muted'],
  'table': ['border', 'cellpadding', 'cellspacing'],
  'td': ['colspan', 'rowspan', 'align', 'valign'],
  'th': ['colspan', 'rowspan', 'align', 'valign'],
};

/**
 * Sanitize HTML content based on allowed tags and attributes
 */
export function sanitizeHTML(
  html: string,
  contentConfig?: SanitizationConfig,
  securityConfig?: SecurityConfig
): string {
  // If sanitization is explicitly disabled, return as-is
  if (contentConfig?.sanitize === false) {
    return html;
  }

  const allowedTags = contentConfig?.allowedTags && contentConfig.allowedTags.length > 0
    ? contentConfig.allowedTags
    : DEFAULT_ALLOWED_TAGS;

  // Treat empty object as "not configured" so defaults still apply.
  // This prevents style-based formatting (e.g. strikethrough/color/font-size)
  // from being stripped when mergeConfig provides {}.
  const hasCustomAllowedAttributes =
    !!contentConfig?.allowedAttributes &&
    Object.keys(contentConfig.allowedAttributes).length > 0;
  const allowedAttributes = hasCustomAllowedAttributes
    ? (contentConfig!.allowedAttributes as Record<string, string[]>)
    : DEFAULT_ALLOWED_ATTRIBUTES;

  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Recursively sanitize all nodes
  sanitizeNode(tempDiv, allowedTags, allowedAttributes);

  return tempDiv.innerHTML;
}

/**
 * Recursively sanitize a DOM node and its children
 */
function sanitizeNode(
  node: Node,
  allowedTags: string[],
  allowedAttributes: Record<string, string[]>
): void {
  // Process all child nodes
  const children = Array.from(node.childNodes);
  
  for (const child of children) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const element = child as Element;
      const tagName = element.tagName.toLowerCase();

      // Remove disallowed tags but keep their content
      if (!allowedTags.includes(tagName)) {
        // Move children to parent before removing
        while (element.firstChild) {
          node.insertBefore(element.firstChild, element);
        }
        node.removeChild(element);
        continue;
      }

      // Sanitize attributes
      sanitizeAttributes(element, allowedAttributes);

      // Recursively sanitize children
      sanitizeNode(element, allowedTags, allowedAttributes);
    } else if (child.nodeType === Node.TEXT_NODE) {
      // Text nodes are safe, keep as-is
      continue;
    } else {
      // Remove other node types (comments, etc.)
      node.removeChild(child);
    }
  }
}

/**
 * Remove disallowed attributes from an element
 */
function sanitizeAttributes(
  element: Element,
  allowedAttributes: Record<string, string[]>
): void {
  const tagName = element.tagName.toLowerCase();
  const attributes = Array.from(element.attributes);

  // Get allowed attributes for this tag
  const tagAllowedAttrs = allowedAttributes[tagName] || [];
  const globalAllowedAttrs = allowedAttributes['*'] || [];
  const combined = [...tagAllowedAttrs, ...globalAllowedAttrs];

  for (const attr of attributes) {
    const attrName = attr.name.toLowerCase();
    let isAllowed = false;

    // Check if attribute is explicitly allowed
    if (combined.includes(attrName)) {
      isAllowed = true;
    }

    // Check wildcard patterns (e.g., 'data-*')
    for (const pattern of combined) {
      if (pattern.endsWith('*')) {
        const prefix = pattern.slice(0, -1);
        if (attrName.startsWith(prefix)) {
          isAllowed = true;
          break;
        }
      }
    }

    // Remove dangerous attributes
    if (
      attrName.startsWith('on') || // Event handlers
      attrName === 'javascript:' ||
      (attrName === 'href' && attr.value.trim().toLowerCase().startsWith('javascript:')) ||
      (attrName === 'src' && attr.value.trim().toLowerCase().startsWith('javascript:'))
    ) {
      isAllowed = false;
    }

    if (!isAllowed) {
      element.removeAttribute(attr.name);
    }
  }

  // Additional safety checks for href and src
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

/**
 * Sanitize HTML on paste
 */
export function sanitizePastedHTML(
  html: string,
  contentConfig?: SanitizationConfig,
  securityConfig?: SecurityConfig
): string {
  // Check if sanitization on paste is enabled
  if (securityConfig?.sanitizeOnPaste === false) {
    return html;
  }

  return sanitizeHTML(html, contentConfig, securityConfig);
}

/**
 * Sanitize HTML on input
 */
export function sanitizeInputHTML(
  html: string,
  contentConfig?: SanitizationConfig,
  securityConfig?: SecurityConfig
): string {
  // Check if sanitization on input is enabled
  if (securityConfig?.sanitizeOnInput === false) {
    return html;
  }

  return sanitizeHTML(html, contentConfig, securityConfig);
}
