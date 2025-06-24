const js = require('@eslint/js');

module.exports = [
	js.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 'latest',
            sourceType: 'commonjs',
            globals: {
                require: 'readonly',
                module: 'readonly',
                process: 'readonly',
                __dirname: 'readonly',
                console: 'readonly',
                fetch: 'readonly',
            }
		},
		rules: {
            'no-unused-vars': 'warn',
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
        },
	},
];