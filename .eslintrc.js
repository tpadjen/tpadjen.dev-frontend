module.exports = {
  'env': {
    'browser': true,
    'es6': true,
    'jest': true,
    'node': true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  'settings': {
    'react': {
      'version': 'detect'
    }
  },
  'parser': 'babel-eslint',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 2018,
    'sourceType': 'module',
    "resolutions": { "babel-eslint/@babel/parser": "7.11.0" }
  },
  'plugins': [
    'react', 'jest'
  ],
  'rules': {
    'indent': ["error", 2, { "SwitchCase": 1, "ignoredNodes": ["TemplateLiteral"]}],
    'quotes': ['error', 'single', { 'avoidEscape': true }],
    'semi': ['error', 'never'],
    'eqeqeq': 'error',
    'react/prop-types': 0,
    'no-unused-vars': ['warn', { 'args': 'all', 'argsIgnorePattern': '^_' }],
    'no-undef': 'warn',
    'no-multiple-empty-lines': ['warn', { 'max': 2, 'maxEOF': 1 }],
    'eol-last': ['warn', 'always'],
  }
}