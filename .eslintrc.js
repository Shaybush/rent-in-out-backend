module.exports = {
	parser: '@typescript-eslint/parser', // Specifies the ESLint parser
	extends: [
		'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
		'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
	],
	parserOptions: {
		ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
		sourceType: 'module', // Allows for the use of imports
	},
	rules: {
		// Possible Errors
		'no-console': 'off', // Disables warning for using console (useful during development)
		'no-template-curly-in-string': 'error', // Prevents accidental use of template strings without expressions
		'require-atomic-updates': 'warn', // Warns about possible race conditions in assignments
		'prefer-const': 'off',

		// Best Practices
		'block-scoped-var': 'error', // Enforces block scope for variables
		curly: ['error', 'multi-line'], // Enforces curly braces for multi-line control structures
		eqeqeq: ['error', 'always'], // Requires the use of === and !== instead of == and !=
		'no-alert': 'error', // Disallows the use of alert, confirm, and prompt in browser environments
		'no-caller': 'error', // Disallows the use of arguments.caller and arguments.callee
		'no-empty-function': 'warn', // Warns against empty function declarations
		'no-eq-null': 'error', // Disallows comparisons to null without a type-checking operator
		'no-eval': 'error', // Disallows the use of eval() function
		'no-extend-native': 'error', // Disallows extending native objects
		'no-floating-decimal': 'error', // Disallows floating decimals without a leading 0
		'no-implied-eval': 'error', // Disallows the use of implied eval() through setTimeout, setInterval, etc.
		'no-iterator': 'error', // Disallows the use of the __iterator__ property
		'no-loop-func': 'warn', // Warns against creating functions within loops
		'no-multi-spaces': 'error', // Disallows multiple spaces in a row where they're not used for indentation
		'no-multi-str': 'error', // Disallows multiline strings
		'no-new': 'warn', // Warns against using 'new' for side-effects
		'no-octal-escape': 'error', // Disallows octal escape sequences in string literals
		'no-proto': 'error', // Disallows use of the __proto__ property
		'no-return-assign': ['error', 'always'], // Disallows assignment operators in return statements
		'no-return-await': 'error', // Disallows unnecessary return await
		'no-script-url': 'error', // Disallows javascript: urls
		'no-self-compare': 'error', // Disallows comparisons where both sides are exactly the same
		'no-sequences': 'error', // Disallows comma operators
		'no-throw-literal': 'error', // Restricts what can be thrown as an exception
		'no-useless-call': 'error', // Disallows unnecessary usage of call() and apply()
		'no-useless-concat': 'error', // Disallows unnecessary string concatenation
		'prefer-promise-reject-errors': 'error', // Requires using Error objects as Promise rejection reasons
		'require-await': 'warn', // Warns against async functions without await expressions
		'wrap-iife': ['error', 'any'], // Requires immediate function invocation to be wrapped in parentheses

		// Node.js and CommonJS
		'global-require': 'warn', // Enforces require() on the top-level module scope
		'handle-callback-err': 'warn', // Requires error handling in callbacks
		'no-mixed-requires': ['warn', { grouping: true, allowCall: true }], // Disallows mixing regular variable declarations with require
		'no-new-require': 'error', // Disallows new require
		'no-path-concat': 'error', // Disallows string concatenation with __dirname and __filename
		'no-process-env': 'off', // Turn off process.env to allow environment variable use
		'no-process-exit': 'warn', // Warns against process.exit() usage
		'no-restricted-modules': 'off', // Allows use of any modules
		'no-sync': 'warn', // Warns against synchronous methods

		// Stylistic Issues
		'consistent-this': ['error', 'self'], // Enforces consistent naming when capturing the current execution context
		'eol-last': 'error', // Enforces newline at the end of files
		'no-array-constructor': 'error', // Disallows Array constructors
		'no-lonely-if': 'error', // Disallows if statements as the only statement in else blocks
		'no-nested-ternary': 'warn', // Warns against nested ternary expressions
		'no-new-object': 'error', // Disallows Object constructors
		'no-trailing-spaces': 'error', // Disallows trailing whitespace
		'one-var': ['error', 'never'], // Enforces variables to be declared either together or separately per function
		semi: ['error', 'always'], // Requires semicolons at the end of statements
		'semi-style': ['error', 'last'], // Enforces placing semicolons at the end of statements

		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'@typescript-eslint/ban-types': 'off',
	},
};
