import {fetchRemoteBranch, hasChanges} from "../utils/git.js";

export const isDeployRequired = async () => {
    console.info("Fetching commits available on the master branch...");
    fetchRemoteBranch("master");

    console.info("Diffing against master...");
    return hasChanges("master", [ "src" ]);
};