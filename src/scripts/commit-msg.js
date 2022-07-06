import { validateCurrentCommit } from "../utils/commit.js";
import { getFileName } from "../utils/path.js";

export default ([ messagePath ]) => {
    if (!messagePath) {
        throw new Error("Path to the last commit message is required.");
    }

    const hook = getFileName(__filename);
    console.info(`Running '${hook}' hook...`);

    return validateCurrentCommit(messagePath);
}