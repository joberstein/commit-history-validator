import {writeFileSync, existsSync, appendFileSync, readFileSync, readdirSync} from "fs";
import {getExecutingProjectDirectory, getWorkingProjectDirectory, getWorkspaceNames} from "../utils/path.js";
import {getHooksPath, setHooksPath} from "../utils/git.js";
import {execSync} from "child_process";
import {resolve} from "path";

const encoding = 'utf-8';

export default () => {
    const executingDir = `${getExecutingProjectDirectory()}`;

    const executingProjectData = readFileSync(`${executingDir}/package.json`, { encoding });
    const {name: executingAppName} = JSON.parse(executingProjectData);

    if (getWorkspaceNames().includes(executingAppName)) {
        const hookImplementationPath = resolve(`${executingDir}/../hooks`);
        setHooksPath(hookImplementationPath);
        console.info(`Set local hooks path to: ${hookImplementationPath}`);
        execSync(`chmod -R +x ${hookImplementationPath}`);
        return;
    }

    const existingHooksPath = getHooksPath();

    if (existingHooksPath) {
        console.warn(`Hooks path already exists at: '${existingHooksPath}'`);
    }

    const workingDir = getWorkingProjectDirectory();
    const hooksPath = existingHooksPath || `${workingDir}/.git/hooks`;
    const hooksData = readFileSync(`${executingDir}/dist/hooks.txt`, { encoding });
    const hooks = hooksData.trim().split(' ');

    console.info(`Found the following hooks to install: [${hooks.join(', ')}]\n`);

    hooks.forEach(hook => {
        const outputFile = [hooksPath, hook].join("/");
        const contents = `npx ${executingAppName} hooks run ${hook} $@`;

        if (!existsSync(outputFile)) {
            console.info(`Writing the command to run the '${hook}' hook...`);
            writeFileSync(outputFile, contents);

            console.info(`Setting permissions for the '${hook}' hook...\n`);
            execSync(`chmod +x ${outputFile}`);

            return;
        }

        console.warn(`Hook already exists at file: '${outputFile}'`);
        const existingHook = readFileSync(outputFile, { encoding });
        const commandMatcher = new RegExp(contents.replace("$", "\\$"));

        if (commandMatcher.test(existingHook)) {
            console.info(`Skipped updating the '${hook}' hook; it already contains the expected command.\n`);
            return;
        }

        console.info(`Appending the command to run the '${hook}' hook...\n`);
        appendFileSync(outputFile, '\n' + contents);
    });
}