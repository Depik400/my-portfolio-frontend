module.exports = {
    env: {
      node: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:vue/vue3-recommended',
      "prettier",
      '@vue/eslint-config-typescript',
    ],
    rules: {
      // override/add rules settings here, such as:
      // 'vue/no-unused-vars': 'error'
        'object-curly-spacing': ['warn',  'always'],
        'semi': ['warn', 'always'],
    }
  }