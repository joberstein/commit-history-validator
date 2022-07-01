import {execSync} from "child_process";

export const validateCommits = async ({ from, config }) => {
    const args = [];

    if (from) {
        args.push(...['---from', `${from}^`]);
    }

    if (config) {
        args.push(...['-g', config]);
    }

    await execSync(`npx commitlint -V ${args}`);
}

export const validateCurrentCommit = async (path) => {
    await execSync(`npx commitlint --edit "${path}"`);
}