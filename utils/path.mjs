import {parse, dirname} from "path";
import {$} from "zx";

export const getExecutingProjectDirectory = () => {
    const {pathname} = new URL(import.meta.url);
    return dirname(parse(pathname).dir);
}

export const getWorkingProjectDirectory = async () => {
    const {stdout} = await $`git rev-parse --show-toplevel`;
    return stdout.trim();
}