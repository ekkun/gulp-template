'use strict';

module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-standard-scss'],
  plugins: ['stylelint-scss'],
  ignoreFiles: ['**/node_modules/**'],
  overrides: [
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss',
    },
  ],
  rules: {
    'selector-id-pattern': null,
    'selector-class-pattern': null,
    'keyframes-name-pattern': null,
    'scss/at-mixin-pattern': null,
    'scss/dollar-variable-pattern': null,
    'scss/percent-placeholder-pattern': null,
    'scss/at-extend-no-missing-placeholder': null,
    'function-url-quotes': ['always', { severity: 'warning' }],
    'number-max-precision': [3, { severity: 'warning' }],
    'alpha-value-notation': ['number', { severity: 'warning' }],
    'font-family-name-quotes': [
      'always-where-recommended',
      { severity: 'warning' },
    ],
    'property-no-vendor-prefix': [
      true,
      {
        ignoreProperties: ['appearance', 'text-size-adjust'],
      },
    ],
  },
};
