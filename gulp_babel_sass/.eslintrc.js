module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    //es6: true,
    //node: true,
  },
  parserOptions: {
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'plugin:eslint-comments/recommended'],
  rules: {
    'prefer-const': 'error',
  },
};
