const fs = require('fs')
const chai = require('chai')
const sinon = require('sinon')
    git 
const testRPM = 'zsh-5.8-3.fc33.x86_64.rpm'
const functions = require('../functions')

//create sandbox
fs.mkdirSync("./test/testsandbox", { recursive: true })

describe('Delete RPM test', function() {
    it('If the function successfully deletes a file the file should no longer exist in the sandbox', async function() {
        fs.copyFileSync(`./test/testresources/${testRPM}`, `./test/testsandbox/${testRPM}`);
        await functions.deleteRPMfile(`./test/testsandbox/${testRPM}`)
        let fileExists = fs.existsSync(testRPM)
        chai.expect(fileExists).to.be.false
    });
})

describe('Test install RPM', function() {
    it('If the installation is successful we should get no errors', async function () {
        this.timeout(7000)
        fs.copyFileSync(`./test/testresources/${testRPM}`, `./test/testsandbox/${testRPM}`)
        sinon.stub(functions, "deleteRPMfile").returns(true)
        const result = await functions.testinstallRPM(`./test/testsandbox/${testRPM}`)
        chai.expect(result).to.be.true
        //clean up sandbox
        //fs.rmdirSync('./test/testsandbox', { recursive: true })
    })
})
