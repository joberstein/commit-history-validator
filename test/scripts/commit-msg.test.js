import run from "src/scripts/commitMsg";
import * as commitUtils from "src/utils/commit.js";

describe('src/hooks/commit-msg', () => {
    const validateCurrentCommit = jest.spyOn(commitUtils, 'validateCurrentCommit')
        .mockResolvedValue({});

    it('Exits normally when the current commit message is valid', () => {
        expect(() => run('filepath')).not.toThrowError();
        expect(validateCurrentCommit).toHaveBeenCalledWith('filepath');
    });

    it('Errors out when the current commit message is not valid', () => {
        const errorText = 'Failed';
        validateCurrentCommit.mockImplementation(() => { throw new Error(errorText); });

        expect(() => run('filepath')).toThrowError(errorText);
        expect(validateCurrentCommit).toHaveBeenCalledWith('filepath');
    });

    it('Errors out when no commit message path is passed', () => {
        run();
        expect(validateCurrentCommit).not.toHaveBeenCalled();
    });
});