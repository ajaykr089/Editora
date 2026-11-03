/**
 * Just enough ZIP for .docx: read stored and deflated entries, write deflated
 * ones. Compression uses the platform's CompressionStream (Node 18+, all
 * current browsers), so there is no dependency.
 */

export type ZipFiles = Map<string, Uint8Array>;

const encoder = new TextEncoder();
const decoder = new TextDecoder();
export const utf8 = (text: string) => encoder.encode(text);
export const fromUtf8 = (bytes: Uint8Array) => decoder.decode(bytes);

async function transform(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const writer = stream.writable.getWriter();
  void writer.write(bytes as Uint8Array<ArrayBuffer>).then(() => writer.close());
  const chunks: Uint8Array[] = [];
  const reader = stream.readable.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  return concat(chunks);
}

function concat(chunks: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(chunks.reduce((sum, chunk) => sum + chunk.length, 0));
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

export function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let index = 0; index < bytes.length; index += 1) crc = CRC_TABLE[(crc ^ bytes[index]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

/** Read every entry of a ZIP archive. */
export async function unzip(data: Uint8Array): Promise<ZipFiles> {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  // The end-of-central-directory record is in the last 64 KB + 22 bytes.
  let end = -1;
  for (let index = data.length - 22; index >= Math.max(0, data.length - 65557); index -= 1) {
    if (view.getUint32(index, true) === 0x06054b50) {
      end = index;
      break;
    }
  }
  if (end < 0) throw new Error('Not a .docx file: no ZIP directory found.');
  const count = view.getUint16(end + 10, true);
  let offset = view.getUint32(end + 16, true);
  if (offset === 0xffffffff) throw new Error('ZIP64 archives are not supported.');
  const files: ZipFiles = new Map();
  for (let entry = 0; entry < count; entry += 1) {
    if (view.getUint32(offset, true) !== 0x02014b50) throw new Error('Corrupt ZIP directory.');
    const method = view.getUint16(offset + 10, true);
    const compressedSize = view.getUint32(offset + 20, true);
    const nameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const commentLength = view.getUint16(offset + 32, true);
    const local = view.getUint32(offset + 42, true);
    const name = fromUtf8(data.subarray(offset + 46, offset + 46 + nameLength));
    offset += 46 + nameLength + extraLength + commentLength;
    if (name.endsWith('/')) continue;
    // Sizes come from the central directory: local headers may defer them to a data descriptor.
    const start = local + 30 + view.getUint16(local + 26, true) + view.getUint16(local + 28, true);
    const raw = data.subarray(start, start + compressedSize);
    if (method === 0) files.set(name, raw.slice());
    else if (method === 8) files.set(name, await transform(raw, new DecompressionStream('deflate-raw')));
    else throw new Error(`Unsupported ZIP compression method ${method} for ${name}.`);
  }
  return files;
}

/** Write a ZIP archive. Entries are deflated, with a fixed timestamp so the same input gives the same bytes. */
export async function zip(files: Array<[string, Uint8Array]>): Promise<Uint8Array> {
  const parts: Uint8Array[] = [];
  const directory: Uint8Array[] = [];
  let offset = 0;
  // 1980-01-01 00:00, the earliest DOS date.
  const time = 0;
  const date = (1 << 5) | 1;
  for (const [name, content] of files) {
    const nameBytes = utf8(name);
    const compressed = await transform(content, new CompressionStream('deflate-raw'));
    const crc = crc32(content);
    const header = new Uint8Array(30 + nameBytes.length);
    const h = new DataView(header.buffer);
    h.setUint32(0, 0x04034b50, true);
    h.setUint16(4, 20, true);
    h.setUint16(6, 0x0800, true); // UTF-8 names
    h.setUint16(8, 8, true);
    h.setUint16(10, time, true);
    h.setUint16(12, date, true);
    h.setUint32(14, crc, true);
    h.setUint32(18, compressed.length, true);
    h.setUint32(22, content.length, true);
    h.setUint16(26, nameBytes.length, true);
    header.set(nameBytes, 30);

    const central = new Uint8Array(46 + nameBytes.length);
    const c = new DataView(central.buffer);
    c.setUint32(0, 0x02014b50, true);
    c.setUint16(4, 20, true);
    c.setUint16(6, 20, true);
    c.setUint16(8, 0x0800, true);
    c.setUint16(10, 8, true);
    c.setUint16(12, time, true);
    c.setUint16(14, date, true);
    c.setUint32(16, crc, true);
    c.setUint32(20, compressed.length, true);
    c.setUint32(24, content.length, true);
    c.setUint16(28, nameBytes.length, true);
    c.setUint32(42, offset, true);
    central.set(nameBytes, 46);

    parts.push(header, compressed);
    directory.push(central);
    offset += header.length + compressed.length;
  }
  const directorySize = directory.reduce((sum, entry) => sum + entry.length, 0);
  const end = new Uint8Array(22);
  const e = new DataView(end.buffer);
  e.setUint32(0, 0x06054b50, true);
  e.setUint16(8, files.length, true);
  e.setUint16(10, files.length, true);
  e.setUint32(12, directorySize, true);
  e.setUint32(16, offset, true);
  return concat([...parts, ...directory, end]);
}
