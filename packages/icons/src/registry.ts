import { iconDefinitions } from './definitions';
import type { IconDefinition, IconGlyph, IconVariant, ResolvedIcon } from './types';

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

function registerDefinition(definition: IconDefinition, options: RegisterOptions = {}): void {
  const name = normalizeName(definition.name);
  if (!name) return;

  if (options.strict && iconMap.has(name)) {
    throw new Error(`Duplicate icon name "${name}" detected in ${options.source || 'registry'}.`);
  }

  iconMap.set(name, { ...definition, name });

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
}

for (const definition of iconDefinitions) {
  registerDefinition(definition, { strict: true, source: 'iconDefinitions' });
}

export function getIcon(name: string): IconDefinition | undefined {
  const normalized = normalizeName(name);
  if (!normalized) return undefined;
  const direct = iconMap.get(normalized);
  if (direct) return direct;
  const target = aliasMap.get(normalized);
  return target ? iconMap.get(target) : undefined;
}

export function hasIcon(name: string): boolean {
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
  registerDefinition(definition);
}

export function registerIcons(definitions: IconDefinition[]): void {
  definitions.forEach((definition) => registerDefinition(definition));
}

export function resolveIcon(name: string, variant: IconVariant = 'outline'): ResolvedIcon | undefined {
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
