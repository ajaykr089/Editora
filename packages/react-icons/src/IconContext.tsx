import React from 'react';
import type { IconContextValue } from './types';

const defaultIconContext: IconContextValue = {
  variant: 'outline',
  iconWeight: 'regular',
  size: 15,
  color: 'currentColor',
  secondaryColor: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
};

// The context's own default must not pre-fill `strokeWidth` or `iconWeight`. Icon resolves the stroke as
// prop width > prop weight > context width > context weight > built-in, and a pre-filled value here would
// always beat one the provider never set: iconWeight always resolved to 'regular', so a provider's
// `strokeWidth` was silently ignored. `defaultIconContext` stays exported unchanged for anyone reading it.
const { strokeWidth: _defaultStrokeWidth, iconWeight: _defaultIconWeight, ...baseContext } = defaultIconContext;

const IconContext = React.createContext<IconContextValue>(baseContext);

export type IconProviderProps = {
  value?: IconContextValue;
  children?: React.ReactNode;
};

export function IconProvider({ value, children }: IconProviderProps): JSX.Element {
  const parent = React.useContext(IconContext);

  const merged = React.useMemo<IconContextValue>(() => {
    if (!value) return parent;
    return { ...parent, ...value };
  }, [parent, value]);

  return <IconContext.Provider value={merged}>{children}</IconContext.Provider>;
}

export function useIconContext(): IconContextValue {
  return React.useContext(IconContext);
}

export { IconContext, defaultIconContext };
