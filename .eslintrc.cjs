module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  settings: {
    react: { version: 'detect' },
  },
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  ignorePatterns: [
    'dist/**',
    'node_modules/**',
    '**/*.d.ts',
    'storybook-static/**',
  ],
  overrides: [
    {
      // These entry points reference custom-elements.d.ts on purpose so consumers of the
      // published package pick up the custom element typings; an import would not carry them.
      files: ['packages/ui-react/src/{client,index,server}.{ts,tsx}'],
      rules: { '@typescript-eslint/triple-slash-reference': 'off' },
    },
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-unused-vars': 'off',
    // Pre-existing patterns across the codebase, downgraded to warnings so
    // `lint` is usable as a real CI gate without a large unrelated cleanup.
    // Revisit tightening these once the backlog they represent is addressed.
    'no-empty': ['warn', { allowEmptyCatch: true }],
    'no-useless-escape': 'warn',
    'no-control-regex': 'warn',
    'no-extra-boolean-cast': 'warn',
    '@typescript-eslint/no-this-alias': 'warn',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
    '@typescript-eslint/ban-types': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',
  },
};
