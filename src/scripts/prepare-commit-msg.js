import {readFileSync, writeFileSync} from 'fs';
import { parse } from "path";
import {getCurrentBranch} from "../utils/git.js";


const isCommentedLine = line => line.startsWith('#');

export default ([ messagePath ]) => {
    const branch = getCurrentBranch();
    const issue = branch.trim().replace(/(issues|release)\//, "");
    const isIssueNumeric = issue && /\d+/.test(issue);

    if (!isIssueNumeric) {
        console.info("Cannot derive issue number from branch.\n");
        return;
    }

    const messageLines = readFileSync(messagePath, 'utf8')
        .trim()
        .split('\n');

    const messageComments = messageLines
        .filter(isCommentedLine)
        .join('\n')
        .trim();

    const messageContents = messageLines
        .filter(line => !isCommentedLine(line))
        .join('\n')
        .trim();

    const issueTag = `Issue ${issue}.`;

    const {name: hook} = parse(__filename);
    console.info(`Running '${hook}' hook...`);

    if (messageContents.includes(issueTag)) {
        console.info("No commit message modifications necessary.\n");
        return;
    }

    const newMessage = messageContents
        .concat("\n".repeat(2))
        .concat(issueTag)
        .concat("\n".repeat(2))
        .concat(messageComments);

    writeFileSync(messagePath, newMessage);
    console.info("Appended the issue number to the commit message.\n");
}