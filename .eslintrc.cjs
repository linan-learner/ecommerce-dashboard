module.exports = {
    root: true,
    env: {
      browser: true,
      node: true,
      es2021: true,
    },
    extends: [
      'eslint:recommended',
      '@vue/typescript/recommended',
      'plugin:vue/vue3-recommended',
    ],
    parserOptions: {
      ecmaVersion: 'latest',
      parser: '@typescript-eslint/parser',
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  }