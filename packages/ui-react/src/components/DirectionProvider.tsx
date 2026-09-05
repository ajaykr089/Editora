import * as React from 'react';

import '@editora/ui-core/direction-provider';
export const DirectionProvider = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) => (
  <ui-direction-provider ref={ref as any} {...props} />
));
DirectionProvider.displayName = 'DirectionProvider';
