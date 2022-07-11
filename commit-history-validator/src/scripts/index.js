import commandLineArgs from 'command-line-args';
import {getCurrentBranch} from "../utils/git";
import setupHooks from "./setupHooks";
import validateCommits from "./validateCommits";
import validateRelease from "./validateRelease";
import {getWorkingProjectDirectory} from "../utils/path";
import {execSync} from "child_process";

const usage = () => [
    "Usage:",
    " - [cmd] hooks setup",
    " - [cmd] hooks run [hook]",
    " - [cmd] validate commits [-b | --branch]",
    " - [cmd] validate release [-b | --branch]",
].join("\n");

const parseCommandWithOptions = (argv) => {
    const definitions = [
        { name: 'name', defaultOption: true },
    ];

    const { name, _unknown } = commandLineArgs(definitions, { argv, stopAtFirstUnknown: true })
    const options = _unknown || [];

    return { name, options };
}

export const run = async () => {
    const mainCommand = parseCommandWithOptions();

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
                    throw new Error(`Subcommand does not exist for main command 'hooks'.\n${usage()}`);
                }
            }
            break;
        }
        case "validate": {
            const {name, options} = parseCommandWithOptions(mainCommand.options);
            const {branch, config} = commandLineArgs([
                {
                    name: 'branch',
                    alias: 'b',
                    defaultValue: getCurrentBranch()
                },
                {
                    name: 'config',
                    alias: 'c',
                    defaultValue: getWorkingProjectDirectory(),
                },
            ], {
                argv: options,
                stopAtFirstUnknown: true
            });

            switch (name) {
                case "commits": {
                    validateCommits(branch);
                    break;
                }
                case "release": {
                    await validateRelease(branch, config);
                    break;
                }
                default: {
                    throw new Error(`Subcommand does not exist for main command 'validate'.\n${usage()}`);
                }
            }
            break;
        }
        case "release": {
            execSync(`semantic-release ${mainCommand.options.join(' ')}`, { stdio: 'inherit'});
            break;
        }
        default: {
            throw new Error(`Command does not exist.\n${usage()}`);
        }
    }
}

export default async () => {
    try {
        await run();
    } catch ({ message }) {
        console.error(message);
        process.exit(1);
    }
}