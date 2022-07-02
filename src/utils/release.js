import {existsSync} from "fs";
import {execSync} from "child_process";

const encoding = 'utf-8';

export const getNextReleaseVersion = (branch) => {
    const command = `yarn release -d --branches=${branch}`;
    const pattern = new RegExp('.*The next release version is (.*)$', 'i');

    return execSync(command, { encoding })
        .trim()
        .split('\n')
        .find(line => line.match(pattern)?.at(0));
}


export const getIsAlreadyDeployed = async (branch, configFile) => {
    const configExists = existsSync(configFile);

    if (!configExists) {
        console.warn("The provided config file does not exist. Every commit will indicate a new release.");
        return true;
    }

    const {isAlreadyDeployed} = await import(configFile);
    return isAlreadyDeployed(branch);
}