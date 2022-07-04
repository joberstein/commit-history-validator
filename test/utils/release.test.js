import {getNextReleaseVersion, getIsAlreadyDeployed} from "src/utils/release";
import {resolve} from "path";
import childProcess from "child_process";
import {describe} from "@jest/globals";

describe('utils/release', () => {

   describe('getNextReleaseVersion', () => {
       const execSync = jest.spyOn(childProcess, 'execSync')
           .mockImplementation();

       it('Gets the initial release version', () => {
           execSync.mockReturnValue('[12:22:23 AM] [semantic-release] › ℹ  No version has been published yet - the next release version is 1.0.0\n')
           const version = getNextReleaseVersion('master');
           expect(version).toEqual('1.0.0');
       });

       it('Gets the next release version', () => {
          execSync.mockReturnValue('[12:22:23 AM] [semantic-release] › ℹ  The next release version is 1.0.3\n')
           const version = getNextReleaseVersion('master');
          expect(version).toEqual('1.0.3');
      });

       it('Returns false if there is no next version', () => {
           execSync.mockReturnValue('[12:22:23 AM] [semantic-release] › ℹ  No release will be performed\n')
           const version = getNextReleaseVersion('master');
           expect(version).toBeFalsy();
       });
   });

   describe('getIsAlreadyDeployed', () => {
       const configFile = resolve('./test/resources/isDeployedTest.js');

       it("Expects to deploy if the config file doesn't exist", async () => {
           const isAlreadyDeployed = await getIsAlreadyDeployed('master', 'fakeFile');
           expect(isAlreadyDeployed).toBeFalsy();
       });

       it("Expects to deploy if the config file implementation returns false", async () => {
           const isAlreadyDeployed = await getIsAlreadyDeployed('deploy', configFile);
           expect(isAlreadyDeployed).toBeFalsy();
       });

       it("Expects not to deploy if the config file implementation returns true", async () => {
           const isAlreadyDeployed = await getIsAlreadyDeployed('master', configFile);
           expect(isAlreadyDeployed).toBeTruthy();
       });
   });
});