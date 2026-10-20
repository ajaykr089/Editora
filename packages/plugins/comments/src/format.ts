/**
 * Pure helpers for how a comment's author and time are shown. No DOM, so they are unit-testable.
 */

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * "just now", "5 min. ago", "3 hr. ago", "2 days ago", then a plain date ("Oct 14", "Oct 14, 2025" for another
 * year). The full date and time belong in the element's title, see `formatFullDate`.
 */
export function formatRelativeTime(isoDate: string, now: number = Date.now(), locale?: string): string {
  const then = new Date(isoDate).getTime();
  if (Number.isNaN(then)) return '';

  const seconds = Math.round((then - now) / 1000);
  const past = Math.abs(seconds);

  let rtf: Intl.RelativeTimeFormat | null = null;
  try {
    rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto', style: 'short' });
  } catch {
    rtf = null;
  }

  if (past < MINUTE) return rtf ? rtf.format(0, 'second') : 'now';
  if (past < HOUR) return rtf ? rtf.format(Math.round(seconds / MINUTE), 'minute') : `${Math.round(past / MINUTE)}m ago`;
  if (past < DAY) return rtf ? rtf.format(Math.round(seconds / HOUR), 'hour') : `${Math.round(past / HOUR)}h ago`;
  if (past < 7 * DAY) return rtf ? rtf.format(Math.round(seconds / DAY), 'day') : `${Math.round(past / DAY)}d ago`;

  const date = new Date(then);
  const sameYear = date.getFullYear() === new Date(now).getFullYear();
  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: sameYear ? undefined : 'numeric',
  });
}

/** The exact moment, for a tooltip. */
export function formatFullDate(isoDate: string, locale?: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' });
}

/** Up to two letters: the first letters of the first and last word of the name. */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = Array.from(words[0])[0] ?? '';
  const last = words.length > 1 ? Array.from(words[words.length - 1])[0] ?? '' : '';
  return (first + last).toUpperCase() || '?';
}

// Dark enough for white initials to stay above 4.5:1 contrast.
const AVATAR_COLORS = [
  'hsl(215 55% 36%)',
  'hsl(262 45% 45%)',
  'hsl(330 52% 40%)',
  'hsl(8 58% 40%)',
  'hsl(28 70% 32%)',
  'hsl(150 55% 28%)',
  'hsl(180 60% 27%)',
  'hsl(240 40% 48%)',
];

/** The same name always gets the same colour. */
export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}
