import { Plugin } from '@editora/core';
// import { MergeTagPluginProvider } from './MergeTagPluginProvider';
import { getScopedElementById, queryScopedElements, findEditorContainer, findEditorContainerFromSelection } from '../../shared/editorContainerHelpers';

/**
 * Merge Tag Plugin for Rich Text Editor
 *
 * Allows insertion of dynamic placeholders (merge tags) that can be:
 * - Grouped by category (User, Company, Date, Custom)
 * - Searched and filtered
 * - Replaced/resolved later
 * - Copy/pasted while preserving metadata
 * - Exported to plain text or HTML
 *
 * Rules:
 * - Merge tags are atomic (non-editable inline elements)
 * - Cannot place cursor inside tag (contenteditable=false)
 * - Delete key removes entire tag
 * - Spell checker ignores tags
 * - Full keyboard navigation support
 *
 * Accessibility:
 * - aria-label identifies each tag
 * - Keyboard accessible dialog
 * - Screen reader compatible
 */
export const MergeTagPlugin = (): Plugin => ({
  name: 'mergeTag',
  toolbar: [
    {
      label: 'Merge Tag',
      command: 'insertMergeTag',
      type: 'button',
      icon: '{{ }}'
    }
  ],
  // context: {
  //   provider: MergeTagPluginProvider
  // }
});

/**
 * Merge Tag Data Model
 */
export interface MergeTag {
  key: string;          // "first_name"
  label: string;        // "First Name"
  preview?: string;     // "John" (example value)
  category: string;     // "User", "Company", "Date", "Custom"
  description?: string; // Additional context
}

/**
 * Registry to track inserted merge tags
 */
const mergeTagRegistry = new Map<string, MergeTag>();

/**
 * Predefined merge tag categories and templates
 */
export const MERGE_TAG_CATEGORIES = {
  USER: {
    name: 'User',
    tags: [
      { key: 'first_name', label: 'First Name', category: 'User', preview: 'John' },
      { key: 'last_name', label: 'Last Name', category: 'User', preview: 'Doe' },
      { key: 'email', label: 'Email', category: 'User', preview: 'john@example.com' },
      { key: 'phone', label: 'Phone', category: 'User', preview: '+1-555-1234' }
    ]
  },
  COMPANY: {
    name: 'Company',
    tags: [
      { key: 'company_name', label: 'Company Name', category: 'Company', preview: 'Acme Corp' },
      { key: 'company_address', label: 'Company Address', category: 'Company', preview: '123 Main St' },
      { key: 'company_phone', label: 'Company Phone', category: 'Company', preview: '+1-555-0000' }
    ]
  },
  DATE: {
    name: 'Date',
    tags: [
      { key: 'today', label: 'Today', category: 'Date', preview: new Date().toLocaleDateString() },
      { key: 'tomorrow', label: 'Tomorrow', category: 'Date', preview: new Date(Date.now() + 86400000).toLocaleDateString() },
      { key: 'next_week', label: 'Next Week', category: 'Date', preview: new Date(Date.now() + 604800000).toLocaleDateString() }
    ]
  },
  CUSTOM: {
    name: 'Custom',
    tags: []
  }
};

/**
 * Insert Merge Tag Command
 *
 * Opens dialog to select and insert merge tag
 */
export const insertMergeTagCommand = (tag: MergeTag) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const tagId = `merge-tag-${tag.key}-${Date.now()}`;

  // Create merge tag span
  const span = document.createElement('span');
  span.className = 'rte-merge-tag';
  span.id = tagId;
  span.setAttribute('data-key', tag.key);
  span.setAttribute('data-category', tag.category);
  span.setAttribute('contenteditable', 'false');
  span.setAttribute('aria-label', `Merge tag: ${tag.label}`);
  span.textContent = `{{ ${tag.label} }}`;

  // Insert at cursor
  range.insertNode(span);

  // Register merge tag
  mergeTagRegistry.set(tagId, tag);

  // Move cursor after tag
  const newRange = document.createRange();
  newRange.setStartAfter(span);
  newRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(newRange);

};

/**
 * Get all merge tags in document
 */
export const getAllMergeTags = (): { id: string; tag: MergeTag }[] => {
  const tags: { id: string; tag: MergeTag }[] = [];
  const editorContainer = findEditorContainerFromSelection() || document.querySelector('[data-editora-editor]') as HTMLDivElement;
  mergeTagRegistry.forEach((tag, id) => {
    if (getScopedElementById(editorContainer, id)) {
      tags.push({ id, tag });
    }
  });
  return tags;
};

/**
 * Replace merge tag value
 * Useful for export or processing
 */
export const replaceMergeTagValue = (tagId: string, value: string) => {
  const editorContainer = findEditorContainerFromSelection() || document.querySelector('[data-editora-editor]') as HTMLDivElement;
  const element = getScopedElementById(editorContainer, tagId);
  if (element) {
    element.textContent = value;
  }
};

/**
 * Export document with merge tags resolved
 */
export const exportWithResolvedTags = (resolver: (tag: MergeTag) => string): string => {
  const clone = document.body.cloneNode(true) as HTMLElement;

  clone.querySelectorAll('.rte-merge-tag').forEach((el) => {
    const key = el.getAttribute('data-key');
    const tag = Array.from(mergeTagRegistry.values()).find(t => t.key === key);

    if (tag) {
      const resolved = resolver(tag);
      const text = document.createTextNode(resolved);
      el.replaceWith(text);
    }
  });

  return clone.innerHTML;
};

/**
 * Validate merge tag integrity
 */
export const validateMergeTags = (): boolean => {
  const editorContainer = findEditorContainerFromSelection() || document.querySelector('[data-editora-editor]') as HTMLDivElement;
  const tags = queryScopedElements(editorContainer, '.rte-merge-tag');
  let isValid = true;

  tags.forEach(tag => {
    const isReadOnly = tag.getAttribute('contenteditable') === 'false';
    const hasKey = tag.hasAttribute('data-key');
    const hasLabel = tag.getAttribute('aria-label');

    if (!isReadOnly || !hasKey || !hasLabel) {
      console.warn('Invalid merge tag:', tag);
      isValid = false;
    }
  });

  return isValid;
};
