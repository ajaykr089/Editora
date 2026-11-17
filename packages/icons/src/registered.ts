// Icons added or replaced with registerIcon / registerIcons, by name. The registry writes here and the
// `@editora/icons/renderer` entry reads it, so a component built from one glyph (`<CheckIcon />` in
// @editora/react-icons) still draws a `check` the app registered, without importing the whole icon set.
import type { IconDefinition } from './types';

const registered = new Map<string, IconDefinition>();

/** @internal Called by the registry for every icon registered after the built-in set. */
export function rememberRegisteredIcon(definition: IconDefinition): void {
  registered.set(definition.name, definition);
}

/**
 * The icon registered with `registerIcon` or `registerIcons` under this exact name, if any. Built-in icons
 * that were never replaced are not listed: use `getIcon` from the package root to look those up.
 */
export function getRegisteredIcon(name: string): IconDefinition | undefined {
  return registered.get(name);
}
