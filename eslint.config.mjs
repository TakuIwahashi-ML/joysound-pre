import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Next.js + TypeScript基本設定
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Prettier統合
  ...compat.extends('prettier'),

  {
    plugins: {
      prettier: await import('eslint-plugin-prettier').then((m) => m.default),
    },
    rules: {
      // Prettier統合ルール
      'prettier/prettier': 'error',

      // TypeScript推奨ルール
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-const': 'error',

      // React/Next.js最適化ルール
      'react/prop-types': 'off', // TypeScriptを使用するため無効
      'react/react-in-jsx-scope': 'off', // Next.js 13+では不要
      'react-hooks/exhaustive-deps': 'warn',

      // Import/Export ルール
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      // コード品質ルール
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'prefer-const': 'error',

      // Joysoundプロジェクト固有ルール
      'naming-convention': 'off', // TypeScriptの命名規則を優先
    },
  },

  // ファイル固有の設定
  {
    files: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'],
    rules: {
      'no-console': 'off', // テストファイルではconsole.logを許可
    },
  },

  // 設定ファイルの除外
  {
    ignores: [
      '.next/**',
      'out/**',
      'node_modules/**',
      '.env*',
      'public/**',
      '*.config.js',
      '*.config.mjs',
    ],
  },
];

export default eslintConfig;
