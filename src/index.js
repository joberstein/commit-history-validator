#!/usr/bin/env node

import run from "./scripts/index";

const printUsage = () => {
    console.info([
        "Command not found.",
        "Usage:",
        " - [cmd] hooks setup",
        " - [cmd] hooks run [hook]",
        " - [cmd] validate commits [-b | --branch]",
        " - [cmd] validate release [-b | --branch]",
    ].join("\n"));
}

try {
    run();
} catch (e) {
    console.error(e);
    printUsage();
}