import { validateCurrentCommit } from "../utils/commit.js";
import { getFileName } from "../utils/path.js";

export default async (messagePath) => {
    if (!messagePath) {
        console.error("Path to the last commit message is required.");
        return;
    }

    const hook = getFileName();
    console.info(`Running '${hook}' hook...`);

    return validateCurrentCommit(messagePath);
}