import { iconDefinitions, iconNameList } from './definitions';
import { getIcon, hasIcon, listIconAliases, listIcons, registerIcon, registerIcons, resolveIcon } from './registry';
import { iconToDataUri, renderIconSvg } from './render';

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
  iconToDataUri
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
