import commandLineArgs from 'command-line-args';
import {getCurrentBranch} from "../utils/git";
import setupHooks from "./setupHooks";
import validateCommits from "./validateCommits";
import validateRelease from "./validateRelease";

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
                    throw new Error("Subcommand does not exist for main command 'hooks'.");
                }
            }
            break;
        }
        case "validate": {
            const {name, options} = parseCommandWithOptions(mainCommand.options);
            const {branch} = commandLineArgs([
                {
                    name: 'branch',
                    alias: 'b',
                    defaultValue: getCurrentBranch()
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
                    await validateRelease(branch);
                    break;
                }
                default: {
                    throw new Error("Subcommand does not exist for main command 'validate'.");
                }
            }
            break;
        }
        default: {
            throw new Error("Command does not exist.");
        }
    }
}