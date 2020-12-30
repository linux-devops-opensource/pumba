const fs = require('fs');
const assert = require('assert');

const functions = require('../functions')

// describe('Delete RPM test', function() {
//     it('If the function successfully deletes a file it should return true', async function() {
//         fs.copyFileSync('./test/testresources/zsh-5.8-3.fc33.x86_64.rpm', './test/testsandbox/zsh-5.8-3.fc33.x86_64.rpm');
//         let result = await functions.deleteRPMfile('./test/testsandbox/zsh-5.8-3.fc33.x86_64.rpm')
//         assert.ok(result, 'Unable to delete RPM')
//     });
// })

describe('Delete RPM test', function() {
    it('If the function successfully deletes a file the file should no longer exist in the sandbox', async function() {
        const testRPM = 'zsh-5.8-3.fc33.x86_64.rpm'
        fs.copyFileSync(`./test/testresources/${testRPM}`, `./test/testsandbox/${testRPM}`);
        await functions.deleteRPMfile(`./test/testsandbox/${testRPM}`)
        let fileExists = fs.existsSync(testRPM)
        assert.ok(!fileExists, 'Unable to delete RPM')
    });
})