module.exports = {
  env: {
    browser: true,
  },
  extends: ['prettier', 'plugin:react-hooks/recommended', 'next'],
  settings: {
    next: {
      rootDir: 'services/hx-web/',
    },
  },
  plugins: ['@typescript-eslint', 'simple-import-sort', 'prettier', 'react'],
  parser: '@typescript-eslint/parser',
  rules: {
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

          // dependencies in package.json for hx-web
          // [...Object.keys(dependencies), ...Object.keys(devDependencies)].map(
          //   (key) => `^${key}`
          // ),
        ],
      },
    ],
    'spaced-comment': 'error',
    'react-hooks/exhaustive-deps': 0,
  },
};
