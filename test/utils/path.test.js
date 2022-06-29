import {getExecutingProjectDirectory, getWorkingProjectDirectory} from "../../src/utils/path.mjs";

const PROJECT_ROOT = 'commit-history-validator';

describe('src/utils/path', () => {
    test('getExecutingProjectDirectory', () => {
       const directory = getExecutingProjectDirectory();
       expect(directory.endsWith(PROJECT_ROOT)).toBeTruthy();
    });

    test('getWorkingProjectDirectory', async () => {
        const directory = await getWorkingProjectDirectory();
        expect(directory.endsWith(PROJECT_ROOT)).toBeTruthy();
    });
});