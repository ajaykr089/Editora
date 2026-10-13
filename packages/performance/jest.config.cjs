// The package's `test` script was plain `jest` with no TypeScript transform, so none of its tests
// could be parsed. Same babel-jest setup as packages/plugins/jest.config.cjs.
module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/__tests__/setup.cjs'],
  testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
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
