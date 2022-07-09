import * as gitUtils from "src/utils/git.js";
import * as releaseUtils from "src/utils/release.js";
import run from 'src/scripts/validateRelease';

const branch = 'test';

describe('scripts/validateRelease', () => {
    const isRemoteBranch = jest.spyOn(gitUtils, 'isRemoteBranch');
    const getNextReleaseVersion = jest.spyOn(releaseUtils, 'getNextReleaseVersion');
    const isDeployRequired = jest.spyOn(releaseUtils, 'isDeployRequired');

    beforeEach(() => {
        isRemoteBranch.mockReturnValue(true);
        getNextReleaseVersion.mockReturnValue('');
        isDeployRequired.mockResolvedValue(false);
    });

    it('Completes when there are no changes to deploy and no next release version', async () => {
        await run(branch);

        expect(console.info).toHaveBeenCalledWith(
            "A release will not be necessary when branch 'test' is merged to master."
        );
    });

    it('Completes when there are changes to deploy and a next release version', async () => {
        getNextReleaseVersion.mockReturnValue('1.0.0');
        isDeployRequired.mockResolvedValue(true);

        await run(branch);

        expect(console.info).toHaveBeenCalledWith(
            "A release (1.0.0) will be created when branch 'test' is merged to master."
        );
    });

    it('Errors when there are changes to deploy, but no next release version', () => {
        isDeployRequired.mockResolvedValue(true);

        expect(run(branch)).rejects.toThrow(
            "There are source code changes to deploy, but the commit history does not indicate a new release."
        );
    });

    it('Errors when there are changes to deploy, but no next release version', () => {
        getNextReleaseVersion.mockReturnValue('1.0.0');

        expect(run(branch)).rejects.toThrow(
            "There are no source code changes to deploy, but the commit history indicates a new release."
        );
    });
});