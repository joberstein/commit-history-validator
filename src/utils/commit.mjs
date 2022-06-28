import {$} from "zx";

export const validateCommits = async ({ from, config }) => {
    const args = [];

    if (from) {
        args.push(...['---from', `${from}^`]);
    }

    if (config) {
        args.push(...['-g', config]);
    }

    await $`npx commitlint -V ${args}`;
}

export const validateCurrentCommit = async (path) => {
    await $`npx commitlint --edit "${path}"`;
}