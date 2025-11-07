import dotenv from 'dotenv';
dotenv.config()

export default {
  clearMocks: true,
  coverageProvider: "v8",
  setupFiles: ["dotenv/config"],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  preset: "ts-jest",
  verbose: true,
  moduleNameMapper: {
    "@/(.*)": ["<rootDir>/src/$1"],
  },
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
};