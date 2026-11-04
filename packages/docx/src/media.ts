const BASE64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export function base64(bytes: Uint8Array): string {
  let out = '';
  let index = 0;
  for (; index + 2 < bytes.length; index += 3) {
    const n = (bytes[index] << 16) | (bytes[index + 1] << 8) | bytes[index + 2];
    out += BASE64[n >> 18] + BASE64[(n >> 12) & 63] + BASE64[(n >> 6) & 63] + BASE64[n & 63];
  }
  const rest = bytes.length - index;
  if (rest === 1) {
    const n = bytes[index] << 16;
    out += `${BASE64[n >> 18]}${BASE64[(n >> 12) & 63]}==`;
  } else if (rest === 2) {
    const n = (bytes[index] << 16) | (bytes[index + 1] << 8);
    out += `${BASE64[n >> 18]}${BASE64[(n >> 12) & 63]}${BASE64[(n >> 6) & 63]}=`;
  }
  return out;
}

export function fromBase64(value: string): Uint8Array {
  const clean = value.replace(/[^A-Za-z0-9+/]/g, '');
  const out = new Uint8Array(Math.floor((clean.length * 3) / 4));
  let bits = 0;
  let buffer = 0;
  let length = 0;
  for (const char of clean) {
    buffer = (buffer << 6) | BASE64.indexOf(char);
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out[length++] = (buffer >> bits) & 0xff;
    }
  }
  return out.subarray(0, length);
}

const TYPES: Record<string, string> = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', bmp: 'image/bmp', tif: 'image/tiff', tiff: 'image/tiff',
  webp: 'image/webp', svg: 'image/svg+xml', emf: 'image/x-emf', wmf: 'image/x-wmf',
};

export const EXTENSIONS: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpeg', 'image/gif': 'gif', 'image/bmp': 'bmp', 'image/tiff': 'tiff', 'image/webp': 'webp', 'image/svg+xml': 'svg' };

/** The image type, from its first bytes or else its file name. */
export function imageType(name: string, bytes: Uint8Array): string {
  const sniffed = sniff(bytes);
  return sniffed ?? TYPES[name.split('.').pop()?.toLowerCase() ?? ''] ?? 'application/octet-stream';
}

function sniff(bytes: Uint8Array): string | undefined {
  const starts = (...values: number[]) => values.every((value, index) => bytes[index] === value);
  if (starts(0x89, 0x50, 0x4e, 0x47)) return 'image/png';
  if (starts(0xff, 0xd8, 0xff)) return 'image/jpeg';
  if (starts(0x47, 0x49, 0x46, 0x38)) return 'image/gif';
  if (starts(0x42, 0x4d)) return 'image/bmp';
  if (starts(0x52, 0x49, 0x46, 0x46) && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return 'image/webp';
  if (starts(0x49, 0x49, 0x2a, 0x00) || starts(0x4d, 0x4d, 0x00, 0x2a)) return 'image/tiff';
  const head = new TextDecoder().decode(bytes.subarray(0, 256)).trimStart();
  if (head.startsWith('<svg') || (head.startsWith('<?xml') && head.includes('<svg'))) return 'image/svg+xml';
  return undefined;
}

/** Pixel size from the image header, for PNG, JPEG, GIF, BMP and WebP. */
export function imageSize(bytes: Uint8Array): { width: number; height: number } | undefined {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const type = sniff(bytes);
  try {
    if (type === 'image/png') return { width: view.getUint32(16), height: view.getUint32(20) };
    if (type === 'image/gif') return { width: view.getUint16(6, true), height: view.getUint16(8, true) };
    if (type === 'image/bmp') return { width: view.getInt32(18, true), height: Math.abs(view.getInt32(22, true)) };
    if (type === 'image/jpeg') {
      let offset = 2;
      while (offset < bytes.length) {
        if (bytes[offset] !== 0xff) return undefined;
        const marker = bytes[offset + 1];
        const length = view.getUint16(offset + 2);
        // Start-of-frame markers carry the size (C0-CF, except C4, C8 and CC).
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { width: view.getUint16(offset + 7), height: view.getUint16(offset + 5) };
        offset += 2 + length;
      }
    }
    if (type === 'image/webp') {
      const chunk = new TextDecoder().decode(bytes.subarray(12, 16));
      if (chunk === 'VP8X') return { width: 1 + (bytes[24] | (bytes[25] << 8) | (bytes[26] << 16)), height: 1 + (bytes[27] | (bytes[28] << 8) | (bytes[29] << 16)) };
      if (chunk === 'VP8 ') return { width: view.getUint16(26, true) & 0x3fff, height: view.getUint16(28, true) & 0x3fff };
      if (chunk === 'VP8L') {
        const bits = view.getUint32(21, true);
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
      }
    }
  } catch {
    return undefined;
  }
  return undefined;
}
