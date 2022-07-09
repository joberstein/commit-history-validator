import {resolve} from "path";
import childProcess from "child_process";
import {validateCommits, validateCurrentCommit} from "../../src/utils/commit";
import {getFirstMissingCommit} from "../../src/utils/git";

const cwd = 'testCommitUtils';
const stdio = 'ignore';
const messagePath = '.git/COMMIT_EDITMSG';
const config = resolve(`./dist/config/commitlint.config.js`);

const execProjectSync = commands => childProcess.execSync(commands.join(' && '));
const execLocalGitSync = commands => childProcess.execSync(commands.join(' && '), {cwd});

describe('utils/commit', () => {
    beforeEach(() => {
        execProjectSync([
            `rm -rf ${cwd}`,
            `mkdir ${cwd}`,
            `cp commitlint-enums.json ${cwd}`,
        ]);

        execLocalGitSync([
            'git init',
            'touch file.txt',
            "echo 'additional text' > file.txt",
            "git add file.txt",
            'touch commitlint.config.js',
            'echo "module.exports = {};" > commitlint.config.js',
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
                validateCurrentCommit({ messagePath, config }, { cwd, stdio });
            }).toThrow();
        });

        it('Validation succeeds when the current commit is formatted correctly', () => {
            execLocalGitSync([
                "git commit -m 'fix(tests): Something.'"
            ]);

            expect(() => {
                validateCurrentCommit({ messagePath, config }, { cwd, stdio });
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
                validateCommits({ from, config }, { cwd, stdio });
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
                validateCommits({ from, config }, { cwd, stdio });
            }).not.toThrow();
        });
    });
});