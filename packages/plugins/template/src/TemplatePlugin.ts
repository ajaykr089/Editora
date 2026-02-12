import { Plugin } from '@editora/core';
// import { TemplatePluginProvider } from './TemplatePluginProvider';
import DOMPurify from 'dompurify';

/**
 * Template Plugin for Rich Text Editor
 *
 * Allows insertion of predefined document templates with:
 * - Template categories and search
 * - Preview functionality
 * - Replace or insert options
 * - HTML sanitization
 * - Undo/redo support
 * - Merge tag integration
 *
 * Rules:
 * - Templates are sanitized on insertion
 * - Scripts are always stripped
 * - CSS may be filtered for security
 * - Existing content warning dialog
 * - Undo restores entire document
 */
export const TemplatePlugin = (): Plugin => ({
  name: "template",
  toolbar: [
    {
      label: "Template",
      command: "insertTemplate",
      type: "button",
      icon: '<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3 3V9H21V3H3ZM19 5H5V7H19V5Z" fill="#000000"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M3 11V21H11V11H3ZM9 13H5V19H9V13Z" fill="#000000"></path> <path d="M21 11H13V13H21V11Z" fill="#000000"></path> <path d="M13 15H21V17H13V15Z" fill="#000000"></path> <path d="M21 19H13V21H21V19Z" fill="#000000"></path> </g></svg>',
    },
  ],
  // context: {
  //   provider: TemplatePluginProvider,
  // },
});

/**
 * Template Data Model
 */
export interface Template {
  id: string;
  name: string;
  category: string;
  html: string;
  description?: string;
  preview?: string;
  tags?: string[];
}

/**
 * Predefined templates
 */
export const PREDEFINED_TEMPLATES: Template[] = [
  {
    id: 'formal-letter',
    name: 'Formal Letter',
    category: 'Letters',
    description: 'Professional business letter template',
    html: `<p><strong>{{ Company Name }}</strong></p>
<p>{{ Today }}</p>
<p>Dear {{ first_name }} {{ last_name }},</p>
<p>I hope this letter finds you well. [Your letter content here]</p>
<p>Thank you for your time and consideration.</p>
<p>Sincerely,<br>Your Name</p>`
  },
  {
    id: 'meeting-notes',
    name: 'Meeting Notes',
    category: 'Notes',
    description: 'Template for meeting notes with attendees and action items',
    html: `<h2>Meeting Notes - {{ today }}</h2>
<p><strong>Attendees:</strong> [List attendees]</p>
<p><strong>Agenda:</strong></p>
<ul>
  <li>[Item 1]</li>
  <li>[Item 2]</li>
  <li>[Item 3]</li>
</ul>
<p><strong>Action Items:</strong></p>
<ul>
  <li>[Owner]: [Task] - [Due Date]</li>
</ul>
<p><strong>Next Meeting:</strong> [Date]</p>`
  },
  {
    id: 'proposal',
    name: 'Project Proposal',
    category: 'Business',
    description: 'Structured project proposal template',
    html: `<h1>Project Proposal</h1>
<h2>Executive Summary</h2>
<p>[Summary of the proposal]</p>
<h2>Objectives</h2>
<ul>
  <li>[Objective 1]</li>
  <li>[Objective 2]</li>
</ul>
<h2>Scope</h2>
<p>[Project scope details]</p>
<h2>Timeline</h2>
<p>[Project timeline]</p>
<h2>Budget</h2>
<p>[Budget details]</p>
<h2>Contact</h2>
<p>{{ first_name }} {{ last_name }}<br>{{ email }}<br>{{ phone }}</p>`
  },
  {
    id: 'faq',
    name: 'FAQ Template',
    category: 'Documentation',
    description: 'FAQ document structure',
    html: `<h1>Frequently Asked Questions</h1>
<h2>General Questions</h2>
<h3>Q: What is this about?</h3>
<p>A: [Answer here]</p>
<h3>Q: Who should use this?</h3>
<p>A: [Answer here]</p>
<h2>Technical Questions</h2>
<h3>Q: How do I get started?</h3>
<p>A: [Answer here]</p>
<h3>Q: What are the requirements?</h3>
<p>A: [Answer here]</p>`
  }
];

/**
 * Template cache
 */
let templateCache: Template[] = [...PREDEFINED_TEMPLATES];

/**
 * Get all available templates
 */
export const getAllTemplates = (): Template[] => {
  return templateCache;
};

/**
 * Get templates by category
 */
export const getTemplatesByCategory = (category: string): Template[] => {
  return templateCache.filter(t => t.category === category);
};

/**
 * Get unique template categories
 */
export const getTemplateCategories = (): string[] => {
  const categories = new Set(templateCache.map(t => t.category));
  return Array.from(categories);
};

/**
 * Search templates
 */
export const searchTemplates = (query: string): Template[] => {
  const q = query.toLowerCase();
  return templateCache.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.description?.toLowerCase().includes(q) ||
    t.tags?.some(tag => tag.toLowerCase().includes(q))
  );
};

/**
 * Sanitize template HTML
 * Removes scripts and potentially dangerous content
 */
export const sanitizeTemplate = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'a', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'class', 'data-key', 'data-category']
  });
};

/**
 * Insert template at cursor position
 */
export const insertTemplateAtCursor = (template: Template) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const fragment = document.createRange().createContextualFragment(sanitizeTemplate(template.html));

  range.insertNode(fragment);

  // Move cursor after inserted template
  const newRange = document.createRange();
  newRange.collapse(false);
  selection.removeAllRanges();
  selection.addRange(newRange);

  console.log(`Template inserted: ${template.name}`);
};

/**
 * Replace entire document with template
 */
export const replaceDocumentWithTemplate = (template: Template, editor: any) => {
  if (editor?.setValue) {
    editor.setValue(sanitizeTemplate(template.html));
  } else {
    // Fallback: clear body and insert
    const body = document.querySelector('[contenteditable="true"]');
    if (body) {
      body.innerHTML = sanitizeTemplate(template.html);
    }
  }

  console.log(`Document replaced with template: ${template.name}`);
};

/**
 * Get current document HTML
 */
export const getCurrentDocumentHTML = (): string => {
  const editor = document.querySelector('[contenteditable="true"]');
  return editor?.innerHTML || '';
};

/**
 * Add custom template
 */
export const addCustomTemplate = (template: Template) => {
  // Check for duplicate ID
  if (templateCache.some(t => t.id === template.id)) {
    console.warn(`Template with ID ${template.id} already exists`);
    return false;
  }

  templateCache.push(template);
  return true;
};

/**
 * Validate template integrity
 */
export const validateTemplate = (template: Template): boolean => {
  return !!(
    template.id &&
    template.name &&
    template.category &&
    template.html &&
    template.html.trim().length > 0
  );
};
