import * as gitUtils from "../../src/utils/git";
import * as setupHooksScript from "../../src/scripts/setupHooks";
import * as prepareCommitMsgScript from "../../src/scripts/prepare-commit-msg";
import * as commitMsgScript from "../../src/scripts/commit-msg";
import * as validateCommitsScript from "../../src/scripts/validateCommits";
import * as validateReleaseScript from "../../src/scripts/validateRelease";
import {run} from '../../src/scripts';

describe('scripts/index', () => {
    const setupHooks = jest.spyOn(setupHooksScript, 'default');
    const prepareCommitMsg = jest.spyOn(prepareCommitMsgScript, 'default');
    const commitMsg = jest.spyOn(commitMsgScript, 'default');
    const validateCommits = jest.spyOn(validateCommitsScript, 'default');
    const validateRelease = jest.spyOn(validateReleaseScript, 'default');
    const getCurrentBranch = jest.spyOn(gitUtils, 'getCurrentBranch');

    beforeEach(() => {
        setupHooks.mockImplementation();
        prepareCommitMsg.mockImplementation();
        commitMsg.mockImplementation();
        validateCommits.mockImplementation();
        validateRelease.mockImplementation();
        getCurrentBranch.mockReturnValue('test');
    });

    it('Runs the setup hooks script', async () => {
        process.argv = ['', '', 'hooks', 'setup'];
        await run();
        expect(setupHooks).toHaveBeenCalled();
    });

    it('Runs the prepare-commit-msg script', async () => {
        process.argv = ['', '', 'hooks', 'run', 'prepare-commit-msg'];
        await run();
        expect(prepareCommitMsg).toHaveBeenCalled();
    });

    it('Runs the commit-msg script', async () => {
        process.argv = ['', '', 'hooks', 'run', 'commit-msg'];
        await run();
        expect(commitMsg).toHaveBeenCalled();
    });

    it('Runs the validate commits script', async () => {
        process.argv = ['', '', 'validate', 'commits'];
        await run();
        expect(validateCommits).toHaveBeenCalled();
    });

    it('Runs the validate release script', async () => {
        process.argv = ['', '', 'validate', 'release'];
        await run();
        expect(validateRelease).toHaveBeenCalled();
    });

    it("Errors when running a non-existent hook", () => {
        process.argv = ['', '', 'hooks', 'run', 'fakeHook'];
        expect(run()).rejects.toThrow(/^Cannot find module '\.\/fakeHook'/);
    });

    ['hooks', 'validate'].forEach(subCommand => {
        it(`Errors when running a non-existent ${subCommand} command`, () => {
            process.argv = ['', '', subCommand, 'fakeSubCommand'];
            expect(run()).rejects.toThrow(new RegExp(`Subcommand does not exist for main command '${subCommand}'.`));
        });
    });

    it("Errors when running a non-existent main command", () => {
        process.argv = ['', '', 'fakeCommand'];
        expect(run()).rejects.toThrow(/Command does not exist\./);
    });
});