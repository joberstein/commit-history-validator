import {execSync} from "child_process";

const stdio = 'inherit';

export const validateCommits = ({ from, config }) => {
    const args = [];

    if (from) {
        args.push(...['---from', `${from}^`]);
    }

    if (config) {
        args.push(...['-g', config]);
    }

    execSync(`npx commitlint -V ${args.join(' ')}`, { stdio });
}

export const validateCurrentCommit = (path) => {
    execSync(`npx commitlint --edit "${path}"`, { stdio });
}