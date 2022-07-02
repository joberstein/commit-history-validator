import fs from 'fs';
import * as gitUtils from "src/utils/git.js";
import run from "src/scripts/prepare-commit-msg";

const filepath = 'filepath';
let mockCommitMsgLines = [];

jest.mock('fs', () => ({
    readFileSync: jest.fn(() => mockCommitMsgLines.join('\n')),
    writeFileSync: jest.fn(),
}));

describe('src/hooks/prepare-commit-msg', () => {
    const getCurrentBranch = jest.spyOn(gitUtils, 'getCurrentBranch')
        .mockReturnValue('');

    beforeEach(() => {
       mockCommitMsgLines = ['Subject Line', '# Comment Line'];
    })

    it('Exits normally when the current branch is not valid', () => {
        run([ filepath ]);

        expect(fs.readFileSync).not.toHaveBeenCalled();
        expect(fs.writeFileSync).not.toHaveBeenCalled();
    });

    describe('Different commit message lengths', () => {
       beforeEach(() => {
           getCurrentBranch.mockReturnValue('issues/4');
       });

        it('Includes the issue number when only a subject line is present', () => {
            run([ filepath ]);

            mockCommitMsgLines.splice(-1, 0, '\nIssue 4.\n');
            const expectedMessage = mockCommitMsgLines.join('\n');

            expect(fs.readFileSync).toHaveBeenCalled();
            expect(fs.writeFileSync).toHaveBeenCalledWith(filepath, expectedMessage);
        });

        it('Includes the issue number when only a subject line is present', () => {
            const extraLine = '\nExtra line';
            const [subjectLine, commentLine] = mockCommitMsgLines;
            mockCommitMsgLines = [subjectLine, extraLine, commentLine];

            run([ filepath ]);

            mockCommitMsgLines.splice(-1, 0, '\nIssue 4.\n');
            const expectedMessage = mockCommitMsgLines.join('\n');

            expect(fs.readFileSync).toHaveBeenCalled();
            expect(fs.writeFileSync).toHaveBeenCalledWith(filepath, expectedMessage);
        });

        it('Does nothing when the issue number is already present', () => {
            const issueLine = '\nIssue 4.';
            const [subjectLine, commentLine] = mockCommitMsgLines;
            mockCommitMsgLines = [subjectLine, issueLine, commentLine];

            run([ filepath ]);

            expect(fs.readFileSync).toHaveBeenCalled();
            expect(fs.writeFileSync).not.toHaveBeenCalled();
        });
    });
});