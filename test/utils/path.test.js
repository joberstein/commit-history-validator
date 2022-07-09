import * as pathUtils from "src/utils/path.js";

const PROJECT_ROOT = 'commit-history-validator';

describe('src/utils/path', () => {
    test('getExecutingProjectDirectory', () => {
       const directory = pathUtils.getExecutingProjectDirectory();
       expect(directory.endsWith(PROJECT_ROOT)).toBeTruthy();
    });

    test('getWorkingProjectDirectory', () => {
        const directory = pathUtils.getWorkingProjectDirectory();
        expect(directory.endsWith(PROJECT_ROOT)).toBeTruthy();
    });

    test('getFileName', () => {
        const fileName = pathUtils.getFileName('/something/file.js');
        expect(fileName).toEqual('file');
    });
});