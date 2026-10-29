import { readFileSync } from 'fs';
import { join } from 'path';
import { cleanPaste } from '../clean';
import { detectSource } from '../detect';

const fixture = (name: string) => readFileSync(join(__dirname, 'fixtures', name), 'utf8');
const [sheetsHtml, excelHtml] = fixture('sheets-excel.html').split('<!-- excel -->');

describe('Word (desktop)', () => {
  const result = cleanPaste({ html: fixture('word-desktop.html') });

  it('rebuilds nested bullet and numbered lists from mso-list paragraphs', () => {
    expect(result.source).toBe('word');
    expect(result.html).toContain(
      '<ul><li>New customers in three regions<ul><li>Europe and <strong>Asia</strong></li></ul></li><li>Lower support costs</li></ul>',
    );
    expect(result.html).toContain('<ol><li>Hire two engineers<ol><li>Backend</li></ol></li><li>Launch in May</li></ol>');
    expect(result.html).not.toMatch(/·|mso|Mso|o:p|class=|style=/);
  });

  it('keeps headings, formatting and links; drops blank lines', () => {
    expect(result.html.startsWith('<h1>Quarterly report</h1><h1>Summary</h1><p>Revenue grew <strong>12%</strong> this quarter, and <em>churn</em> fell to 3.1%. See <a href="https://example.com/report">the full report</a>.</p>')).toBe(true);
    expect(result.html).not.toContain('<p></p>');
  });

  it('turns a bold first table row into a header row', () => {
    expect(result.html).toContain('<table><thead><tr><th>Region</th><th>Growth</th></tr></thead><tbody><tr><td>Europe</td><td>18%</td></tr></tbody></table>');
  });

  it('reports images that point at the author\'s disk', () => {
    expect(result.images).toEqual([expect.objectContaining({ alt: 'Chart', status: 'local-file' })]);
    expect(result.html).not.toContain('<img');
    expect(result.warnings[0]).toMatch(/1 image pointed at files/);
  });

  it('handles Mac Word markers and lists without a stylesheet', () => {
    const html = `<p class=MsoListParagraph style='text-indent:-.25in;mso-list:l0 level1 lfo1'><![if !supportLists]><span style='mso-list:Ignore'>1.<span>&nbsp;&nbsp; </span></span><![endif]>One</p>
<p class=MsoListParagraph style='text-indent:-.25in;mso-list:l0 level1 lfo1'><![if !supportLists]><span style='mso-list:Ignore'>2.<span>&nbsp;&nbsp; </span></span><![endif]>Two</p>`;
    expect(cleanPaste(html).html).toBe('<ol><li>One</li><li>Two</li></ol>');
  });

  it('accepts tracked deletions and insertions', () => {
    expect(cleanPaste('<p class=MsoNormal>Keep <del cite="mailto:ajay" datetime="2026-01-01">gone</del><ins cite="mailto:ajay">new</ins></p>').html).toBe('<p>Keep <u>new</u></p>');
  });
});

describe('Word for the web', () => {
  it('merges one-item lists and nests them by level', () => {
    const result = cleanPaste(fixture('word-online.html'));
    expect(result.source).toBe('word-online');
    expect(result.html).toBe('<p>Plain and <strong>bold</strong></p><ul><li>First item<ul><li>Nested item</li></ul></li><li>Second item</li></ul>');
  });
});

describe('Google Docs', () => {
  const result = cleanPaste(fixture('google-docs.html'));

  it('drops the bold wrapper and maps inline styles to tags', () => {
    expect(result.source).toBe('google-docs');
    expect(result.html).toContain('<h1>Launch checklist</h1><p>The launch is <strong>next Tuesday</strong><em>, pending review</em>. Details are in <a href="https://example.com/spec?v=2">the spec</a>. E=mc<sup>2</sup></p>');
  });

  it('moves misplaced nested lists into their parent item', () => {
    expect(result.html).toContain('<ul><li>Final copy<ul><li>Legal sign-off</li></ul></li><li>Screenshots <s>for the app store</s></li></ul><ol><li>Freeze the build</li></ol>');
  });

  it('cleans the table and removes layout <br>s', () => {
    expect(result.html).toContain('<table><thead><tr><th>Owner</th><th>Task</th></tr></thead><tbody><tr><td>Priya</td><td>Release notes</td></tr></tbody></table>');
    expect(result.html).not.toContain('<br>');
  });
});

describe('spreadsheets', () => {
  it('Google Sheets: header row, alignment, line breaks in cells', () => {
    const result = cleanPaste(sheetsHtml);
    expect(result.source).toBe('google-sheets');
    expect(result.html).toBe(
      '<table><thead><tr><th>Item</th><th>Total</th></tr></thead><tbody><tr><td style="text-align: right">3</td><td style="text-align: right">6</td></tr><tr><td>Two<br>lines</td><td></td></tr></tbody></table>',
    );
  });

  it('Excel: formatting from stylesheet classes and align attributes', () => {
    const result = cleanPaste(excelHtml);
    expect(result.source).toBe('excel');
    expect(result.html).toBe(
      '<table><thead><tr><th>Region</th><th>Revenue</th></tr></thead><tbody><tr><td>North</td><td style="text-align: right">$1,200.00</td></tr><tr><td><em>South (est.)</em></td><td style="text-align: right">$950.00</td></tr></tbody></table>',
    );
    expect(result.text).toBe('Region\tRevenue\nNorth\t$1,200.00\nSouth (est.)\t$950.00');
  });

  it('can flatten tables', () => {
    expect(cleanPaste(excelHtml, { keepTables: false }).html).toContain('<p>North — $1,200.00</p>');
  });
});

describe('Apple (TextEdit / Pages, real Cocoa HTML)', () => {
  it('recovers the heading from the stylesheet font size and fixes nested lists', () => {
    const result = cleanPaste(fixture('apple-textedit.html'));
    expect(result.source).toBe('apple');
    expect(result.html).toBe(
      '<h1>Trip plan</h1><p>We leave on <strong>Friday</strong> at <em>8am</em>, see <a href="https://example.com/map">the map</a>.</p><ul><li>Pack snacks</li><li>Charge phones<ul><li>Bring the cable</li></ul></li></ul><ol><li>Drive north</li><li>Stop at the lake</li></ol><table><tbody><tr><td>Day</td><td>Place</td></tr><tr><td>Fri</td><td>Lake</td></tr></tbody></table>',
    );
  });

  it('can leave headings alone', () => {
    expect(cleanPaste(fixture('apple-textedit.html'), { inferHeadings: false }).html.startsWith('<p><strong>Trip plan</strong></p>')).toBe(true);
  });
});

describe('web pages and code', () => {
  it('strips computed styles from a browser copy but keeps semantics', () => {
    const result = cleanPaste(fixture('web-chrome.html'));
    expect(result.source).toBe('web');
    expect(result.html).toBe(
      '<h2>Getting started</h2><p>Install the <code>cli</code> with <strong>npm</strong>, then read <a href="https://github.com/ajaykr089/Editora#readme">the docs</a>.</p><pre>npm install @editora/core\n# then\nnpx editora init</pre><p>Trailing inline text</p>',
    );
  });

  it('turns a VS Code copy into one code block', () => {
    const result = cleanPaste(fixture('vscode.html'));
    expect(result.source).toBe('vscode');
    expect(result.html).toBe(
      "<pre><code>import { cleanPaste } from '@editora/paste-cleaner';\n\nconst html = cleanPaste(input).html;\n  // &lt;b&gt;indented&lt;/b&gt;</code></pre>",
    );
  });

  it('keeps an inline fragment inline', () => {
    const result = cleanPaste('mid<b>dle</b> of a<br>sentence');
    expect(result).toMatchObject({ html: 'mid<strong>dle</strong> of a<br>sentence', inline: true });
  });

  it('keeps colours only when asked', () => {
    const html = '<p><span style="color:#c00;background-color:yellow">red</span> <span style="color:black">plain</span></p>';
    expect(cleanPaste(html).html).toBe('<p>red plain</p>');
    expect(cleanPaste(html, { keepColors: true }).html).toBe('<p><span style="color: #c00; background-color: yellow">red</span> plain</p>');
  });
});

describe('security', () => {
  const result = cleanPaste(fixture('xss.html'), { keepColors: true });

  it('removes every script vector', () => {
    expect(result.html).not.toMatch(/on\w+=|javascript:|vbscript:|data:text|<script|<svg|<math|<iframe|<object|<embed|<form|<input|<button|<style|<meta|<template|<noscript|url\(|expression|srcset|ping=|target=/i);
  });

  it('keeps the harmless content', () => {
    expect(result.html).toBe(
      '<p>Click me or me or me or me.</p><p><img src="x"><img src="https://example.com/ok.png" alt="ok"></p><p>Styled</p><p><a href="https://example.com">Safe link</a></p><p><span style="color: red">Kept text</span></p>',
    );
    expect(result.images.map((image) => image.status)).toEqual(['kept', 'unsafe', 'kept']);
  });

  it('allows only raster data: images, and only when enabled', () => {
    const png = '<img src="data:image/png;base64,iVBORw0KGgo=">';
    expect(cleanPaste(png).html).toBe(png);
    expect(cleanPaste(png, { allowDataImages: false }).html).toBe('');
  });
});

describe('plain text and Markdown', () => {
  it('converts Markdown with nested lists, tables, code and quotes', () => {
    const text = '## Plan\n\nWe **ship** on *Friday*, see [docs](https://x.dev) and `npm i`.\n\n- one\n  - nested\n- two\n\n1. first\n2. second\n\n| Name | Qty |\n|---|--:|\n| a | 1 |\n\n```js\nconst a = 1 < 2;\n```\n\n> quoted';
    const result = cleanPaste({ text });
    expect(result.source).toBe('markdown');
    expect(result.html).toBe(
      '<h2>Plan</h2><p>We <strong>ship</strong> on <em>Friday</em>, see <a href="https://x.dev">docs</a> and <code>npm i</code>.</p><ul><li>one<ul><li>nested</li></ul></li><li>two</li></ul><ol><li>first</li><li>second</li></ol><table><thead><tr><th>Name</th><th style="text-align: right">Qty</th></tr></thead><tbody><tr><td>a</td><td style="text-align: right">1</td></tr></tbody></table><pre><code class="language-js">const a = 1 &lt; 2;</code></pre><blockquote><p>quoted</p></blockquote>',
    );
  });

  it('leaves ordinary text alone and links bare URLs', () => {
    expect(cleanPaste({ text: 'Costs - about 3 dollars.\nSee https://example.com/a?b=1.\n\nNext' }).html).toBe(
      '<p>Costs - about 3 dollars.<br>See <a href="https://example.com/a?b=1">https://example.com/a?b=1</a>.</p><p>Next</p>',
    );
    expect(cleanPaste({ text: 'just a phrase' })).toMatchObject({ html: 'just a phrase', inline: true, source: 'plain' });
  });

  it('never lets Markdown inject HTML or script links', () => {
    const html = cleanPaste({ text: '# <img src=x onerror=alert(1)>\n\n[x](javascript:alert(1)) **<b>**' }).html;
    expect(html).toBe('<h1>&lt;img src=x onerror=alert(1)&gt;</h1><p>x <strong>&lt;b&gt;</strong></p>');
  });

  it('pastes HTML as plain paragraphs in plain-text mode', () => {
    expect(cleanPaste(fixture('google-docs.html'), { plainText: true }).html.startsWith('<p>Launch checklist</p><p>The launch is next Tuesday, pending review.')).toBe(true);
  });
});

describe('detectSource', () => {
  it('recognises each app', () => {
    expect(detectSource(fixture('word-desktop.html'))).toBe('word');
    expect(detectSource(fixture('google-docs.html'))).toBe('google-docs');
    expect(detectSource('<p>hi</p>')).toBe('web');
    expect(detectSource('<p class="msonormal-ish">hi</p>')).toBe('web');
  });
});

describe('Markdown links', () => {
  it('keeps parentheses inside link targets', () => {
    expect(cleanPaste({ text: '## See\n\n[Mercury](https://en.wikipedia.org/wiki/Mercury_(planet)) now' }).html).toBe(
      '<h2>See</h2><p><a href="https://en.wikipedia.org/wiki/Mercury_(planet)">Mercury</a> now</p>',
    );
  });
});
