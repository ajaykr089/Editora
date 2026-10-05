/**
 * Editing chrome that plugins put *inside* the editable element (the table plugin's column and
 * table resize handles) and that must never reach saved/emitted HTML.
 */
const UI_ARTIFACT_SELECTOR = '.resize-handle, .table-resize-handle';
const UI_ARTIFACT_HINT = /resize-handle/;

/**
 * Remove editing-only elements from editor HTML before it leaves the editor (onChange,
 * content-change, getContent/getHTML, autosave).
 *
 * The table plugin attaches drag handles as real children of the cells and of the table wrapper
 * while the caret is in a table, and gives each header cell `position: relative` to anchor them.
 * Without this they showed up in every `onChange` value taken while editing a table.
 *
 * Returns the input untouched (no parse) when it contains no such artifact.
 */
export function stripEditorUiArtifacts(html: string): string {
  if (!html || !UI_ARTIFACT_HINT.test(html)) return html;

  // <template> parses into an inert fragment: no scripts, no image loads, no handlers.
  const template = document.createElement('template');
  template.innerHTML = html;

  const holders = new Set<HTMLElement>();
  template.content.querySelectorAll(UI_ARTIFACT_SELECTOR).forEach((node) => {
    const parent = node.parentElement;
    if (parent && (parent.tagName === 'TD' || parent.tagName === 'TH')) holders.add(parent);
    node.remove();
  });

  // The anchor style the plugin added for the handle; drop it so the cell is as the author left it.
  holders.forEach((cell) => {
    if (cell.style.position === 'relative') {
      cell.style.removeProperty('position');
      if (!cell.getAttribute('style')?.trim()) cell.removeAttribute('style');
    }
  });

  return template.innerHTML;
}

/** `el.innerHTML` without editing-only artifacts. */
export function getCleanEditorHTML(el: Element | null | undefined): string {
  return el ? stripEditorUiArtifacts(el.innerHTML) : '';
}
