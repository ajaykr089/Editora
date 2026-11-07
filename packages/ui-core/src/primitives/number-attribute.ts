/**
 * Reads a numeric attribute value. A missing or blank attribute, or one that is not a number,
 * gives `fallback`. (`Number(null)` and `Number('')` are 0, so a bare `Number(getAttribute(x))`
 * silently turned "not set" into 0 and bypassed the documented default.)
 */
export function numberAttribute(raw: string | null, fallback: number): number {
  if (raw == null || raw.trim() === '') return fallback;
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}
