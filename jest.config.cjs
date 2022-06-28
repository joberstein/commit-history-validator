module.exports = {
    transformIgnorePatterns: [
        'node_modules/'
    ],
    transform: {
        '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest',
    },
    moduleNameMapper: {
        "#(.*)": "<rootDir>/node_modules/$1"
    },
};