import run from "src/scripts/commit-msg";
import * as commitUtils from "src/utils/commit.js";

describe('src/hooks/commit-msg', () => {
    const validateCurrentCommit = jest.spyOn(commitUtils, 'validateCurrentCommit')
        .mockResolvedValue({});

    it('Exits normally when the current commit message is valid', async () => {
        await expect(run('filepath'))
            .resolves
            .not.toThrowError();

        expect(validateCurrentCommit).toHaveBeenCalledWith('filepath');
    });

    it('Errors out when the current commit message is not valid', async () => {
        const errorText = 'Failed';
        validateCurrentCommit.mockImplementation(() => { throw new Error(errorText); });

        await expect(run('filepath'))
            .rejects
            .toThrowError(errorText);

        expect(validateCurrentCommit).toHaveBeenCalledWith('filepath');
    });

    it('Errors out when no commit message path is passed', async () => {
        await run();
        expect(validateCurrentCommit).not.toHaveBeenCalled();
    });
});