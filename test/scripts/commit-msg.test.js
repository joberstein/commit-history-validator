import {resolve} from "path";
import run from "src/scripts/commit-msg";
import * as commitUtils from "src/utils/commit.js";

const commitlintArgs = {
    messagePath: 'filepath',
    config: resolve('dist/config/commitlint.config.js')
};

describe('scripts/commit-msg', () => {
    const validateCurrentCommit = jest.spyOn(commitUtils, 'validateCurrentCommit');

    beforeEach(() => {
        validateCurrentCommit.mockResolvedValue({});
    })

    it("Does nothing for a branch that doesn't match the expected format", () => {
        expect(() => run([ 'filepath' ])).not.toThrow();
        expect(validateCurrentCommit).toHaveBeenCalledWith(commitlintArgs);
    });

    it('Exits when the current commit message is not valid', () => {
        validateCurrentCommit.mockImplementation(() => { throw new Error('Failed'); });

        expect(() => run([ 'filepath' ])).toThrow();
        expect(validateCurrentCommit).toHaveBeenCalledWith(commitlintArgs);
    });

    it('Errors out when no commit message path is passed', () => {
        expect(() => run([])).toThrow();
        expect(validateCurrentCommit).not.toHaveBeenCalled();
    });
});