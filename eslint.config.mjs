import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    rules: {
      'no-unused-private-class-members': 'error',
      'class-methods-use-this': ['error', { exceptMethods: ['showError'] }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
];
