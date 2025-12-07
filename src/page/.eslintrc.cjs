module.exports = {
  env: {
    browser: true,
    es2022: true,
  },
  extends: ['airbnb', 'prettier'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.js', '.jsx']
      }
    }
  },
  rules: {
    'no-shadow': 'off',
    'max-classes-per-file': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['vite.config.js'],
      },
    ],
    'import/no-unresolved': ['error', { ignore: ['\\?worker$'] }],
    'react/react-in-jsx-scope': 'off',
    'react/function-component-definition': 'off',
    'react/prop-types': 'off',
    'react/jsx-filename-extension': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
  },
}
