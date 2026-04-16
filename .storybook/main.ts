import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ['./stories/**/*.stories.@(js|jsx|ts|tsx)'],
  docs: {
    autodocs: true,
  },
  typescript: {
    // The default docgen pass trips over a few locally-aliased source types
    // during static Storybook builds. We keep authored docs enabled and skip
    // runtime prop introspection so preview/docs builds stay reliable.
    reactDocgen: false,
  },
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: [
          { find: '@editora/core', replacement: path.resolve(__dirname, '../packages/core/src') },
          { find: '@editora/react', replacement: path.resolve(__dirname, '../packages/react/src') },
          { find: '@editora/plugins', replacement: path.resolve(__dirname, '../packages/plugins/src') },
          { find: '@editora/themes', replacement: path.resolve(__dirname, '../packages/themes/src') },
          { find: '@editora/toast', replacement: path.resolve(__dirname, '../packages/editora-toast/src') },
          { find: '@editora/editor', replacement: path.resolve(__dirname, '../packages/react/src') },
          { find: '@editora/icons', replacement: path.resolve(__dirname, '../packages/icons/src') },
          { find: '@editora/react-icons', replacement: path.resolve(__dirname, '../packages/react-icons/src') },
          // Resolve UI packages to local source during Storybook development.
          { find: '@editora/ui-core/runtime', replacement: path.resolve(__dirname, '../packages/ui-core/src/runtime.ts') },
          { find: '@editora/ui-core', replacement: path.resolve(__dirname, '../packages/ui-core/src/index.ts') },
          { find: '@editora/ui-react', replacement: path.resolve(__dirname, '../packages/ui-react/src/index.tsx') },
        ],
      }
    });
  },
};

export default config;
