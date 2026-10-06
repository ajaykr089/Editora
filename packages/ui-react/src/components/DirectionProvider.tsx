import * as React from 'react';

import '@editora/ui-core/direction-provider';
import { createUIElement } from './_internals';

export const DirectionProvider = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>((props, ref) =>
  createUIElement('ui-direction-provider', { ref, ...props })
);
DirectionProvider.displayName = 'DirectionProvider';
