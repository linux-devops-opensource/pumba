const fs = require('fs')
const chai = require('chai')
const sinon = require('sinon')
const testPackage = 'telepathy-filesystem-0.0.2-6.el7.noarch.rpm'
const genfunc = require('../genericfunctions')

//create sandbox
fs.mkdirSync("./test/testsandbox", { recursive: true })

describe('Delete Package file test', function() {
    it('If the function successfully deletes a file the file should no longer exist in the sandbox', async function() {
        fs.copyFileSync(`./test/testresources/${testPackage}`, `./test/testsandbox/${testPackage}`);
        await genfunc.deletePackagefile(`./test/testsandbox/${testPackage}`)
        let fileExists = fs.existsSync(testPackage)
        chai.expect(fileExists).to.be.false
    });
})