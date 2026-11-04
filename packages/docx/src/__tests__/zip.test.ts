import { crc32, unzip, utf8, zip, fromUtf8 } from '../zip';
import { parseXml, child, textContent } from '../xml';

describe('zip', () => {
  it('round-trips files and is deterministic', async () => {
    const files: Array<[string, Uint8Array]> = [['a.txt', utf8('hello '.repeat(200))], ['dir/b.xml', utf8('<x>é ✓</x>')], ['empty', new Uint8Array()]];
    const first = await zip(files);
    expect(await zip(files)).toEqual(first);
    const back = await unzip(first);
    expect([...back.keys()]).toEqual(['a.txt', 'dir/b.xml', 'empty']);
    expect(fromUtf8(back.get('dir/b.xml')!)).toBe('<x>é ✓</x>');
    expect(back.get('a.txt')!.length).toBe(1200);
  });

  it('computes the standard CRC-32', () => {
    expect(crc32(utf8('123456789'))).toBe(0xcbf43926);
  });

  it('rejects files that are not ZIP archives', async () => {
    await expect(unzip(utf8('not a zip at all, definitely not'))).rejects.toThrow(/Not a \.docx/);
  });
});

describe('xml', () => {
  it('normalises namespace prefixes by URI', () => {
    const doc = parseXml('<?xml version="1.0"?><x:document xmlns:x="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><x:body><x:p><x:r><x:t xml:space="preserve"> a &amp; b </x:t></x:r></x:p></x:body></x:document>');
    const document = child(doc, 'w:document')!;
    const t = child(child(child(child(document, 'w:body'), 'w:p'), 'w:r'), 'w:t')!;
    expect(textContent(t)).toBe(' a & b ');
    expect(t.attrs['xml:space']).toBe('preserve');
  });
});
