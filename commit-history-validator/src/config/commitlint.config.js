import {readFileSync, existsSync} from "fs";
import {getExecutingProjectDirectory, getWorkingProjectDirectory} from "../utils/path";

const customPath = `${getWorkingProjectDirectory()}/commitlint-enums.json`;
const customEnumData = existsSync(customPath) ? readFileSync(customPath, 'utf-8') : '{}';
const customEnums = JSON.parse(customEnumData);

const defaultEnumData = readFileSync(`${getExecutingProjectDirectory()}/commitlint-enums.json`, 'utf-8');
const defaultEnums = JSON.parse(defaultEnumData);

const getEnum = (name) => {
    const {mergeStrategy} = customEnums;
    const parsedMergeStrategy = (mergeStrategy && mergeStrategy[name]) || 'merge';

    const enumValues = parsedMergeStrategy === 'merge' ?
        [...(customEnums[name] || []), ...defaultEnums[name]] :
        customEnums[name] || defaultEnums[name] || [];

    return [...new Set(enumValues)];
}

const scopes = getEnum("scopes");
const types = getEnum("types");

/**
 * Base configuration:
 * https://github.com/conventional-changelog/commitlint/blob/master/%40commitlint/config-conventional/index.js
 */
const Configuration = {
    extends: ['@commitlint/config-conventional'],
    formatter: '@commitlint/format',
    rules: {
        'body-case': [2, 'always', ['sentence-case']],
        'body-full-stop': [2, 'always', '.'],
        'body-max-line-length': [0],
        'footer-max-line-length': [0],
        'header-max-length': [0],
        'scope-case': [2, 'always', ['kebab-case']],
        'subject-case': [2, 'always', ['sentence-case']],
        'subject-full-stop': [2, 'always', '.'],
    },
};

if (scopes.length) {
    Configuration.rules["scope-enum"] = [2, 'always', scopes];
}

if (types.length) {
    Configuration.rules["type-enum"] = [2, 'always', types];
}

module.exports = Configuration;
