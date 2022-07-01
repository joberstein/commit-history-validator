import {parse, dirname} from "path";
import {execSync} from "child_process";

export const getFileName = () => {
    return parse(__filename).name;
}

export const getExecutingProjectDirectory = () => {
    const parentLevels = 2;

    return [...Array(parentLevels).keys()]
        .reduce(path => dirname(path), parse(__filename).dir);
}

export const getWorkingProjectDirectory = async () => {
    const result = execSync(`git rev-parse --show-toplevel`, { encoding: 'utf-8' });
    return result.trim();
}