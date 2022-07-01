import {execSync} from "child_process";

export const node = (executable, options) => {
    execSync(`node ${executable} ${options}`);
}

export const zx = (executable, options) => {
    execSync(`zx ${executable} ${options}`);
}