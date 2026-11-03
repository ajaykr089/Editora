/** Where clipboard content came from, judged by the markers each app writes. */
export type PasteSource = 'word' | 'google-docs' | 'google-sheets' | 'excel' | 'libreoffice' | 'apple' | 'vscode' | 'web' | 'plain';

export interface PasteInfo {
  source: PasteSource;
  /** Page the content was copied from, when the clipboard says. */
  url?: string;
}

export function detectPasteSource(html: string, text: string, types: readonly string[] = []): PasteInfo {
  if (!html) return { source: types.includes('vscode-editor-data') ? 'vscode' : 'plain' };
  const url = /<base\s[^>]*href="([^"]+)"/i.exec(html)?.[1] ?? /SourceURL:([^\s]+)/i.exec(html)?.[1];
  const info = (source: PasteSource): PasteInfo => (url && /^https?:/i.test(url) ? { source, url } : { source });

  if (types.includes('vscode-editor-data')) return info('vscode');
  if (/id="docs-internal-guid-/i.test(html)) return info('google-docs');
  if (/google-sheets-html-origin|data-sheets-value/i.test(html)) return info('google-sheets');
  if (/urn:schemas-microsoft-com:office:excel|ProgId"?\s*content="?Excel/i.test(html)) return info('excel');
  if (/urn:schemas-microsoft-com:office:word|ProgId"?\s*content="?Word|class="?Mso|mso-[a-z-]+:/i.test(html)) return info('word');
  if (/content="?LibreOffice|content="?OpenOffice/i.test(html)) return info('libreoffice');
  // Not Apple-converted-space: Safari adds it to copies from any web page.
  if (/Cocoa HTML Writer|apple-content-edited/i.test(html)) return info('apple');
  return info(text || html ? 'web' : 'plain');
}
