/**
 * Lightweight multi-language formatter utilities.
 *
 * These helpers are intentionally conservative. They provide safe whitespace
 * cleanup and simple indentation without pretending to replace full language
 * formatters such as Prettier, Black, gofmt, php-cs-fixer, or rustfmt.
 */

import type { Formatter } from '../types';

export type LightweightFormattingLanguage =
  | 'html'
  | 'css'
  | 'markdown'
  | 'php'
  | 'python'
  | 'bash'
  | 'javascript'
  | 'go'
  | 'cpp'
  | 'java'
  | 'csharp'
  | 'rust'
  | 'ruby'
  | 'sql'
  | 'dockerfile'
  | 'vue'
  | 'ejs'
  | 'jsx'
  | 'xml'
  | 'plain';

const htmlVoidTags = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

const htmlTextContainerTags = new Set([
  'a',
  'button',
  'code',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'label',
  'li',
  'p',
  'small',
  'span',
  'strong',
  'td',
  'th',
  'title',
]);

const htmlStructuralBoundaryTags = new Set([
  'address',
  'article',
  'aside',
  'blockquote',
  'body',
  'dd',
  'details',
  'dialog',
  'div',
  'dl',
  'dt',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hr',
  'html',
  'li',
  'main',
  'menu',
  'nav',
  'ol',
  'p',
  'section',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'tr',
  'ul',
]);

export function createLightweightFormatter(): Formatter {
  return (context) => formatLightweightCode(context.input);
}

export const lightweightFormatter: Formatter = createLightweightFormatter();

export function formatLightweightCode(input: string): string {
  const language = detectLightweightFormattingLanguage(input);
  const output = formatAsLanguage(input, language);
  // The formatter only moves whitespace. If anything else came out different, something was misread: give the
  // code back as it was rather than change what it does. (PHP may get its missing "<" of "<?php" back.)
  return language === 'php' || sameNonWhitespace(input, output) ? output : input;
}

function sameNonWhitespace(a: string, b: string): boolean {
  return a.replace(/\s+/g, '') === b.replace(/\s+/g, '');
}

function formatAsLanguage(input: string, language: LightweightFormattingLanguage): string {

  if (language === 'css') {
    return formatCss(input);
  }

  if (language === 'html' || language === 'vue') {
    return formatHtml(input);
  }

  if (language === 'xml') {
    return formatHtml(input, { inlineAnyTextTag: true });
  }

  if (language === 'markdown') {
    return normalizeMarkdown(input);
  }

  if (language === 'php') {
    return withProtectedLiterals(input, 'c', (code) => formatBraceCode(code, { repairPhpOpenTag: true }));
  }

  if (language === 'python') {
    return withProtectedLiterals(input, 'python', formatPython);
  }

  if (language === 'bash') {
    return formatShell(input);
  }

  if (language === 'javascript') {
    return withProtectedLiterals(input, 'js', formatJavaScript);
  }

  if (language === 'ruby') {
    return formatRuby(input);
  }

  if (language === 'ejs') {
    return normalizePlainCode(input);
  }

  if (language === 'jsx') {
    return withProtectedLiterals(input, 'jsx', formatJsx);
  }

  if (['go', 'cpp', 'java', 'csharp', 'rust', 'dockerfile'].includes(language)) {
    return withProtectedLiterals(input, 'c', (code) => formatBraceCode(code));
  }

  return normalizePlainCode(input);
}

export function detectLightweightFormattingLanguage(input: string): LightweightFormattingLanguage {
  const trimmed = input.trim();

  if (/^<\?php\b/i.test(trimmed) || /^\?php\b/i.test(trimmed) || /\$[A-Za-z_]\w*\s*=/.test(trimmed)) {
    return 'php';
  }

  if (/<%[\s\S]*?%>/.test(trimmed)) {
    return 'ejs';
  }

  if (looksLikeMarkdown(trimmed)) {
    return 'markdown';
  }

  if (/<template\b|<script\s+setup\b|<style\s+scoped\b/i.test(trimmed)) {
    return 'vue';
  }

  if (/^<\?xml\b/i.test(trimmed)) {
    return 'xml';
  }

  if (looksLikeJsxOrTsx(trimmed)) {
    return 'jsx';
  }

  if (
    /^<!DOCTYPE\s+html\b/i.test(trimmed) ||
    /<\/?(html|head|body|meta|title|style|script)\b/i.test(trimmed) ||
    looksLikeHtmlFragment(trimmed)
  ) {
    return 'html';
  }

  if (/^#!\/usr\/bin\/env\s+(bash|sh|zsh)/.test(trimmed) || /\b(npm|pnpm|yarn|git|docker)\s+/.test(trimmed)) {
    return 'bash';
  }

  if (looksLikeRuby(trimmed)) {
    return 'ruby';
  }

  if (/^\s*(from\s+\w+\s+import|import\s+\w+|def\s+\w+\s*\(|class\s+\w+|for\s+\w+\s+in\s+.+:|if\s+.+:|while\s+.+:|print\s*\()/m.test(trimmed)) {
    return 'python';
  }

  if (/^\s*package\s+\w+/m.test(trimmed) || /\bfunc\s+\w+\s*\(/.test(trimmed)) {
    return 'go';
  }

  if (/^\s*#include\s*<[^>]+>/m.test(trimmed) || /\b(std::|cout\s*<<|cin\s*>>|template\s*<)/.test(trimmed)) {
    return 'cpp';
  }

  if (/\b(public|private|protected)\s+(class|interface|enum)\s+\w+/.test(trimmed)) {
    return 'java';
  }

  if (/^\s*using\s+[\w.]+;/m.test(trimmed) || /\b(Console\.WriteLine|namespace|record)\b/.test(trimmed)) {
    return 'csharp';
  }

  if (/\bfn\s+\w+\s*\(/.test(trimmed) || /\b(let\s+mut|println!\s*\(|impl\s+\w+)/.test(trimmed)) {
    return 'rust';
  }

  if (looksLikeJavaScript(trimmed)) {
    return 'javascript';
  }

  if (/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/im.test(trimmed)) {
    return 'sql';
  }

  if (/^\s*FROM\s+\S+/im.test(trimmed) || /^\s*(RUN|COPY|ADD|CMD|ENTRYPOINT|WORKDIR|ENV|ARG)\b/im.test(trimmed)) {
    return 'dockerfile';
  }

  if (looksLikeCss(trimmed)) {
    return 'css';
  }

  return 'plain';
}

export function formatCss(input: string): string {
  // Strings, comments and url(...) can hold ";", "{" and "}" (content: "{;}", data: URLs): they are kept as they are.
  return withProtectedLiterals(input, 'css', formatCssLayout);
}

function formatCssLayout(input: string): string {
  const normalized = input
    .replace(/\r\n?/g, '\n')
    .replace(/\s*{\s*/g, ' {\n')
    .replace(/;(?![ \t]*\n)[ \t]*/g, ';\n')
    .replace(/[ \t]*\n?[ \t]*}[ \t]*(\n[ \t]*\n)?/g, (_, blankLine) => `\n}\n${blankLine ? '\n' : ''}`)
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (!normalized) {
    return '';
  }

  const lines = normalized
    .split('\n')
    .map((line) => line.trim());
  const output: string[] = [];
  let depth = 0;

  for (const line of lines) {
    if (!line) {
      if (output.length > 0 && output[output.length - 1] !== '') {
        output.push('');
      }
      continue;
    }

    if (line === '}') {
      depth = Math.max(0, depth - 1);
      if (output[output.length - 1] === '') output.pop();
    }

    output.push(`${'  '.repeat(depth)}${line}`);

    if (line.endsWith('{')) {
      depth += 1;
    }
  }

  return output.join('\n');
}

export function normalizePlainCode(input: string): string {
  return input
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/g, ''))
    .join('\n')
    .trim();
}

/** As normalizePlainCode, but two or more trailing spaces stay two: in Markdown they are a line break. */
function normalizeMarkdown(input: string): string {
  return input
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/g, (trailing) => (/^ {2,}$/.test(trailing) && line.trim() ? '  ' : '')))
    .join('\n')
    .trim();
}

function looksLikeCss(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed || /</.test(trimmed)) {
    return false;
  }

  return /{[\s\S]*}/.test(trimmed) && /[A-Za-z-]+\s*:/.test(trimmed);
}

function looksLikeHtmlFragment(input: string): boolean {
  return /<[a-z][\w:-]*(?:\s[^>]*)?>[\s\S]*<\/[a-z][\w:-]*>/i.test(input);
}

function looksLikeJsxOrTsx(input: string): boolean {
  const hasJsxTag = /<[A-Za-z][\w.:-]*(?:\s[^>]*)?>/.test(input);
  const hasCodeSignal =
    /^\s*(import|export|type|interface|const|let|var|function)\b/m.test(input) ||
    /\breturn\s*\(/.test(input) ||
    /\bclassName=/.test(input);

  return hasJsxTag && hasCodeSignal;
}

function looksLikeJavaScript(input: string): boolean {
  return (
    /^\s*(import|export)\s+/m.test(input) ||
    /^\s*(const|let|var)\s+\w+/m.test(input) ||
    /^\s*(type|interface)\s+\w+/m.test(input) ||
    /\bfunction\s+\w+\s*\(/.test(input) ||
    /=>/.test(input)
  );
}

function looksLikeRuby(input: string): boolean {
  return (
    /\bdo\s*(?:\|[^|\n]*\|)?\s*$/m.test(input) ||
    /^\s*end\s*$/m.test(input) ||
    /\bputs\s+/.test(input) ||
    (/^\s*(def|class|module)\s+\w+/m.test(input) && /^\s*end\s*$/m.test(input))
  );
}

function looksLikeMarkdown(input: string): boolean {
  const trimmed = input.trim();
  const signals = [
    /^---\s*\n[\s\S]*?\n---\s*(?:\n|$)/.test(trimmed),
    /^#{1,6}\s+\S/m.test(trimmed),
    /^\s*```/m.test(trimmed),
    /^\s*~~~/m.test(trimmed),
    /^\s{0,3}>\s+/m.test(trimmed),
    /^\s{0,3}(?:[-*+]|\d+\.)\s+\S/m.test(trimmed),
    /^\s{0,3}[-*+]\s+\[[ xX]\]\s+\S/m.test(trimmed),
    /\[[^\]\n]+\]\([^)]+\)/.test(trimmed),
    /!\[[^\]\n]*\]\([^)]+\)/.test(trimmed),
    /(^|\n)\s*\|.+\|\s*\n\s*\|[\s:-]+\|/m.test(trimmed),
    /(^|\s)(?:\*\*|__)[^*_]+(?:\*\*|__)(?=\s|$|[.,;:!?])/m.test(trimmed),
  ];

  return signals.filter(Boolean).length > 0;
}

function stripStringsAndLineComments(line: string): string {
  let output = '';
  let quote: '"' | "'" | '`' | null = null;
  let escaped = false;

  for (let index = 0; index < line.length; index++) {
    const char = line[index];
    const next = line[index + 1];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }
      output += ' ';
      continue;
    }

    if (char === '/' && next === '/') {
      break;
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      output += ' ';
      continue;
    }

    output += char;
  }

  return output;
}

function formatBraceCode(
  input: string,
  options: { repairPhpOpenTag?: boolean; countSquareBrackets?: boolean; countParentheses?: boolean } = {},
): string {
  const normalized = normalizePlainCode(input);
  if (!normalized) {
    return '';
  }

  const lines = normalized.split('\n');
  const output: string[] = [];
  let depth = 0;

  lines.forEach((rawLine, index) => {
    let line = rawLine.trim();
    if (index === 0 && options.repairPhpOpenTag && /^(\?php)(\s|$)/i.test(line)) {
      line = `<${line}`;
    }

    if (!line) {
      output.push('');
      return;
    }

    const structuralLine = stripStringsAndLineComments(line);

    if (startsWithClosingStructure(structuralLine, options)) {
      depth = Math.max(0, depth - 1);
    }

    output.push(`${'  '.repeat(depth)}${line}`);

    const opens = countOpeningStructures(structuralLine, options);
    const closes = countClosingStructures(structuralLine, options);
    const leadingClose = startsWithClosingStructure(structuralLine, options) ? 1 : 0;
    depth = Math.max(0, depth + opens - Math.max(0, closes - leadingClose));
  });

  return output.join('\n');
}

function startsWithClosingStructure(
  line: string,
  options: { countSquareBrackets?: boolean; countParentheses?: boolean },
): boolean {
  const pattern = options.countSquareBrackets || options.countParentheses
    ? /^[}\])]/ 
    : /^}/;

  return pattern.test(line.trimStart());
}

function countOpeningStructures(
  line: string,
  options: { countSquareBrackets?: boolean; countParentheses?: boolean },
): number {
  let count = (line.match(/{/g) || []).length;

  if (options.countSquareBrackets) {
    count += (line.match(/\[/g) || []).length;
  }

  if (options.countParentheses) {
    count += (line.match(/\(/g) || []).length;
  }

  return count;
}

function countClosingStructures(
  line: string,
  options: { countSquareBrackets?: boolean; countParentheses?: boolean },
): number {
  let count = (line.match(/}/g) || []).length;

  if (options.countSquareBrackets) {
    count += (line.match(/]/g) || []).length;
  }

  if (options.countParentheses) {
    count += (line.match(/\)/g) || []).length;
  }

  return count;
}

function formatPython(input: string): string {
  const normalized = normalizePlainCode(input);
  if (!normalized) {
    return '';
  }

  const lines = normalized.split('\n');
  const output: string[] = [];
  let depth = 0;
  let previousClosedSuite = false;

  const getExplicitDepth = (line: string): number | null => {
    const match = line.match(/^[ \t]+/);
    if (!match) {
      return null;
    }

    const width = match[0].replace(/\t/g, '    ').length;
    return Math.max(0, Math.floor(width / 4));
  };

  const isDedentClause = (line: string): boolean =>
    /^(elif|else|except|finally)\b/.test(line);

  const isLikelyTopLevelStarter = (line: string): boolean =>
    /^(async\s+def|def|class|from|import)\b/.test(line) ||
    /^@[A-Za-z_][\w.]*\b/.test(line);

  const closesSimpleSuite = (line: string): boolean =>
    /^(return|raise|break|continue|pass)\b/.test(line);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      output.push('');
      continue;
    }

    const explicitDepth = getExplicitDepth(rawLine);
    if (explicitDepth !== null) {
      depth = explicitDepth;
    } else if (isDedentClause(line)) {
      depth = Math.max(0, depth - 1);
    } else if (previousClosedSuite || isLikelyTopLevelStarter(line)) {
      depth = 0;
    }

    output.push(`${'    '.repeat(depth)}${line}`);

    const currentDepth = depth;
    depth = /:\s*(#.*|\uE100[0-9a-z]+\uE101)?$/.test(line) ? currentDepth + 1 : currentDepth;
    previousClosedSuite = currentDepth > 0 && closesSimpleSuite(line);
  }

  return output.join('\n');
}

function formatShell(input: string): string {
  const normalized = normalizePlainCode(input);
  if (!normalized) {
    return '';
  }

  const output: string[] = [];
  let depth = 0;

  for (const rawLine of normalized.split('\n')) {
    const line = rawLine.trim();
    if (!line) {
      output.push('');
      continue;
    }

    if (/^(done|fi|esac)\b/.test(line)) {
      depth = Math.max(0, depth - 1);
    }

    output.push(`${'  '.repeat(depth)}${line}`);

    if (/\b(do|then)\s*$/.test(line) || /\bcase\b.*\bin\b\s*$/.test(line)) {
      depth += 1;
    }
  }

  return output.join('\n');
}

function formatRuby(input: string): string {
  const normalized = normalizePlainCode(input);
  if (!normalized) {
    return '';
  }

  const output: string[] = [];
  let depth = 0;

  for (const rawLine of normalized.split('\n')) {
    const line = rawLine.trim();
    if (!line) {
      output.push('');
      continue;
    }

    if (shouldDedentRubyLine(line)) {
      depth = Math.max(0, depth - 1);
    }

    output.push(`${'  '.repeat(depth)}${line}`);

    if (shouldIndentAfterRubyLine(line)) {
      depth += 1;
    }
  }

  return output.join('\n');
}

function shouldDedentRubyLine(line: string): boolean {
  return /^(end|else|elsif|rescue|ensure|when)\b/.test(line);
}

function shouldIndentAfterRubyLine(line: string): boolean {
  const structuralLine = stripStringsAndLineComments(line).trim();
  if (!structuralLine || /^#/.test(structuralLine)) {
    return false;
  }

  return (
    /^(class|module|def|if|unless|case|begin|for|while|until)\b/.test(structuralLine) ||
    /\bdo\s*(?:\|[^|\n]*\|)?\s*$/.test(structuralLine) ||
    /(?:else|elsif|rescue|ensure|when)\b/.test(structuralLine)
  );
}

function formatJavaScript(input: string): string {
  const normalized = normalizeJavaScriptLayout(input);
  return formatBraceCode(normalized, { countSquareBrackets: true, countParentheses: true });
}

function normalizeJavaScriptLayout(input: string): string {
  const normalized = normalizePlainCode(input)
    .replace(/\[\s*{/g, '[\n{')
    .replace(/}\s*,\s*{/g, '},\n{');

  const output: string[] = [];

  for (const rawLine of normalized.split('\n')) {
    const line = rawLine.trim();

    if (!line) {
      output.push('');
      continue;
    }

    if (/^[;,]$/.test(line)) {
      appendToPreviousNonEmptyLine(output, line);
      continue;
    }

    if (/^[}\])]\s*[;,]?$/.test(line)) {
      output.push(line);
      continue;
    }

    if (shouldSplitJavaScriptProperties(line)) {
      splitTopLevelCommas(line).forEach((part, index, parts) => {
        const suffix = index < parts.length - 1 ? ',' : '';
        output.push(`${part.trim()}${suffix}`);
      });
      continue;
    }

    output.push(line);
  }

  return output.join('\n');
}

function appendToPreviousNonEmptyLine(lines: string[], suffix: string): void {
  for (let index = lines.length - 1; index >= 0; index--) {
    if (lines[index]) {
      lines[index] = `${lines[index]}${suffix}`;
      return;
    }
  }

  lines.push(suffix);
}

function shouldSplitJavaScriptProperties(line: string): boolean {
  if (!/^[\w$-]+\s*:/.test(line) || !line.includes(',')) {
    return false;
  }

  return splitTopLevelCommas(line).length > 1;
}

function splitTopLevelCommas(line: string): string[] {
  const parts: string[] = [];
  let current = '';
  let quote: '"' | "'" | '`' | null = null;
  let escaped = false;
  let depth = 0;

  for (let index = 0; index < line.length; index++) {
    const char = line[index];

    if (quote) {
      current += char;
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char;
      current += char;
      continue;
    }

    if (char === '{' || char === '[' || char === '(') {
      depth += 1;
      current += char;
      continue;
    }

    if (char === '}' || char === ']' || char === ')') {
      depth = Math.max(0, depth - 1);
      current += char;
      continue;
    }

    if (char === ',' && depth === 0) {
      parts.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  if (current) {
    parts.push(current);
  }

  return parts;
}

function formatJsx(input: string): string {
  const normalized = normalizePlainCode(input);
  if (!normalized) {
    return '';
  }

  const output: string[] = [];
  let depth = 0;

  for (const rawLine of normalized.split('\n')) {
    const line = rawLine.trim();
    if (!line) {
      output.push('');
      continue;
    }

    if (shouldDedentJsxLine(line)) {
      depth = Math.max(0, depth - 1);
    }

    output.push(`${'  '.repeat(depth)}${line}`);

    if (shouldIndentAfterJsxLine(line)) {
      depth += 1;
    }
  }

  return output.join('\n');
}

function shouldDedentJsxLine(line: string): boolean {
  return /^<\/[A-Za-z][\w.:-]*/.test(line) || /^[)}\]]/.test(line);
}

function shouldIndentAfterJsxLine(line: string): boolean {
  if (/^[)}\]]/.test(line)) {
    return false;
  }

  if (shouldIndentJsxTag(line)) {
    return true;
  }

  return /(?:=>\s*)?[\[{(]\s*$/.test(stripStringsAndLineComments(line));
}

function shouldIndentJsxTag(line: string): boolean {
  if (!/^<[A-Za-z][\w.:-]*/.test(line)) {
    return false;
  }

  if (/\/>\s*$/.test(line)) {
    return false;
  }

  const tagMatch = line.match(/^<([A-Za-z][\w.:-]*)/);
  const tagName = tagMatch?.[1];
  if (!tagName || htmlVoidTags.has(tagName.toLowerCase())) {
    return false;
  }

  return !new RegExp(`</${tagName.replace(/\./g, '\\.')}\\s*>\\s*(?:[);,}]*)$`).test(line);
}

function formatHtml(input: string, options: { inlineAnyTextTag?: boolean } = {}): string {
  const normalized = input.replace(/\r\n?/g, '\n').trim();

  if (!normalized) {
    return '';
  }

  const tokens = normalized.match(
    /<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<!DOCTYPE[\s\S]*?>|<style\b[^>]*>[\s\S]*?<\/style>|<script\b[^>]*>[\s\S]*?<\/script>|<pre\b[^>]*>[\s\S]*?<\/pre>|<textarea\b[^>]*>[\s\S]*?<\/textarea>|<\/?[A-Za-z][^>]*?>|[^<]+/gi,
  ) || [];
  const output: string[] = [];
  const stack: string[] = [];

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index];
    const line = token.trim();
    if (!line) {
      continue;
    }

    const styleBlockMatch = line.match(/^<style\b([^>]*)>([\s\S]*?)<\/style>$/i);
    if (styleBlockMatch) {
      const depth = stack.length;
      output.push(`${'  '.repeat(depth)}<style${styleBlockMatch[1]}>`);

      const formattedCss = formatCss(styleBlockMatch[2]);
      if (formattedCss) {
        formattedCss.split('\n').forEach((cssLine) => {
          output.push(`${'  '.repeat(depth + 1)}${cssLine}`);
        });
      }

      output.push(`${'  '.repeat(depth)}</style>`);
      continue;
    }

    // The text of <pre> and <textarea> is shown (or submitted) with its whitespace: it is kept exactly.
    if (/^<(pre|textarea)\b/i.test(line)) {
      output.push(`${'  '.repeat(stack.length)}${line}`);
      continue;
    }

    const scriptBlockMatch = line.match(/^<script\b([^>]*)>([\s\S]*?)<\/script>$/i);
    if (scriptBlockMatch) {
      const depth = stack.length;
      output.push(`${'  '.repeat(depth)}<script${scriptBlockMatch[1]}>`);

      // Lines are re-indented, but strings, template literals and comments that span lines are kept as they are.
      const script = protectLiterals(scriptBlockMatch[2], 'js');
      const scriptLines: string[] = [];
      script.text
        .split('\n')
        .map((scriptLine) => scriptLine.trim())
        .forEach((scriptLine) => {
          if (!scriptLine) {
            if (scriptLines.length > 0 && scriptLines[scriptLines.length - 1] !== '') {
              scriptLines.push('');
            }
            return;
          }
          scriptLines.push(`${'  '.repeat(depth + 1)}${scriptLine}`);
        });
      while (scriptLines.length > 0 && scriptLines[scriptLines.length - 1] === '') scriptLines.pop();
      const restored = script.restore(scriptLines.join('\n'));
      if (restored === null) {
        output.push(scriptBlockMatch[2]);
      } else if (restored) {
        output.push(restored);
      }

      output.push(`${'  '.repeat(depth)}</script>`);
      continue;
    }

    if (!/^</.test(line)) {
      const depth = stack.length;
      line
        .split(/\n+/)
        .map((textLine) => textLine.trim())
        .forEach((textLine) => {
          if (!textLine) {
            if (output.length > 0 && output[output.length - 1] !== '') {
              output.push('');
            }
            return;
          }
          output.push(`${'  '.repeat(depth)}${textLine}`);
        });
      continue;
    }

    if (/^<\?/.test(line)) {
      output.push(`${'  '.repeat(stack.length)}${line}`);
      continue;
    }

    if (/^<\//.test(line)) {
      const tagName = getHtmlTagName(line);
      closeHtmlStackToTag(stack, tagName);
      output.push(`${'  '.repeat(stack.length)}${line}`);
      continue;
    }

    const tagName = getHtmlTagName(line);
    closeHtmlStackForBoundary(stack, tagName);

    const inlineText = getFollowingHtmlText(tokens, index);
    const inlineClose = getFollowingHtmlClosingToken(tokens, index + 2, tagName);
    const keepInline = tagName && inlineText && (options.inlineAnyTextTag || htmlTextContainerTags.has(tagName));
    if (keepInline) {
      const suffix = inlineClose || '';
      output.push(`${'  '.repeat(stack.length)}${line}${inlineText}${suffix}`);
      index += inlineClose ? 2 : 1;
      continue;
    }

    output.push(`${'  '.repeat(stack.length)}${line}`);

    if (shouldIndentHtmlLine(line)) {
      stack.push(tagName || '');
    }
  }

  return output.join('\n');
}

function getHtmlTagName(line: string): string | null {
  return line.match(/^<\/?\s*([A-Za-z][A-Za-z0-9-]*)/)?.[1]?.toLowerCase() || null;
}

function getFollowingHtmlText(tokens: string[], index: number): string | null {
  const next = tokens[index + 1];
  if (!next || /^</.test(next.trim())) {
    return null;
  }

  const trimmed = next.trim();
  return trimmed && !trimmed.includes('\n') ? trimmed : null;
}

function getFollowingHtmlClosingToken(tokens: string[], index: number, tagName: string | null): string | null {
  if (!tagName) {
    return null;
  }

  const next = tokens[index]?.trim();
  return next && new RegExp(`^</${tagName}\\s*>$`, 'i').test(next) ? next : null;
}

function closeHtmlStackToTag(stack: string[], tagName: string | null): void {
  if (!tagName) {
    return;
  }

  const index = stack.lastIndexOf(tagName);
  if (index >= 0) {
    stack.splice(index);
  }
}

function closeHtmlStackForBoundary(stack: string[], tagName: string | null): void {
  if (!tagName || !htmlStructuralBoundaryTags.has(tagName)) {
    return;
  }

  const last = stack[stack.length - 1];
  if (last && htmlTextContainerTags.has(last)) {
    stack.pop();
  }

  if (tagName === 'body' && stack[stack.length - 1] === 'head') {
    stack.pop();
  }
}

function shouldIndentHtmlLine(line: string): boolean {
  if (!/^</.test(line)) {
    return false;
  }

  if (/^<\//.test(line) || /^<!--/.test(line) || /^<\?/.test(line) || /^<!DOCTYPE/i.test(line)) {
    return false;
  }

  if (/\/>$/.test(line)) {
    return false;
  }

  const tagMatch = line.match(/^<([A-Za-z][A-Za-z0-9-]*)/);
  const tagName = tagMatch?.[1]?.toLowerCase();
  if (!tagName || htmlVoidTags.has(tagName)) {
    return false;
  }

  if (new RegExp(`^<${tagName}\\b[^>]*>.*</${tagName}>$`, 'i').test(line)) {
    return false;
  }

  return true;
}

/** `jsx` keeps only template literals and block comments: quotes in JSX text ("don't") are not strings. */
type LiteralSyntax = 'c' | 'js' | 'jsx' | 'css' | 'python';

const LITERAL_OPEN = '\uE100';
const LITERAL_CLOSE = '\uE101';
const LITERAL_PLACEHOLDER = /\uE100([0-9a-z]+)\uE101/g;
const REGEX_AFTER_WORDS = new Set(['return', 'typeof', 'instanceof', 'in', 'of', 'new', 'delete', 'void', 'throw', 'case', 'do', 'else', 'yield', 'await']);

/**
 * Runs a line-based formatter with every string, template literal, regular-expression literal and comment taken out
 * of the code first, so the formatter can neither split them (a "{" inside a string or regex used to start a new
 * line) nor re-indent their lines (which changed the text of a multi-line template literal). If a literal does not
 * come back exactly once, the input is returned unformatted.
 */
function withProtectedLiterals(input: string, syntax: LiteralSyntax, format: (code: string) => string): string {
  if (input.includes(LITERAL_OPEN) || input.includes(LITERAL_CLOSE)) {
    return input;
  }
  const { text, restore } = protectLiterals(input, syntax);
  return restore(format(text)) ?? input;
}

function protectLiterals(input: string, syntax: LiteralSyntax): { text: string; restore: (formatted: string) => string | null } {
  const literals: string[] = [];
  const length = input.length;
  let text = '';
  let index = 0;
  let lastSignificant = '';
  let lastWord = '';

  const take = (end: number) => {
    literals.push(input.slice(index, end));
    text += `${LITERAL_OPEN}${(literals.length - 1).toString(36)}${LITERAL_CLOSE}`;
    index = end;
    lastSignificant = 'a';
    lastWord = '';
  };
  const lineEnd = (from: number) => {
    const end = input.indexOf('\n', from);
    return end === -1 ? length : end;
  };
  const quoted = (from: number, quote: string): number => {
    for (let j = from + 1; j < length; j++) {
      const char = input[j];
      if (char === '\\') {
        j++;
      } else if (char === quote) {
        return j + 1;
      } else if (char === '\n') {
        return j;
      }
    }
    return length;
  };
  const template = (from: number): number => {
    for (let j = from + 1; j < length; j++) {
      const char = input[j];
      if (char === '\\') {
        j++;
      } else if (char === '`') {
        return j + 1;
      } else if (char === '$' && input[j + 1] === '{') {
        let depth = 1;
        j += 2;
        while (j < length && depth > 0) {
          const inner = input[j];
          if (inner === '"' || inner === "'") {
            j = quoted(j, inner);
            continue;
          }
          if (inner === '`') {
            j = template(j);
            continue;
          }
          if (inner === '{') depth++;
          if (inner === '}') depth--;
          j++;
        }
        j--;
      }
    }
    return length;
  };
  const regexLiteral = (from: number): number => {
    let inClass = false;
    for (let j = from + 1; j < length; j++) {
      const char = input[j];
      if (char === '\n') return -1;
      if (char === '\\') {
        j++;
      } else if (inClass) {
        if (char === ']') inClass = false;
      } else if (char === '[') {
        inClass = true;
      } else if (char === '/') {
        j++;
        while (j < length && /[a-z]/i.test(input[j])) j++;
        return j;
      }
    }
    return -1;
  };
  const regexAllowed = () => {
    if (!lastSignificant) return true;
    if (/[\w$]/.test(lastSignificant)) return REGEX_AFTER_WORDS.has(lastWord);
    return lastSignificant !== ')' && lastSignificant !== ']';
  };

  while (index < length) {
    const char = input[index];
    const next = input[index + 1];

    if (syntax !== 'python' && char === '/' && next === '*') {
      const close = input.indexOf('*/', index + 2);
      take(close === -1 ? length : close + 2);
      continue;
    }
    if ((syntax === 'c' || syntax === 'js') && char === '/' && next === '/') {
      take(lineEnd(index));
      continue;
    }
    if (syntax === 'python' && char === '#') {
      take(lineEnd(index));
      continue;
    }
    if ((char === '"' || char === "'") && syntax !== 'jsx') {
      if (syntax === 'python' && input.startsWith(char.repeat(3), index)) {
        const close = input.indexOf(char.repeat(3), index + 3);
        take(close === -1 ? length : close + 3);
      } else {
        take(quoted(index, char));
      }
      continue;
    }
    if (char === '`' && syntax !== 'css' && syntax !== 'python') {
      take(template(index));
      continue;
    }
    if (syntax === 'js' && char === '/' && regexAllowed()) {
      const end = regexLiteral(index);
      if (end !== -1) {
        take(end);
        continue;
      }
    }
    if (syntax === 'css' && /^url\(/i.test(input.slice(index, index + 4))) {
      const close = input.indexOf(')', index + 4);
      if (close !== -1 && !input.slice(index, close).includes('\n')) {
        take(close + 1);
        continue;
      }
    }

    const previous = text[text.length - 1] ?? '';
    text += char;
    if (!/\s/.test(char)) {
      lastWord = /[\w$]/.test(char) ? (/[\w$]/.test(previous) ? lastWord + char : char) : '';
      lastSignificant = char;
    }
    index++;
  }

  const restore = (formatted: string): string | null => {
    const used = new Array<number>(literals.length).fill(0);
    const result = formatted.replace(LITERAL_PLACEHOLDER, (_, id: string) => {
      const position = parseInt(id, 36);
      used[position] = (used[position] ?? 0) + 1;
      return literals[position] ?? '';
    });
    return used.every((count) => count === 1) ? result : null;
  };

  return { text, restore };
}
