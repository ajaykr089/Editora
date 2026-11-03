/** The look applied to content that has no inline style of its own. */
export interface EmailTheme {
  fontFamily: string;
  /** Body text size in px. */
  fontSize: number;
  lineHeight: number;
  color: string;
  mutedColor: string;
  headingColor: string;
  linkColor: string;
  /** Behind the email. */
  background: string;
  /** Behind the content column. */
  contentBackground: string;
  borderColor: string;
  codeBackground: string;
  codeFontFamily: string;
  buttonBackground: string;
  buttonColor: string;
  buttonRadius: number;
  /** Space after paragraphs and blocks, in px. */
  spacing: number;
  /** Heading sizes in px, h1 to h6. */
  headingSizes: [number, number, number, number, number, number];
}

export const defaultTheme: EmailTheme = {
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  fontSize: 16,
  lineHeight: 1.6,
  color: '#1f2328',
  mutedColor: '#59636e',
  headingColor: '#1f2328',
  linkColor: '#0b57d0',
  background: '#f4f4f5',
  contentBackground: '#ffffff',
  borderColor: '#d0d7de',
  codeBackground: '#f3f4f6',
  codeFontFamily: "Menlo, Consolas, 'Courier New', monospace",
  buttonBackground: '#0b57d0',
  buttonColor: '#ffffff',
  buttonRadius: 6,
  spacing: 16,
  headingSizes: [30, 24, 20, 18, 16, 14],
};

const lh = (size: number, ratio: number) => `${Math.round(size * ratio)}px`;

/** Per-tag inline styles. Outlook does not inherit fonts from tables, so every text block gets the font. */
export function tagStyles(theme: EmailTheme): Record<string, string> {
  const font = `font-family:${theme.fontFamily};mso-line-height-rule:exactly`;
  const body = `${font};font-size:${theme.fontSize}px;line-height:${lh(theme.fontSize, theme.lineHeight)};color:${theme.color}`;
  const out: Record<string, string> = {
    p: `margin:0 0 ${theme.spacing}px;${body}`,
    li: `margin:0 0 ${Math.round(theme.spacing / 2)}px;${body}`,
    ul: `margin:0 0 ${theme.spacing}px ${theme.spacing + 8}px;padding:0`,
    ol: `margin:0 0 ${theme.spacing}px ${theme.spacing + 8}px;padding:0`,
    a: `color:${theme.linkColor};text-decoration:underline`,
    td: `${body};padding:8px 12px;border:1px solid ${theme.borderColor};text-align:left;vertical-align:top`,
    th: `${body};padding:8px 12px;border:1px solid ${theme.borderColor};text-align:left;vertical-align:top;font-weight:bold;background-color:${theme.codeBackground}`,
    caption: `${body};color:${theme.mutedColor};padding:0 0 8px;text-align:left`,
    code: `font-family:${theme.codeFontFamily};font-size:${Math.round(theme.fontSize * 0.875)}px;background-color:${theme.codeBackground};padding:1px 4px;border-radius:4px`,
    mark: 'background-color:#fff3a3;color:inherit',
    figcaption: `margin:0 0 ${theme.spacing}px;${font};font-size:${Math.round(theme.fontSize * 0.875)}px;line-height:${lh(theme.fontSize * 0.875, theme.lineHeight)};color:${theme.mutedColor}`,
  };
  theme.headingSizes.forEach((size, index) => {
    out[`h${index + 1}`] = `margin:0 0 ${Math.round(theme.spacing * 0.75)}px;${font};font-size:${size}px;line-height:${lh(size, 1.25)};font-weight:bold;color:${theme.headingColor}`;
  });
  return out;
}
