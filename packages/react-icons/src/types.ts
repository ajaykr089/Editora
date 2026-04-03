import type React from 'react';
import type { IconVariant, IconWeight } from '@editora/icons';

export type IconFlip = 'horizontal' | 'vertical' | 'both';

export type IconBaseProps = Omit<React.SVGProps<SVGSVGElement>, 'color'> & {
  name: string;
  variant?: IconVariant;
  iconWeight?: IconWeight;
  size?: number | string;
  color?: string;
  secondaryColor?: string;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  decorative?: boolean;
  title?: string;
  ariaLabel?: string;
  rotate?: number;
  flip?: IconFlip;
  rtl?: boolean;
};

export type IconProps = Partial<Omit<IconBaseProps, 'name'>> & Pick<IconBaseProps, 'name'>;

export type NamedIconProps = Omit<IconProps, 'name'>;

export type IconContextValue = Omit<NamedIconProps, 'children' | 'dangerouslySetInnerHTML'>;

export type IconComponent = React.ForwardRefExoticComponent<NamedIconProps & React.RefAttributes<SVGSVGElement>>;

export type { IconWeight };
