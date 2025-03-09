module.exports = {
  root: true,
  extends: ['react-app'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': ['warn', { 
      'varsIgnorePattern': 'React|^_',
      'argsIgnorePattern': '^_'
    }]
  }
};
