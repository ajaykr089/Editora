import { readDocx } from '../index.js';
import { utf8, zip } from '../zip.js';

// Builds a minimal .docx around hand-written parts, to cover markup Word writes but the tools in fixtures/ do not.
const W = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
async function makeDocx(body: string, parts: { numbering?: string; styles?: string } = {}): Promise<Uint8Array> {
  const rels = [
    parts.styles ? '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' : '',
    parts.numbering ? '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>' : '',
    '<Relationship Id="rId9" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="https://example.com/rel" TargetMode="External"/>',
  ].join('');
  const files: Array<[string, Uint8Array]> = [
    ['[Content_Types].xml', utf8('<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>')],
    ['_rels/.rels', utf8('<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')],
    ['word/document.xml', utf8(`<?xml version="1.0"?><w:document ${W}><w:body>${body}</w:body></w:document>`)],
    ['word/_rels/document.xml.rels', utf8(`<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${rels}</Relationships>`)],
  ];
  if (parts.styles) files.push(['word/styles.xml', utf8(`<?xml version="1.0"?><w:styles ${W}>${parts.styles}</w:styles>`)]);
  if (parts.numbering) files.push(['word/numbering.xml', utf8(`<?xml version="1.0"?><w:numbering ${W}>${parts.numbering}</w:numbering>`)]);
  return zip(files);
}

const p = (text: string, pPr = '') => `<w:p>${pPr ? `<w:pPr>${pPr}</w:pPr>` : ''}<w:r><w:t xml:space="preserve">${text}</w:t></w:r></w:p>`;
const numPr = (numId: number, ilvl = 0) => `<w:numPr><w:ilvl w:val="${ilvl}"/><w:numId w:val="${numId}"/></w:numPr>`;
const lvl = (ilvl: number, format: string, start = 1) => `<w:lvl w:ilvl="${ilvl}"><w:start w:val="${start}"/><w:numFmt w:val="${format}"/><w:lvlText w:val="%${ilvl + 1}."/></w:lvl>`;

describe('Word markup', () => {
  it('reads lists defined through a list style (numStyleLink), as corporate templates do', async () => {
    const numbering = [
      // The definition with the levels, linked to the list style...
      `<w:abstractNum w:abstractNumId="1"><w:styleLink w:val="LegalList"/>${lvl(0, 'decimal')}${lvl(1, 'lowerLetter')}</w:abstractNum>`,
      // ...and the one paragraphs use, which only points at the style.
      '<w:abstractNum w:abstractNumId="2"><w:numStyleLink w:val="LegalList"/></w:abstractNum>',
      '<w:num w:numId="1"><w:abstractNumId w:val="1"/></w:num>',
      '<w:num w:numId="2"><w:abstractNumId w:val="2"/></w:num>',
    ].join('');
    const styles = `<w:style w:type="numbering" w:styleId="LegalList"><w:name w:val="Legal List"/><w:pPr>${numPr(1)}</w:pPr></w:style>`;
    const { doc } = await readDocx(await makeDocx(p('Clause', numPr(2)) + p('Sub clause', numPr(2, 1)), { numbering, styles }));
    expect(doc.children).toEqual([
      { type: 'list', ordered: true, items: [{ children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Clause' }] }, { type: 'list', ordered: true, items: [{ children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Sub clause' }] }] }] }] }] },
    ]);
  });

  it('reads numbering from a paragraph style, and level overrides', async () => {
    const numbering = [
      `<w:abstractNum w:abstractNumId="1">${lvl(0, 'bullet')}</w:abstractNum>`,
      '<w:num w:numId="1"><w:abstractNumId w:val="1"/></w:num>',
      // Same definition, but this instance turns level 0 into numbers starting at 5.
      `<w:num w:numId="2"><w:abstractNumId w:val="1"/><w:lvlOverride w:ilvl="0">${lvl(0, 'decimal')}<w:startOverride w:val="5"/></w:lvlOverride></w:num>`,
    ].join('');
    const styles = `<w:style w:type="paragraph" w:styleId="Bulleted"><w:name w:val="Bulleted"/><w:pPr>${numPr(1)}</w:pPr></w:style>`;
    const { doc } = await readDocx(await makeDocx(p('Styled bullet', '<w:pStyle w:val="Bulleted"/>') + p('Plain') + p('Five', numPr(2)), { numbering, styles }));
    expect(doc.children).toEqual([
      { type: 'list', ordered: false, items: [{ children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Styled bullet' }] }] }] },
      { type: 'paragraph', children: [{ type: 'text', text: 'Plain' }] },
      { type: 'list', ordered: true, start: 5, items: [{ children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Five' }] }] }] },
    ]);
  });

  it('reads headings from custom styles based on Heading styles', async () => {
    const styles = '<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/></w:style><w:style w:type="paragraph" w:styleId="ReportSection"><w:name w:val="Report Section"/><w:basedOn w:val="Heading2"/></w:style>';
    const { doc } = await readDocx(await makeDocx(p('Section', '<w:pStyle w:val="ReportSection"/>'), { styles }));
    expect(doc.children).toEqual([{ type: 'heading', level: 2, children: [{ type: 'text', text: 'Section' }] }]);
  });

  it('reads complex HYPERLINK fields, relationship links and bookmark links', async () => {
    const field =
      '<w:p><w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> HYPERLINK "https://example.com/field" </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:t>field</w:t></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r>' +
      '<w:r><w:t xml:space="preserve"> </w:t></w:r><w:hyperlink r:id="rId9"><w:r><w:t>rel</w:t></w:r></w:hyperlink><w:r><w:t xml:space="preserve"> </w:t></w:r><w:hyperlink w:anchor="intro"><w:r><w:t>anchor</w:t></w:r></w:hyperlink></w:p>';
    const { doc } = await readDocx(await makeDocx(field));
    expect(doc.children[0]).toEqual({
      type: 'paragraph',
      children: [
        { type: 'text', text: 'field', link: { href: 'https://example.com/field' } },
        { type: 'text', text: ' ' },
        { type: 'text', text: 'rel', link: { href: 'https://example.com/rel' } },
        { type: 'text', text: ' ' },
        { type: 'text', text: 'anchor', link: { href: '#intro' } },
      ],
    });
  });

  it('keeps the result of other fields (page numbers, dates) and the text of content controls', async () => {
    const body =
      '<w:p><w:r><w:t xml:space="preserve">Page </w:t></w:r><w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText> PAGE </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:t>3</w:t></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p>' +
      '<w:sdt><w:sdtPr/><w:sdtContent><w:p><w:sdt><w:sdtContent><w:r><w:t>Inside a control</w:t></w:r></w:sdtContent></w:sdt></w:p></w:sdtContent></w:sdt>';
    const { doc } = await readDocx(await makeDocx(body));
    expect(doc.children).toEqual([
      { type: 'paragraph', children: [{ type: 'text', text: 'Page 3' }] },
      { type: 'paragraph', children: [{ type: 'text', text: 'Inside a control' }] },
    ]);
  });

  it('reads symbols, non-breaking hyphens and toggles turned off', async () => {
    const body = '<w:p><w:r><w:rPr><w:b w:val="0"/></w:rPr><w:t>not bold</w:t></w:r><w:r><w:sym w:font="Arial" w:char="2192"/><w:noBreakHyphen/></w:r><w:bookmarkStart w:id="0" w:name="intro"/><w:r><w:rPr><w:u w:val="none"/></w:rPr><w:t>x</w:t></w:r><w:bookmarkEnd w:id="0"/></w:p>';
    const { doc } = await readDocx(await makeDocx(body));
    expect(doc.children[0]).toEqual({ type: 'paragraph', children: [{ type: 'text', text: 'not bold→‑x' }] });
  });

  it('reads a paragraph with only a bottom border as a rule, and drops empty spacing paragraphs', async () => {
    const body = `${p('Above')}<w:p/><w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="auto"/></w:pBdr></w:pPr></w:p><w:p/>${p('Below')}`;
    const { doc } = await readDocx(await makeDocx(body));
    expect(doc.children.map((block) => block.type)).toEqual(['paragraph', 'rule', 'paragraph']);
    const kept = await readDocx(await makeDocx(body), { keepEmptyParagraphs: true });
    expect(kept.doc.children.map((block) => block.type)).toEqual(['paragraph', 'paragraph', 'rule', 'paragraph', 'paragraph']);
  });
});
