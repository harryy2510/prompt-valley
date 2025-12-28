import type { Config } from 'prettier'

const config: Config = {
	arrowParens: 'always',
	overrides: [
		{
			files: ['*.jsonc'],
			options: {
				parser: 'json',
			},
		},
	],
	semi: false,
	singleQuote: true,
	tabWidth: 2,
	trailingComma: 'all',
	useTabs: true,
}

export default config
