import {fetchRemoteBranch, hasChanges} from "./src/utils/git.mjs";

const sourceCodePaths = [
  "hooks",
  "scripts",
  "utils",
  "commitlint.config.js",
  "commitlint-enums.json",
  "index.mjs",
  "package.json",
  "validate-release.config.js",
  "yarn.lock",
];

export const isAlreadyDeployed = async () => {
    console.info("Fetching commits available on the master branch...");
    fetchRemoteBranch("master");

    console.info("Diffing against master...");
    return hasChanges("master", sourceCodePaths);
}