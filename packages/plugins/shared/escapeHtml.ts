/**
 * Escape text for use inside HTML (element content or a quoted attribute value).
 *
 * Plugin dialogs build their markup with template literals assigned to innerHTML. Anything
 * that comes from the document (an image's alt text, a link's title or href, the code in a
 * code block, text the user selected) or from the user must go through this first - a bare
 * `${value}` lets a `</textarea>` or a stray quote turn data into live markup.
 */
export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
