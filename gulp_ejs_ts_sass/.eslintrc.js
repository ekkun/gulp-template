module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'prefer-const': 'error',
    'prefer-regex-literals': 'error',
    'no-use-before-define': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    //'@typescript-eslint/no-unnecessary-type-constraint': 'error',
    //'@typescript-eslint/no-use-before-define': ['error'],
    'no-param-reassign': [2, { props: false }],
    'import/extensions': [
      'error',
      {
        js: 'never',
        ts: 'never',
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.ts'],
      },
    },
  },
};
