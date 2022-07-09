import childProcess from "child_process";
import {validateCommits, validateCurrentCommit} from "../../src/utils/commit";
import {getFirstMissingCommit} from "../../src/utils/git";

const cwd = 'testCommitUtils';
const stdio = 'ignore';
const messagePath = '.git/COMMIT_EDITMSG';

const execProjectSync = commands => childProcess.execSync(commands.join(' && '));
const execLocalGitSync = commands => childProcess.execSync(commands.join(' && '), {cwd});

describe('utils/commit', () => {
    beforeEach(() => {
        execProjectSync([
            `rm -rf ${cwd}`,
            `mkdir ${cwd}`,
            `cp ../.commitlintrc.json ${cwd}`,
        ]);

        execLocalGitSync([
            'git init',
            'touch file.txt',
            "echo 'additional text' > file.txt",
            "git add file.txt",
        ]);
    });

    afterEach(() => {
        execProjectSync([`rm -rf ${cwd}`]);
    });

    describe('validateCurrentCommit', () => {
        it('Validation fails when the current commit is not formatted correctly', () => {
            execLocalGitSync([
                "git commit -m 'test'"
            ]);

            expect(() => {
                validateCurrentCommit({ messagePath }, { cwd, stdio });
            }).toThrow();
        });

        it('Validation succeeds when the current commit is formatted correctly', () => {
            execLocalGitSync([
                "git commit -m 'fix: Something.'"
            ]);

            expect(() => {
                validateCurrentCommit({ messagePath }, { cwd, stdio });
            }).not.toThrow();
        });
    });

    describe('validateCommits', () => {
        it('Fails when one of the past commits are not formatted correctly', () => {
            execLocalGitSync([
                "git commit -m 'test'",
                'git checkout -qb other',
                "echo 'additional text' >> file.txt",
                "git add file.txt",
                'git commit -m "test 2"',
                "echo 'even more text' >> file.txt",
                "git add file.txt",
                "git commit -m 'fix: Something.'"
            ]);

            const from = getFirstMissingCommit('master', 'other', { cwd });

            expect(() => {
                validateCommits({ from }, { cwd, stdio });
            }).toThrow();
        });

        it('Succeeds when all of the past commits are formatted correctly', () => {
            execLocalGitSync([
                "git commit -m 'test'",
                'git checkout -qb other',
                "echo 'additional text' >> file.txt",
                "git add file.txt",
                "git commit -m 'fix: Something.'",
                "echo 'even more text' >> file.txt",
                "git add file.txt",
                "git commit -m 'chore: Something else.'"
            ]);

            const from = getFirstMissingCommit('master', 'other', { cwd});

            expect(() => {
                validateCommits({ from }, { cwd, stdio });
            }).not.toThrow();
        });
    });
});