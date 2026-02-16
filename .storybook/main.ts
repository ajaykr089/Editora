import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ['./stories/**/*.stories.@(js|jsx|ts|tsx)'],
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
        alias: {
          '@editora/core': path.resolve(__dirname, '../packages/core/src'),
          '@editora/react': path.resolve(__dirname, '../packages/react/src'),
          '@editora/plugins': path.resolve(__dirname, '../packages/plugins/src'),
          '@editora/themes': path.resolve(__dirname, '../packages/themes/src'),
          '@editora/toast': path.resolve(__dirname, '../packages/editora-toast/src'),
        },
      }
    });
  },
};

export default config;
