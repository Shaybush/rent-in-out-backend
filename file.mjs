import tseslint from '@typescript-eslint/eslint-plugin';
import tseslintPrefer from 'eslint-plugin-prefer-import';
import parser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';

export default [
	{
		files: ['src/**/*.ts'],
		languageOptions: {
			parser,
			parserOptions: {
				ecmaVersion: 2020,
				sourceType: 'module',
				// project: './tsconfig.json',
				// tsconfigRootDir: __dirname,
			},
		},
		plugins: {
			'@typescript-eslint': tseslint,
			'prefer-import': tseslintPrefer,
			prettier: prettier,
		},
		rules: {
			// Avoid redundant spaces
			'no-multi-spaces': 'error',
			'no-trailing-spaces': 'error',
			'space-in-parens': ['error', 'never'],
			'space-before-blocks': ['error', 'always'],
			'space-before-function-paren': ['error', 'never'],
			'spaced-comment': ['error', 'always', { exceptions: ['-', '+'] }],
			'prefer-import/prefer-import-over-require': 'error',

			// Other necessary rules
			// 'no-unused-vars': 'error',
			eqeqeq: ['error', 'always'],
			curly: 'error',
			semi: ['error', 'always'],
			quotes: ['error', 'single'],
			indent: ['error', 2],
		},
	},
];
