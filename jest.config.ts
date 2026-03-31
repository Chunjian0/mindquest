import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(png|jpg|svg|css)$': '<rootDir>/__mocks__/fileMock.ts',
  },

  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
      },
    }],
  },

  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],

  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
}

export default config