// Server-safe (no hooks, no DOM): maps a wrapper's props to the custom element's attributes.
// React 18 writes custom-element props literally (`mediaVariant` -> a `mediavariant` attribute,
// `false` -> the string "false", which a presence attribute reads as on), so wrappers translate
// them: camelCase props get their kebab attribute, booleans become present ('') or absent.

export type AttrKind = 'string' | 'bool';
export type AttrSpec = Record<string, readonly [attribute: string, kind: AttrKind]>;

export function toHostProps<P extends Record<string, unknown>>(props: P, spec: AttrSpec): Record<string, unknown> {
  const host: Record<string, unknown> = {};
  for (const key of Object.keys(props)) {
    const value = props[key];
    const entry = spec[key];
    if (!entry) {
      host[key] = value;
      continue;
    }
    const [attribute, kind] = entry;
    if (kind === 'bool') {
      if (value) host[attribute] = '';
    } else if (value != null && value !== false) {
      host[attribute] = String(value);
    }
  }
  return host;
}
