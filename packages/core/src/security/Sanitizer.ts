/**
 * HTML sanitization configuration.
 */
export interface SanitizeConfig {
  /** Allowed HTML tags */
  allowedTags?: string[];
  /** Allowed HTML attributes */
  allowedAttributes?: Record<string, string[]>;
  /** Whether to allow data URLs */
  allowDataUrls?: boolean;
  /** Maximum URL length */
  maxUrlLength?: number;
  /** Custom URL validator */
  urlValidator?: (url: string) => boolean;
}

/**
 * HTML sanitizer for cleaning user input.
 */
export class Sanitizer {
  private config: Required<SanitizeConfig>;

  constructor(config: SanitizeConfig = {}) {
    this.config = {
      allowedTags: [
        'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img', 'iframe', 'table', 'tr', 'td', 'th', 'section'
      ],
      allowedAttributes: {
        'a': ['href', 'title', 'target'],
        'img': ['src', 'alt', 'title', 'width', 'height'],
        'iframe': ['src', 'width', 'height', 'name', 'title', 'longdesc', 'allow', 'allowfullscreen', 'frameborder', 'scrolling', 'loading', 'referrerpolicy'],
        'td': ['colspan', 'rowspan'],
        'th': ['colspan', 'rowspan'],
        '*': ['class', 'style', 'id', 'data-*', 'role', 'aria-*', 'tabindex', 'contenteditable', 'spellcheck', 'dir', 'lang']
      },
      allowDataUrls: false,
      maxUrlLength: 2048,
      urlValidator: (url) => this.defaultUrlValidator(url),
      ...config
    };
  }

  /**
   * Sanitize HTML content.
   */
  sanitize(html: string): string {
    // Create a temporary DOM element to parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Sanitize the document
    this.sanitizeElement(doc.body);

    // Return the sanitized HTML
    return doc.body.innerHTML;
  }

  /**
   * Sanitize a DOM element recursively.
   */
  private sanitizeElement(element: Element): void {
    const children = Array.from(element.children);

    for (const child of children) {
      if (this.isAllowedTag(child.tagName.toLowerCase())) {
        // Sanitize attributes
        this.sanitizeAttributes(child);
        // Recursively sanitize children
        this.sanitizeElement(child);
      } else {
        // Remove disallowed elements
        element.removeChild(child);
      }
    }
  }

  /**
   * Check if a tag is allowed.
   */
  private isAllowedTag(tagName: string): boolean {
    return this.config.allowedTags.includes(tagName.toLowerCase());
  }

  /**
   * Sanitize element attributes.
   */
  private sanitizeAttributes(element: Element): void {
    const attributes = Array.from(element.attributes);
    const tagName = element.tagName.toLowerCase();

    for (const attr of attributes) {
      const attrName = attr.name.toLowerCase();

      // Check if attribute is allowed for this tag
      const allowedForTag = this.config.allowedAttributes[tagName] || [];
      const allowedForAll = this.config.allowedAttributes['*'] || [];

      const allowedPatterns = [...allowedForTag, ...allowedForAll];
      const isAllowed = allowedPatterns.some((pattern) => {
        if (pattern === attrName) return true;
        if (pattern.endsWith('*')) {
          return attrName.startsWith(pattern.slice(0, -1));
        }
        return false;
      });

      if (!isAllowed) {
        element.removeAttribute(attr.name);
        continue;
      }

      if (attrName === 'dir' && !['ltr', 'rtl', 'auto'].includes(attr.value.trim().toLowerCase())) {
        element.removeAttribute(attr.name);
        continue;
      }

      // Special validation for URLs
      if (attrName === 'href' || attrName === 'src') {
        if (!this.isValidUrl(attr.value)) {
          element.removeAttribute(attr.name);
        }
      }
    }
  }

  /**
   * Validate a URL.
   */
  private isValidUrl(url: string): boolean {
    // Check length
    if (url.length > this.config.maxUrlLength) {
      return false;
    }

    // Check for data URLs
    if (url.startsWith('data:') && !this.config.allowDataUrls) {
      return false;
    }

    // Use custom validator
    return this.config.urlValidator(url);
  }

  /**
   * Default URL validator.
   */
  private defaultUrlValidator(url: string): boolean {
    try {
      // Allow relative URLs
      if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../') || url.startsWith('#')) {
        return true;
      }

      // Allow mailto and tel URLs
      if (url.startsWith('mailto:') || url.startsWith('tel:')) {
        return true;
      }

      // Validate absolute URLs
      const parsedUrl = new URL(url);

      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return false;
      }

      // Basic domain validation (no IP addresses that could be malicious)
      const hostname = parsedUrl.hostname;
      if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
        // Allow localhost for development
        return hostname === 'localhost' || hostname === '127.0.0.1';
      }

      return true;
    } catch {
      // Invalid URL format
      return false;
    }
  }
}

/**
 * Content validator for editor input.
 */
export class ContentValidator {
  /**
   * Validate text content for potential security issues.
   */
  static validateText(text: string): { valid: boolean; warnings: string[] } {
    const warnings: string[] = [];

    // Check for suspicious patterns
    if (text.includes('<script') || text.includes('javascript:')) {
      warnings.push('Potential XSS attempt detected');
    }

    // Check for very long words (potential DoS)
    const words = text.split(/\s+/);
    const longWords = words.filter(word => word.length > 1000);
    if (longWords.length > 0) {
      warnings.push('Extremely long words detected');
    }

    // Check for excessive nesting (potential DoS)
    const nestingLevel = this.calculateNestingLevel(text);
    if (nestingLevel > 50) {
      warnings.push('Excessive element nesting detected');
    }

    return {
      valid: warnings.length === 0,
      warnings
    };
  }

  /**
   * Calculate maximum nesting level in HTML.
   */
  private static calculateNestingLevel(html: string): number {
    let maxDepth = 0;
    let currentDepth = 0;

    // Simple regex to count opening/closing tags
    const tagRegex = /<\/?[a-zA-Z][^>]*>/g;
    let match;

    while ((match = tagRegex.exec(html)) !== null) {
      const tag = match[0];
      if (tag.startsWith('</')) {
        currentDepth = Math.max(0, currentDepth - 1);
      } else if (!tag.endsWith('/>') && !tag.includes('br') && !tag.includes('img') && !tag.includes('input')) {
        currentDepth++;
        maxDepth = Math.max(maxDepth, currentDepth);
      }
    }

    return maxDepth;
  }

  /**
   * Validate file upload.
   */
  static validateFile(file: File, options: {
    maxSize?: number;
    allowedTypes?: string[];
    allowEmpty?: boolean;
  } = {}): { valid: boolean; error?: string } {
    const { maxSize = 10 * 1024 * 1024, allowedTypes = [], allowEmpty = true } = options;

    if (!allowEmpty && file.size === 0) {
      return { valid: false, error: 'File is empty' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: `File size exceeds ${maxSize} bytes` };
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return { valid: false, error: `File type ${file.type} not allowed` };
    }

    return { valid: true };
  }
}

/**
 * Create a sanitizer instance.
 */
export function createSanitizer(config?: SanitizeConfig): Sanitizer {
  return new Sanitizer(config);
}

/**
 * Default sanitizer instance.
 */
export const defaultSanitizer = new Sanitizer();
