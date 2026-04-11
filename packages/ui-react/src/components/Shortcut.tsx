import React from 'react';
import { Kbd, type KbdProps } from './Kbd';

export type ShortcutProps = KbdProps;

export const Shortcut = React.forwardRef<HTMLElement, ShortcutProps>(function Shortcut(
  { size = 'sm', tone = 'default', ...rest },
  forwardedRef
) {
  return <Kbd ref={forwardedRef} size={size} tone={tone} {...rest} />;
});

Shortcut.displayName = 'Shortcut';

export default Shortcut;
