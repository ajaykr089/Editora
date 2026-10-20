import { describe, expect, it, vi } from 'vitest';
import { SelectionModel } from '../ui/picker/selection';
import { UploadQueue } from '../uploadQueue';

const item = (id: string) => ({ id });
const png = (name = 'a.png') => new File(['x'], name, { type: 'image/png' });

describe('what is chosen in the picker', () => {
  it('accumulates in order of choosing, and toggles', () => {
    const onChange = vi.fn();
    const selection = new SelectionModel(true, onChange);
    selection.toggle(item('b'));
    selection.toggle(item('a'));
    expect(selection.items.map((i) => i.id)).toEqual(['b', 'a']);
    selection.toggle(item('b'));
    expect(selection.items.map((i) => i.id)).toEqual(['a']);
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it('takes only one in single mode', () => {
    const selection = new SelectionModel(false);
    selection.toggle(item('a'));
    selection.toggle(item('b'));
    expect(selection.items.map((i) => i.id)).toEqual(['b']);
    selection.range([item('a'), item('b')], 'a', 'b');
    selection.all([item('a'), item('c')]);
    expect(selection.size).toBe(1);
  });

  it('chooses a range in either direction, keeping what was chosen before', () => {
    const list = ['a', 'b', 'c', 'd', 'e'].map(item);
    const selection = new SelectionModel(true);
    selection.toggle(list[0]);
    selection.range(list, 'd', 'b');
    expect(selection.items.map((i) => i.id).sort()).toEqual(['a', 'b', 'c', 'd']);
  });

  it('removes and clears, and says nothing when nothing changed', () => {
    const onChange = vi.fn();
    const selection = new SelectionModel(true, onChange);
    selection.clear();
    selection.remove('x');
    expect(onChange).not.toHaveBeenCalled();
    selection.all([item('a'), item('b')]);
    selection.remove('a');
    expect(selection.has('a')).toBe(false);
    selection.clear();
    expect(selection.size).toBe(0);
  });
});

describe('the upload queue', () => {
  const handlerQueue = (handler: (file: File, ctx: any) => Promise<string>, extra: Record<string, unknown> = {}) => {
    const onChange = vi.fn();
    const queue = new UploadQueue({ config: { uploadHandler: handler as any, ...extra }, onChange });
    return { queue, onChange };
  };
  const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

  it('uploads at most three at a time and starts the next as one finishes', async () => {
    const finishers: Array<(url: string) => void> = [];
    const { queue } = handlerQueue((_f) => new Promise((resolve) => finishers.push(resolve)));
    queue.add([png('1.png'), png('2.png'), png('3.png'), png('4.png')]);
    await settle();
    expect(queue.entries.map((e) => e.status)).toEqual(['uploading', 'uploading', 'uploading', 'queued']);
    finishers[0]('https://cdn.test/1.png');
    await settle();
    expect(queue.entries.map((e) => e.status)).toEqual(['done', 'uploading', 'uploading', 'uploading']);
    expect(queue.entries[0].item?.src).toBe('https://cdn.test/1.png');
    expect(queue.active).toBe(3);
  });

  it('records progress, and the reason when a file fails or is refused', async () => {
    const { queue } = handlerQueue(
      async (file, ctx) => {
        ctx.onProgress({ loaded: 1, total: 2, fraction: 0.5 });
        if (file.name === 'bad.png') throw new Error('Quota exceeded');
        return 'https://cdn.test/ok.png';
      },
      { maxFileSize: 10 },
    );
    const big = new File(['x'.repeat(50)], 'big.png', { type: 'image/png' });
    queue.add([png('bad.png'), big]);
    await settle();
    await settle();
    const [bad, tooBig] = queue.entries;
    expect(bad).toMatchObject({ status: 'error', error: 'Quota exceeded' });
    expect(tooBig.status).toBe('error');
    expect(tooBig.error).toMatch(/big\.png/);
  });

  it('retries a failed file, and a removed entry is cancelled and forgotten', async () => {
    let calls = 0;
    let signal!: AbortSignal;
    const { queue } = handlerQueue((_f, ctx) => {
      calls++;
      signal = ctx.signal;
      return calls === 1 ? Promise.reject(new Error('Busy')) : new Promise(() => {});
    });
    queue.add([png()]);
    await settle();
    const id = queue.entries[0].id;
    expect(queue.entries[0].status).toBe('error');
    queue.retry(id);
    await settle();
    expect(queue.entries[0].status).toBe('uploading');
    queue.remove(id);
    expect(signal.aborted).toBe(true);
    expect(queue.entries).toHaveLength(0);
  });

  it('stops everything on dispose, without reporting errors', async () => {
    const signals: AbortSignal[] = [];
    const { queue } = handlerQueue((_f, ctx) => (signals.push(ctx.signal), new Promise(() => {})));
    queue.add([png('1.png'), png('2.png')]);
    await settle();
    queue.dispose();
    expect(signals.every((s) => s.aborted)).toBe(true);
    expect(queue.entries).toHaveLength(0);
  });
});
