module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.js'],
  moduleNameMapper: {
    '^immer$': '<rootDir>/node_modules/immer/dist/cjs/index.js',
    '^@reduxjs/toolkit$': '<rootDir>/node_modules/@reduxjs/toolkit/dist/cjs/index.js',
    '^react-redux$': '<rootDir>/node_modules/react-redux/dist/cjs/index.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation)/)',
  ],
};
