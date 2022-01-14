module.exports = {
  root: true,
  env: {
    node: true
  },
  globals: {
    // Workaround für Linter-Problem mit Compiler-Makros https://stackoverflow.com/questions/69796772/what-is-causing-error-eslintrc-js-environment-key-vue-setup-compiler-macros
    defineProps: "readonly",
    defineEmits: "readonly",
    defineExpose: "readonly"
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-inferrable-types': 'off' // explizite Deklarationen wie let x : number = 1; erlauben!
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
