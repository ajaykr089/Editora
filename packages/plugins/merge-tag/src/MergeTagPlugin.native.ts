import type { Plugin } from '@editora/core';

/**
 * MergeTagPlugin - Native implementation
 * 
 * Features:
 * - Category tabs (User, Company, Date, Custom)
 * - Search and filter
 * - Tag preview pane
 * - Keyboard navigation (Enter to insert, Escape to close)
 * - Double-click to insert
 * - Accessible dialog
 * - Non-editable inline tags
 * - Styled merge tags matching React version
 */

interface MergeTag {
  key: string;
  label: string;
  category: string;
  preview?: string;
  description?: string;
}

const MERGE_TAG_CATEGORIES = {
  USER: {
    name: 'User',
    tags: [
      { key: 'first_name', label: 'First Name', category: 'User', preview: 'John' },
      { key: 'last_name', label: 'Last Name', category: 'User', preview: 'Doe' },
      { key: 'email', label: 'Email', category: 'User', preview: 'john@example.com' },
      { key: 'phone', label: 'Phone', category: 'User', preview: '+1-555-1234' },
      { key: 'full_name', label: 'Full Name', category: 'User', preview: 'John Doe' },
      { key: 'username', label: 'Username', category: 'User', preview: 'johndoe' }
    ]
  },
  COMPANY: {
    name: 'Company',
    tags: [
      { key: 'company_name', label: 'Company Name', category: 'Company', preview: 'Acme Corp' },
      { key: 'company_address', label: 'Company Address', category: 'Company', preview: '123 Main St' },
      { key: 'company_phone', label: 'Company Phone', category: 'Company', preview: '+1-555-0000' },
      { key: 'company_email', label: 'Company Email', category: 'Company', preview: 'info@acme.com' }
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

let savedSelection: Range | null = null;
let selectedTag: MergeTag | null = null;

function insertMergeTag(tag: MergeTag) {
  const range = savedSelection;
  if (!range) return;

  const selection = window.getSelection();
  if (!selection) return;

  selection.removeAllRanges();
  selection.addRange(range);

  const tagId = `merge-tag-${tag.key}-${Date.now()}`;
  const span = document.createElement('span');
  span.className = 'rte-merge-tag';
  span.id = tagId;
  span.setAttribute('contenteditable', 'false');
  span.setAttribute('data-key', tag.key);
  span.setAttribute('data-category', tag.category);
  span.setAttribute('aria-label', `Merge tag: ${tag.label}`);
  span.textContent = `{{ ${tag.label} }}`;
  span.style.cssText = 'background-color: #e3f2fd; border: 1px solid #bbdefb; border-radius: 3px; padding: 2px 6px; margin: 0 2px; display: inline-block; white-space: nowrap; font-weight: 500; color: #1976d2; cursor: pointer; user-select: none;';

  try {
    range.deleteContents();
    range.insertNode(span);
    
    // Move cursor after the tag
    range.setStartAfter(span);
    range.setEndAfter(span);
    selection.removeAllRanges();
    selection.addRange(range);

    // Trigger input event
    const editor = span.closest('[contenteditable="true"]');
    if (editor) {
      editor.dispatchEvent(new Event('input', { bubbles: true }));
    }
  } catch (error) {
    console.error('Failed to insert merge tag:', error);
  }
}

function showMergeTagDialog() {
  // Save current selection
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    savedSelection = selection.getRangeAt(0).cloneRange();
  }

  let currentCategory = 'USER';
  let searchTerm = '';
  let filteredTags: MergeTag[] = MERGE_TAG_CATEGORIES.USER.tags;
  selectedTag = filteredTags[0] || null;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'rte-dialog-overlay';
  overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;';

  // Create dialog
  const dialog = document.createElement('div');
  dialog.className = 'rte-dialog rte-merge-tag-dialog';
  dialog.style.cssText = 'background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); width: 500px; max-width: 90vw; max-height: 600px; overflow: hidden; display: flex; flex-direction: column;';

  // Header
  const header = document.createElement('div');
  header.className = 'rte-dialog-header';
  header.style.cssText = 'padding: 16px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;';
  header.innerHTML = `
    <h2 style="margin: 0; font-size: 18px; font-weight: 600;">Insert Merge Tag</h2>
    <button class="rte-dialog-close" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #999; padding: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;" aria-label="Close">✕</button>
  `;

  // Body
  const body = document.createElement('div');
  body.className = 'rte-dialog-body';
  body.style.cssText = 'padding: 16px; overflow-y: auto; flex: 1;';

  // Search input
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'rte-input';
  searchInput.placeholder = 'Search merge tags...';
  searchInput.setAttribute('aria-label', 'Search merge tags');
  searchInput.style.cssText = 'width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box; margin-bottom: 12px;';
  body.appendChild(searchInput);

  // Category tabs
  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'rte-tabs';
  tabsContainer.style.cssText = 'display: flex; gap: 8px; margin-bottom: 12px; border-bottom: 2px solid #eee;';

  const categories = Object.entries(MERGE_TAG_CATEGORIES).map(([key, value]) => ({ key, name: value.name }));
  categories.forEach(cat => {
    const tab = document.createElement('button');
    tab.className = 'rte-tab';
    tab.textContent = cat.name;
    tab.setAttribute('aria-label', `${cat.name} category`);
    tab.style.cssText = 'padding: 8px 12px; background: none; border: none; cursor: pointer; border-bottom: 3px solid transparent; color: #666; font-weight: 500; transition: all 0.2s;';
    
    if (cat.key === currentCategory) {
      tab.classList.add('active');
      tab.style.color = '#1976d2';
      tab.style.borderBottomColor = '#1976d2';
    }

    tab.addEventListener('click', () => {
      currentCategory = cat.key;
      searchTerm = '';
      searchInput.value = '';
      updateTabs();
      updateTagList();
    });

    tab.addEventListener('mouseenter', () => {
      tab.style.color = '#333';
    });

    tab.addEventListener('mouseleave', () => {
      if (!tab.classList.contains('active')) {
        tab.style.color = '#666';
      }
    });

    tabsContainer.appendChild(tab);
  });
  body.appendChild(tabsContainer);

  // Tag list
  const tagList = document.createElement('div');
  tagList.className = 'rte-merge-tag-list';
  tagList.style.cssText = 'border: 1px solid #ddd; border-radius: 4px; max-height: 300px; overflow-y: auto; margin-bottom: 12px;';
  body.appendChild(tagList);

  // Preview pane
  const previewPane = document.createElement('div');
  previewPane.className = 'rte-merge-tag-preview';
  previewPane.style.cssText = 'padding: 8px; background-color: #f5f5f5; border-radius: 4px; font-family: monospace; font-size: 12px;';
  body.appendChild(previewPane);

  function updateTabs() {
    const tabs = tabsContainer.querySelectorAll('.rte-tab');
    tabs.forEach((tab, index) => {
      const cat = categories[index];
      if (cat.key === currentCategory) {
        tab.classList.add('active');
        (tab as HTMLElement).style.color = '#1976d2';
        (tab as HTMLElement).style.borderBottomColor = '#1976d2';
      } else {
        tab.classList.remove('active');
        (tab as HTMLElement).style.color = '#666';
        (tab as HTMLElement).style.borderBottomColor = 'transparent';
      }
    });
  }

  function updateTagList() {
    const categoryData = MERGE_TAG_CATEGORIES[currentCategory as keyof typeof MERGE_TAG_CATEGORIES];
    let tags = categoryData ? categoryData.tags : [];

    // Filter by search
    if (searchTerm.trim()) {
      tags = tags.filter(tag =>
        tag.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tag.key.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filteredTags = tags;
    selectedTag = tags[0] || null;

    // Clear and rebuild tag list
    tagList.innerHTML = '';

    if (tags.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'rte-empty-state';
      emptyState.textContent = 'No merge tags found';
      emptyState.style.cssText = 'padding: 24px; text-align: center; color: #999;';
      tagList.appendChild(emptyState);
    } else {
      tags.forEach((tag, index) => {
        const tagItem = document.createElement('div');
        tagItem.className = 'rte-merge-tag-item';
        tagItem.setAttribute('data-tag-key', tag.key);
        tagItem.style.cssText = 'padding: 8px 12px; border-bottom: 1px solid #f0f0f0; cursor: pointer; transition: background-color 0.2s;';

        if (index === 0) {
          tagItem.classList.add('selected');
          tagItem.style.backgroundColor = '#f5f5f5';
        }

        const labelDiv = document.createElement('div');
        labelDiv.className = 'tag-label';
        labelDiv.textContent = tag.label;
        labelDiv.style.cssText = 'font-weight: 600; color: #333;';
        tagItem.appendChild(labelDiv);

        if (tag.preview) {
          const previewDiv = document.createElement('div');
          previewDiv.className = 'tag-preview';
          previewDiv.textContent = tag.preview;
          previewDiv.style.cssText = 'font-size: 12px; color: #999; margin-top: 2px;';
          tagItem.appendChild(previewDiv);
        }

        if (tag.description) {
          const descDiv = document.createElement('div');
          descDiv.className = 'tag-description';
          descDiv.textContent = tag.description;
          descDiv.style.cssText = 'font-size: 12px; color: #aaa; margin-top: 2px;';
          tagItem.appendChild(descDiv);
        }

        tagItem.addEventListener('click', () => {
          selectedTag = tag;
          updateTagSelection();
          updatePreview();
        });

        tagItem.addEventListener('dblclick', () => {
          insertMergeTag(tag);
          closeDialog();
        });

        tagItem.addEventListener('mouseenter', () => {
          tagItem.style.backgroundColor = '#f5f5f5';
        });

        tagItem.addEventListener('mouseleave', () => {
          if (!tagItem.classList.contains('selected')) {
            tagItem.style.backgroundColor = '';
          }
        });

        tagList.appendChild(tagItem);
      });
    }

    updatePreview();
  }

  function updateTagSelection() {
    const items = tagList.querySelectorAll('.rte-merge-tag-item');
    items.forEach(item => {
      const key = item.getAttribute('data-tag-key');
      if (key === selectedTag?.key) {
        item.classList.add('selected');
        (item as HTMLElement).style.backgroundColor = '#f5f5f5';
      } else {
        item.classList.remove('selected');
        (item as HTMLElement).style.backgroundColor = '';
      }
    });
  }

  function updatePreview() {
    if (selectedTag) {
      previewPane.innerHTML = `<strong>Preview:</strong> {{ ${selectedTag.label} }}`;
      previewPane.style.display = 'block';
    } else {
      previewPane.style.display = 'none';
    }
  }

  // Search functionality
  searchInput.addEventListener('input', (e) => {
    searchTerm = (e.target as HTMLInputElement).value;
    updateTagList();
  });

  // Keyboard navigation
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && selectedTag) {
      insertMergeTag(selectedTag);
      closeDialog();
    } else if (e.key === 'Escape') {
      closeDialog();
    }
  });

  // Footer
  const footer = document.createElement('div');
  footer.className = 'rte-dialog-footer';
  footer.style.cssText = 'padding: 12px 16px; border-top: 1px solid #eee; display: flex; gap: 8px; justify-content: flex-end;';

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'rte-button-secondary';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.style.cssText = 'padding: 8px 16px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; cursor: pointer; background-color: #f5f5f5; color: #333; transition: all 0.2s;';
  cancelBtn.addEventListener('click', closeDialog);
  cancelBtn.addEventListener('mouseenter', () => {
    cancelBtn.style.backgroundColor = '#eeeeee';
  });
  cancelBtn.addEventListener('mouseleave', () => {
    cancelBtn.style.backgroundColor = '#f5f5f5';
  });

  const insertBtn = document.createElement('button');
  insertBtn.className = 'rte-button-primary';
  insertBtn.textContent = 'Insert';
  insertBtn.style.cssText = 'padding: 8px 16px; border: none; border-radius: 4px; font-size: 14px; cursor: pointer; background-color: #1976d2; color: white; transition: all 0.2s;';
  insertBtn.addEventListener('click', () => {
    if (selectedTag) {
      insertMergeTag(selectedTag);
      closeDialog();
    }
  });
  insertBtn.addEventListener('mouseenter', () => {
    insertBtn.style.backgroundColor = '#1565c0';
  });
  insertBtn.addEventListener('mouseleave', () => {
    insertBtn.style.backgroundColor = '#1976d2';
  });

  footer.appendChild(cancelBtn);
  footer.appendChild(insertBtn);

  // Assemble dialog
  dialog.appendChild(header);
  dialog.appendChild(body);
  dialog.appendChild(footer);
  overlay.appendChild(dialog);

  // Close handlers
  function closeDialog() {
    overlay.remove();
    savedSelection = null;
    selectedTag = null;
  }

  header.querySelector('.rte-dialog-close')?.addEventListener('click', closeDialog);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeDialog();
  });

  // Add to document
  document.body.appendChild(overlay);

  // Initialize
  updateTagList();

  // Focus search
  setTimeout(() => searchInput.focus(), 100);
}

export const MergeTagPlugin = (): Plugin => ({
  name: 'mergeTag',
  
  toolbar: [
    {
      label: 'Merge Tag',
      command: 'insertMergeTag',
      icon: '{{ }}',
    }
  ],
  
  commands: {
    insertMergeTag: () => {
      showMergeTagDialog();
      return true;
    }
  }
});
