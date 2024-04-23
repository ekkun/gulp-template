module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  parserOptions: {
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'plugin:eslint-comments/recommended'],
  rules: {
    'prefer-const': 'error',
  },
};
