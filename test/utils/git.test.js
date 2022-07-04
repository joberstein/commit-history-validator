import {
    fetchRemoteBranch, getCurrentBranch,
    getFirstMissingCommit,
    getHooksPath, hasChanges, isRemoteBranch,
    resetHooksPath,
    setHooksPath
} from "../../src/utils/git";
import childProcess from "child_process";

const cwd = 'testGitRepo';
const testRemote = 'testRemoteGitRepo';
const localBranch = 'localBranch';

const execProjectSync = commands => childProcess.execSync(commands.join(' && '));
const execLocalGitSync = commands => childProcess.execSync(commands.join(' && '), {cwd});
const execRemoteGitSync = commands => childProcess.execSync(commands.join(' && '), {cwd: testRemote});

describe('utils/git', () => {
    beforeEach(() => {
        execProjectSync([
            `rm -rf ${cwd} ${testRemote}`,
            `mkdir ${cwd}`,
            `mkdir ${testRemote}`
        ]);

        execRemoteGitSync([
            'git init',
            'touch file.txt',
            'git add file.txt',
            "git commit -m 'test'",
        ]);

        execLocalGitSync([
            'git init',
            `git remote add origin ../${testRemote}`,
            `git pull -q origin master`,
            `git checkout -qb ${localBranch}`,
        ]);
    });

    it('Gets, sets, and resets the hooks path', () => {
        const originalHooksPath = getHooksPath({cwd});
        expect(originalHooksPath).toBeFalsy();

        setHooksPath('testPath', {cwd});

        const updatedHooksPath = getHooksPath({cwd});
        expect(updatedHooksPath).toEqual('testPath');

        resetHooksPath({cwd});

        const clearedHooksPath = getHooksPath({cwd});
        expect(clearedHooksPath).toBeFalsy();
    });

    describe("getCurrentBranch", () => {
        it("Expects the local branch to be the local repo's current branch", () => {
            expect(getCurrentBranch({cwd})).toEqual(localBranch);
        });

        it("Expects the master branch to be the remote repo's current branch", () => {
            expect(getCurrentBranch({cwd: testRemote})).toEqual('master');
        });
    });

    describe("isRemoteBranch", () => {
        it("Expects a local branch not to be a remote branch", () => {
            expect(isRemoteBranch(localBranch, {cwd})).toBeFalsy();
        });

        it('Expects a remote branch to be remote', () => {
            expect(isRemoteBranch('master', {cwd})).toBeTruthy();
        });
    });

    describe('getFirstMissingCommit', () => {
        it("Returns an empty value if there are no missing commits", () => {
            const commit = getFirstMissingCommit('master', localBranch, {cwd});
            expect(commit).toBeFalsy();
        });

        it("Returns the first missing commit", () => {
            execLocalGitSync([
                "echo 'additional text' >> file.txt",
                "git add file.txt",
                "git commit -m 'test 2'"
            ]);

            const commit = getFirstMissingCommit('master', localBranch, {cwd});
            expect(commit).toBeTruthy();
        });
    });

    describe('fetchRemoteBranch', () => {
        it("Fetches the remote branch when it exists", () => {
            const newRemoteBranch = 'other';

            execRemoteGitSync([
                `git checkout -qb '${newRemoteBranch}'`,
            ]);

            expect(() => {
                fetchRemoteBranch(newRemoteBranch, {cwd});
            }).not.toThrow();
        });

        it("Errors when it tries to fetch a remote branch that does not exist", () => {
            expect(() => {
                fetchRemoteBranch('other', {cwd});
            }).toThrow();
        });
    });

    describe('hasChanges', () => {
        it("Returns false when the given file does not have changes compared to another branch", () => {
            const result = hasChanges('master', ['file.txt'], {cwd});
            expect(result).toBeFalsy();
        });

        it("Returns false when only unrelated files have changes compared to another branch", () => {
            execLocalGitSync([
                'touch file2.txt',
                "echo 'additional text' > file2.txt",
                "git add file2.txt",
                "git commit -m 'test 2'"
            ]);

            const result = hasChanges('master', ['file.txt'], {cwd});
            expect(result).toBeFalsy();
        });

        it("Returns true when the given file has changes compared to another branch", () => {
            execLocalGitSync([
                "echo 'additional text' >> file.txt",
                "git add file.txt",
                "git commit -m 'test 2'"
            ]);

            const result = hasChanges('master', ['file.txt'], {cwd});
            expect(result).toBeTruthy();
        });
    });

    afterEach(() => {
        execProjectSync([`rm -rf ${cwd} ${testRemote}`]);
    });
})
;