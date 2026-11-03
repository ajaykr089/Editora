/**
 * Hash chain over the event log. Each sealed batch hashes the previous
 * batch's hash plus its own events, so changing any recorded event later
 * breaks every hash after it. A witness server can sign each batch hash
 * with its own clock (see `@editora/authorship/server`).
 */
import { canonicalJson, hmacHex, sha256Hex, textHash } from './hash.js';
import { createReplay } from './replay.js';
import type { AuthorshipLog, AuthorshipState, LogBase, LogBatch, LogEvent, WitnessReceipt } from './types.js';

export async function baseHash(base: LogBase, subtle?: SubtleCrypto): Promise<string> {
  return sha256Hex(canonicalJson(base), subtle);
}

export async function batchHash(prev: string, events: readonly LogEvent[], subtle?: SubtleCrypto): Promise<string> {
  return sha256Hex(`${prev}\n${canonicalJson(events)}`, subtle);
}

/** Seal the events logged since the last batch into a new batch (null when there are none). */
export async function sealBatch(log: AuthorshipLog, subtle?: SubtleCrypto): Promise<LogBatch | null> {
  const batches = (log.batches ??= []);
  const last = batches[batches.length - 1];
  const from = last ? last.to : 0;
  const to = log.events.length;
  if (to <= from) return null;
  // Reserve the range first so events logged while hashing start the next batch.
  const batch: LogBatch = { seq: batches.length, from, to, prev: '', hash: '' };
  batches.push(batch);
  batch.prev = last ? last.hash : await baseHash(log.base, subtle);
  batch.hash = await batchHash(batch.prev, log.events.slice(from, to), subtle);
  return batch;
}

export const receiptMessage = (receipt: Omit<WitnessReceipt, 'sig'>) => `${receipt.doc}\n${receipt.seq}\n${receipt.hash}\n${receipt.time}`;

export async function signReceipt(secret: string, receipt: Omit<WitnessReceipt, 'sig'>, subtle?: SubtleCrypto): Promise<WitnessReceipt> {
  return { ...receipt, sig: await hmacHex(secret, receiptMessage(receipt), subtle) };
}

export async function receiptIsValid(secret: string, receipt: WitnessReceipt, subtle?: SubtleCrypto): Promise<boolean> {
  if (!receipt || typeof receipt.sig !== 'string') return false;
  const expected = await hmacHex(secret, receiptMessage(receipt), subtle);
  if (expected.length !== receipt.sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) diff |= expected.charCodeAt(i) ^ receipt.sig.charCodeAt(i);
  return diff === 0;
}

export interface VerifyOptions {
  /** Witness secret: also check every receipt's signature. */
  secret?: string;
  /** Expected document id on the receipts. */
  doc?: string;
  /** Allowed clock difference between the writer and the witness (default 5 minutes). */
  clockSkewMs?: number;
  subtle?: SubtleCrypto;
}

export interface VerifyResult {
  /** No problems found. */
  ok: boolean;
  problems: string[];
  /** Replaying the log gives the saved text and runs. */
  replayMatches: boolean;
  /** Events covered by sealed batches / by valid witness receipts. */
  sealedEvents: number;
  witnessedEvents: number;
  totalEvents: number;
  /** Latest witness time, when any. */
  witnessedUntil?: number;
}

/**
 * Check a saved state: the log replays to the saved text, the hash chain is
 * intact, and (with `secret`) every receipt was signed by the witness and
 * no event claims a time after the witness saw it.
 */
export async function verifyAuthorship(state: AuthorshipState, options: VerifyOptions = {}): Promise<VerifyResult> {
  const problems: string[] = [];
  const log = state.log;
  const result: VerifyResult = { ok: false, problems, replayMatches: false, sealedEvents: 0, witnessedEvents: 0, totalEvents: log?.events.length ?? 0 };
  if (!log) {
    problems.push('The state has no log.');
    return result;
  }

  const final = createReplay(log).after(log.events.length);
  result.replayMatches =
    (state.text === undefined ? textHash(final.text) === state.textHash : final.text === state.text) &&
    JSON.stringify(final.runs) === JSON.stringify(state.runs);
  if (!result.replayMatches) problems.push('Replaying the log does not give the saved text and origins.');

  const skew = options.clockSkewMs ?? 5 * 60_000;
  let prev = await baseHash(log.base, options.subtle);
  let expectedFrom = 0;
  let lastWitness = -Infinity;
  for (const [index, batch] of (log.batches ?? []).entries()) {
    if (batch.seq !== index || batch.from !== expectedFrom || batch.to < batch.from || batch.to > log.events.length) {
      problems.push(`Batch ${index} does not continue the previous one.`);
      break;
    }
    if (batch.prev !== prev) problems.push(`Batch ${index} does not link to the previous hash.`);
    const hash = await batchHash(batch.prev, log.events.slice(batch.from, batch.to), options.subtle);
    if (hash !== batch.hash) problems.push(`Batch ${index}'s events were changed after it was sealed.`);
    else result.sealedEvents = batch.to;

    const receipt = batch.receipt;
    if (receipt && options.secret) {
      const valid = (await receiptIsValid(options.secret, receipt, options.subtle)) && receipt.hash === batch.hash && receipt.seq === batch.seq && (!options.doc || receipt.doc === options.doc);
      if (!valid) problems.push(`Batch ${index}'s witness receipt is not valid.`);
      else {
        const late = log.events.slice(batch.from, batch.to).find((event) => event.t > receipt.time + skew);
        if (late) problems.push(`Batch ${index} has an event dated after the witness saw it.`);
        const early = index > 0 ? log.events.slice(batch.from, batch.to).find((event) => event.t < lastWitness - skew) : undefined;
        if (early) problems.push(`Batch ${index} has an event dated before the previous witness receipt.`);
        if (!late && !early && result.witnessedEvents === batch.from) result.witnessedEvents = batch.to;
        lastWitness = receipt.time;
        result.witnessedUntil = receipt.time;
      }
    }
    prev = batch.hash;
    expectedFrom = batch.to;
  }
  result.ok = problems.length === 0;
  return result;
}
