import fs from "fs";
import childProcess from "child_process";
import * as gitUtils from '../../src/utils/git';
import * as pathUtils from '../../src/utils/path';
import run from '../../src/scripts/setupHooks';

const name = '@joberstein12/commit-history-validator';
let version;
let prepareCommitMsgHookContents = '';
let commitMsgHookContents = '';

describe('scripts/setupHooks', () => {
    const getHooksPath = jest.spyOn(gitUtils, 'getHooksPath')
        .mockReturnValue('');

    const setHooksPath = jest.spyOn(gitUtils, 'setHooksPath')
        .mockImplementation();

    const getWorkingProjectDirectory = jest.spyOn(pathUtils, 'getWorkingProjectDirectory');

    const getWorkspaceNames = jest.spyOn(pathUtils, 'getWorkspaceNames')
        .mockReturnValue([name]);

    const existsSync = jest.spyOn(fs, 'existsSync')
        .mockReturnValue(false);

    const readFileSync = jest.spyOn(fs, 'readFileSync');

    const appendFileSync = jest.spyOn(fs, 'appendFileSync')
        .mockImplementation();

    const writeFileSync = jest.spyOn(fs, 'writeFileSync')
        .mockImplementation();

    const execSync = jest.spyOn(childProcess, 'execSync');

    beforeEach(() => {
        version = '1.2.1';
        prepareCommitMsgHookContents = `\nnpx ${name}@${version} hooks run prepare-commit-msg $@`;
        commitMsgHookContents = `\nnpx ${name}@${version} hooks run commit-msg $@`;
    });

    it('Sets the hooks path for this project', () => {
        run();

        expect(setHooksPath).toHaveBeenCalledWith(expect.stringMatching(/release-utils\/hooks$/));
        expect(getHooksPath).not.toHaveBeenCalled();
    });

    describe('Setting up hooks for other projects', () => {
       beforeEach(() => {
           getWorkingProjectDirectory.mockReturnValue('other');
           execSync.mockImplementation();
           getWorkspaceNames.mockReturnValue([]);

           readFileSync.mockImplementation(filepath => {
               if (filepath.endsWith('commit-history-validator/package.json')) {
                   return JSON.stringify({ name, version });
               } else if (filepath.endsWith('other/package.json')) {
                   return JSON.stringify({ name: 'other' });
               } else if (filepath.endsWith('dist/hooks.txt')) {
                   return [ 'commit-msg', 'prepare-commit-msg' ].join(' ');
               } else if (filepath.endsWith('.git/hooks/prepare-commit-msg')) {
                   return prepareCommitMsgHookContents;
               } else if (filepath.endsWith('.git/hooks/commit-msg')) {
                   return commitMsgHookContents;
               }
           });
       });

        it('Writes new hooks', () => {
            run();

            expect(setHooksPath).not.toHaveBeenCalled();
            expect(appendFileSync).not.toHaveBeenCalled();
            expect(getHooksPath).toHaveBeenCalled();

            ['commit-msg', 'prepare-commit-msg'].forEach(hook => {
                const hookPath = `other/.git/hooks/${hook}`;
                const hookContents = `npx ${name}@${version} hooks run ${hook} $@`;

                expect(writeFileSync).toHaveBeenCalledWith(hookPath, hookContents, { mode: 0o755 });
            });
        });

        describe("Existing hooks", () => {
            beforeEach(() => {
                existsSync.mockReturnValue(true);
            });

            it('Appends to existing hooks', () => {
                commitMsgHookContents = 'Other hook contents';
                prepareCommitMsgHookContents = 'Other hook contents';

                run();

                expect(getHooksPath).toHaveBeenCalled();
                expect(setHooksPath).not.toHaveBeenCalled();
                expect(writeFileSync).not.toHaveBeenCalled();

                ['commit-msg', 'prepare-commit-msg'].forEach(hook => {
                    const hookPath = `other/.git/hooks/${hook}`;
                    const hookContents = `\nnpx ${name}@${version} hooks run ${hook} $@`;

                    expect(appendFileSync).toHaveBeenCalledWith(hookPath, hookContents);
                });
            });

            it('Updates hooks that have already been modified', () => {
                version = '1.2.2';

                run();

                expect(getHooksPath).toHaveBeenCalled();
                expect(setHooksPath).not.toHaveBeenCalled();
                expect(appendFileSync).not.toHaveBeenCalled();

                [commitMsgHookContents, prepareCommitMsgHookContents].forEach(contents =>
                    expect(writeFileSync).toHaveBeenCalledWith(
                        expect.anything(),
                        contents.replace('1.2.1', version)
                    ));
            });
        });
    });
});