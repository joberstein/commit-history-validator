import * as pathUtils from "../../src/utils/path.js";
import {expect} from "@jest/globals";
import {execSync} from "child_process";

describe('src/utils/path', () => {
    test('getExecutingProjectDirectory', () => {
       const directory = pathUtils.getExecutingProjectDirectory();
       expect(directory.endsWith('commit-history-validator')).toBeTruthy();
    });

    test('getWorkingProjectDirectory', () => {
        const directory = pathUtils.getWorkingProjectDirectory();
        expect(directory.endsWith("release-utils")).toBeTruthy();
    });

    test('getFileName', () => {
        const fileName = pathUtils.getFileName('/something/file.js');
        expect(fileName).toEqual('file');
    });

    describe('getWorkspacesNames', () => {
        it('Gets the workspaces names for a project that has workspaces', () => {
            const workspaces = pathUtils.getWorkspaceNames();
            expect(workspaces.includes('@joberstein12/commit-history-validator')).toBeTruthy();
        });

        it('Returns an empty list for a project that has does not have workspaces', () => {
            const cwd = 'testWorkspacesDir';
            const packageJson = { name: "test", version: "1.0.0", license: "MIT" };

            execSync([
                `mkdir ${cwd}`,
                `touch ${cwd}/package.json`,
                `echo '${JSON.stringify(packageJson)}' > ${cwd}/package.json`,
            ].join(' && '));

            const workspaces = pathUtils.getWorkspaceNames({ cwd: '/tmp' });
            execSync(`rm -rf ${cwd}`);

            expect(workspaces).toEqual([]);
        });
    });
});