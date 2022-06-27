import {writeFileSync, existsSync, appendFileSync, readFileSync, readdirSync} from "fs";
import {getExecutingProjectDirectory, getWorkingProjectDirectory} from "../utils/path.mjs";
import {getHooksPath, setHooksPath} from "../utils/git.mjs";

const executingDir = getExecutingProjectDirectory();
const workingDir = await getWorkingProjectDirectory();

const executingProjectData = readFileSync(`${executingDir}/package.json`, 'utf-8');
const {name: executingAppName, version: executingAppVersion} = JSON.parse(executingProjectData);

const workingProjectData = readFileSync(`${workingDir}/package.json`, 'utf-8');
const { name: workingAppName } = JSON.parse(workingProjectData);

if (workingAppName === executingAppName) {
    const hooksPath = `${executingDir}/hooks`;

    await setHooksPath(hooksPath);
    console.info(`Set local hooks path to: ${hooksPath}`);
    process.exit(0);
}

let existingHooksPath = await getHooksPath();

if (existingHooksPath) {
    console.warn(`Hooks path already exists at: '${existingHooksPath}'`);
}

const hooksPath = existingHooksPath || `${workingDir}/.git/hooks`;
const hooks = readdirSync(`${executingDir}/hooks`);
console.info(`Found the following hooks to install: [${hooks.join(', ')}]`);

hooks.forEach(hook => {
    const outputFile = [hooksPath, hook].join("/");
    const contents = `npx ${executingAppName}@${executingAppVersion} hooks run ${hook} $@\n`;

    if (!existsSync(outputFile)) {
        console.info(`Writing the command to run the '${hook}' hook...`);
        writeFileSync(outputFile, contents);
        return;
    }

    console.warn(`Hook already exists at file: '${outputFile}'`);
    const existingHook = readFileSync(outputFile, 'utf-8');
    const commandMatcher = new RegExp(contents
        .replace(executingAppVersion, "\\d+.\\d+.\\d+")
        .replace("$", "\\$")
    );

    if (commandMatcher.test(existingHook)) {
        console.info(`Skipped updating the '${hook}' hook; it already contains the expected command.`);
        return;
    }

    console.info(`Appending the command to run the '${hook}' hook...`);
    appendFileSync(outputFile, '\n' + contents);
});