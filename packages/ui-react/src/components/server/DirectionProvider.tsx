import * as React from 'react';

import { createUIElement } from '../_createElement';

export const DirectionProvider = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) =>
  createUIElement('ui-direction-provider', { ref, ...props })
);
DirectionProvider.displayName = 'DirectionProvider';
