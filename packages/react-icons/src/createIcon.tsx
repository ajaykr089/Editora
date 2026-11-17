import React from 'react';
import type { IconName } from '@editora/icons';
import { Icon } from './Icon';
import { toComponentName } from './defineIcon';
import type { IconComponent, NamedIconProps } from './types';

/**
 * A component that draws an icon by name when it renders, so it follows registerIcon. It uses <Icon>, which
 * brings the whole icon set into a bundle: for an icon you have as a definition, defineIcon() does not.
 */
export function createIcon(name: IconName | (string & {}), displayName?: string): IconComponent {
  const Component = React.forwardRef<SVGSVGElement, NamedIconProps>(function EditoraNamedIcon(props, ref) {
    return <Icon ref={ref} name={name} {...props} />;
  });

  Component.displayName = displayName || toComponentName(name);
  return Component;
}
