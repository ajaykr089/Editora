import React, { useImperativeHandle, useRef } from 'react';

export type AnchorProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

export const Anchor = React.forwardRef<HTMLElement, AnchorProps>(function Anchor(
  { children, ...rest },
  forwardedRef
) {
  const ref = useRef<HTMLElement | null>(null);
  useImperativeHandle(forwardedRef, () => ref.current as HTMLElement);
  return React.createElement('ui-anchor', { ref, ...rest }, children);
});

Anchor.displayName = 'Anchor';

export default Anchor;
