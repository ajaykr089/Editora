import { readFileSync } from 'fs';
import { join } from 'path';
import { checkContent, fixContent, RULES } from '../check';
import { contrastRatio, nearestPassingColor, parseColor } from '../color';

const rulesFor = (html: string, options = {}) => checkContent(html, options).issues.map((issue) => issue.rule);
const fixture = readFileSync(join(__dirname, 'fixtures', 'problems.html'), 'utf8');

describe('rules', () => {
  it('every rule has an id, title and level', () => {
    for (const rule of RULES) {
      expect(rule.id).toMatch(/^[a-z]+(-[a-z0-9]+)+$/);
      expect(rule.title.length).toBeGreaterThan(10);
      if (rule.level !== 'best-practice') expect(rule.wcag).toMatch(/^\d\.\d\.\d+$/);
    }
    expect(new Set(RULES.map((rule) => rule.id)).size).toBe(RULES.length);
  });

  it('finds every planted problem in the sample, in document order', () => {
    const result = checkContent(fixture, { minHeadingLevel: 2 });
    expect(result.issues.map((issue) => issue.rule)).toEqual([
      'heading-too-high', 'heading-skip', 'image-alt-filename', 'image-alt-missing', 'image-alt-redundant',
      'image-link-alt', 'link-generic-text', 'link-empty', 'link-url-text', 'link-file-type', 'link-new-window',
      'heading-fake', 'list-fake', 'heading-empty', 'text-all-caps', 'text-contrast', 'text-underline',
      'empty-paragraphs', 'table-headers', 'iframe-title', 'media-captions',
    ]);
    expect({ errors: result.errors, warnings: result.warnings, infos: result.infos }).toEqual({ errors: 8, warnings: 10, infos: 3 });
  });

  it('passes clean content', () => {
    const clean = `<h2>Plans</h2><p>Read the <a href="/pricing">2026 pricing guide (PDF)</a>.</p>
      <p><img src="a.png" alt="Sales grew 12% from March to June"><img src="line.png" alt=""></p>
      <h3>Teams</h3><ul><li>One</li><li>Two</li></ul>
      <table><thead><tr><th>Team</th><th>Size</th></tr></thead><tbody><tr><td>A</td><td>3</td></tr></tbody></table>
      <p><span style="color: #595959">Readable grey.</span> NASA and the EU agreed.</p>
      <iframe src="https://x" title="Video: product tour"></iframe>`;
    expect(rulesFor(clean, { minHeadingLevel: 2 })).toEqual([]);
  });

  it('images: missing, file name, generic word, too long', () => {
    expect(rulesFor('<img src="x.png">')).toEqual(['image-alt-missing']);
    expect(rulesFor('<img src="/a/DSC_0042.jpg" alt="DSC_0042.jpg">')).toEqual(['image-alt-filename']);
    expect(rulesFor('<img src="a.png" alt="photo">')).toEqual(['image-alt-filename']);
    expect(rulesFor('<img src="a.png" alt="team.png">')).toEqual(['image-alt-filename']);
    expect(rulesFor(`<img src="a.png" alt="${'x '.repeat(80)}">`)).toEqual(['image-alt-long']);
    expect(rulesFor('<img src="a.png" alt="" role="presentation"><img src="b.png" aria-hidden="true">')).toEqual([]);
  });

  it('links: empty, generic, long URL, new tab, file type, same text', () => {
    expect(rulesFor('<p><a href="/x"></a></p>')).toEqual(['link-empty']);
    expect(rulesFor('<p><a href="/x">Click here.</a></p>')).toEqual(['link-generic-text']);
    expect(rulesFor('<p><a href="/x">Read more →</a></p>')).toEqual(['link-generic-text']);
    expect(rulesFor('<p><a href="/x" aria-label="Read more about pricing">Read more</a></p>')).toEqual([]);
    expect(rulesFor('<p><a href="/x" target="_blank">Partner site (opens in a new tab)</a></p>')).toEqual([]);
    expect(rulesFor('<p><a href="/files/a.docx">Budget</a> <a href="/b.pdf">Budget PDF</a></p>')).toEqual(['link-file-type']);
    expect(rulesFor('<p><a href="/a">Pricing</a> <a href="/b">Pricing</a></p>')).toEqual(['link-same-text']);
    expect(rulesFor('<p><a href="/a">Pricing</a> <a href="/a/">Pricing</a></p>')).toEqual([]);
  });

  it('headings: empty, skipped levels, fake, too long, start level', () => {
    expect(rulesFor('<h2>A</h2><h4>B</h4>')).toEqual(['heading-skip']);
    expect(rulesFor('<h3>Starts low</h3><h4>B</h4>')).toEqual([]); // Start level unknown: any first level is fine.
    expect(rulesFor('<h3>Starts low</h3>', { minHeadingLevel: 2 })).toEqual(['heading-skip']);
    expect(rulesFor('<h2>A</h2><h3>B</h3><h2>C</h2><h3>D</h3>')).toEqual([]);
    expect(rulesFor('<h1>Title</h1>', { minHeadingLevel: 2 })).toEqual(['heading-too-high']);
    expect(rulesFor('<p><b>Summary</b></p><p>Text.</p>')).toEqual(['heading-fake']);
    expect(rulesFor('<p><b>Note:</b></p><p>Text.</p>')).toEqual([]); // Ends in punctuation: a lead-in, not a heading.
    expect(rulesFor('<p><b>One</b></p><p><b>Two</b></p>')).toEqual([]); // A run of bold lines.
    expect(rulesFor(`<h2>${'word '.repeat(40)}</h2>`)).toEqual(['heading-long']);
  });

  it('lists and tables', () => {
    expect(rulesFor('<p>1. One</p><p>2. Two</p>')).toEqual(['list-fake']);
    expect(rulesFor('<p>- Only one dash line</p>')).toEqual([]);
    expect(rulesFor('<table><tr><th></th><th>Q1</th></tr><tr><th>Sales</th><td>3</td></tr></table>')).toEqual(['table-empty-header']);
    expect(rulesFor('<table role="presentation"><tr><td>a</td><td>b</td></tr><tr><td>c</td><td>d</td></tr></table>')).toEqual([]);
  });

  it('text: caps, underline, empty paragraphs, contrast with large-text threshold', () => {
    expect(rulesFor('<p>THIS IS VERY LOUD TEXT</p>')).toEqual(['text-all-caps']);
    expect(rulesFor('<p>The NASA and EU deal.</p>')).toEqual([]);
    expect(rulesFor('<p><u>Look</u> <a href="/x"><u>Pricing</u></a></p>')).toEqual(['text-underline']);
    expect(rulesFor('<p>a</p><p></p><p>&nbsp;</p><p>b</p>')).toEqual(['empty-paragraphs']);
    expect(rulesFor('<p><span style="color:#949494">grey</span></p>')).toEqual(['text-contrast']);
    // 3.03:1 passes only as large text.
    expect(rulesFor('<p><span style="color:#949494;font-size:24px">big grey</span></p>')).toEqual([]);
    expect(rulesFor('<p style="background-color:#1d1d24"><span style="color:#333">dark on dark</span></p>')).toEqual(['text-contrast']);
    expect(rulesFor('<p><span style="color:#949494">grey</span></p>', { background: '#000' })).toEqual([]);
  });

  it('rule settings: off, severity, messages, extra generic text', () => {
    const result = checkContent('<img src="x.png"><p><a href="/x">Go now</a></p>', {
      rules: { 'image-alt-missing': 'warning' },
      messages: { 'image-alt-missing': 'Describe it.' },
      genericLinkText: ['go now'],
    });
    expect(result.issues.map((issue) => [issue.rule, issue.severity, issue.message])).toEqual([
      ['image-alt-missing', 'warning', 'Describe it.'],
      ['link-generic-text', 'warning', 'The link text "Go now" does not say where it goes.'],
    ]);
    expect(rulesFor('<img src="x.png">', { rules: { 'image-alt-missing': 'off' } })).toEqual([]);
  });
});

describe('fixes', () => {
  it('applies only the safe fixes by default', () => {
    const result = fixContent(fixture, { minHeadingLevel: 2 });
    expect(result.applied.map((item) => item.rule)).toEqual(['image-alt-redundant', 'link-empty', 'heading-empty', 'empty-paragraphs']);
    expect(result.html).toContain('alt="A bar chart showing sales"');
    expect(result.html).not.toContain('<a href="/a">');
    expect(result.html).not.toMatch(/<h2><\/h2>|<p><\/p>/);
  });

  it('never marks images decorative or rewrites text that needs a person', () => {
    const result = fixContent(fixture, { minHeadingLevel: 2, kinds: ['auto', 'suggested'] });
    expect(result.html).toContain('<img src="/team.jpg">');
    expect(result.html).toContain('alt="IMG_4031.JPG"');
    expect(result.html).toContain('target="_blank"');
    expect(result.remaining.map((issue) => issue.rule)).toEqual(
      expect.arrayContaining(['image-alt-filename', 'image-alt-missing', 'image-link-alt', 'link-generic-text', 'iframe-title']),
    );
  });

  it('applies suggested fixes when asked: outline, lists, tables, labels, contrast', () => {
    const { html } = fixContent(fixture, { minHeadingLevel: 2, kinds: ['auto', 'suggested'] });
    expect(html).toContain('<h2>Spring newsletter</h2>');
    expect(html).toContain('<h2>From the team</h2>');
    expect(html).toContain('<h3>Upcoming events</h3>');
    expect(html).toContain('<ul><li>Workshop on Monday</li><li>Meetup on Wednesday</li><li>Demo day on Friday</li></ul>');
    expect(html).toContain('<thead><tr><th scope="col">Event</th><th scope="col">Day</th></tr></thead>');
    expect(html).toContain('Download the plan (PDF)');
    expect(html).toContain('visit our partner (opens in a new tab)');
    expect(html).toContain('<p>Please register before the end of march</p>');
    const color = html.match(/color: (#[0-9a-f]{6})/)![1];
    expect(contrastRatio(parseColor(color)!, [255, 255, 255, 1])).toBeGreaterThanOrEqual(4.5);
  });

  it('fixes that need text take it as input', () => {
    const result = checkContent('<p><img src="x.png"></p>');
    const fix = result.issues[0].fixes.find((candidate) => candidate.input)!;
    fix.apply('A red bicycle');
    expect(result.html()).toBe('<p><img src="x.png" alt="A red bicycle"></p>');
  });
});

describe('contrast maths', () => {
  it('matches WCAG reference values', () => {
    expect(contrastRatio(parseColor('#000')!, parseColor('#fff')!)).toBeCloseTo(21, 1);
    expect(contrastRatio(parseColor('#767676')!, parseColor('white')!)).toBeCloseTo(4.54, 2);
    expect(contrastRatio(parseColor('rgb(119,119,119)')!, parseColor('#ffffff')!)).toBeCloseTo(4.48, 2);
    expect(contrastRatio(parseColor('hsl(0, 0%, 46.3%)')!, parseColor('#fff')!)).toBeGreaterThan(4.5);
  });

  it('suggests the nearest passing colour in the same hue', () => {
    const better = nearestPassingColor(parseColor('#ff8080')!, [255, 255, 255, 1], 4.5)!;
    expect(contrastRatio(parseColor(better)!, [255, 255, 255, 1])).toBeGreaterThanOrEqual(4.5);
    const [r, , b] = parseColor(better)!;
    expect(r).toBeGreaterThan(b); // Still red.
  });
});
