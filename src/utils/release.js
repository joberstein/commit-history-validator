import {existsSync} from "fs";
import {execSync} from "child_process";

const encoding = 'utf-8';

export const getNextReleaseVersion = (branch) => {
    const command = `semantic-release -d --branches=${branch}`;
    const pattern = /.*\[semantic-release\].*The next release version is (.*)$/i;

    const versionLine = execSync(command, { encoding })
        .trim()
        .split('\n')
        .find(line => pattern.test(line));

    const [, nextVersion] = pattern.exec(versionLine) || [];
    return nextVersion;
}

export const getIsAlreadyDeployed = async (branch, configFile) => {
    const configExists = existsSync(configFile);

    if (!configExists) {
        console.warn("The provided config file does not exist. Every commit will indicate a new release.");
        return false;
    }

    const config = await import(configFile);
    return config.isAlreadyDeployed(branch);
}