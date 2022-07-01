import { validateCurrentCommit } from "../utils/commit.js";
import { getFileName } from "../utils/path.js";

export default (messagePath) => {
    if (!messagePath) {
        console.error("Path to the last commit message is required.");
        return;
    }

    const hook = getFileName(__filename);
    console.info(`Running '${hook}' hook...`);

    return validateCurrentCommit(messagePath);
}