import run from "src/scripts/commit-msg";
import * as commitUtils from "src/utils/commit.js";

describe('scripts/commit-msg', () => {
    const validateCurrentCommit = jest.spyOn(commitUtils, 'validateCurrentCommit')
        .mockResolvedValue({});

    const exit = jest.spyOn(process, 'exit')
        .mockReturnValue({});

    it("Does nothing for a branch that doesn't match the expected format", () => {
        run([ 'filepath' ]);

        expect(validateCurrentCommit).toHaveBeenCalledWith('filepath');
        expect(exit).not.toHaveBeenCalled();
    });

    it('Errors out when the current commit message is not valid', () => {
        validateCurrentCommit.mockImplementation(() => { throw new Error('Failed'); });

        expect(() => run([ 'filepath' ])).toThrow();
        expect(validateCurrentCommit).toHaveBeenCalledWith('filepath');
    });

    it('Errors out when no commit message path is passed', () => {
        expect(() => run([])).toThrow();
        expect(validateCurrentCommit).not.toHaveBeenCalled();
    });
});