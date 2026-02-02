/**
 * Security validation utilities for media uploads
 */

const SAFE_FILENAME_REGEX = /[^a-zA-Z0-9._-]/g;
const DANGEROUS_EXTENSIONS = ['exe', 'bat', 'cmd', 'com', 'pif', 'scr', 'vbs', 'js'];

export class MediaValidator {
  /**
   * Validate file MIME type
   */
  static validateMimeType(file: File, allowedTypes?: string[]): boolean {
    if (!allowedTypes || allowedTypes.length === 0) {
      // Default safe types
      allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
        'video/mp4', 'video/webm', 'video/ogg',
        'audio/mpeg', 'audio/wav', 'audio/ogg'
      ];
    }

    return allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        const prefix = type.slice(0, -2);
        return file.type.startsWith(prefix);
      }
      return file.type === type;
    });
  }

  /**
   * Validate file extension to prevent spoofing
   */
  static validateExtension(fileName: string, allowedTypes?: string[]): boolean {
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    if (!ext) return false;
    if (DANGEROUS_EXTENSIONS.includes(ext)) return false;

    if (allowedTypes && allowedTypes.length > 0) {
      return allowedTypes.some(type => {
        if (type.includes('/')) {
          const [, typeExt] = type.split('/');
          return typeExt === '*' || typeExt === ext;
        }
        return type === ext;
      });
    }

    return true;
  }

  /**
   * Sanitize filename to remove potentially dangerous characters
   */
  static sanitizeFilename(fileName: string): string {
    return fileName
      .replace(SAFE_FILENAME_REGEX, '_')
      .slice(0, 255) // Limit length
      .trim();
  }

  /**
   * Validate file size
   */
  static validateFileSize(file: File, maxSize: number): boolean {
    return file.size <= maxSize;
  }

  /**
   * Sanitize HTML attributes in media elements
   */
  static sanitizeMediaAttrs(attrs: Record<string, any>): Record<string, any> {
    const dangerous = [
      'onclick', 'onload', 'onerror', 'onmouseover', 'onmouseout',
      'onmouseenter', 'onmouseleave', 'onkeydown', 'onkeyup',
      'javascript:', 'data:', 'vbscript:'
    ];

    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(attrs)) {
      // Skip dangerous attributes
      if (dangerous.some(d => key.toLowerCase().includes(d))) {
        continue;
      }

      // Sanitize string values
      if (typeof value === 'string') {
        if (dangerous.some(d => value.toLowerCase().includes(d))) {
          continue;
        }
        sanitized[key] = value;
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Validate SVG for XSS attacks
   */
  static validateSVG(svgContent: string): boolean {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent, 'image/svg+xml');

      // Check for parser errors
      if (doc.getElementsByTagName('parsererror').length > 0) {
        return false;
      }

      // Check for script tags
      if (doc.getElementsByTagName('script').length > 0) {
        return false;
      }

      // Check for event handlers
      const allElements = doc.getElementsByTagName('*');
      for (let i = 0; i < allElements.length; i++) {
        const attrs = allElements[i].attributes;
        for (let j = 0; j < attrs.length; j++) {
          const attr = attrs[j].name;
          if (attr.startsWith('on')) {
            return false;
          }
        }
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Comprehensive media validation
   */
  static validate(
    file: File,
    options: {
      maxSize?: number;
      allowedTypes?: string[];
      sanitizeFilename?: boolean;
    } = {}
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check MIME type
    if (!this.validateMimeType(file, options.allowedTypes)) {
      errors.push(`File type ${file.type} is not allowed`);
    }

    // Check extension
    if (!this.validateExtension(file.name, options.allowedTypes)) {
      errors.push(`File extension is not allowed`);
    }

    // Check file size
    if (options.maxSize && !this.validateFileSize(file, options.maxSize)) {
      errors.push(`File size exceeds maximum of ${options.maxSize} bytes`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
