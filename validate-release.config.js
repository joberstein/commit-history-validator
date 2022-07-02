const {fetchRemoteBranch, hasChanges} = require("./dist/utils/git.js");

const sourceCodePaths = [
    "src",
    "commitlint.config.js",
    "commitlint-enums.json",
    "package.json",
    "validate-release.config.js",
    "yarn.lock",
];

module.exports = {
    isAlreadyDeployed: async () => {
        console.info("Fetching commits available on the master branch...");
        fetchRemoteBranch("master");

        console.info("Diffing against master...");
        return hasChanges("master", sourceCodePaths);
    }
};