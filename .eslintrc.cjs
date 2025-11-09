/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
  ],
  rules: {
    // These opinionated rules are enabled in stylistic-type-checked above.
    // Feel free to reconfigure them to your own preference.
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/non-nullable-type-assertion-style": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: { attributes: false },
      },
    ],
  },
  overrides: [
    {
      // Target all files ending with .test.ts or .spec.ts
      files: ["**/*.test.ts", "**/*.spec.ts", "**/__tests__/**/*"],
      // Enable Jest-specific environments
      env: {
        jest: true,
      },
      // Extend configurations for testing if you have them
      // extends: ["plugin:jest/recommended"],
      rules: {
        // You can selectively disable or modify rules for test files here.
        // For example, to disable the unbound-method rule:
        "@typescript-eslint/unbound-method": "off",

        // "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
        // "@typescript-eslint/no-misused-promises": "off", 
        // "@typescript-eslint/explicit-function-return-type": "off", 
      },
    },
  ],
};

module.exports = config;
