import { describe, expect, it } from 'vitest';
import { formatCss, formatLightweightCode } from '../extensions/LightweightFormatter';

// The lightweight formatter works line by line and did not know where strings, template literals, regular
// expressions and comments were. It split them at "{", ";" and "[{", and re-indented the lines of multi-line
// literals, which changed what the code does. It may only move whitespace that is not part of a literal.

describe('formatLightweightCode keeps literals as they are', () => {
  it('does not re-indent the lines of a template literal', () => {
    const input = 'const t = `line1\n  keep { this }\n    indent`;\nif (x) {\ny();\n}';
    expect(formatLightweightCode(input)).toBe('const t = `line1\n  keep { this }\n    indent`;\nif (x) {\n  y();\n}');
  });

  it('does not split a regular-expression literal at "[{"', () => {
    expect(formatLightweightCode('const r = /[{]/g;\nif (a) {\nb();\n}')).toBe('const r = /[{]/g;\nif (a) {\n  b();\n}');
  });

  it('tells division from a regular expression', () => {
    const input = 'const a = b / c / d;\nfunction f(s) {\nreturn /x{2}/.test(s);\n}';
    expect(formatLightweightCode(input)).toBe('const a = b / c / d;\nfunction f(s) {\n  return /x{2}/.test(s);\n}');
  });

  it('ignores braces in comments when indenting', () => {
    const input = 'function f() {\n// a { brace\n/* } */\nreturn 1;\n}';
    expect(formatLightweightCode(input)).toBe('function f() {\n  // a { brace\n  /* } */\n  return 1;\n}');
  });

  it('keeps a multi-line JSDoc comment and a string with "[{" intact', () => {
    const input = 'function f() {\nconst s = "[{x}, {y}]";\n/**\n   * Keep me.\n   */\nreturn s;\n}';
    const output = formatLightweightCode(input);
    expect(output).toContain('const s = "[{x}, {y}]";');
    expect(output).toContain('/**\n   * Keep me.\n   */');
  });

  it('keeps the text of a template literal in JSX', () => {
    const input = 'export const A = () => {\nconst t = `x\n        y`;\nreturn (\n<div className="a">\n<p>{t}</p>\n</div>\n);\n};';
    expect(formatLightweightCode(input)).toContain('const t = `x\n        y`;');
  });

  it('keeps a Python docstring, and indents after a line that ends in a comment', () => {
    const input = 'def f():\n    """Doc.\n\n      indented line\n    """\n    if x:  # note\n        return 1';
    expect(formatLightweightCode(input)).toBe(input);
  });

  it('keeps the whitespace of <pre> and <textarea>', () => {
    const output = formatLightweightCode('<div><pre>  keep\n    this</pre><textarea>  a\n b</textarea></div>');
    expect(output).toContain('<pre>  keep\n    this</pre>');
    expect(output).toContain('<textarea>  a\n b</textarea>');
  });

  it('keeps a template literal inside a <script> block', () => {
    const output = formatLightweightCode('<div>\n<script>\nconst t = `a\n      b`;\n</script>\n</div>');
    expect(output).toContain('const t = `a\n      b`;');
  });

  it('keeps a Markdown line break (two trailing spaces)', () => {
    expect(formatLightweightCode('# T\n\nline one   \nline two \nend')).toBe('# T\n\nline one  \nline two\nend');
  });

  it('only ever changes whitespace', () => {
    const samples = [
      'const a = { b: "}", c: `${d + "{"}` };\nif (a) {\nb(/[}]/);\n}',
      'func main() {\n\tfmt.Println("{ not a block")\n}',
      'a{content:"{;}";background:url(x.png)}',
      'def f():\n    s = "#not: a comment"\n    return s',
    ];
    for (const sample of samples) {
      expect(formatLightweightCode(sample).replace(/\s+/g, '')).toBe(sample.replace(/\s+/g, ''));
    }
  });
});

describe('formatCss keeps strings, comments and url() together', () => {
  it('does not split a string at ";" or "{"', () => {
    expect(formatCss('a::before{content:"{;}"}')).toBe('a::before {\n  content:"{;}"\n}');
    expect(formatCss('a{background:url("x;y");color:red}')).toBe('a {\n  background:url("x;y");\n  color:red\n}');
  });

  it('does not split an unquoted data: URL', () => {
    expect(formatCss('a{background:url(data:image/png;base64,AAAA);color:red}')).toBe(
      'a {\n  background:url(data:image/png;base64,AAAA);\n  color:red\n}',
    );
  });

  it('leaves no blank line before a closing brace', () => {
    expect(formatCss('@media (max-width: 1px){b{c:d}}')).toBe('@media (max-width: 1px) {\n  b {\n    c:d\n  }\n}');
  });
});
