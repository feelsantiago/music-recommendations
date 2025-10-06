import nx from '@nx/eslint-plugin';
import angular from 'angular-eslint';
import tseslint from 'typescript-eslint';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  ...nx.configs['flat/angular'],
  ...tseslint.config({
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended],
    rules: {},
  }),
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'msc',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'msc',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@angular-eslint/prefer-inject': 'off',
      '@angular-eslint/no-input-rename': 'off',
    },
  },
];
