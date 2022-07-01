import {execSync} from "child_process";

const encoding = 'utf-8';

export const getCurrentBranch = () => {
    const command = `git branch --show-current`;
    return execSync(command, { encoding }).trim();
}

export const getHooksPath = () => {
    const command = `git config core.hooksPath`;
    return execSync(command, { encoding }).trim();
}

export const setHooksPath = (path) => {
    execSync(`git config core.hooksPath ${path}`);
}

export const resetHooksPath = () => {
    execSync(`git config --unset core.hooksPath`);
}

export const getFirstMissingCommit = (branch1, branch2) => {
    const command = `git rev-list ^${branch1} "${branch2}" | tail -n 1`;
    return execSync(command, { encoding }).trim();
}

export const fetchRemoteBranch = (branch) => {
    execSync(`git fetch origin ${branch}:${branch}`);
}

export const hasChanges = (branch, files) => {
    const command = `git diff master -- ${files}`;
    return !!execSync(command, { encoding }).trim();
}

export const isRemoteBranch = (branch) => {
    const command = `git ls-remote --heads origin ${branch}`;
    return !!execSync(command, { encoding }).trim();
}