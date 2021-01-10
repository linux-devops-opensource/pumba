const func = require('./functions')
const genfunc = require('./genericfunctions')
const dlUrl = 'http://192.168.122.1/rpms/'
const targetDir = './rpms4test'

async function Start() {
    const rpms = await func.getRPMs(dlUrl)
    await genfunc.downloadPackages(rpms, dlUrl, targetDir)
    func.validation(targetDir)
}
Start()