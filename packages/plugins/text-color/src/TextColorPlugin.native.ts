import type { Plugin } from '@editora/core';
import { applyColorToSelection } from '../../src/utils/colorSelectionApply';

/**
 * TextColorPlugin - Native Implementation
 *
 * Allows users to set text color with:
 * - Inline color picker with preset color swatches
 * - Custom color picker (native browser input)
 * - Hex color input
 * - Color preview
 * - Applies foreground color to selected text
 * 
 * Features match React ColorPickerDialog component
 */

// ============================================================================
// Module-Level State
// ============================================================================
let colorPickerElement: HTMLDivElement | null = null;
let currentButton: HTMLElement | null = null;
let savedRange: Range | null = null;
let selectedColor: string = '#000000';
const DARK_THEME_SELECTOR = '[data-theme="dark"], .dark, .editora-theme-dark';

// ============================================================================
// Preset Colors (matching React version) - Reduced set for smaller picker
// ============================================================================
const PRESET_COLORS = [
  '#000000', '#ffffff', '#808080', '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080', '#ffc0cb'
];

/**
 * Find the editor container that currently owns selection/focus.
 * Supports both web component and React editor roots.
 */
function getActiveEditorRoot(): HTMLElement | null {
  const selection = window.getSelection();

  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const startNode = range.startContainer;
    const startElement = startNode.nodeType === Node.ELEMENT_NODE
      ? (startNode as HTMLElement)
      : startNode.parentElement;

    if (startElement) {
      const selectionRoot = startElement.closest(
        '[data-editora-editor="true"], .rte-editor, .editora-editor',
      ) as HTMLElement | null;
      if (selectionRoot) return selectionRoot;
    }
  }

  const activeElement = document.activeElement as HTMLElement | null;
  if (!activeElement) return null;

  return activeElement.closest(
    '[data-editora-editor="true"], .rte-editor, .editora-editor',
  ) as HTMLElement | null;
}

/**
 * Resolve toolbar button for command in current active editor first.
 */
function getToolbarButton(command: string): HTMLElement | null {
  const root = getActiveEditorRoot();

  if (root) {
    const scopedButton = root.querySelector(
      `[data-command="${command}"]`,
    ) as HTMLElement | null;
    if (scopedButton) return scopedButton;
  }

  return document.querySelector(`[data-command="${command}"]`) as HTMLElement | null;
}

function isDarkThemeContext(anchor?: HTMLElement | null): boolean {
  if (anchor?.closest(DARK_THEME_SELECTOR)) return true;

  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const node = selection.getRangeAt(0).startContainer;
    const element = node.nodeType === Node.ELEMENT_NODE
      ? (node as HTMLElement)
      : node.parentElement;
    if (element?.closest(DARK_THEME_SELECTOR)) return true;
  }

  const active = document.activeElement as HTMLElement | null;
  if (active?.closest(DARK_THEME_SELECTOR)) return true;

  return document.body.matches(DARK_THEME_SELECTOR) || document.documentElement.matches(DARK_THEME_SELECTOR);
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Apply text color to selection
 */
function applyTextColor(color: string): boolean {
  return applyColorToSelection({
    color,
    className: 'rte-text-color',
    styleProperty: 'color',
    commands: ['foreColor'],
    savedRange,
    getActiveEditorRoot,
    warnMessage: '[TextColor] Could not apply color for current selection',
  });
}
function getCurrentTextColor(): string {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return '#000000';

  const range = selection.getRangeAt(0);
  let node: Node | null = range.startContainer;

  // Traverse up to find a span with color style
  while (node && node !== document.body) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const color = element.style.color || window.getComputedStyle(element).color;
      if (color && color !== 'rgb(0, 0, 0)') {
        // Convert rgb to hex
        return rgbToHex(color);
      }
    }
    node = node.parentNode;
  }

  return '#000000';
}

/**
 * Convert RGB color to hex
 */
function rgbToHex(rgb: string): string {
  if (rgb.startsWith('#')) return rgb;
  
  const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!match) return '#000000';

  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);

  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Create the inline color picker
 */
function createColorPicker(button: HTMLElement): void {
  // Save current selection
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    savedRange = selection.getRangeAt(0).cloneRange();
  }

  // Get current color
  selectedColor = getCurrentTextColor();

  // Create picker element
  colorPickerElement = document.createElement('div');
  colorPickerElement.className = 'rte-inline-color-picker';
  if (isDarkThemeContext(button)) {
    colorPickerElement.classList.add('rte-theme-dark');
  }
  colorPickerElement.addEventListener('click', (e) => e.stopPropagation());

  // Build picker content
  colorPickerElement.innerHTML = `
    <div class="rte-color-picker-header">
      <span class="rte-color-picker-title">Text Color</span>
      <button class="rte-color-picker-close" aria-label="Close">×</button>
    </div>
    
    <div class="rte-color-picker-body">
      <!-- Current Color Preview -->
      <div class="rte-color-preview-section">
        <div class="rte-color-preview-box" style="background-color: ${selectedColor}; ${selectedColor === '#ffffff' ? 'border: 1px solid #ccc;' : ''}"></div>
        <span class="rte-color-preview-label">${selectedColor.toUpperCase()}</span>
      </div>

      <!-- Preset Colors -->
      <div class="rte-color-section">
        <label class="rte-color-section-label">Colors</label>
        <div class="rte-color-palette">
          ${PRESET_COLORS.map(color => `
            <button
              class="rte-color-swatch ${selectedColor === color ? 'selected' : ''}"
              style="background-color: ${color}; ${color === '#ffffff' ? 'border: 1px solid #ccc;' : ''}"
              data-color="${color}"
              title="${color.toUpperCase()}"
              aria-label="${color.toUpperCase()}"
            ></button>
          `).join('')}
        </div>
      </div>

      <!-- Custom Color -->
      <div class="rte-color-section">
        <label class="rte-color-section-label">Custom</label>
        <div class="rte-custom-color-inputs">
          <input
            type="color"
            value="${selectedColor}"
            class="rte-color-input-native"
            aria-label="Color picker"
          />
          <input
            type="text"
            value="${selectedColor}"
            placeholder="#000000"
            pattern="^#[0-9A-Fa-f]{6}$"
            class="rte-color-input-text"
            aria-label="Hex color input"
          />
        </div>
      </div>
    </div>
  `;

  // Position picker below button
  const buttonRect = button.getBoundingClientRect();
  colorPickerElement.style.position = 'absolute';
  colorPickerElement.style.top = `${buttonRect.bottom + window.scrollY + 4}px`;
  colorPickerElement.style.left = `${buttonRect.left + window.scrollX}px`;
  colorPickerElement.style.zIndex = '10000';

  document.body.appendChild(colorPickerElement);
  currentButton = button;

  // Attach event listeners
  attachColorPickerListeners();
}

/**
 * Attach event listeners to color picker elements
 */
function attachColorPickerListeners(): void {
  if (!colorPickerElement) return;

  // Close button
  const closeBtn = colorPickerElement.querySelector('.rte-color-picker-close');
  closeBtn?.addEventListener('click', () => closeColorPicker());

  // Color swatches - single click applies immediately
  const swatches = colorPickerElement.querySelectorAll('.rte-color-swatch');
  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const color = swatch.getAttribute('data-color');
      if (color) {
        selectedColor = color;
        applyTextColor(color);
        closeColorPicker();
      }
    });
  });

  // Native color input - apply on change
  const nativeInput = colorPickerElement.querySelector('.rte-color-input-native') as HTMLInputElement;
  nativeInput?.addEventListener('change', (e) => {
    const color = (e.target as HTMLInputElement).value;
    selectedColor = color;
    applyTextColor(color);
    closeColorPicker();
  });

  // Text color input - apply on valid input
  const textInput = colorPickerElement.querySelector('.rte-color-input-text') as HTMLInputElement;
  textInput?.addEventListener('change', (e) => {
    const color = (e.target as HTMLInputElement).value;
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
      selectedColor = color;
      applyTextColor(color);
      closeColorPicker();
    }
  });

  // Update preview on input (but don't apply yet)
  nativeInput?.addEventListener('input', (e) => {
    const color = (e.target as HTMLInputElement).value;
    selectedColor = color;
    updateColorPreview(color);
    updateSelectedSwatch(color);
    updateTextInput(color);
  });

  textInput?.addEventListener('input', (e) => {
    const color = (e.target as HTMLInputElement).value;
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
      selectedColor = color;
      updateColorPreview(color);
      updateSelectedSwatch(color);
      updateNativeInput(color);
    }
  });
}

/**
 * Update color preview
 */
function updateColorPreview(color: string): void {
  if (!colorPickerElement) return;
  
  const previewBox = colorPickerElement.querySelector('.rte-color-preview-box') as HTMLElement;
  const previewLabel = colorPickerElement.querySelector('.rte-color-preview-label') as HTMLElement;
  
  if (previewBox) {
    previewBox.style.backgroundColor = color;
    previewBox.style.border = color === '#ffffff' ? '1px solid #ccc' : 'none';
  }
  if (previewLabel) {
    previewLabel.textContent = color.toUpperCase();
  }
}

/**
 * Update selected swatch
 */
function updateSelectedSwatch(color: string): void {
  if (!colorPickerElement) return;
  
  const swatches = colorPickerElement.querySelectorAll('.rte-color-swatch');
  swatches.forEach(swatch => {
    if (swatch.getAttribute('data-color') === color) {
      swatch.classList.add('selected');
    } else {
      swatch.classList.remove('selected');
    }
  });
}

/**
 * Update custom inputs
 */
function updateCustomInputs(color: string): void {
  updateNativeInput(color);
  updateTextInput(color);
}

function updateNativeInput(color: string): void {
  if (!colorPickerElement) return;
  const nativeInput = colorPickerElement.querySelector('.rte-color-input-native') as HTMLInputElement;
  if (nativeInput) nativeInput.value = color;
}

function updateTextInput(color: string): void {
  if (!colorPickerElement) return;
  const textInput = colorPickerElement.querySelector('.rte-color-input-text') as HTMLInputElement;
  if (textInput) textInput.value = color;
}

/**
 * Close color picker
 */
function closeColorPicker(): void {
  if (colorPickerElement) {
    colorPickerElement.remove();
    colorPickerElement = null;
  }
  currentButton = null;
  savedRange = null;
}

/**
 * Open color picker
 */
function openTextColorPicker(): boolean {
  // Close any existing picker
  if (colorPickerElement) {
    closeColorPicker();
    return true;
  }

  // Find the text color button
  const button = getToolbarButton('openTextColorPicker');
  if (!button) return false;

  createColorPicker(button);
  return true;
}

/**
 * Initialize plugin (called once when editor loads)
 */
function initTextColorPlugin(): void {
  if ((window as any).__textColorPluginInitialized) {
    return;
  }

  (window as any).__textColorPluginInitialized = true;

  // Close picker when clicking outside
  document.addEventListener('click', (e) => {
    if (colorPickerElement && currentButton) {
      const target = e.target as Node;
      if (!colorPickerElement.contains(target) && !currentButton.contains(target)) {
        closeColorPicker();
      }
    }
  });

  // Add CSS styles
  if (!document.getElementById('text-color-plugin-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'text-color-plugin-styles';
    styleElement.textContent = `
      .rte-inline-color-picker {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        width: 220px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }

      .rte-color-picker-header {
        padding: 12px 16px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .rte-color-picker-title {
        font-size: 14px;
        font-weight: 600;
        color: #333;
      }

      .rte-color-picker-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #999;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
      }

      .rte-color-picker-close:hover {
        color: #333;
      }

      .rte-color-picker-body {
        padding: 8px;
      }

      .rte-color-preview-section {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
        padding: 6px;
        background-color: #f8f9fa;
        border-radius: 6px;
        border: 1px solid #e0e0e0;
      }

      .rte-color-preview-box {
        width: 24px;
        height: 24px;
        border-radius: 4px;
        flex-shrink: 0;
      }

      .rte-color-preview-label {
        font-size: 13px;
        font-weight: 500;
        color: #666;
        font-family: monospace;
      }

      .rte-color-section {
        margin-bottom: 16px;
      }

      .rte-color-section:last-child {
        margin-bottom: 0;
      }

      .rte-color-section-label {
        display: block;
        font-size: 12px;
        font-weight: 600;
        color: #666;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .rte-color-palette {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 6px;
        max-width: 180px;
      }

      .rte-color-swatch {
        width: 100%;
        aspect-ratio: 1;
        border: 1px solid #e0e0e0;
        border-radius: 3px;
        cursor: pointer;
        transition: all 0.15s ease;
        padding: 0;
        min-height: 20px;
      }

      .rte-color-swatch:hover {
        transform: scale(1.05);
        border-color: #ccc;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
      }

      .rte-color-swatch.selected {
        border-color: #1976d2;
        box-shadow: 0 0 0 1px rgba(25, 118, 210, 0.3);
      }

      .rte-custom-color-inputs {
        display: flex;
        gap: 8px;
      }

      .rte-color-input-native {
        width: 50px;
        height: 26px;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        padding: 2px;
      }

      .rte-color-input-text {
        flex: 1;
        height: 26px;
        width: 50px;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 0 12px;
        font-size: 13px;
        font-family: monospace;
      }

      .rte-color-input-text:focus {
        outline: none;
        border-color: #1976d2;
      }

      .rte-color-picker-footer {
        padding: 12px 16px;
        border-top: 1px solid #eee;
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }

      .rte-btn-primary,
      .rte-btn-secondary {
        padding: 6px 16px;
        border-radius: 4px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
      }

      .rte-btn-primary {
        background-color: #1976d2;
        color: white;
      }

      .rte-btn-primary:hover {
        background-color: #1565c0;
      }

      .rte-btn-secondary {
        background-color: #f5f5f5;
        color: #333;
        border: 1px solid #ddd;
      }

      .rte-btn-secondary:hover {
        background-color: #eeeeee;
      }

      .rte-inline-color-picker.rte-theme-dark {
        background: #1f2937;
        border: 1px solid #4b5563;
        box-shadow: 0 14px 30px rgba(0, 0, 0, 0.5);
      }

      .rte-inline-color-picker.rte-theme-dark .rte-color-picker-header {
        border-bottom-color: #3b4657;
      }

      .rte-inline-color-picker.rte-theme-dark .rte-color-picker-title {
        color: #e2e8f0;
      }

      .rte-inline-color-picker.rte-theme-dark .rte-color-picker-close {
        color: #94a3b8;
      }

      .rte-inline-color-picker.rte-theme-dark .rte-color-picker-close:hover {
        color: #f8fafc;
      }

      .rte-inline-color-picker.rte-theme-dark .rte-color-preview-section {
        background-color: #111827;
        border-color: #4b5563;
      }

      .rte-inline-color-picker.rte-theme-dark .rte-color-preview-label {
        color: #cbd5e1;
      }

      .rte-inline-color-picker.rte-theme-dark .rte-color-section-label {
        color: #9fb0c6;
      }

      .rte-inline-color-picker.rte-theme-dark .rte-color-swatch {
        border-color: #4b5563;
      }

      .rte-inline-color-picker.rte-theme-dark .rte-color-swatch:hover {
        border-color: #7a8ba5;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
      }

      .rte-inline-color-picker.rte-theme-dark .rte-color-swatch.selected {
        border-color: #58a6ff;
        box-shadow: 0 0 0 1px rgba(88, 166, 255, 0.4);
      }

      .rte-inline-color-picker.rte-theme-dark .rte-color-input-native,
      .rte-inline-color-picker.rte-theme-dark .rte-color-input-text {
        background: #111827;
        border-color: #4b5563;
        color: #e2e8f0;
      }

      .rte-inline-color-picker.rte-theme-dark .rte-color-input-text::placeholder {
        color: #94a3b8;
      }

      .rte-inline-color-picker.rte-theme-dark .rte-color-input-text:focus {
        border-color: #58a6ff;
      }
    `;
    document.head.appendChild(styleElement);
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTextColorPlugin);
} else {
  setTimeout(initTextColorPlugin, 100);
}

// ============================================================================
// Plugin Definition
// ============================================================================

export const TextColorPlugin = (): Plugin => ({
  name: 'textColor',

  marks: {
    textColor: {
      attrs: {
        color: { default: '#000000' }
      },
      parseDOM: [
        {
          tag: 'span[style*=color]',
          getAttrs: (node: HTMLElement) => {
            const style = node.getAttribute('style') || '';
            const colorMatch = style.match(/color:\s*([^;]+)/);
            if (colorMatch) {
              return { color: colorMatch[1] };
            }
            return null;
          }
        },
        {
          tag: 'font[color]',
          getAttrs: (node: HTMLElement) => {
            const color = node.getAttribute('color');
            return color ? { color } : null;
          }
        }
      ],
      toDOM: (mark) => [
        'span',
        {
          style: `color: ${mark.attrs?.color || '#000000'}`,
          class: 'rte-text-color'
        },
        0
      ]
    }
  },

  toolbar: [
    {
      label: 'Text Color',
      command: 'openTextColorPicker',
      icon: '<svg width="24" height="24" focusable="false"><g fill-rule="evenodd"><path class="tox-icon-text-color__color" d="M3 18h18v3H3z" fill="currentColor"></path><path d="M8.7 16h-.8a.5.5 0 0 1-.5-.6l2.7-9c.1-.3.3-.4.5-.4h2.8c.2 0 .4.1.5.4l2.7 9a.5.5 0 0 1-.5.6h-.8a.5.5 0 0 1-.4-.4l-.7-2.2c0-.3-.3-.4-.5-.4h-3.4c-.2 0-.4.1-.5.4l-.7 2.2c0 .3-.2.4-.4.4Zm2.6-7.6-.6 2a.5.5 0 0 0 .5.6h1.6a.5.5 0 0 0 .5-.6l-.6-2c0-.3-.3-.4-.5-.4h-.4c-.2 0-.4.1-.5.4Z"></path></g></svg>'
    }
  ],

  commands: {
    openTextColorPicker: () => {
      return openTextColorPicker();
    },
    setTextColor: (color?: string) => {
      if (!color) return false;
      return applyTextColor(color);
    }
  },

  keymap: {}
});
