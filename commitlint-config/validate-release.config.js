const {fetchRemoteBranch, hasChanges} = require("@joberstein12/commit-history-validator");

module.exports = {
    isDeployRequired: () => {
        console.info("Fetching commits available on the master branch...");
        fetchRemoteBranch("master");

        console.info("Diffing against master...");
        return hasChanges({
            branch: "master",
            relative: 'commitlint-config',
            files: [ ":!*/README.md", ":!*LICENSE" ]
        });
    }
};