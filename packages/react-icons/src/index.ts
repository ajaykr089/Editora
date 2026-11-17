export { Icon } from './Icon';
export { createIcon } from './createIcon';
export { defineIcon } from './defineIcon';
export { IconContext, IconProvider, useIconContext, defaultIconContext } from './IconContext';
export { Icons, icons, iconNames, getIconComponent } from './icons';

export * from './icons';

export type { IconBaseProps, IconComponent, IconContextValue, IconFlip, IconProps, NamedIconProps, IconWeight } from './types';
export type { IconName } from './icons';

// Icon search lives in @editora/icons; re-exported so an icon picker needs one import.
export { searchIcons, listIconCategories } from '@editora/icons';
export type { IconSearchField, IconSearchOptions, IconSearchResult } from '@editora/icons';
