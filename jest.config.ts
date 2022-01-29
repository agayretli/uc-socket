export default {
    clearMocks: true,
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    roots: ['<rootDir>/src'],
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
};
