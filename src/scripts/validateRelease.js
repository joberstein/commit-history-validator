import commandLineArgs from "command-line-args";
import {getWorkingProjectDirectory} from "../utils/path.js";
import {getCurrentBranch, isRemoteBranch} from "../utils/git.js";
import {getIsAlreadyDeployed, getNextReleaseVersion} from "../utils/release.js";

const currentBranch = await getCurrentBranch();
const workingDir = await getWorkingProjectDirectory();

const definitions = [
    {
        name: 'configFile',
        alias: 'c',
        defaultValue: `${workingDir}/validate-release.config.mjs`
    },
    {
        name: 'branch',
        alias: 'b',
        defaultValue: currentBranch
    },
];

const { branch, configFile } = commandLineArgs(definitions, { stopAtFirstUnknown: true });
const isRemote = await isRemoteBranch(branch);

if (!branch || branch === "master" || branch.startsWith("release") || !isRemote) {
    console.info(`Skipped release validation on branch '${branch}'.`);
    process.exit(0);
}

console.info(`Analyzing the commit history on branch '${branch}'...`);
const nextVersion = getNextReleaseVersion(branch);
const needsDeploy = await getIsAlreadyDeployed(branch, configFile);

if (!needsDeploy && !!nextVersion) {
    console.error("There are no source code changes to deploy, but the commit history indicates a new release.");
    process.exit(1);
}

if (needsDeploy && !nextVersion) {
    console.error("There are source code changes to deploy, but the commit history does not indicate a new release.");
    process.exit(1);
}

if (!!nextVersion) {
    console.info(`A release (${nextVersion}) will be created when branch '${branch}' is merged to master.`);
} else {
    console.info(`A release will not be necessary when branch '${branch}' is merged to master.`);
}