const { builtinModules } = require('module');

const {
  dependencies,
  devDependencies,
} = require('./services/hx-web/package.json');

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'next/core-web-vitals',
    'prettier',
    'react-app',
    'plugin:react-hooks/recommended',
    'standard-with-typescript',
  ],

  parserOptions: {
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
    'simple-import-sort',
    'import',
    'react',
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
        semi: false,
        singleQuote: true,
        trailingComma: 'es5',
        bracketSpacing: true,
        arrowParens: 'always',
      },
    ],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // side-effect imports, e.g. `import 'some-polyfill'`
          ['^\\u0000'],

          // Node.js builtins
          [`^(${builtinModules.join('|')})(/|$)`],

          // dependencies in package.json for hx-web
          [...Object.keys(dependencies), ...Object.keys(devDependencies)].map(
            (key) => `^${key}`,
          ),
        ],
      },
    ],
    'spaced-comment': 'error',
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
        semi: false,
        singleQuote: true,
        trailingComma: 'es5',
        bracketSpacing: true,
        arrowParens: 'always',
      },
    ],
  },
  overrides: [
    {
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
      rules: {
        'import/no-unresolved': 'error',
        'no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            caughtErrors: 'all',
            caughtErrorsIgnorePattern: '^_',
            ignoreRestSiblings: true,
            varsIgnorePattern: '^_',
          },
        ],
      },
    },
  ],
};
