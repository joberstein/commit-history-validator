import * as gitUtils from "../..//src/utils/git.js";
import * as commitUtils from "../../src/utils/commit.js";
import run from '../../src/scripts/validateCommits';

describe('scripts/validateCommits', () => {
    const isRemoteBranch = jest.spyOn(gitUtils, 'isRemoteBranch');
    const fetchRemoteBranch = jest.spyOn(gitUtils, 'fetchRemoteBranch');
    const getFirstMissingCommit = jest.spyOn(gitUtils, 'getFirstMissingCommit');
    const validateCommits = jest.spyOn(commitUtils, 'validateCommits');

    beforeEach(() => {
        isRemoteBranch.mockReturnValue(true);
        fetchRemoteBranch.mockImplementation();
        getFirstMissingCommit.mockReturnValue('abc');
        validateCommits.mockImplementation();
    });

    ['', 'master'].forEach(branch => {
        it(`Exits early for branch '${branch}'`, () => {
            expect(() => run(branch)).not.toThrow();
            expect(isRemoteBranch).not.toHaveBeenCalled();
            expect(validateCommits).not.toHaveBeenCalled();
        });
    });

    it(`Exits early for a non-remote branch`, () => {
        isRemoteBranch.mockReturnValue(false);

        expect(() => run('other')).not.toThrow();
        expect(getFirstMissingCommit).not.toHaveBeenCalled();
        expect(validateCommits).not.toHaveBeenCalled();
    });

    it(`Exits early if the branch is not missing any commits`, () => {
        getFirstMissingCommit.mockReturnValue('');

        expect(() => run('other')).not.toThrow();
        expect(getFirstMissingCommit).toHaveBeenCalled();
        expect(validateCommits).not.toHaveBeenCalled();
    });

    it(`Exits normally after successfully validating commits`, () => {
        expect(() => run('other')).not.toThrow();
        expect(validateCommits).toHaveBeenCalled();
    });

    it(`Exits with an error after failing to validate commits`, () => {
        validateCommits.mockImplementation(() => { throw new Error(); });

        expect(() => run('other')).toThrow();
        expect(validateCommits).toHaveBeenCalled();
    });
});