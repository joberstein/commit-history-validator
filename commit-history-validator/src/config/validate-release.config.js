import {fetchRemoteBranch, hasChanges} from "../utils/git.js";

export const isDeployRequired = async () => {
    console.info("Fetching commits available on the master branch...");
    fetchRemoteBranch("master");

    console.info("Diffing against master...");
    return hasChanges({
        branch: "master",
        relative: 'commit-history-validator',
        files: ["src", "package.json", ".npmignore"]
    });
};