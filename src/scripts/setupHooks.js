import {writeFileSync, existsSync, appendFileSync, readFileSync, readdirSync} from "fs";
import {getExecutingProjectDirectory, getWorkingProjectDirectory} from "../utils/path.js";
import {getHooksPath, setHooksPath} from "../utils/git.js";
import {execSync} from "child_process";

export default () => {
    const executingDir = getExecutingProjectDirectory();
    const workingDir = getWorkingProjectDirectory();

    const executingProjectData = readFileSync(`${executingDir}/package.json`, 'utf-8');
    const {name: executingAppName} = JSON.parse(executingProjectData);

    const workingProjectData = readFileSync(`${workingDir}/package.json`, 'utf-8');
    const {name: workingAppName} = JSON.parse(workingProjectData);

    if (workingAppName === executingAppName) {
        const hooksPath = `${executingDir}/src/hooks`;

        setHooksPath(hooksPath);
        console.info(`Set local hooks path to: ${hooksPath}`);
        return;
    }

    const existingHooksPath = getHooksPath();

    if (existingHooksPath) {
        console.warn(`Hooks path already exists at: '${existingHooksPath}'`);
    }

    const hooksPath = existingHooksPath || `${workingDir}/.git/hooks`;
    const hooks = readdirSync(`${executingDir}/src/hooks`);
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
        const existingHook = readFileSync(outputFile, 'utf-8');
        const commandMatcher = new RegExp(contents.replace("$", "\\$"));

        if (commandMatcher.test(existingHook)) {
            console.info(`Skipped updating the '${hook}' hook; it already contains the expected command.\n`);
            return;
        }

        console.info(`Appending the command to run the '${hook}' hook...\n`);
        appendFileSync(outputFile, '\n' + contents);
    });
}