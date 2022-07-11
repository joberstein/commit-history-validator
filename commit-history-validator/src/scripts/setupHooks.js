import {writeFileSync, existsSync, appendFileSync, readFileSync, readdirSync} from "fs";
import {getExecutingProjectDirectory, getWorkingProjectDirectory, getWorkspaceNames} from "../utils/path.js";
import {getHooksPath, setHooksPath} from "../utils/git.js";
import {execSync} from "child_process";
import {resolve} from "path";

const encoding = 'utf-8';

export default () => {
    const executingDir = `${getExecutingProjectDirectory()}`;
    const executingProjectData = readFileSync(`${executingDir}/package.json`, { encoding });
    const {name: executingAppName, version} = JSON.parse(executingProjectData);

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
        const contents = `npx ${executingAppName}@${version} hooks run ${hook} $@`;

        if (!existsSync(outputFile)) {
            console.info(`Writing the command to run the '${hook}' hook...`);
            writeFileSync(outputFile, contents, { mode: 0o755 });
            return;
        }

        const commandMatcher = new RegExp(contents
            .replace(`@${version}`, '.*')
            .replaceAll("$", "\\$")
        );

        console.warn(`Hook already exists at file: '${outputFile}'`);
        const existingHookLines = readFileSync(outputFile, { encoding })
            .split('\n');

        const commandLineIdx = existingHookLines.findIndex(line => commandMatcher.test(line));

        if (commandLineIdx < 0) {
            console.info(`Appending the command to run the '${hook}' hook...\n`);
            appendFileSync(outputFile, '\n' + contents);
            return;
        }

        existingHookLines.splice(commandLineIdx, 1, contents);
        console.info(`Updating the '${hook}' hook to version ${version}.\n`);
        writeFileSync(outputFile, existingHookLines.join('\n'));
    });
}