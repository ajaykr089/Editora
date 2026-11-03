import { toEmailHtml, toEmailText } from '../index';

const fragment = (html: string, options = {}) => toEmailHtml(html, { fragment: true, ...options });

describe('document', () => {
  const { html } = toEmailHtml('<p>Hello</p>', { title: 'Weekly', preheader: 'This week in short', lang: 'de', width: 640 });

  it('is a complete email document', () => {
    expect(html).toMatch(/^<!doctype html>/);
    expect(html).toContain('<html lang="de" dir="ltr"');
    expect(html).toContain('<title>Weekly</title>');
    expect(html).toContain('<meta name="x-apple-disable-message-reformatting">');
    expect(html).toContain('<o:PixelsPerInch>96</o:PixelsPerInch>');
  });

  it('centres a fixed-width column, with an Outlook-only table since Outlook ignores max-width', () => {
    expect(html).toContain('<!--[if mso]><table role="presentation" align="center" width="640"');
    expect(html).toContain('max-width:640px');
  });

  it('hides the preheader and pads it so body text does not leak into the inbox preview', () => {
    expect(html).toMatch(/<div style="display:none;[^"]*mso-hide:all;[^"]*">This week in short(&#847;&zwnj;&nbsp;)+<\/div>/);
  });

  it('uses the body of a whole document', () => {
    expect(fragment('<html><head><title>x</title><style>p{}</style></head><body><p>Only this</p></body></html>').html).toBe(
      fragment('<p>Only this</p>').html,
    );
  });
});

describe('text blocks', () => {
  it('inlines the theme on every block, since Outlook does not inherit fonts from tables', () => {
    const { html } = fragment('<h1>T</h1><p>a</p>');
    expect(html).toMatch(/<h1 style="margin:0 0 12px;font-family:[^"]+;font-size:30px;/);
    expect(html).toMatch(/<p style="[^"]*font-family:[^"]+;mso-line-height-rule:exactly;font-size:16px;line-height:26px;color:#1f2328/);
  });

  it('lets the content\'s own inline style win over the theme', () => {
    expect(fragment('<p style="color: red; font-size: 1.25rem">a</p>').html).toMatch(/color:red;font-size:20px/);
  });

  it('applies extra styles by selector and drops classes', () => {
    const { html } = fragment('<p class="lead">a</p><p>b</p>', { styles: { '.lead': 'font-size:20px', p: 'color:#333' } });
    expect(html).toContain('color:#333;font-size:20px">a</p>');
    expect(html).not.toContain('class=');
  });

  it('wraps loose text in a paragraph and keeps empty paragraphs as blank lines', () => {
    const { html } = fragment('Just text<p></p><p>b</p>');
    expect(html).toMatch(/^<p[^>]*>Just text<\/p><p[^>]*>&nbsp;<\/p><p/);
  });

  it('turns a div of text into a paragraph and a styled div into a table cell', () => {
    const { html } = fragment('<div>line</div><div style="background-color:#eef;padding:12px"><p>boxed</p></div>');
    expect(html).toMatch(/^<p[^>]*>line<\/p>/);
    expect(html).toContain('<td bgcolor="#eef" style="background-color:#eef;padding:12px">');
  });

  it('drops the last block\'s bottom margin so the column padding stays even', () => {
    expect(fragment('<p>a</p><p>b</p>').html).toMatch(/<p style="margin:0 0 16px;[^"]*">a<\/p><p style="margin:0 0 0 0;[^"]*">b<\/p>$/);
  });
});

describe('Outlook-safe blocks', () => {
  it('draws quotes with a bordered table cell', () => {
    expect(fragment('<blockquote><p>q</p></blockquote>').html).toContain('<td style="border-left:4px solid #d0d7de;padding:0 0 0 16px"><p');
  });

  it('draws rules as a bordered cell', () => {
    expect(fragment('<hr>').html).toContain('border-top:1px solid #d0d7de;font-size:0;line-height:0');
  });

  it('keeps code layout with &nbsp; and <br>, since Outlook ignores white-space: pre', () => {
    expect(fragment('<pre><code>if (a) {\n\treturn  1;\n}</code></pre>').html).toContain('if (a) {<br>&nbsp;&nbsp;&nbsp;&nbsp;return&nbsp;&nbsp;1;<br>}</td>');
  });

  it('makes buttons from links with class="button": padding on the cell so Outlook draws them', () => {
    const { html, warnings } = fragment('<p style="text-align:center"><a class="button" href="https://e.test" style="background-color:#111">Go</a></p>');
    expect(html).toContain('<td align="center" style="padding:0 0 0"><table role="presentation"');
    expect(html).toContain('<td align="center" bgcolor="#111" style="border-radius:6px;background-color:#111;padding:12px 24px;mso-padding-alt:12px 24px">');
    expect(warnings).toEqual([]);
  });

  it('warns about a button inside a line of text', () => {
    expect(fragment('<p>Click <a class="btn" href="https://e.test">here</a> now</p>').warnings).toEqual(['A button inside a line of text shows as a plain link in Outlook; put it in its own paragraph']);
  });

  it('keeps data tables with borders, spans and header cells', () => {
    const { html } = fragment('<table><thead><tr><th colspan="2">H</th></tr></thead><tbody><tr><td>a</td><td><p>b</p></td></tr></tbody></table>');
    expect(html).toContain('<table width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr><th colspan="2" bgcolor="#f3f4f6" align="left"');
    expect(html).toMatch(/border:1px solid #d0d7de;[^"]*">a<\/td>/);
  });

  it('leaves layout tables (role="presentation") without borders', () => {
    const { html } = fragment('<table role="presentation"><tr><td>a</td><td>b</td></tr></table>');
    expect(html).toContain('<table role="presentation" width="100%"');
    expect(html).not.toMatch(/border:1px solid/);
  });

  it('keeps list start numbers and shows task checkboxes as characters', () => {
    const { html } = fragment('<ol start="4"><li>a</li></ol><ul data-type="taskList"><li data-checked="true">done</li></ul>');
    expect(html).toContain('<ol start="4" style="margin:0 0 16px 24px;padding:0">');
    expect(html).toContain('list-style-type:none">&#9745;&nbsp;done</li>');
  });

  it('unwraps paragraphs in list items (Tiptap and ProseMirror output)', () => {
    expect(fragment('<ul><li><p>One</p></li></ul>').html).toMatch(/<li style="[^"]*">One<\/li>/);
  });
});

describe('images', () => {
  it('sets width for Outlook and scales oversized images to the column', () => {
    const { html, warnings } = fragment('<p><img src="https://e.test/a.png" alt="A" width="1072" height="400"></p>');
    expect(html).toContain('<img src="https://e.test/a.png" alt="A" width="536" height="200" style="display:block;');
    expect(warnings).toEqual([]);
  });

  it('reads the width from the style, and percentages of the column', () => {
    expect(fragment('<p><img src="https://e.test/a.png" alt="" style="width:300px"></p>').html).toContain('width="300"');
    expect(fragment('<p><img src="https://e.test/a.png" alt="" width="50%"></p>').html).toContain('width="268"');
  });

  it('warns about missing widths, alt text and data: images', () => {
    expect(fragment('<p><img src="data:image/png;base64,AAAA"></p>').warnings).toEqual([
      'Gmail and Outlook block data: images; host the image and use its URL',
      'Images without a width show at their natural size in Outlook; set width on the image',
      'Images need alt text: many clients block images until the reader allows them',
    ]);
  });

  it('keeps a linked image as a block, and inline images inline', () => {
    expect(fragment('<p><a href="https://e.test"><img src="https://e.test/a.png" alt="" width="10"></a></p>').html).toContain('<a href="https://e.test" style="text-decoration:none;"><img');
    expect(fragment('<p>Icon <img src="https://e.test/i.png" alt="" width="16"> here</p>').html).toContain('display:inline-block');
  });
});

describe('links and safety', () => {
  it('keeps merge tags: Editora tag spans become bare tokens, and tokens work as URLs', () => {
    const { html, text } = fragment('<p>Hi <span class="rte-merge-tag" data-token="{{ first_name }}" contenteditable="false">{{ first_name }}</span>, <a href="{{ unsubscribe_url }}">unsubscribe</a> or <a href="*|UPDATE_PROFILE|*">update</a></p>');
    expect(html).toContain('Hi {{ first_name }}, <a href="{{ unsubscribe_url }}"');
    expect(html).toContain('href="*|UPDATE_PROFILE|*"');
    expect(text).toBe('Hi {{ first_name }}, unsubscribe ({{ unsubscribe_url }}) or update (*|UPDATE_PROFILE|*)');
  });

  it('removes javascript: links, scripts and event handlers', () => {
    const { html, warnings } = fragment('<p onclick="x()"><a href="javascript:alert(1)">a</a></p><script>alert(1)</script><style>p{}</style>');
    expect(html).not.toMatch(/javascript|alert|onclick/);
    expect(warnings).toEqual(['Removed a javascript: link']);
  });

  it('resolves relative URLs against baseUrl, and warns without one', () => {
    expect(fragment('<p><a href="/pricing">p</a></p>', { baseUrl: 'https://e.test/blog/' }).html).toContain('href="https://e.test/pricing"');
    expect(fragment('<p><a href="/pricing">p</a></p>').warnings).toEqual(['Relative link URLs do not work in email; pass baseUrl (found "/pricing")']);
  });

  it('escapes text and attributes', () => {
    expect(fragment('<p title="a&quot;b">&lt;b&gt; &amp;</p>').html).toMatch(/<p title="a&quot;b" style="[^"]*">&lt;b&gt; &amp;<\/p>/);
  });

  it('replaces embeds with a link', () => {
    const { html, warnings } = fragment('<iframe src="https://www.youtube.com/embed/x" title="Launch video"></iframe>');
    expect(html).toContain('<a href="https://www.youtube.com/embed/x" style="color:#0b57d0;text-decoration:underline">Launch video</a>');
    expect(warnings).toEqual(['Embedded frames and videos do not play in email; they were replaced by a link']);
  });
});

describe('CSS clients ignore', () => {
  it('removes layout CSS and reports it once', () => {
    const { html, warnings } = fragment('<div style="display:flex;gap:8px;position:relative;box-shadow:0 0 2px #000;padding:8px">x</div><div style="display:flex">y</div>');
    expect(html).not.toMatch(/flex|gap|position|box-shadow/);
    expect(warnings).toEqual([
      'Flexbox and grid layouts are not supported by Outlook or Gmail; use tables for columns ("display" was removed) (2 times)',
      'flex and grid gaps are not supported by Gmail or Outlook; "gap" was removed',
      'Positioning is not supported by Gmail or Outlook; "position" was removed',
      'Box shadows are not supported by Outlook or Gmail on Android; "box-shadow" was removed',
    ]);
  });

  it('resolves CSS variables to their fallback and drops ones without', () => {
    const { html, warnings } = fragment('<p style="color:var(--brand, #c00);background-color:var(--bg)">a</p>');
    expect(html).toContain('color:#c00');
    expect(html).not.toContain('var(');
    expect(warnings).toEqual(['CSS variables are not supported by Gmail or Outlook; "background-color" was removed']);
  });

  it('warns when the email is big enough for Gmail to clip it', () => {
    const { warnings, size } = fragment(`<p>${'x'.repeat(110 * 1024)}</p>`);
    expect(size).toBeGreaterThan(102 * 1024);
    expect(warnings[0]).toMatch(/Gmail clips messages over 102 KB/);
  });
});

describe('plain text', () => {
  it('keeps structure, links and list markers', () => {
    expect(
      toEmailText(`<h1>Title</h1><p>Read <a href="https://e.test/a">the post</a> or mail <a href="mailto:hi@e.test">hi@e.test</a>.<br>Thanks</p>
        <ul><li><p>One</p><ul><li>Nested</li></ul></li><li>Two</li></ul><ol start="3"><li>Three</li></ol>
        <blockquote><p>Quote</p></blockquote><hr><table><tr><th>A</th><th>B</th></tr><tr><td>1</td><td>2</td></tr></table>
        <p><img src="https://e.test/x.png" alt="Chart"></p><pre><code>a\n  b</code></pre>`),
    ).toBe(`Title
=====

Read the post (https://e.test/a) or mail hi@e.test.
Thanks

- One
  - Nested
- Two

3. Three

> Quote

----------

A | B
1 | 2

[Chart]

a
  b`);
  });
});
