export default {
  clearMocks: true,
  coverageProvider: "v8",
  preset: "ts-jest",
  verbose: true,
  moduleNameMapper: {
    "@/(.*)": ["<rootDir>/src/$1"]
},
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
};