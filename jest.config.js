module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/src/__tests__/test-utils/'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
      },
    ],
    '^.+\\.(js|jsx)$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!(react|react-dom|@testing-library|@babel|next)/)'],
  coveragePathIgnorePatterns: ['/node_modules/', '/.next/', '/__tests__/'],
};
