import {existsSync} from "fs";
import {execSync} from "child_process";

const encoding = 'utf-8';

export const getNextReleaseVersion = (branch) => {
    const command = [
        `yarn release -d --branches=${branch}`,
        `sed -n "s/.*The next release version is \\(.*\\)$/\\1/pi"`
    ].join(' | ');

    return execSync(command, { encoding }).trim();
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