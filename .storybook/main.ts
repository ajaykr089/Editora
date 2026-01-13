import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
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
          '@rte-editor/core': path.resolve(__dirname, '../packages/core/src'),
          '@rte-editor/react': path.resolve(__dirname, '../packages/react/src'),
          '@rte-editor/plugins': path.resolve(__dirname, '../packages/plugins/src'),
          '@rte-editor/themes': path.resolve(__dirname, '../packages/themes/src'),
        },
      },
      server: {
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true
          },
          '/uploads': {
            target: 'http://localhost:3001',
            changeOrigin: true
          }
        }
      }
    });
  },
};

export default config;
