module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'max-len': ['error', { code: 160 }], // Ajusta el máximo permitido a 120 caracteres, por ejemplo
    'no-underscore-dangle': 'off',
    'no-await-in-loop': 'off',
    'no-restricted-syntax': 'off',
    'no-loop-func': 'off',
    'no-alert': 'off', // Deshabilitar la regla no-alert
    'vuejs-accessibility/label-has-for': 'off', // Deshabilitar la regla label-has-for
  },

};
