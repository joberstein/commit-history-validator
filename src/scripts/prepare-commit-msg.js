import {readFileSync, writeFileSync} from 'fs';
import { parse } from "path";
import {getCurrentBranch} from "../utils/git.js";

export default ([ messagePath ]) => {
    const isCommentedLine = line => line.startsWith('#');

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

    const {name: hook} = parse(__filename);
    console.info(`Running '${hook}' hook...`);

    const branch = getCurrentBranch();
    const issue = branch.trim().replace(/(issues|release)\//, "");
    const isIssueNumeric = issue && /\d+/.test(issue);
    const issueTag = `Issue ${issue}.`;

    if (isIssueNumeric && !messageContents.includes(issueTag)) {
        const newMessage = messageContents
            .concat("\n".repeat(2))
            .concat(issueTag)
            .concat("\n".repeat(2))
            .concat(messageComments);

        writeFileSync(messagePath, newMessage);
        console.info("Appended the issue number to the commit message.\n");
    } else {
        console.info("No commit message modifications necessary.\n");
    }
}