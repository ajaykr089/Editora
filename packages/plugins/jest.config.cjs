module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/content-rules/src/**/*.test.js',
    '<rootDir>/citations/src/**/*.test.js',
    '<rootDir>/approval-workflow/src/**/*.test.js',
    '<rootDir>/pii-redaction/src/**/*.test.js',
    '<rootDir>/smart-paste/src/**/*.test.js',
  ],
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
  moduleFileExtensions: ['js', 'json'],
  clearMocks: true,
  restoreMocks: true,
};
