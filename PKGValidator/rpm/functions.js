const errDebug = require('debug')('debug:err')
const superDebug = require('debug')('debug:stdout')
const { execSync } = require('child_process')
const fs = require('fs')
const axios = require('axios')
const { stderr } = require('process')
const dlUrl = 'http://192.168.122.1/rpms/'
const rpmdir = './rpms4test'
var loopbacktoken = false

exports.deleteRPMfile = deleteRPMfile
exports.getRPMs = getRPMs
exports.validateRPMs = validateRPMs
exports.testinstallRPM = testinstallRPM
exports.downloadRPM = downloadRPM

async function getRPMs() {
    const res = await axios({
        url: dlUrl,
        method: 'GET'
    })
    const rpms = res.data.match(/.*\.rpm/g)
    const amount = rpms.length
    for ( i = 0; i < amount; i++) {
        const rpmName = rpms[i].split("\"")[1]
        await downloadRPM(`${dlUrl}${rpmName}`, `${rpmdir}/${rpmName}`)
    }
    do {
        loopbacktoken = false
        superDebug(`start while loop, loopbacktoken: ${loopbacktoken}`)
        try {
            await validateRPMs()
        } catch (err) {
            errDebug(err)
        }
        superDebug(`end of while loop, loopbacktoken: ${loopbacktoken}`)
    } while (loopbacktoken)
    console.log('RPM package validator has finished')
}

function validateRPMs() {
    return new Promise((res, rej) => {
        if (fs.readdirSync(rpmdir).length != 0) {
            fs.readdirSync(rpmdir).forEach(async (file) => {
                let stdout = execSync(`file ${rpmdir}/${file}`).toString()
                if (stdout.includes("RPM")) {
                    try {
                        await testinstallRPM(`${rpmdir}/${file}`)
                    } catch (err) {
                        rej(err)
                    }
                    res(true)
                } else {
                    const err = `File "${file}" is not an RPM package`
                    errDebug(err)
                    rej(err)
                }
            })
        } else {
            res('There are no files in the validate directory')
        }
    })
}

function testinstallRPM(rpm) {
    return new Promise(async (res, rej) => {
        console.log(`Validating Package ${rpm}`)
        superDebug(`Stage testinstallRPM:start loopbacktoken: ${loopbacktoken}`)
        try {
            const stdout = execSync(`yum -y install ${rpm} --setopt=tsflags=test --setopt=keepcache=0`, {stdio: [stderr]}).toString()
            superDebug(stdout)
            console.log(`Package ${rpm} installed successfully`)
            loopbacktoken = true
            await deleteRPMfile(rpm)
            res(true)
        } catch (err) {
            const stderr = err.stderr
            if (stderr.includes("Requires") || stderr.includes("nothing provides")) {
                console.log(`Package ${rpm} has missing dependencies...`)
            } else {
                console.log(`Unable to install package ${rpm}, run debug mode to view error`)
                errDebug(err)
            }
            rej(err)
        }
    })
}

function downloadRPM(fileUrl, outputLocationPath) {
    const writer = fs.createWriteStream(outputLocationPath);
    return axios({
      method: 'get',
      url: fileUrl,
      responseType: 'stream',
    }).then((response) => {
      return new Promise(async (res, rej) => {
        response.data.pipe(writer);
        let error = null;
        writer.on('error', err => {
          error = err;
          writer.close();
          console.log(err)
          rej(err);
        });
        writer.on('close', () => {
            if (!error) {
                console.log(fileUrl, 'download complete')
                res(true);
            }
        });
      });
    });
}

function deleteRPMfile(rpm) {
    return new Promise ((res, rej) => {
        try {
            fs.unlinkSync(rpm)
            console.log(`Deleted rpm ${rpm} succesfully`)
            res(true)
        } catch (err) {
            console.log(`Error deleting rpm file ${rpm} run debug to see error`)
            errDebug(err)
            rej(err)
        }
    })
}