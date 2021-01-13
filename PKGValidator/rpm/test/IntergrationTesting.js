const fs = require('fs')
const chai = require('chai')
const sinon = require('sinon')
const testRPM = 'telepathy-filesystem-0.0.2-6.el7.noarch.rpm'
const functions = require('../functions')
const genfunc = require('../genericfunctions')

//create sandbox
fs.mkdirSync("./test/testsandbox", { recursive: true })

describe('Test install RPM', function() {
    it('If the installation is successful we should get no errors', async function () {
        this.timeout(7000)
        fs.copyFileSync(`./test/testresources/${testRPM}`, `./test/testsandbox/${testRPM}`)
        sinon.stub(genfunc, "deletePackagefile").returns(true)
        const result = await functions.testinstallRPM(`./test/testsandbox/${testRPM}`)
        chai.expect(result).to.be.true
    })
})
