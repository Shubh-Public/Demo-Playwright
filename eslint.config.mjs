import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'playwright-report/**',
      'allure-report/**',
      'allure-results/**',
      'test-results/**',
      'blob-report/**',
      'mcp-output/**',
      'logs/**',
      'playwright/.auth/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
);
