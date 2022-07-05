import {execSync} from "child_process";

const stdio = 'inherit';

export const validateCommits = ({ from, config }, { cwd, stdio } = { stdio }) => {
    const args = [];

    if (from) {
        args.push(...['---from', `${from}^`]);
    }

    if (config) {
        args.push(...['-g', config]);
    }

    execSync(`commitlint -V ${args.join(' ')}`, { cwd, stdio });
}

export const validateCurrentCommit = (path, { cwd, stdio } = { stdio }) => {
    execSync(`commitlint --edit "${path}"`, { cwd, stdio });
}