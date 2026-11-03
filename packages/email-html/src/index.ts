import { escapeAttr, escapeText, parseHtml, type HElement } from './html-parser';
import { Report } from './report';
import { toPlainText } from './text';
import { defaultTheme, type EmailTheme } from './theme';
import { createState, renderBlocks } from './transform';

export interface EmailOptions {
  /** Width of the email column in px. Default 600. */
  width?: number;
  /** Space inside the column, around the content, in px. Default 32. */
  padding?: number;
  /** Colours, fonts and spacing; anything left out uses the default theme. */
  theme?: Partial<EmailTheme>;
  /** Extra inline styles by simple selector, e.g. `{ '.lead': 'font-size:20px', 'a.button': 'background-color:#111' }`. */
  styles?: Record<string, string>;
  /** The `<title>` (some clients show it). */
  title?: string;
  /** The preview line inboxes show after the subject. */
  preheader?: string;
  lang?: string;
  dir?: 'ltr' | 'rtl';
  /** Resolve relative links and image paths against this URL. */
  baseUrl?: string;
  /** Return only the inlined content, without the document and centred column (for an email service's own template). */
  fragment?: boolean;
}

export interface EmailResult {
  /** The email HTML. */
  html: string;
  /** The plain-text version, for the text/plain part. */
  text: string;
  /** Problems found: content clients will not show, and things to fix. */
  warnings: string[];
  /** Size of `html` in bytes. Gmail clips messages over about 102 KB. */
  size: number;
}

const GMAIL_CLIP = 102 * 1024;

/**
 * Turn editor HTML into email HTML: inline styles, table layout and the fixes
 * Outlook, Gmail and Apple Mail need.
 *
 *   const { html, text, warnings } = toEmailHtml(editor.getHTML(), { preheader: 'Your weekly update' });
 */
export function toEmailHtml(input: string, options: EmailOptions = {}): EmailResult {
  const report = new Report();
  const theme: EmailTheme = { ...defaultTheme, ...options.theme };
  const width = options.width ?? 600;
  const padding = options.padding ?? 32;
  const root = bodyOf(parseHtml(input));
  const state = createState({ theme, report, contentWidth: width - padding * 2, baseUrl: options.baseUrl, classStyles: options.styles ?? {} });
  const content = renderBlocks(root.children, state, true);
  const html = options.fragment ? content : documentHtml(content, theme, width, padding, options);
  const size = new TextEncoder().encode(html).length;
  if (size > GMAIL_CLIP) report.warn(`The email is ${Math.round(size / 1024)} KB; Gmail clips messages over 102 KB behind a "View entire message" link`);
  return { html, text: toPlainText(root), warnings: report.warnings, size };
}

/** Plain text for the text/plain part of an email. */
export function toEmailText(input: string): string {
  return toPlainText(bodyOf(parseHtml(input)));
}

/** A whole document as input: use its body. */
function bodyOf(root: HElement): HElement {
  const find = (node: HElement): HElement | undefined => {
    for (const child of node.children) {
      if (typeof child === 'string') continue;
      if (child.tag === 'body') return child;
      const found = find(child);
      if (found) return found;
    }
    return undefined;
  };
  return find(root) ?? root;
}

function documentHtml(content: string, theme: EmailTheme, width: number, padding: number, options: EmailOptions): string {
  const lang = escapeAttr(options.lang ?? 'en');
  const dir = escapeAttr(options.dir ?? 'ltr');
  // Inbox previews take the first text they find: pad the preheader so body text does not follow it.
  const preheader = options.preheader
    ? `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;color:${theme.background};">${escapeText(options.preheader)}${'&#847;&zwnj;&nbsp;'.repeat(40)}</div>`
    : '';
  return `<!doctype html>
<html lang="${lang}" dir="${dir}" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no, url=no">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeText(options.title ?? '')}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
body { margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
img { -ms-interpolation-mode: bicubic; }
a[x-apple-data-detectors], #MessageViewBody a { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
u + #body a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; }
@media only screen and (max-width: ${width + 20}px) {
  .email-column { width: 100% !important; }
  .email-content { padding-left: 20px !important; padding-right: 20px !important; }
}
</style>
</head>
<body id="body" style="margin:0;padding:0;word-spacing:normal;background-color:${theme.background};">
${preheader}<div role="article" aria-roledescription="email"${options.title ? ` aria-label="${escapeAttr(options.title)}"` : ''} lang="${lang}" dir="${dir}" style="background-color:${theme.background};">
<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="${theme.background}" style="border-collapse:collapse;background-color:${theme.background};"><tr><td align="center" style="padding:24px 0;">
<!--[if mso]><table role="presentation" align="center" width="${width}" border="0" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
<table role="presentation" class="email-column" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="${theme.contentBackground}" style="border-collapse:collapse;max-width:${width}px;margin:0 auto;background-color:${theme.contentBackground};"><tr><td class="email-content" style="padding:${padding}px;font-family:${escapeAttr(theme.fontFamily)};font-size:${theme.fontSize}px;color:${theme.color};">
${content}
</td></tr></table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr></table>
</div>
</body>
</html>
`;
}

export { defaultTheme } from './theme';
export type { EmailTheme } from './theme';
