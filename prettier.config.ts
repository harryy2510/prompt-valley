import type { Config } from 'prettier'

const config: Config = {
  overrides: [
    {
      files: ['*.jsonc'],
      options: {
        parser: 'json',
      },
    },
  ],
  arrowParens: 'always',
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
}

export default config
