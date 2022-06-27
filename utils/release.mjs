import {$} from "zx";
import {existsSync} from "fs";

export const getNextReleaseVersion = async (branch) => {
    const {stdout} = await $`
        yarn release -d --branches=${branch} | 
        sed -n "s/.*The next release version is \\(.*\\)$/\\1/pi"
    `;

    return stdout.trim();
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