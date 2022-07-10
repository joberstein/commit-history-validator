#!/usr/bin/env node

import run from "./scripts";
import * as gitUtils from "./utils/git";

export const fetchRemoteBranch = gitUtils.fetchRemoteBranch;
export const isRemoteBranch = gitUtils.isRemoteBranch;
export const hasChanges = gitUtils.hasChanges;

run();