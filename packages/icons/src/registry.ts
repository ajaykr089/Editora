import { iconDefinitions } from './definitions';
import type { IconName } from './names';
import { rememberRegisteredIcon } from './registered';
import type { IconDefinition, IconGlyph, IconVariant, ResolvedIcon } from './types';

// A built-in name autocompletes; any other string (an alias, or an icon you registered) is still accepted.
type AnyIconName = IconName | (string & {});

const DEFAULT_ICON_VIEWBOX = '0 0 24 24';

const iconMap = new Map<string, IconDefinition>();
const aliasMap = new Map<string, string>();

function normalizeName(input: string): string {
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/_/g, '-');
}

type RegisterOptions = {
  strict?: boolean;
  source?: string;
};

function registerDefinition(definition: IconDefinition, options: RegisterOptions = {}): IconDefinition | undefined {
  const name = normalizeName(definition.name);
  if (!name) return undefined;

  if (options.strict && iconMap.has(name)) {
    throw new Error(`Duplicate icon name "${name}" detected in ${options.source || 'registry'}.`);
  }

  const stored = { ...definition, name };
  iconMap.set(name, stored);

  const aliases = definition.aliases || [];
  for (const alias of aliases) {
    const normalized = normalizeName(alias);
    if (!normalized || normalized === name) continue;

    if (options.strict) {
      const existingAliasTarget = aliasMap.get(normalized);
      if (existingAliasTarget && existingAliasTarget !== name) {
        throw new Error(
          `Alias collision "${normalized}" -> "${existingAliasTarget}" and "${name}" in ${options.source || 'registry'}.`
        );
      }

      const iconWithAliasName = iconMap.get(normalized);
      if (iconWithAliasName && iconWithAliasName.name !== name) {
        throw new Error(
          `Alias "${normalized}" for "${name}" conflicts with existing icon name "${iconWithAliasName.name}" in ${options.source || 'registry'}.`
        );
      }
    }

    aliasMap.set(normalized, name);
  }
  return stored;
}

for (const definition of iconDefinitions) {
  registerDefinition(definition, { strict: true, source: 'iconDefinitions' });
}

export function getIcon(name: AnyIconName): IconDefinition | undefined {
  const normalized = normalizeName(name);
  if (!normalized) return undefined;
  const direct = iconMap.get(normalized);
  if (direct) return direct;
  const target = aliasMap.get(normalized);
  return target ? iconMap.get(target) : undefined;
}

export function hasIcon(name: AnyIconName): boolean {
  return !!getIcon(name);
}

export function listIcons(): string[] {
  return Array.from(iconMap.keys()).sort();
}

export function listIconAliases(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [alias, target] of aliasMap.entries()) {
    out[alias] = target;
  }
  return out;
}

export function registerIcon(definition: IconDefinition): void {
  const stored = registerDefinition(definition);
  if (stored) rememberRegisteredIcon(stored);
}

export function registerIcons(definitions: IconDefinition[]): void {
  definitions.forEach((definition) => registerIcon(definition));
}

export function resolveIcon(name: AnyIconName, variant: IconVariant = 'outline'): ResolvedIcon | undefined {
  const definition = getIcon(name);
  if (!definition) return undefined;

  const requested = definition.variants[variant];
  const glyph: IconGlyph = requested || definition.variants.outline;

  const resolvedVariant: IconVariant = requested ? variant : 'outline';
  return {
    definition,
    viewBox: definition.viewBox || DEFAULT_ICON_VIEWBOX,
    variant: resolvedVariant,
    glyph
  };
}
