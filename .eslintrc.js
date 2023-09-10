const { builtinModules } = require("module");

const {
  dependencies,
  devDependencies,
} = require("./services/hx-web/package.json");

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "prettier",
    "react-app",
    "plugin:react-hooks/recommended",
    "standard-with-typescript",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
    "prettier",
    "simple-import-sort",
    "import",
    "react",
  ],
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          // side-effect imports, e.g. `import 'some-polyfill'`
          ["^\\u0000"],

          // Node.js builtins
          [`^(${builtinModules.join("|")})(/|$)`],

          // dependencies in package.json for axios-web
          [...Object.keys(dependencies), ...Object.keys(devDependencies)].map(
            (key) => `^${key}`
          ),
        ],
      },
    ],
    "spaced-comment": "error",
    "prettier/prettier": [
      "error",
      {
        printWidth: 100,
        semi: false,
        singleQuote: true,
        trailingComma: "es5",
        bracketSpacing: true,
        arrowParens: "always",
      },
    ],
  },
};
