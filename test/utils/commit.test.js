import childProcess from "child_process";
import {validateCommits, validateCurrentCommit} from "../../src/utils/commit";
import {getFirstMissingCommit} from "../../src/utils/git";

const cwd = 'testGitRepo2';
const stdio = 'ignore';

const execProjectSync = commands => childProcess.execSync(commands.join(' && '));
const execLocalGitSync = commands => childProcess.execSync(commands.join(' && '), {cwd});

describe('utils/git', () => {
    beforeEach(() => {
        execProjectSync([
            `rm -rf ${cwd}`,
            `mkdir ${cwd}`,
            `cp commitlint-enums.json commitlint.config.js ${cwd}`,
        ]);

        execLocalGitSync([
            'git init',
            'touch file.txt',
            "echo 'additional text' > file.txt",
            "git add file.txt",
        ]);
    });

    describe('validateCurrentCommit', () => {
        it('Validation fails when the current commit is not formatted correctly', () => {
            execLocalGitSync([
                "git commit -m 'test'"
            ]);

            expect(() => {
                validateCurrentCommit(`.git/COMMIT_EDITMSG`, { cwd, stdio });
            }).toThrow();
        });

        it('Validation succeeds when the current commit is formatted correctly', () => {
            execLocalGitSync([
                "git commit -m 'fix(tests): Something.'"
            ]);

            expect(() => {
                validateCurrentCommit(`.git/COMMIT_EDITMSG`, { cwd, stdio });
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
                "git commit -m 'fix(tests): Something.'"
            ]);

            const from = getFirstMissingCommit('master', 'other', { cwd });

            expect(() => {
                validateCommits({ from, config: './commitlint.config.js' }, { cwd, stdio });
            }).toThrow();
        });

        it('Succeeds when all of the past commits are formatted correctly', () => {
            execLocalGitSync([
                "git commit -m 'test'",
                'git checkout -qb other',
                "echo 'additional text' >> file.txt",
                "git add file.txt",
                "git commit -m 'fix(tests): Something.'",
                "echo 'even more text' >> file.txt",
                "git add file.txt",
                "git commit -m 'chore(dependencies): Something else.'"
            ]);

            const from = getFirstMissingCommit('master', 'other', { cwd});

            expect(() => {
                validateCommits({ from, config: './commitlint.config.js' }, { cwd, stdio });
            }).not.toThrow();
        });
    });

    afterEach(() => {
        execProjectSync([`rm -rf ${cwd}`]);
    });
});