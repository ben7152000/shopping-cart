module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'no-console': 'off',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
