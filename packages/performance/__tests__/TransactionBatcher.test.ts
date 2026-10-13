import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { TransactionBatcher } from '../src/TransactionBatcher';

describe('TransactionBatcher', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  const ids = (transactions: Array<{ id?: unknown }>) => transactions.map((transaction) => String(transaction.id));

  it('flushes when the batch is full, and when the time is up', () => {
    const batcher = new TransactionBatcher({ maxBatchSize: 3, maxBatchTime: 50 });
    const flushed: string[][] = [];
    batcher.setOnFlush((transactions) => flushed.push(ids(transactions)));

    batcher.add({ id: 'a' });
    batcher.add({ id: 'b' });
    expect(flushed).toEqual([]);
    expect(batcher.getBatchSize()).toBe(2);
    batcher.add({ id: 'c' });
    expect(flushed).toEqual([['a', 'b', 'c']]);

    batcher.add({ id: 'd' });
    jest.advanceTimersByTime(49);
    expect(flushed).toHaveLength(1);
    jest.advanceTimersByTime(1);
    expect(flushed).toEqual([['a', 'b', 'c'], ['d']]);
    expect(batcher.getBatchSize()).toBe(0);
  });

  it('hands over the state before the first transaction, or an empty object', () => {
    const batcher = new TransactionBatcher({ maxBatchTime: 10 });
    const states: unknown[] = [];
    batcher.setOnFlush((_transactions, state) => states.push(state));
    const before = { doc: 'before' } as never;
    batcher.add({ id: 'a', beforeState: before });
    batcher.add({ id: 'b' });
    jest.advanceTimersByTime(10);
    batcher.add({ id: 'c' });
    jest.advanceTimersByTime(10);
    expect(states).toEqual([before, {}]);
  });

  it('passes each transaction straight through when disabled, and flushes what is waiting when it is disabled', () => {
    const batcher = new TransactionBatcher({ enabled: false });
    const flushed: string[][] = [];
    batcher.setOnFlush((transactions) => flushed.push(ids(transactions)));
    batcher.add({ id: 'a' });
    batcher.add({ id: 'b' });
    expect(flushed).toEqual([['a'], ['b']]);

    batcher.setEnabled(true);
    batcher.add({ id: 'c' });
    batcher.setEnabled(false);
    expect(flushed).toEqual([['a'], ['b'], ['c']]);
  });

  it('destroy() flushes what is waiting and stops the timer', () => {
    const batcher = new TransactionBatcher({ maxBatchTime: 50 });
    const flushed: string[][] = [];
    batcher.setOnFlush((transactions) => flushed.push(ids(transactions)));
    batcher.add({ id: 'a' });
    batcher.destroy();
    expect(flushed).toEqual([['a']]);
    jest.advanceTimersByTime(100);
    expect(flushed).toHaveLength(1);
  });

  it('keeps a transaction that is added from inside the flush callback', () => {
    // The batch used to be emptied after the callback ran, which threw away what the callback had just added.
    const batcher = new TransactionBatcher({ maxBatchSize: 10, maxBatchTime: 50 });
    const flushed: string[][] = [];
    let added = false;
    batcher.setOnFlush((transactions) => {
      flushed.push(ids(transactions));
      if (!added) {
        added = true;
        batcher.add({ id: 'late' });
      }
    });

    batcher.add({ id: 'a' });
    batcher.add({ id: 'b' });
    batcher.flushBatch();
    expect(batcher.getBatchSize()).toBe(1);

    jest.advanceTimersByTime(50);
    expect(flushed).toEqual([['a', 'b'], ['late']]);
  });
});
