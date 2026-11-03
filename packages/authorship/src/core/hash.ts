/** Fast non-cryptographic hash (FNV-1a, 32 bit) as 8 hex digits: for matching texts, not for security. */
export function textHash(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

/** JSON with object keys sorted, so the same value always hashes the same. */
export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null';
  if (Array.isArray(value)) return `[${value.map((item) => (item === undefined ? 'null' : canonicalJson(item))).join(',')}]`;
  const entries = Object.keys(value as Record<string, unknown>)
    .filter((key) => (value as Record<string, unknown>)[key] !== undefined)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalJson((value as Record<string, unknown>)[key])}`);
  return `{${entries.join(',')}}`;
}

const hex = (buffer: ArrayBuffer) => Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, '0')).join('');

export function defaultSubtle(): SubtleCrypto {
  const subtle = (globalThis as { crypto?: Crypto }).crypto?.subtle;
  if (!subtle) throw new Error('Web Crypto is not available here (it needs a secure context: https or localhost).');
  return subtle;
}

export async function sha256Hex(text: string, subtle: SubtleCrypto = defaultSubtle()): Promise<string> {
  return hex(await subtle.digest('SHA-256', new TextEncoder().encode(text)));
}

export async function hmacHex(secret: string, text: string, subtle: SubtleCrypto = defaultSubtle()): Promise<string> {
  const key = await subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await subtle.sign('HMAC', key, new TextEncoder().encode(text)));
}
