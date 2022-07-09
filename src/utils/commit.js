import {execSync} from "child_process";

const defaultOptions = { stdio: 'inherit' };

const buildCommand = ({ from, config, messagePath, verbose }) => [
    'commitlint',
    ...(from ? ['--from', `${from}^`] : []),
    ...(config ? ['-g', `'${config}'`] : []),
    ...(verbose ? ['-V'] : []),
    ...(messagePath ? ['--edit', `'${messagePath}'`] : []),
].join(' ');

export const validateCommits = (options, execOptions = defaultOptions) => {
    const command = buildCommand({ ...options, verbose: true });
    execSync(command, execOptions);
}

export const validateCurrentCommit = (options, execOptions = defaultOptions) => {
    const command = buildCommand(options);
    execSync(command, execOptions);
}