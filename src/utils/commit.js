import {execSync} from "child_process";

const defaultOptions = { stdio: 'inherit' };

export const validateCommits = ({ from, config }, { cwd, stdio } = defaultOptions) => {
    const args = [];

    if (from) {
        args.push(...['---from', `${from}^`]);
    }

    if (config) {
        args.push(...['-g', config]);
    }

    execSync(`commitlint -V ${args.join(' ')}`, { cwd, stdio });
}

export const validateCurrentCommit = (path, { cwd, stdio } = defaultOptions) => {
    execSync(`commitlint --edit "${path}"`, { cwd, stdio });
}