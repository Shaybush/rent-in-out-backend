import tseslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';


export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        // project: './tsconfig.json',
        // tsconfigRootDir: __dirname,
      },
    },
    ignorePatterns: [
      'index.d.ts'
    ],
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // Avoid redundant spaces
      'no-multi-spaces': 'error',
      'no-trailing-spaces': 'error',
      'space-in-parens': ['error', 'never'],
      'space-before-blocks': ['error', 'always'],
      'space-before-function-paren': ['error', 'never'],
      'spaced-comment': ['error', 'always', { 'exceptions': ['-', '+'] }],

      // Other necessary rules
      'no-unused-vars': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': 'error',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
    }
  },
];
