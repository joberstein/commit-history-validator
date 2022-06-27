import {$} from "zx";

export const getCurrentBranch = async () => {
    const {stdout} = await $`git branch --show-current`;
    return stdout.trim();
}

export const getHooksPath = async () => {
    const {stdout} = await $`git config core.hooksPath`;
    return stdout.trim();
}

export const setHooksPath = async (path) => {
    await $`git config core.hooksPath ${path}`;
}

export const getFirstMissingCommit = async (branch1, branch2) => {
    const {stdout} = await $`git rev-list ^${branch1} "${branch2}" | tail -n 1`;
    return stdout.trim();
}

export const fetchRemoteBranch = async (branch) => {
    await $`git fetch origin ${branch}:${branch}`;
}

export const hasChanges = async (branch, files) => {
    const {stdout} = await $`git diff master -- ${files}`;
    return !!stdout.trim();
}