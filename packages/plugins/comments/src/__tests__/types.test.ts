import { describe, expect, it } from 'vitest';
import { isSafeAvatarUrl, isSafeId, normalizeThreads, normalizeUser } from '../types';

const NOW = '2026-10-20T12:00:00.000Z';

describe('normalizeUser', () => {
  it('takes a name or an object, and drops what it cannot use', () => {
    expect(normalizeUser('  Ada Lovelace ')).toEqual({ name: 'Ada Lovelace' });
    expect(normalizeUser({ id: 7, name: 'Ada', avatar: 'https://x.test/a.png', extra: 1 })).toEqual({
      id: '7',
      name: 'Ada',
      avatar: 'https://x.test/a.png',
    });
    expect(normalizeUser({ name: '  ' })).toBeNull();
    expect(normalizeUser({ id: 'x' })).toBeNull();
    expect(normalizeUser(null)).toBeNull();
    expect(normalizeUser(42)).toBeNull();
  });

  it('keeps a picture only if it can only be a picture', () => {
    expect(normalizeUser({ name: 'A', avatar: 'javascript:alert(1)' })).toEqual({ name: 'A' });
    expect(normalizeUser({ name: 'A', avatar: 'data:text/html;base64,AAAA' })).toEqual({ name: 'A' });
    expect(normalizeUser({ name: 'A', avatar: 'data:image/png;base64,AAAA' })!.avatar).toBeDefined();
    expect(isSafeAvatarUrl(`data:image/png;base64,${'A'.repeat(5000)}`)).toBe(true); // a small picture is thousands of characters
    expect(isSafeAvatarUrl(`https://x.test/${'a'.repeat(3000)}`)).toBe(false);
    expect(isSafeAvatarUrl('/img/a.png')).toBe(true);
    expect(isSafeAvatarUrl('//cdn.test/a.png')).toBe(true);
    expect(isSafeAvatarUrl('vbscript:x')).toBe(false);
    expect(isSafeAvatarUrl('')).toBe(false);
  });
});

describe('isSafeId', () => {
  it('rejects ids that could break out of a selector', () => {
    expect(isSafeId('comment-1730-1')).toBe(true);
    expect(isSafeId('a:b.c_d')).toBe(true);
    expect(isSafeId('x"] , body { display: none } [id="')).toBe(false);
    expect(isSafeId('')).toBe(false);
    expect(isSafeId(5)).toBe(false);
  });
});

describe('normalizeThreads', () => {
  const thread = (extra: Record<string, unknown> = {}) => ({
    id: 't1',
    anchorId: 'a1',
    quote: ' some text ',
    author: 'Ada',
    text: ' hello ',
    createdAt: '2026-10-19T10:00:00Z',
    resolved: false,
    replies: [{ id: 'r1', author: { name: 'Bob', id: 'b' }, text: 'hi', createdAt: '2026-10-19T11:00:00Z' }],
    ...extra,
  });

  it('turns good data into the public shape', () => {
    const [t] = normalizeThreads([thread()], NOW);
    expect(t).toEqual({
      id: 't1',
      anchorId: 'a1',
      quote: 'some text',
      author: { name: 'Ada' },
      text: 'hello',
      createdAt: '2026-10-19T10:00:00Z',
      resolved: false,
      replies: [{ id: 'r1', author: { name: 'Bob', id: 'b' }, text: 'hi', createdAt: '2026-10-19T11:00:00Z' }],
    });
  });

  it('never throws and drops what cannot be shown', () => {
    expect(normalizeThreads('nope')).toEqual([]);
    expect(normalizeThreads(null)).toEqual([]);
    const result = normalizeThreads(
      [null, 5, {}, thread({ id: '' }), thread({ text: '   ' }), thread(), thread({ text: 'duplicate id' }), thread({ id: 't2', anchorId: '"]{' })],
      NOW,
    );
    expect(result.map((t) => t.id)).toEqual(['t1', 't2']);
    expect(result[1].anchorId).toBeUndefined();
  });

  it('replaces dates that do not parse, and gives a missing author the default', () => {
    const [t] = normalizeThreads([thread({ author: undefined, createdAt: 'yesterday', editedAt: 'x' })], NOW);
    expect(t.createdAt).toBe(NOW);
    expect(t.editedAt).toBeUndefined();
    expect(t.author).toEqual({ name: 'User' });
  });

  it('only keeps resolution details for a resolved thread, and gives replies ids when they have none', () => {
    const [open, done] = normalizeThreads(
      [
        thread({ id: 'o', resolvedAt: NOW, resolvedBy: 'Zed' }),
        thread({ id: 'd', resolved: true, resolvedAt: NOW, resolvedBy: 'Zed', replies: [{ text: 'a' }, { text: 'b' }, { id: 'r', text: 'c' }, { id: 'r', text: 'd' }] }),
      ],
      NOW,
    );
    expect(open.resolvedAt).toBeUndefined();
    expect(open.resolvedBy).toBeUndefined();
    expect(done.resolvedBy).toEqual({ name: 'Zed' });
    const ids = done.replies.map((r) => r.id);
    expect(new Set(ids).size).toBe(4);
  });
});
