/**
 * Witness server: signs batch hashes with the server's clock. It only ever
 * receives hashes, never the document's text, and keeps no state unless you
 * give it a `store` (which also rejects forked histories).
 *
 *   import { createAuthorshipWitness, toNodeHandler } from '@editora/authorship/server';
 *   const witness = createAuthorshipWitness({ secret: process.env.AUTHORSHIP_SECRET });
 *   // Fetch-style (Next.js route, Workers, Deno): export const POST = witness;
 *   // Node http / Express: app.post('/api/authorship', toNodeHandler(witness));
 */
import { receiptIsValid, signReceipt, verifyAuthorship, type VerifyOptions, type VerifyResult } from './core/chain.js';
import type { AuthorshipState, WitnessReceipt } from './core/types.js';

export interface WitnessStore {
  /** Last receipt issued for a document. */
  get(doc: string): Promise<WitnessReceipt | undefined> | WitnessReceipt | undefined;
  set(doc: string, receipt: WitnessReceipt): Promise<void> | void;
}

export interface WitnessOptions {
  /** HMAC secret for receipts; keep it on the server. */
  secret: string;
  store?: WitnessStore;
  /** Accept a document id (e.g. check the signed-in user may write it). */
  allowDoc?: (doc: string, request: Request) => boolean | Promise<boolean>;
  now?: () => number;
  subtle?: SubtleCrypto;
}

const HEX64 = /^[0-9a-f]{64}$/;

async function subtleCrypto(given?: SubtleCrypto): Promise<SubtleCrypto> {
  if (given) return given;
  const global = (globalThis as { crypto?: Crypto }).crypto?.subtle;
  if (global) return global;
  // Node 18 has Web Crypto only on the crypto module.
  const moduleName = 'node:crypto';
  const nodeCrypto = (await import(/* @vite-ignore */ moduleName)) as { webcrypto: Crypto };
  return nodeCrypto.webcrypto.subtle;
}

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export function createAuthorshipWitness(options: WitnessOptions): (request: Request) => Promise<Response> {
  if (!options.secret || options.secret.length < 16) throw new Error('createAuthorshipWitness needs a secret of at least 16 characters.');
  const now = options.now ?? (() => Date.now());

  return async (request: Request) => {
    if (request.method !== 'POST') return json(405, { error: 'Use POST.' });
    let body: { doc?: unknown; seq?: unknown; prev?: unknown; hash?: unknown; prevReceipt?: WitnessReceipt | null };
    try {
      body = await request.json();
    } catch {
      return json(400, { error: 'Body must be JSON.' });
    }
    const { doc, seq, prev, hash, prevReceipt } = body;
    if (typeof doc !== 'string' || !doc || doc.length > 200) return json(400, { error: 'doc must be a string id.' });
    if (typeof seq !== 'number' || !Number.isInteger(seq) || seq < 0) return json(400, { error: 'seq must be a whole number.' });
    if (typeof prev !== 'string' || !HEX64.test(prev) || typeof hash !== 'string' || !HEX64.test(hash)) return json(400, { error: 'prev and hash must be SHA-256 hex.' });
    if (options.allowDoc && !(await options.allowDoc(doc, request))) return json(403, { error: 'Not allowed for this document.' });

    const subtle = await subtleCrypto(options.subtle);
    if (seq > 0) {
      if (!prevReceipt || !(await receiptIsValid(options.secret, prevReceipt, subtle))) return json(409, { error: 'prevReceipt is missing or not signed by this witness.' });
      if (prevReceipt.doc !== doc || prevReceipt.seq !== seq - 1 || prevReceipt.hash !== prev) return json(409, { error: 'prevReceipt does not link to this batch.' });
    }
    if (options.store) {
      const last = await options.store.get(doc);
      const expected = last ? last.seq + 1 : 0;
      if (seq !== expected || (last && last.hash !== prev)) return json(409, { error: `This document's history continues at seq ${expected}.` });
    }
    const receipt = await signReceipt(options.secret, { doc, seq, hash, time: now() }, subtle);
    await options.store?.set(doc, receipt);
    return json(200, receipt);
  };
}

/** Check a saved record on the server, including witness signatures. */
export async function verifyWitnessed(state: AuthorshipState, options: VerifyOptions & { secret: string }): Promise<VerifyResult> {
  return verifyAuthorship(state, { ...options, subtle: await subtleCrypto(options.subtle) });
}

interface NodeRequest {
  method?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  on(event: 'data', listener: (chunk: Uint8Array) => void): unknown;
  on(event: 'end', listener: () => void): unknown;
  on(event: 'error', listener: (error: Error) => void): unknown;
}
interface NodeResponse {
  statusCode: number;
  setHeader(name: string, value: string): unknown;
  end(body?: string): unknown;
}

/** Adapt a fetch-style handler to Node's http / Express (req, res). */
export function toNodeHandler(handler: (request: Request) => Promise<Response>) {
  return async (req: NodeRequest, res: NodeResponse) => {
    const chunks: Uint8Array[] = [];
    await new Promise<void>((resolve, reject) => {
      req.on('data', (chunk) => chunks.push(chunk));
      req.on('end', () => resolve());
      req.on('error', reject);
    });
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) if (typeof value === 'string') headers.set(key, value);
    const size = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const body = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      body.set(chunk, offset);
      offset += chunk.length;
    }
    const response = await handler(new Request(`http://localhost${req.url ?? '/'}`, { method: req.method, headers, body: req.method === 'GET' || req.method === 'HEAD' ? undefined : body }));
    res.statusCode = response.status;
    response.headers.forEach((value, key) => res.setHeader(key, value));
    res.end(await response.text());
  };
}

export { verifyAuthorship } from './core/chain.js';
export type { VerifyOptions, VerifyResult } from './core/chain.js';
export type { AuthorshipState, WitnessReceipt } from './core/types.js';
