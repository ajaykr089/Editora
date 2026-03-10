import { UIFileUpload } from './ui-file-upload';

export class UIDropzone extends UIFileUpload {
  override connectedCallback(): void {
    if (!this.hasAttribute('surface')) this.setAttribute('surface', 'dropzone');
    super.connectedCallback();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-dropzone': UIDropzone;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-dropzone')) {
  customElements.define('ui-dropzone', UIDropzone);
}
