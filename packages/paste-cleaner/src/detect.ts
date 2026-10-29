export type PasteSource =
  | 'word'
  | 'word-online'
  | 'excel'
  | 'google-docs'
  | 'google-sheets'
  | 'apple'
  | 'libreoffice'
  | 'vscode'
  | 'web'
  | 'markdown'
  | 'plain';

/** Where clipboard HTML came from, judged by the markers each app leaves. */
export function detectSource(html: string): PasteSource {
  if (/<google-sheets-html-origin|data-sheets-(?:value|root)/i.test(html)) return 'google-sheets';
  if (/id=["']?docs-internal-guid/i.test(html)) return 'google-docs';
  if (/urn:schemas-microsoft-com:office:excel|content=["']?Excel\.Sheet/i.test(html)) return 'excel';
  if (/class=["']?(?:OutlineElement|TextRun|ListContainerWrapper)\b|paraeid=|data-ccp-props/i.test(html)) return 'word-online';
  if (/urn:schemas-microsoft-com:office:word|content=["']?Word\.Document|mso-list:|<o:p\b/i.test(html) || /class=["']?Mso[A-Z]/.test(html)) return 'word';
  if (/content=["']Cocoa HTML Writer|Apple-converted-space|class=["']?Apple-/i.test(html)) return 'apple';
  if (/content=["']LibreOffice/i.test(html)) return 'libreoffice';
  const firstStyle = html.match(/^\s*(?:<meta[^>]*>\s*)?<div[^>]*\sstyle="([^"]*)"/i)?.[1] ?? '';
  if (/white-space:\s*pre/i.test(firstStyle) && /font-family:[^;]*(Menlo|Monaco|Consolas|Courier|monospace)/i.test(firstStyle)) return 'vscode';
  return 'web';
}
