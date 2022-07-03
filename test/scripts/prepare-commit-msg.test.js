import fs from 'fs';
import * as gitUtils from "src/utils/git.js";
import run from "src/scripts/prepare-commit-msg";

const filepath = 'filepath';
let mockCommitMsgLines = [];

jest.mock('fs', () => ({
    readFileSync: jest.fn(() => mockCommitMsgLines.join('\n')),
    writeFileSync: jest.fn(),
}));

const getNewMessage = (issue) => {
    mockCommitMsgLines = [...mockCommitMsgLines, `\nIssue ${issue}.`];
    return mockCommitMsgLines.join('\n');
}

describe('src/hooks/prepare-commit-msg', () => {
    const getCurrentBranch = jest.spyOn(gitUtils, 'getCurrentBranch')
        .mockReturnValue('');

    beforeEach(() => {
        mockCommitMsgLines = ['Subject Line'];
    });

    ['', 'issues', 'issues/a'].forEach(branch => {
        it(`Exits normally when the current branch: '${branch}' is invalid`, () => {
            getCurrentBranch.mockReturnValue(branch);
            run([ filepath ]);

            expect(fs.readFileSync).not.toHaveBeenCalled();
            expect(fs.writeFileSync).not.toHaveBeenCalled();
        });
    });

    describe('Different commit message lengths', () => {
       beforeEach(() => {
           getCurrentBranch.mockReturnValue('issues/4');
       });

        it('Includes the issue number for a release branch', () => {
            getCurrentBranch.mockReturnValue('release/5');
            run([ filepath ]);
            const newMessage = getNewMessage(5);

            expect(fs.readFileSync).toHaveBeenCalled();
            expect(fs.writeFileSync).toHaveBeenCalledWith(filepath, newMessage);
        });

        it('Includes the issue number when only a subject line is present', () => {
            run([ filepath ]);

            expect(fs.readFileSync).toHaveBeenCalled();
            expect(fs.writeFileSync).toHaveBeenCalledWith(filepath, getNewMessage(4));
        });

        it('Includes the issue number when only a subject line is present', () => {
            const extraLine = '\nExtra line';
            const [subjectLine] = mockCommitMsgLines;
            mockCommitMsgLines = [subjectLine, extraLine];

            run([ filepath ]);

            expect(fs.readFileSync).toHaveBeenCalled();
            expect(fs.writeFileSync).toHaveBeenCalledWith(filepath, getNewMessage(4));
        });

        it('Does nothing when the issue number is already present', () => {
            const issueLine = '\nIssue 4.';
            const [subjectLine] = mockCommitMsgLines;
            mockCommitMsgLines = [subjectLine, issueLine];

            run([ filepath ]);

            expect(fs.readFileSync).toHaveBeenCalled();
            expect(fs.writeFileSync).not.toHaveBeenCalled();
        });

        it('Removes all lines after comments in the commit message', () => {
            const extraLines = ['\n# Comment line', '\nExtra line'];
            const [subjectLine] = mockCommitMsgLines;
            mockCommitMsgLines = [subjectLine, ...extraLines];

            run([ filepath ]);
            mockCommitMsgLines.splice(1, 2);

            expect(fs.readFileSync).toHaveBeenCalled();
            expect(fs.writeFileSync).toHaveBeenCalledWith(filepath, getNewMessage(4));
        });
    });
});