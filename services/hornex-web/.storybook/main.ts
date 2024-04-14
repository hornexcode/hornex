import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  webpackFinal: async (config, { configType }) => {
    if (!config.resolve) {
      return config;
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      '@/lib': path.resolve(__dirname, '../src/lib'),
      '@/components': path.resolve(__dirname, '../src/components'),
      '@/styles': path.resolve(__dirname, '../src/styles'),
      '@/hooks': path.resolve(__dirname, '../src/hooks'),
      '@/utils': path.resolve(__dirname, '../src/utils'),
      '@/stories': path.resolve(__dirname, '../src/stories'),
      '@/public': path.resolve(__dirname, '../public'),
      '@/': path.resolve(__dirname, '../src'),
    };
    return config;
  },
};
export default config;
