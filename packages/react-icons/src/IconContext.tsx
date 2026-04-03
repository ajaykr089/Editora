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

const IconContext = React.createContext<IconContextValue>(defaultIconContext);

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
