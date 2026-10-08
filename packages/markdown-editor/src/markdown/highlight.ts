/**
 * Syntax highlighting for fenced code in the preview pane.
 *
 * The code is tokenised in ONE pass over the raw text and every piece (token or gap) is HTML-escaped
 * as it is emitted. The previous implementation escaped first and then ran a chain of regex
 * replaces over its own output, so later passes matched the markup earlier passes had inserted:
 * the string pass swallowed `class="md-token-keyword"` (leaving a stray `<span class="&lt;span">`) and
 * the number pass split the `39` out of an escaped `&#39;`.
 */

export const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

type Family = 'json' | 'clike' | 'script';

const FAMILY_BY_LANGUAGE: Record<string, Family> = {
  json: 'json',
  jsonc: 'json',
  js: 'clike',
  jsx: 'clike',
  javascript: 'clike',
  mjs: 'clike',
  cjs: 'clike',
  ts: 'clike',
  tsx: 'clike',
  typescript: 'clike',
  java: 'clike',
  c: 'clike',
  cpp: 'clike',
  'c++': 'clike',
  cs: 'clike',
  csharp: 'clike',
  go: 'clike',
  rust: 'clike',
  rs: 'clike',
  swift: 'clike',
  kotlin: 'clike',
  php: 'clike',
  py: 'script',
  python: 'script',
  rb: 'script',
  ruby: 'script',
  sh: 'script',
  bash: 'script',
  shell: 'script',
  zsh: 'script',
  yaml: 'script',
  yml: 'script',
  toml: 'script',
};

const KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case',
  'break', 'continue', 'new', 'class', 'extends', 'import', 'export', 'from', 'default', 'async',
  'await', 'try', 'catch', 'finally', 'throw', 'typeof', 'instanceof', 'in', 'of', 'this', 'super',
  'static', 'public', 'private', 'protected', 'interface', 'type', 'enum', 'void', 'null', 'undefined',
  'true', 'false', 'fn', 'func', 'package', 'struct', 'impl', 'use', 'mod', 'pub', 'mut', 'match',
  'def', 'elif', 'pass', 'lambda', 'None', 'True', 'False', 'and', 'or', 'not', 'is', 'with', 'as',
  'yield', 'end', 'then', 'fi', 'done', 'echo',
]);

const tokenize = (
  code: string,
  pattern: RegExp,
  render: (match: RegExpMatchArray) => string | null,
): string => {
  let html = '';
  let last = 0;
  for (const match of code.matchAll(pattern)) {
    const index = match.index ?? 0;
    html += escapeHtml(code.slice(last, index));
    html += render(match) ?? escapeHtml(match[0]);
    last = index + match[0].length;
  }
  return html + escapeHtml(code.slice(last));
};

const span = (kind: string, text: string): string =>
  `<span class="md-token-${kind}">${escapeHtml(text)}</span>`;

// 1: string, 2: ':' after a string (marks it as a key), 3: true/false/null, 4: number
const JSON_PATTERN = /("(?:\\.|[^"\\\n])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;

// 1: comment, 2: string, 3: number, 4: identifier
const CLIKE_PATTERN =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|\b(0x[\da-fA-F]+|\d+(?:\.\d+)?)\b|\b([A-Za-z_$][\w$]*)\b/g;

const SCRIPT_PATTERN =
  /(#[^\n]*)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|\b(0x[\da-fA-F]+|\d+(?:\.\d+)?)\b|\b([A-Za-z_$][\w$]*)\b/g;

const renderCode = (match: RegExpMatchArray): string | null => {
  const [, comment, string, number, identifier] = match;
  if (comment) return span('comment', comment);
  if (string) return span('string', string);
  if (number) return span('number', number);
  if (identifier && KEYWORDS.has(identifier)) return span('keyword', identifier);
  return null;
};

export const highlightCode = (code: string, language?: string): string => {
  const family = FAMILY_BY_LANGUAGE[(language || '').trim().toLowerCase()];

  if (family === 'json') {
    return tokenize(code, JSON_PATTERN, (match) => {
      const [, string, colon, literal, number] = match;
      if (string) return span(colon ? 'key' : 'string', string) + escapeHtml(colon || '');
      if (literal) return span('boolean', literal);
      if (number) return span('number', number);
      return null;
    });
  }
  if (family === 'clike') return tokenize(code, CLIKE_PATTERN, renderCode);
  if (family === 'script') return tokenize(code, SCRIPT_PATTERN, renderCode);

  // Unknown or unspecified language: no guesswork, just escape.
  return escapeHtml(code);
};
