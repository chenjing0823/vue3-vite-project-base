module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: [
    // add more generic rulesets here, such as:
    'plugin:prettier/recommended',
    'eslint-config-prettier',
    'eslint:recommended',
    'plugin:vue/base',
    './.eslintrc-auto-import.json'
    // 'plugin:vue/vue3-recommended',
    // 'plugin:vue/recommended' // Use this if you are using Vue.js 2.x.
  ],
  plugins: ['vue', 'prettier'],
  globals: {
    defineEmits: true,
    defineProps: true,
    defineExpose: true,
    ElLoading: true,
    AMap: true
  },
  rules: {
    'no-useless-escape': 0,
    // override/add rules settings here, such as:
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prefer-const': 2,
    semi: ['error', 'never'],
    'vue/no-unused-vars': 'error',
    'no-prototype-builtins': 'off'
  }
}
