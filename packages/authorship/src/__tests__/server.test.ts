// @vitest-environment node
import { webcrypto } from 'node:crypto';
import { sealBatch, verifyAuthorship } from '../core/chain.js';
import { AuthorshipEngine } from '../core/engine.js';
import type { WitnessReceipt } from '../core/types.js';
import { createAuthorshipWitness, type WitnessStore } from '../server.js';

const SECRET = 'a-long-enough-test-secret';
const post = (body: unknown) => new Request('http://x/api', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } });

describe('createAuthorshipWitness', () => {
  it('signs a chain of batches that verifyAuthorship accepts', async () => {
    const witness = createAuthorshipWitness({ secret: SECRET });
    const engine = new AuthorshipEngine({ author: 'Ana' });
    engine.reset('Base');
    let prevReceipt: WitnessReceipt | null = null;
    for (const next of ['Base one', 'Base one two']) {
      engine.update(next, { cause: 'type', origin: { kind: 'typed', author: 'Ana' } });
      const batch = (await sealBatch(engine.log!, webcrypto.subtle as unknown as SubtleCrypto))!;
      const response = await witness(post({ doc: 'essay-1', seq: batch.seq, prev: batch.prev, hash: batch.hash, prevReceipt }));
      expect(response.status).toBe(200);
      batch.receipt = prevReceipt = await response.json();
    }
    const result = await verifyAuthorship(engine.serialize(), { secret: SECRET, doc: 'essay-1', subtle: webcrypto.subtle as unknown as SubtleCrypto });
    expect(result.problems).toEqual([]);
    expect(result.witnessedEvents).toBe(2);
  });

  it('rejects bad input, unlinked receipts and forks', async () => {
    const receipts = new Map<string, WitnessReceipt>();
    const store: WitnessStore = { get: (doc) => receipts.get(doc), set: (doc, receipt) => void receipts.set(doc, receipt) };
    const witness = createAuthorshipWitness({ secret: SECRET, store });
    const h = (c: string) => c.repeat(64);
    expect((await witness(post({ doc: 'd', seq: 0, prev: 'nope', hash: h('a') }))).status).toBe(400);
    const first = await (await witness(post({ doc: 'd', seq: 0, prev: h('0'), hash: h('a') }))).json();
    // A second batch 0 for the same document is a fork.
    expect((await witness(post({ doc: 'd', seq: 0, prev: h('0'), hash: h('b') }))).status).toBe(409);
    expect((await witness(post({ doc: 'd', seq: 1, prev: h('c'), hash: h('d'), prevReceipt: first }))).status).toBe(409);
    expect((await witness(post({ doc: 'd', seq: 1, prev: h('a'), hash: h('d'), prevReceipt: { ...first, sig: h('f') } }))).status).toBe(409);
    expect((await witness(post({ doc: 'd', seq: 1, prev: h('a'), hash: h('d'), prevReceipt: first }))).status).toBe(200);
    expect(() => createAuthorshipWitness({ secret: 'short' })).toThrow();
  });
});
