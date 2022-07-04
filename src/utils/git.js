import {execSync} from "child_process";

const encoding = 'utf-8';

export const getCurrentBranch = ({ cwd } = {}) => {
    const command = `git branch --show-current`;
    return execSync(command, { encoding, cwd }).trim();
}

export const getHooksPath = ({ cwd } = {}) => {
    try {
        const command = `git config core.hooksPath`;
        return execSync(command, { encoding, cwd }).trim();
    } catch (e) {
        return '';
    }
}

export const setHooksPath = (path, { cwd } = {}) => {
    execSync(`git config core.hooksPath ${path}`, { cwd });
}

export const resetHooksPath = ({ cwd } = {}) => {
    execSync(`git config --unset core.hooksPath`, { cwd });
}

export const getFirstMissingCommit = (branch1, branch2, { cwd } = {}) => {
    const command = `git rev-list ^${branch1} "${branch2}" | tail -n 1`;
    return execSync(command, { encoding, cwd }).trim();
}

export const fetchRemoteBranch = (branch, { cwd } = {}) => {
    execSync(`git fetch origin ${branch}:${branch}` , { cwd, stdio: 'ignore' });
}

export const hasChanges = (branch, files, { cwd } = {}) => {
    const command = `git diff --quiet ${branch} -- ${files.join(' ')}`;
    try {
        execSync(command, { encoding, cwd });
        return false;
    } catch (e) {
        return true;
    }
}

export const isRemoteBranch = (branch, { cwd } = {}) => {
    const command = `git ls-remote --heads origin ${branch}`;
    return !!execSync(command, { encoding, cwd }).trim();
}