const run = require('./functions')
const dlUrl = 'http://192.168.122.1/rpms/'

async function Start() {
    const rpms = await run.getRPMs(dlUrl)
    await run.downloadRPMs(rpms, dlUrl)
    run.validation()
}
Start()