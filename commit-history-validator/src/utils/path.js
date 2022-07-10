import {parse, dirname} from "path";
import {execSync} from "child_process";

const encoding = 'utf-8';

export const getFileName = (filename) => {
    return parse(filename).name;
}

export const getExecutingProjectDirectory = () => {
    const parentLevels = 2;

    return [...Array(parentLevels).keys()]
        .reduce(path => dirname(path), parse(__filename).dir);
}

export const getWorkingProjectDirectory = () => {
    const command = `git rev-parse --show-toplevel`;
    return execSync(command, { encoding }).trim();
}

export const getWorkspaceNames = ({ cwd } = {}) => {
    const stdio = ['pipe', 'pipe', 'ignore'];
    const command = 'yarn workspaces --json info';

    try {
        const workspacesInfo = JSON.parse(execSync(command, { cwd, encoding, stdio }));
        const workspaces = JSON.parse(workspacesInfo.data);
        return Object.keys(workspaces);
    } catch (ignored) {
        return [];
    }
}