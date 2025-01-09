import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import globals from 'globals';
import svelteConfig from './svelte.config.js';
import ts from 'typescript-eslint';

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	prettier,
	...eslintPluginSvelte.configs.recommended,
	...eslintPluginSvelte.configs.prettier,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			},
			parserOptions: { svelteConfig }
		}
	},
	{
		files: ['**/*.svelte', '*.svelte'],

		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/']
	},
	{
		rules: {
			'no-undef': 'off',
			'@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_' }],
			'svelte/prefer-const': [
				'error',
				{
					destructuring: 'any',
					ignoreReadonly: true
				}
			]
		}
	}
);
