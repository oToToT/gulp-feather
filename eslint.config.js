const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    files: ['index.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: globals.node,
    },
    rules: {
      'linebreak-style': ['error', 'unix'],
      'no-var': 'off',
      'no-param-reassign': ['error', {
        props: true,
        ignorePropertyModificationsForRegex: ['^file$'],
      }],
    },
  },
];
