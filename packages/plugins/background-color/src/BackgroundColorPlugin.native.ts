import type { Plugin } from '@editora/core';

/**
 * BackgroundColorPlugin - Native implementation with inline color picker
 * 
 * Features:
 * - Inline color picker positioned below toolbar button (not modal dialog)
 * - 18 preset colors in 6-column grid
 * - Custom color picker (hex input + native color input)
 * - Real-time color preview with hex display
 * - Apply/Cancel buttons
 * - Click outside to close
 * - Smart positioning to avoid viewport edges
 * - Applies background color (highlight) to selected text
 * 
 * Commands:
 * - openBackgroundColorPicker: Opens inline color picker
 * - setBackgroundColor: Sets the background color to specified value
 */

/**
 * Module-level state for the color picker
 */
let colorPickerElement: HTMLDivElement | null = null;
let currentButton: HTMLElement | null = null;
let savedRange: Range | null = null;
let selectedColor: string = '#ffff00'; // Default yellow highlight

/**
 * Preset colors for background color - reduced set for smaller picker
 */
const PRESET_COLORS = [
  '#000000', '#ffffff', '#808080', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080', '#ffc0cb'
];

/**
 * Inject CSS styles for the background color picker
 */
function injectStyles() {
  if (document.getElementById('rte-bg-color-picker-styles')) {
    return; // Already injected
  }

  const styleElement = document.createElement('style');
  styleElement.id = 'rte-bg-color-picker-styles';
  styleElement.textContent = `
    /* Background Color Picker Container */
    .rte-bg-color-picker {
      position: absolute;
      background: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 16px;
      z-index: 10000;
      width: 220px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* Preview Section */
    .rte-bg-color-preview {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .rte-bg-color-preview-label {
      font-weight: 600;
      color: #333;
      font-size: 13px;
    }

    .rte-bg-color-preview-box {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 3px;
      background: #f5f5f5;
      border-radius: 4px;
      border: 1px solid #e0e0e0;
    }

    .rte-bg-color-preview-swatch {
      width: 24px;
      height: 24px;
      border: 2px solid #ddd;
      border-radius: 4px;
      flex-shrink: 0;
    }

    .rte-bg-color-preview-hex {
      font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
      font-size: 14px;
      font-weight: 600;
      color: #555;
      user-select: all;
    }

    /* Preset Colors Section */
    .rte-bg-color-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .rte-bg-color-section-label {
      font-weight: 600;
      color: #333;
      font-size: 13px;
    }

    .rte-bg-color-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 6px;
      max-width: 180px;
    }

    .rte-bg-color-swatch {
      width: 100%;
      aspect-ratio: 1;
      border: 1px solid #e0e0e0;
      border-radius: 3px;
      cursor: pointer;
      transition: all 0.15s ease;
      padding: 0;
      background: none;
      position: relative;
      min-height: 20px;
    }

    .rte-bg-color-swatch:hover {
      border-color: #ccc;
      transform: scale(1.05);
    }

    .rte-bg-color-swatch.selected {
      border-color: #1976d2;
      border-width: 2px;
      transform: scale(1.02);
    }

    .rte-bg-color-swatch.selected::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-weight: bold;
      font-size: 12px;
      text-shadow: 0 0 2px rgba(0,0,0,0.5);
    }

    /* Custom Color Section */
    .rte-bg-color-custom {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .rte-bg-color-input {
      width: 50px;
      height: 26px;
      border: 2px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      padding: 2px;
      background: white;
    }

    .rte-bg-color-input:hover {
      border-color: #999;
    }

    .rte-bg-color-text-input {
      flex: 1;
      height: 24px;
      border: 2px solid #ddd;
      border-radius: 4px;
      padding: 0 12px;
      width: 60px;
      font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
      font-size: 14px;
      transition: border-color 0.2s ease;
    }

    .rte-bg-color-text-input:focus {
      outline: none;
      border-color: #0066cc;
    }

    .rte-bg-color-text-input::placeholder {
      color: #aaa;
    }

    /* Action Buttons */
    .rte-bg-color-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      padding-top: 8px;
      border-top: 1px solid #e0e0e0;
    }

    .rte-bg-color-btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .rte-bg-color-btn-cancel {
      background: #f5f5f5;
      color: #666;
    }

    .rte-bg-color-btn-cancel:hover {
      background: #e0e0e0;
    }

    .rte-bg-color-btn-apply {
      background: #0066cc;
      color: white;
    }

    .rte-bg-color-btn-apply:hover {
      background: #0052a3;
    }

    .rte-bg-color-btn:active {
      transform: scale(0.98);
    }
  `;

  document.head.appendChild(styleElement);
}

/**
 * Create the inline color picker element
 */
function createColorPicker(): HTMLDivElement {
  const picker = document.createElement('div');
  picker.className = 'rte-bg-color-picker';

  // Preview Section
  const previewSection = document.createElement('div');
  previewSection.className = 'rte-bg-color-preview';

  const previewLabel = document.createElement('div');
  previewLabel.className = 'rte-bg-color-preview-label';
  previewLabel.textContent = 'Current Color';

  const previewBox = document.createElement('div');
  previewBox.className = 'rte-bg-color-preview-box';

  const previewSwatch = document.createElement('div');
  previewSwatch.className = 'rte-bg-color-preview-swatch';
  previewSwatch.id = 'rte-bg-color-preview-swatch';

  const previewHex = document.createElement('span');
  previewHex.className = 'rte-bg-color-preview-hex';
  previewHex.id = 'rte-bg-color-preview-hex';

  previewBox.appendChild(previewSwatch);
  previewBox.appendChild(previewHex);
  previewSection.appendChild(previewLabel);
  previewSection.appendChild(previewBox);

  // Preset Colors Section
  const presetSection = document.createElement('div');
  presetSection.className = 'rte-bg-color-section';

  const presetLabel = document.createElement('div');
  presetLabel.className = 'rte-bg-color-section-label';
  presetLabel.textContent = 'Preset Colors';

  const colorGrid = document.createElement('div');
  colorGrid.className = 'rte-bg-color-grid';
  colorGrid.id = 'rte-bg-color-grid';

  PRESET_COLORS.forEach((color) => {
    const swatch = document.createElement('button');
    swatch.type = 'button';
    swatch.className = 'rte-bg-color-swatch';
    swatch.style.backgroundColor = color;
    swatch.dataset.color = color;
    swatch.title = color;
    colorGrid.appendChild(swatch);
  });

  presetSection.appendChild(presetLabel);
  presetSection.appendChild(colorGrid);

  // Custom Color Section
  const customSection = document.createElement('div');
  customSection.className = 'rte-bg-color-section';

  const customLabel = document.createElement('div');
  customLabel.className = 'rte-bg-color-section-label';
  customLabel.textContent = 'Custom Color';

  const customDiv = document.createElement('div');
  customDiv.className = 'rte-bg-color-custom';

  const colorInput = document.createElement('input');
  colorInput.type = 'color';
  colorInput.className = 'rte-bg-color-input';
  colorInput.id = 'rte-bg-color-input';
  colorInput.value = selectedColor;

  const textInput = document.createElement('input');
  textInput.type = 'text';
  textInput.className = 'rte-bg-color-text-input';
  textInput.id = 'rte-bg-color-text-input';
  textInput.placeholder = '#FFFF00';
  textInput.value = selectedColor.toUpperCase();
  textInput.maxLength = 7;

  customDiv.appendChild(colorInput);
  customDiv.appendChild(textInput);
  customSection.appendChild(customLabel);
  customSection.appendChild(customDiv);

  // Action Buttons
  const actions = document.createElement('div');
  actions.className = 'rte-bg-color-actions';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'rte-bg-color-btn rte-bg-color-btn-cancel';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.id = 'rte-bg-color-cancel';

  const applyBtn = document.createElement('button');
  applyBtn.type = 'button';
  applyBtn.className = 'rte-bg-color-btn rte-bg-color-btn-apply';
  applyBtn.textContent = 'Apply';
  applyBtn.id = 'rte-bg-color-apply';

  actions.appendChild(cancelBtn);
  actions.appendChild(applyBtn);

  // Assemble picker
  picker.appendChild(previewSection);
  picker.appendChild(presetSection);
  picker.appendChild(customSection);

  return picker;
}

/**
 * Attach event listeners to the color picker
 */
function attachColorPickerListeners() {
  if (!colorPickerElement) return;

  // Preset color swatches - apply immediately on click
  const grid = colorPickerElement.querySelector('#rte-bg-color-grid');
  if (grid) {
    grid.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('rte-bg-color-swatch')) {
        const color = target.dataset.color;
        if (color) {
          selectedColor = color;
          applyBackgroundColor(color);
          closeColorPicker();
        }
      }
    });
  }

  // Native color input - apply on change
  const colorInput = colorPickerElement.querySelector('#rte-bg-color-input') as HTMLInputElement;
  if (colorInput) {
    colorInput.addEventListener('change', (e) => {
      const color = (e.target as HTMLInputElement).value.toUpperCase();
      selectedColor = color;
      applyBackgroundColor(color);
      closeColorPicker();
    });

    // Update preview on input (but don't apply yet)
    colorInput.addEventListener('input', (e) => {
      const color = (e.target as HTMLInputElement).value.toUpperCase();
      selectedColor = color;
      updateColorPreview();
      updateSelectedSwatch();
    });
  }

  // Hex text input - apply on valid change
  const textInput = colorPickerElement.querySelector('#rte-bg-color-text-input') as HTMLInputElement;
  if (textInput) {
    textInput.addEventListener('change', (e) => {
      let value = (e.target as HTMLInputElement).value.trim();
      
      // Auto-prepend # if missing
      if (value && !value.startsWith('#')) {
        value = '#' + value;
      }
      
      // Validate and apply hex color format
      if (/^#[0-9A-F]{6}$/i.test(value)) {
        selectedColor = value.toUpperCase();
        applyBackgroundColor(selectedColor);
        closeColorPicker();
      }
    });

    // Update preview on input (but don't apply yet)
    textInput.addEventListener('input', (e) => {
      let value = (e.target as HTMLInputElement).value.trim();
      
      // Auto-prepend # if missing
      if (value && !value.startsWith('#')) {
        value = '#' + value;
        textInput.value = value;
      }
      
      // Validate hex color format for preview
      if (/^#[0-9A-F]{6}$/i.test(value)) {
        selectedColor = value.toUpperCase();
        updateColorPreview();
        updateSelectedSwatch();
      }
    });
  }

  // Click outside to close
  const handleClickOutside = (e: MouseEvent) => {
    if (colorPickerElement && currentButton) {
      const target = e.target as Node;
      if (!colorPickerElement.contains(target) && !currentButton.contains(target)) {
        closeColorPicker();
      }
    }
  };

  // Add slight delay to prevent immediate closure
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside);
  }, 100);

  // Store handler for cleanup
  (colorPickerElement as any)._clickOutsideHandler = handleClickOutside;
}

/**
 * Update the color preview display
 */
function updateColorPreview() {
  if (!colorPickerElement) return;

  const previewSwatch = colorPickerElement.querySelector('#rte-bg-color-preview-swatch') as HTMLElement;
  const previewHex = colorPickerElement.querySelector('#rte-bg-color-preview-hex') as HTMLElement;
  const colorInput = colorPickerElement.querySelector('#rte-bg-color-input') as HTMLInputElement;
  const textInput = colorPickerElement.querySelector('#rte-bg-color-text-input') as HTMLInputElement;

  if (previewSwatch) {
    previewSwatch.style.backgroundColor = selectedColor;
  }
  if (previewHex) {
    previewHex.textContent = selectedColor.toUpperCase();
  }
  if (colorInput) {
    colorInput.value = selectedColor;
  }
  if (textInput) {
    textInput.value = selectedColor.toUpperCase();
  }
}

/**
 * Update selected swatch highlight
 */
function updateSelectedSwatch() {
  if (!colorPickerElement) return;

  const swatches = colorPickerElement.querySelectorAll('.rte-bg-color-swatch');
  swatches.forEach((swatch) => {
    const swatchColor = (swatch as HTMLElement).dataset.color;
    if (swatchColor?.toUpperCase() === selectedColor.toUpperCase()) {
      swatch.classList.add('selected');
    } else {
      swatch.classList.remove('selected');
    }
  });
}

/**
 * Get current background color at cursor or selection
 */
function getCurrentBackgroundColor(): string {
  try {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return '#ffff00'; // Default yellow highlight
    }

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const element = container.nodeType === 1 
      ? (container as HTMLElement)
      : container.parentElement;

    if (element) {
      // Check for background-color in style attribute
      const bgElement = element.closest('[style*="background-color"]') as HTMLElement;
      if (bgElement) {
        const bgColor = bgElement.style.backgroundColor;
        if (bgColor) {
          return rgbToHex(bgColor);
        }
      }
    }

    return '#ffff00'; // Default yellow highlight
  } catch (error) {
    return '#ffff00';
  }
}

/**
 * Convert RGB color to hex format
 */
function rgbToHex(rgb: string): string {
  // If already hex, return as-is
  if (rgb.startsWith('#')) {
    return rgb.toUpperCase();
  }

  // Parse rgb(r, g, b) or rgba(r, g, b, a)
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase();
  }

  return '#ffff00'; // Default yellow highlight
}

/**
 * Apply background color to the saved selection
 */
function applyBackgroundColor(color: string): boolean {
  try {
    // Restore saved range
    if (savedRange) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(savedRange.cloneRange()); // Clone to avoid mutating saved range
      }
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      console.warn('[BackgroundColor] No valid selection');
      return false;
    }

    const range = selection.getRangeAt(0);

    // Check if range is valid and has content
    if (range.collapsed) {
      console.warn('[BackgroundColor] Range is collapsed');
      return false;
    }

    // Check if the selection is entirely within existing background color spans
    const startElement = range.startContainer.nodeType === Node.TEXT_NODE ? range.startContainer.parentElement : range.startContainer as Element;
    const endElement = range.endContainer.nodeType === Node.TEXT_NODE ? range.endContainer.parentElement : range.endContainer as Element;

    // Find the outermost background color span that contains the entire selection
    let targetSpan: Element | null = null;
    let currentElement: Element | null = startElement;

    while (currentElement && currentElement !== document.body) {
      if (currentElement.classList.contains('rte-bg-color')) {
        // Check if this span contains the entire selection
        const spanRange = document.createRange();
        spanRange.selectNodeContents(currentElement);
        
        // Check if the selection range is within this span's range
        if (spanRange.compareBoundaryPoints(Range.START_TO_START, range) <= 0 &&
            spanRange.compareBoundaryPoints(Range.END_TO_END, range) >= 0) {
          targetSpan = currentElement;
          break;
        }
      }
      currentElement = currentElement.parentElement;
    }

    // If we found a target span that contains the entire selection, just update its background color
    if (targetSpan) {
      targetSpan.style.backgroundColor = color;

      // Trigger input event to notify editor
      const editorContent = targetSpan.closest('[contenteditable="true"]') || document.querySelector('[contenteditable="true"]');
      if (editorContent) {
        editorContent.dispatchEvent(new Event('input', { bubbles: true }));
      }

      console.log('[BackgroundColor] Updated existing span with color:', color);
      return true;
    }

    // No existing span contains the entire selection, create a new one
    const span = document.createElement('span');
    span.style.backgroundColor = color;
    span.className = 'rte-bg-color';

    const contents = range.extractContents();
    span.appendChild(contents);
    range.insertNode(span);

    // Move cursor to end of inserted span
    range.setStartAfter(span);
    range.setEndAfter(span);
    selection.removeAllRanges();
    selection.addRange(range);

    // Trigger input event to notify editor
    const editorContent = span.closest('[contenteditable="true"]') || document.querySelector('[contenteditable="true"]');
    if (editorContent) {
      editorContent.dispatchEvent(new Event('input', { bubbles: true }));
    }

    console.log('[BackgroundColor] Applied color:', color);
    return true;
  } catch (error) {
    console.error('[BackgroundColor] Failed to apply background color:', error);
    return false;
  }
}



/**
 * Close and cleanup the color picker
 */
function closeColorPicker() {
  if (colorPickerElement) {
    // Remove click outside handler
    const handler = (colorPickerElement as any)._clickOutsideHandler;
    if (handler) {
      document.removeEventListener('click', handler);
    }

    colorPickerElement.remove();
    colorPickerElement = null;
  }
  currentButton = null;
  savedRange = null;
}

/**
 * Position the color picker below the button
 */
function positionColorPicker(button: HTMLElement, picker: HTMLDivElement) {
  const buttonRect = button.getBoundingClientRect();
  const pickerHeight = 450; // Approximate height
  const pickerWidth = 280;

  let top = buttonRect.bottom + 5;
  let left = buttonRect.left;

  // Adjust if picker would go off right edge
  if (left + pickerWidth > window.innerWidth) {
    left = window.innerWidth - pickerWidth - 10;
  }

  // Adjust if picker would go off bottom edge
  if (top + pickerHeight > window.innerHeight) {
    // Try to position above the button
    const topAbove = buttonRect.top - pickerHeight - 5;
    
    // If above position is also off-screen, just position at top of viewport with scroll offset
    if (topAbove < 0) {
      top = window.scrollY + 10; // 10px from top of viewport
    } else {
      top = topAbove + window.scrollY;
    }
  } else {
    // Add scroll offset for below position
    top = top + window.scrollY;
  }
  
  // Ensure left is not negative
  if (left < 0) {
    left = 10;
  }

  picker.style.top = `${top}px`;
  picker.style.left = `${left}px`;
}

/**
 * Open background color picker
 */
function openBackgroundColorPicker(): boolean {
  // Ensure styles are injected
  injectStyles();
  
  // Close any existing picker
  if (colorPickerElement) {
    closeColorPicker();
    return true;
  }

  // Find the background color button
  const button = document.querySelector('[data-command="openBackgroundColorPicker"]') as HTMLElement;
  
  if (!button) {
    return false;
  }

  // Check if there's a selection
  const selection = window.getSelection();
  
  if (!selection || selection.isCollapsed) {
    alert('Please select text to apply background color');
    return false;
  }

  // Save current selection
  if (selection.rangeCount > 0) {
    savedRange = selection.getRangeAt(0).cloneRange();
  }

  // Get current color
  selectedColor = getCurrentBackgroundColor();

  // Create and show picker
  colorPickerElement = createColorPicker();
  document.body.appendChild(colorPickerElement);

  currentButton = button;
  positionColorPicker(button, colorPickerElement);

  // Initialize preview
  updateColorPreview();
  updateSelectedSwatch();

  // Attach listeners
  attachColorPickerListeners();

  return true;
}

/**
 * Auto-initialization
 */
// Note: Auto-initialization removed - picker is now opened via command handler
// The openBackgroundColorPicker() function is called directly by RichTextEditor
// when the toolbar button is clicked, preventing race conditions

export const BackgroundColorPlugin = (): Plugin => {
  return {
    name: "backgroundColor",

    marks: {
      backgroundColor: {
        attrs: {
          color: { default: '#ffffff' },
        },
        parseDOM: [
          {
            tag: 'span[style*="background-color"]',
            getAttrs: (dom) => {
              const element = dom as HTMLElement;
              const style = element.getAttribute('style') || '';
              const colorMatch = style.match(/background-color:\s*([^;]+)/);
              if (colorMatch) {
                return { color: colorMatch[1] };
              }
              return null;
            },
          },
          {
            tag: "mark",
            getAttrs: (dom) => {
              const element = dom as HTMLElement;
              const color = element.style.backgroundColor || "#ffff00";
              return { color };
            },
          },
        ],
        toDOM: (mark) => {
          return [
            "span",
            { 
              style: `background-color: ${mark.attrs.color || '#ffffff'}`,
              class: 'rte-bg-color'
            },
            0,
          ];
        },
      },
    },

    toolbar: [
      {
        label: "Background Color",
        command: "openBackgroundColorPicker",
        icon: `<svg width="24" height="24" focusable="false"><g fill-rule="evenodd"><path class="tox-icon-highlight-bg-color__color" d="M3 18h18v3H3z" fill="#000000"></path><path fill-rule="nonzero" d="M7.7 16.7H3l3.3-3.3-.7-.8L10.2 8l4 4.1-4 4.2c-.2.2-.6.2-.8 0l-.6-.7-1.1 1.1zm5-7.5L11 7.4l3-2.9a2 2 0 0 1 2.6 0L18 6c.7.7.7 2 0 2.7l-2.9 2.9-1.8-1.8-.5-.6"></path></g></svg>`,
        shortcut: "Mod-Shift-h",
      },
    ],

    commands: {
      openBackgroundColorPicker: () => {
        return openBackgroundColorPicker();
      },

      setBackgroundColor: (color?: string) => {
        if (!color) return false;
        return applyBackgroundColor(color);
      },
    },

    keymap: {
      'Mod-Shift-h': 'openBackgroundColorPicker',
    },
  };
};
