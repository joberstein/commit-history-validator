import {readFileSync, writeFileSync} from 'fs';
import { parse } from "path";
import {getCurrentBranch} from "../utils/git.js";

export default ([ messagePath ]) => {
    const branch = getCurrentBranch();
    const issue = branch.trim().replace(/(issues|release)\//, "");
    const isIssueNumeric = issue && /\d+/.test(issue);

    if (!isIssueNumeric) {
        console.info("Cannot derive issue number from branch.\n");
        return;
    }

    const originalMessage = readFileSync(messagePath, 'utf8').trim();
    const messageLines = originalMessage.split('\n');
    const firstLineToIgnore = messageLines.findIndex(line => line.startsWith('#'));

    if (firstLineToIgnore >= 0) {
        messageLines.splice(firstLineToIgnore, messageLines.length);
    }

    const message = messageLines.join('\n').trim();
    const issueTag = `Issue ${issue}.`;

    const {name: hook} = parse(__filename);
    console.info(`Running '${hook}' hook...`);

    if (message.includes(issueTag)) {
        console.info("No commit message modifications necessary.\n");
        return;
    }

    const newMessage = message
        .concat("\n".repeat(2))
        .concat(issueTag);

    writeFileSync(messagePath, newMessage);
    console.info("Appended the issue number to the commit message.\n");
}