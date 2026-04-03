export type IconVariant = 'outline' | 'solid' | 'duotone';
export type IconWeight = 'thin' | 'regular' | 'bold';

export type IconTag =
  | 'path'
  | 'circle'
  | 'ellipse'
  | 'line'
  | 'polyline'
  | 'polygon'
  | 'rect'
  | 'g';

export type IconAttrValue = string | number | boolean | undefined;

export type IconNode = {
  tag: IconTag;
  attrs?: Record<string, IconAttrValue>;
  children?: IconNode[];
};

export type IconGlyph = {
  nodes: IconNode[];
};

export type IconDefinition = {
  name: string;
  aliases?: string[];
  viewBox?: string;
  rtlMirror?: boolean;
  tags?: string[];
  categories?: string[];
  variants: {
    outline: IconGlyph;
    solid?: IconGlyph;
    duotone?: IconGlyph;
  };
};

export type IconRenderOptions = {
  variant?: IconVariant;
  iconWeight?: IconWeight;
  size?: number | string;
  color?: string;
  secondaryColor?: string;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  className?: string;
  style?: string;
  title?: string;
  ariaLabel?: string;
  decorative?: boolean;
  rotate?: number;
  flip?: 'horizontal' | 'vertical' | 'both';
  rtl?: boolean;
  attrs?: Record<string, string | number | boolean | undefined>;
};

export type ResolvedIcon = {
  definition: IconDefinition;
  viewBox: string;
  variant: IconVariant;
  glyph: IconGlyph;
};
