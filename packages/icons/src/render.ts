import { getIcon } from './registry';
import { normalizeIconSize, renderIconDefinition } from './renderer';
import type { IconName } from './names';
import type { IconRenderOptions } from './types';

export { normalizeIconSize };

export function renderIconSvg(name: IconName | (string & {}), options: IconRenderOptions = {}): string {
  const definition = getIcon(name);
  return definition ? renderIconDefinition(definition, options) : '';
}

export function iconToDataUri(name: IconName | (string & {}), options: IconRenderOptions = {}): string {
  const svg = renderIconSvg(name, options);
  if (!svg) return '';
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
