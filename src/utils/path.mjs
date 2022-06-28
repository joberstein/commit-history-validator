import {parse, dirname} from "path";
import {$} from "zx";

export const getExecutingProjectDirectory = () => {
    const {pathname} = new URL(import.meta.url);
    const parentLevels = 2;

    return [...Array(parentLevels).keys()]
        .reduce(path => dirname(path), parse(pathname).dir);
}

export const getWorkingProjectDirectory = async () => {
    const {stdout} = await $`git rev-parse --show-toplevel`;
    return stdout.trim();
}