/**
 * Native Color Picker
 * Framework-agnostic color picker component
 */

export interface ColorPickerConfig {
  value?: string;
  onChange?: (color: string) => void;
  presetColors?: string[];
}

export class ColorPicker {
  private element: HTMLDivElement;
  private config: ColorPickerConfig;
  private selectedColor?: string;

  private defaultPresets = [
    '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF',
    '#980000', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF',
    '#E6B8AF', '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#C9DAF8', '#CFE2F3', '#D9D2E9', '#EAD1DC'
  ];

  constructor(config: ColorPickerConfig) {
    this.config = {
      presetColors: this.defaultPresets,
      ...config
    };
    this.selectedColor = config.value;
    this.element = this.createElement();
    this.attachEventListeners();
  }

  private createElement(): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'editora-color-picker';

    container.innerHTML = `
      <div class="editora-color-picker-input">
        <input type="color" value="${this.selectedColor || '#000000'}" />
        <input type="text" value="${this.selectedColor || '#000000'}" placeholder="#000000" />
      </div>
      <div class="editora-color-picker-presets">
        ${this.config.presetColors?.map(color => `
          <button 
            class="editora-color-preset" 
            style="background-color: ${color};" 
            data-color="${color}"
            title="${color}"
          ></button>
        `).join('')}
      </div>
    `;

    return container;
  }

  private attachEventListeners(): void {
    const colorInput = this.element.querySelector('input[type="color"]') as HTMLInputElement;
    const textInput = this.element.querySelector('input[type="text"]') as HTMLInputElement;

    // Color input change
    colorInput.addEventListener('input', (e) => {
      const color = (e.target as HTMLInputElement).value;
      textInput.value = color;
      this.selectedColor = color;
      this.config.onChange?.(color);
    });

    // Text input change
    textInput.addEventListener('input', (e) => {
      const color = (e.target as HTMLInputElement).value;
      if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
        colorInput.value = color;
        this.selectedColor = color;
        this.config.onChange?.(color);
      }
    });

    // Preset buttons
    const presets = this.element.querySelectorAll('.editora-color-preset');
    presets.forEach(preset => {
      preset.addEventListener('click', () => {
        const color = preset.getAttribute('data-color');
        if (color) {
          colorInput.value = color;
          textInput.value = color;
          this.selectedColor = color;
          this.config.onChange?.(color);
        }
      });
    });
  }

  getValue(): string | undefined {
    return this.selectedColor;
  }

  setValue(color: string): void {
    this.selectedColor = color;
    const colorInput = this.element.querySelector('input[type="color"]') as HTMLInputElement;
    const textInput = this.element.querySelector('input[type="text"]') as HTMLInputElement;
    if (colorInput) colorInput.value = color;
    if (textInput) textInput.value = color;
  }

  getElement(): HTMLDivElement {
    return this.element;
  }

  destroy(): void {
    this.element.remove();
  }
}
