// The package's `test` script was plain `jest` with no TypeScript transform, so none of its tests
// could be parsed. Same babel-jest setup as packages/plugins/jest.config.cjs.
module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
  // PerformanceMonitor.test.ts predates this config and has never run: it needs `window`
  // (jest-environment-jsdom is not installed in this repo) and may have drifted from the
  // implementation. Left out rather than silently "fixed"; see the notes on the commit that added this.
  testPathIgnorePatterns: ['/node_modules/', 'PerformanceMonitor\\.test\\.ts$'],
  transform: {
    '^.+\\.tsx?$': [
      'babel-jest',
      {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          ['@babel/preset-typescript', { allowDeclareFields: true }],
        ],
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  clearMocks: true,
  restoreMocks: true,
};
