import { iconDefinitions, iconNameList } from './definitions';
import { getIcon, hasIcon, listIconAliases, listIcons, registerIcon, registerIcons, resolveIcon } from './registry';
import { iconToDataUri, normalizeIconSize, renderIconSvg } from './render';
import { listIconCategories, searchIcons } from './search';

export type { IconSearchField, IconSearchOptions, IconSearchResult } from './search';

export type { IconName } from './names';
export { getRegisteredIcon } from './registered';
export { renderIconDefinition } from './renderer';

export type {
  IconAttrValue,
  IconDefinition,
  IconGlyph,
  IconNode,
  IconRenderOptions,
  IconTag,
  IconVariant,
  IconWeight,
  ResolvedIcon
} from './types';

export {
  iconDefinitions,
  iconNameList,
  getIcon,
  hasIcon,
  listIcons,
  listIconAliases,
  registerIcon,
  registerIcons,
  resolveIcon,
  renderIconSvg,
  iconToDataUri,
  searchIcons,
  listIconCategories,
  normalizeIconSize
};

/**
 * Bridge helper for @editora/ui-core icon registry.
 * Usage:
 * registerWithEditoraUI(registerIcon);
 */
export function registerWithEditoraUI(registerFn: (name: string, svg: string) => void): void {
  for (const name of iconNameList) {
    const svg = renderIconSvg(name, { variant: 'outline', decorative: true });
    if (svg) registerFn(name, svg);
  }
}
