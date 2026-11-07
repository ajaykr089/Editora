import type { IconDefinition } from '@editora/icons';
import { renderIconDefinition } from '@editora/icons/renderer';
import { registerIconDefinitions } from './icons';

type IconDefinitions = IconDefinition | IconDefinition[] | Record<string, IconDefinition>;

function isDefinition(value: unknown): value is IconDefinition {
  return !!value && typeof value === 'object' && typeof (value as IconDefinition).name === 'string' && !!(value as IconDefinition).variants;
}

/**
 * Registers built-in icons by definition, so they render without loading the whole set:
 *
 *   import { addIcons } from '@editora/ui-core/add-icons';
 *   import { checkIcon, chevronDownIcon } from '@editora/icons/glyphs';
 *   addIcons(checkIcon, chevronDownIcon);
 *
 * Accepts definitions, arrays of them or a module namespace. Each icon is found by its name and its
 * aliases (`check`, `tick`, `done`) and keeps its variants and weights. Call it before the icons
 * first render: a name that is not registered yet loads the full set, as before.
 */
export function addIcons(...definitions: IconDefinitions[]): void {
  const list: IconDefinition[] = [];
  for (const entry of definitions) {
    if (isDefinition(entry)) list.push(entry);
    else if (Array.isArray(entry)) list.push(...entry.filter(isDefinition));
    else if (entry && typeof entry === 'object') list.push(...Object.values(entry).filter(isDefinition));
  }
  registerIconDefinitions(list, renderIconDefinition);
}
