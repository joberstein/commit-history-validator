import {isRemoteBranch} from "../utils/git.js";
import {isDeployRequired, getNextReleaseVersion} from "../utils/release.js";
import {resolve} from "path";

export default async (branch, configPath = ".") => {
    const isRemote = isRemoteBranch(branch);

    if (!branch || branch === "master" || branch.startsWith("release") || !isRemote) {
        console.info(`Skipped release validation on branch '${branch}'.`);
        return;
    }

    console.info(`Analyzing the commit history on branch '${branch}'...`);
    const nextVersion = getNextReleaseVersion(branch);
    const configFile = `${resolve(configPath)}/validate-release.config.js`;
    const needsDeploy = await isDeployRequired(branch, configFile);

    if (!needsDeploy && !!nextVersion) {
        throw new Error("There are no source code changes to deploy, but the commit history indicates a new release.");
    }

    if (needsDeploy && !nextVersion) {
        throw new Error("There are source code changes to deploy, but the commit history does not indicate a new release.");s
    }

    if (!!nextVersion) {
        console.info(`A release (${nextVersion}) will be created when branch '${branch}' is merged to master.`);
    } else {
        console.info(`A release will not be necessary when branch '${branch}' is merged to master.`);
    }
}