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

/** Thrown for files that are not usable .docx archives, with a message fit to show the user. */
export class DocxError extends Error {
  /** The underlying error, for damaged files. */
  readonly cause?: unknown;

  constructor(message: string, readonly code: 'not-docx' | 'legacy-or-encrypted' | 'too-large' | 'corrupt', options?: { cause?: unknown }) {
    super(message);
    this.name = 'DocxError';
    if (options?.cause !== undefined) this.cause = options.cause;
  }
}

async function transform(bytes: Uint8Array, stream: CompressionStream | DecompressionStream, limit = Infinity): Promise<Uint8Array> {
  const writer = stream.writable.getWriter();
  // Errors surface on the reading side; keep the writer's from going unhandled.
  writer.write(bytes as Uint8Array<ArrayBuffer>).then(() => writer.close()).catch(() => undefined);
  const chunks: Uint8Array[] = [];
  let total = 0;
  const reader = stream.readable.getReader();
  for (;;) {
    let result: ReadableStreamReadResult<Uint8Array>;
    try {
      result = await reader.read();
    } catch {
      throw new DocxError('The file is damaged: part of it could not be decompressed.', 'corrupt');
    }
    if (result.done) break;
    total += result.value.length;
    // Stop as soon as a part grows past the limit, so a "zip bomb" cannot fill memory.
    if (total > limit) {
      await reader.cancel().catch(() => undefined);
      throw new DocxError('The file expands to more data than allowed (maxUncompressedSize).', 'too-large');
    }
    chunks.push(result.value);
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

export interface ZipLimits {
  /** Largest archive accepted, in bytes. */
  maxSize?: number;
  /** Most bytes all parts read may expand to, in total. */
  maxUncompressedSize?: number;
}

export interface ZipArchive {
  names: string[];
  /** Decompress one entry; undefined when it does not exist. Parts are only expanded when asked for. */
  read(name: string): Promise<Uint8Array | undefined>;
}

const MB = 1024 * 1024;

/** Open a ZIP archive without expanding anything yet. */
export function openZip(data: Uint8Array, limits: ZipLimits = {}): ZipArchive {
  const maxSize = limits.maxSize ?? 100 * MB;
  let budget = limits.maxUncompressedSize ?? 500 * MB;
  if (data.length > maxSize) throw new DocxError(`The file is ${Math.round(data.length / MB)} MB, more than the ${Math.round(maxSize / MB)} MB allowed (maxSize).`, 'too-large');
  // Word 97-2003 files, and password-protected .docx files, are OLE compound documents, not ZIP.
  if (data[0] === 0xd0 && data[1] === 0xcf && data[2] === 0x11 && data[3] === 0xe0) {
    throw new DocxError('This is an old Word 97-2003 (.doc) file or a password-protected document. Save it as .docx without a password and try again.', 'legacy-or-encrypted');
  }
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  // The end-of-central-directory record is in the last 64 KB + 22 bytes.
  let end = -1;
  for (let index = data.length - 22; index >= Math.max(0, data.length - 65557); index -= 1) {
    if (view.getUint32(index, true) === 0x06054b50) {
      end = index;
      break;
    }
  }
  if (end < 0) throw new DocxError('Not a .docx file: no ZIP directory found.', 'not-docx');
  const count = view.getUint16(end + 10, true);
  let offset = view.getUint32(end + 16, true);
  if (offset === 0xffffffff) throw new DocxError('ZIP64 archives are not supported.', 'not-docx');
  const entries = new Map<string, { method: number; start: number; size: number }>();
  try {
    for (let entry = 0; entry < count; entry += 1) {
      if (view.getUint32(offset, true) !== 0x02014b50) throw new DocxError('The file is damaged: its ZIP directory is broken.', 'corrupt');
      const method = view.getUint16(offset + 10, true);
      const size = view.getUint32(offset + 20, true);
      const nameLength = view.getUint16(offset + 28, true);
      const extraLength = view.getUint16(offset + 30, true);
      const commentLength = view.getUint16(offset + 32, true);
      const local = view.getUint32(offset + 42, true);
      const name = fromUtf8(data.subarray(offset + 46, offset + 46 + nameLength));
      offset += 46 + nameLength + extraLength + commentLength;
      if (name.endsWith('/')) continue;
      // Sizes come from the central directory: local headers may defer them to a data descriptor.
      const start = local + 30 + view.getUint16(local + 26, true) + view.getUint16(local + 28, true);
      if (start + size > data.length) throw new DocxError('The file is damaged or incomplete (was the download cut short?).', 'corrupt');
      entries.set(name, { method, start, size });
    }
  } catch (error) {
    if (error instanceof DocxError) throw error;
    throw new DocxError('The file is damaged: its ZIP directory is broken.', 'corrupt');
  }
  const cache = new Map<string, Promise<Uint8Array>>();
  return {
    names: [...entries.keys()],
    read(name) {
      const entry = entries.get(name);
      if (!entry) return Promise.resolve(undefined);
      let pending = cache.get(name);
      if (!pending) {
        const raw = data.subarray(entry.start, entry.start + entry.size);
        pending = (async () => {
          let bytes: Uint8Array;
          if (entry.method === 0) bytes = raw.slice();
          else if (entry.method === 8) bytes = await transform(raw, new DecompressionStream('deflate-raw'), budget);
          else throw new DocxError(`Unsupported ZIP compression method ${entry.method} for ${name}.`, 'not-docx');
          budget -= bytes.length;
          if (budget < 0) throw new DocxError('The file expands to more data than allowed (maxUncompressedSize).', 'too-large');
          return bytes;
        })();
        cache.set(name, pending);
      }
      return pending;
    },
  };
}

/** Read every entry of a ZIP archive. */
export async function unzip(data: Uint8Array, limits?: ZipLimits): Promise<ZipFiles> {
  const archive = openZip(data, limits);
  const files: ZipFiles = new Map();
  for (const name of archive.names) files.set(name, (await archive.read(name))!);
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
