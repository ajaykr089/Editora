import React from 'react';
import { getIcon } from '@editora/icons';
import { IconSvg, named } from './defineIcon';
import type { IconProps } from './types';

// Any icon by name: a built-in one, an alias, or one added with registerIcon. Looking names up needs the
// registry, so using <Icon> brings the whole icon set into a bundle; the named icons (<CheckIcon />) do not.
export const Icon = /*#__PURE__*/ named(/*#__PURE__*/ React.forwardRef<SVGSVGElement, IconProps>(function Icon({ name, ...rest }, ref) {
  const definition = getIcon(name);
  if (!definition) return null;
  return <IconSvg ref={ref} definition={definition} fallbackLabel={name} {...rest} />;
}), 'Icon');

export default Icon;
