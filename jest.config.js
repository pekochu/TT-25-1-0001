module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json'
    }
  },
  moduleFileExtensions: [
    'ts',
    'js'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testMatch: [
    'webdriver-server/test/**/*.test.(ts)'
  ],
  testEnvironment: 'node',
  testTimeout: 120000
};
