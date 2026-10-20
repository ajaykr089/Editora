import { describe, expect, it } from 'vitest';
import { formatFullDate, formatRelativeTime, getAvatarColor, getInitials } from '../format';

const NOW = new Date('2026-10-20T12:00:00Z').getTime();
const ago = (seconds: number) => new Date(NOW - seconds * 1000).toISOString();

describe('formatRelativeTime', () => {
  it('says "now" for the last minute', () => {
    expect(formatRelativeTime(ago(5), NOW, 'en')).toBe('now');
    expect(formatRelativeTime(ago(59), NOW, 'en')).toBe('now');
  });

  it('counts minutes, hours and days', () => {
    expect(formatRelativeTime(ago(5 * 60), NOW, 'en')).toMatch(/^5 min/);
    expect(formatRelativeTime(ago(3 * 3600), NOW, 'en')).toMatch(/^3 hr/);
    expect(formatRelativeTime(ago(2 * 86400), NOW, 'en')).toMatch(/^2 days? ago/);
  });

  it('switches to a date after a week, with the year only when it is another one', () => {
    expect(formatRelativeTime(ago(10 * 86400), NOW, 'en')).toBe('Oct 10');
    expect(formatRelativeTime('2025-03-02T10:00:00Z', NOW, 'en')).toMatch(/Mar 2, 2025/);
  });

  it('returns nothing for a date it cannot read', () => {
    expect(formatRelativeTime('not a date', NOW, 'en')).toBe('');
    expect(formatFullDate('not a date', 'en')).toBe('');
  });
});

describe('the author badge', () => {
  it('takes the first letters of the first and last word', () => {
    expect(getInitials('Ada Lovelace')).toBe('AL');
    expect(getInitials('  grace   brewster  murray hopper ')).toBe('GH');
    expect(getInitials('Plato')).toBe('P');
    expect(getInitials('')).toBe('?');
  });

  it('keeps one colour per name', () => {
    expect(getAvatarColor('Ada Lovelace')).toBe(getAvatarColor('Ada Lovelace'));
    expect(getAvatarColor('User')).toMatch(/^hsl\(/);
  });
});
