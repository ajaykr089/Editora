import React, { ReactNode } from 'react';
import { Plugin } from '@editora/core';

interface DynamicProviderWrapperProps {
  plugins: Plugin[];
  children: ReactNode;
}

/**
 * DynamicProviderWrapper dynamically renders provider hierarchy from plugins
 * This allows plugins to have their own React context providers without
 * requiring them to be hardcoded in the main component
 */
export const DynamicProviderWrapper: React.FC<DynamicProviderWrapperProps> = ({
  plugins,
  children
}) => {
  // Get all plugins that have providers
  const pluginsWithProviders = plugins.filter(p => p.context?.provider);

  // If no plugins have providers, just render children
  if (pluginsWithProviders.length === 0) {
    return <>{children}</>;
  }

  // Reduce plugins with providers into nested provider structure
  // Start from the innermost (children) and wrap outward
  const wrappedChildren = pluginsWithProviders.reduce(
    (acc, plugin) => {
      const Provider = plugin.context!.provider as React.ComponentType<{
        children?: React.ReactNode;
      }>;
      return (
        <Provider key={plugin.name}>
          {acc}
        </Provider>
      );
    },
    <>{children}</>
  );

  return wrappedChildren;
};
