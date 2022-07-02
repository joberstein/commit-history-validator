import commandLineArgs from 'command-line-args';
import {node} from "../utils/exec.js";
import {getExecutingProjectDirectory} from "../utils/path.js";
import setupHooks from "./setupHooks";

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

const parseCommandWithOptions = (argv) => {
    const definitions = [
        { name: 'name', defaultOption: true },
    ];

    const { name, _unknown } = commandLineArgs(definitions, { argv, stopAtFirstUnknown: true })
    const options = _unknown || [];

    return { name, options };
}

export default async () => {
    const mainCommand = parseCommandWithOptions();
    const executingDir = getExecutingProjectDirectory();

    switch (mainCommand.name) {
        case "hooks": {
            const subCommand = parseCommandWithOptions(mainCommand.options);

            switch (subCommand.name) {
                case "setup": {
                    setupHooks();
                    break;
                }
                case "run": {
                    const {name: hook, options} = parseCommandWithOptions(subCommand.options);
                    const hookExports = await import(`./${hook}`);
                    hookExports.default(options);
                    break;
                }
                default: {
                    printUsage();
                }
            }
            break;
        }
        case "validate": {
            const {name, options} = parseCommandWithOptions(mainCommand.options);

            switch (name) {
                case "commits": {
                    node(`${executingDir}/dist/scripts/validateCommits.js`, options);
                    break;
                }
                case "release": {
                    node(`${executingDir}/dist/scripts/validateRelease.js`, options);
                    break;
                }
                default: {
                    printUsage();
                }
            }
            break;
        }
        default: {
            printUsage();
        }
    }
}