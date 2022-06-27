import {$} from "zx";

export const node = async (executable, options) => {
    await $`node ${executable} ${options}`;
}

export const zx = async (executable, options) => {
    await $`zx ${executable} ${options}`;
}