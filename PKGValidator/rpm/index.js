const infoDebug = require('debug')('debug:info')
const superDebug = require('debug')('debug:stdout')
const { exec } = require('child_process')
const fs = require('fs')
const axios = require('axios')
const rpmdir = './rpms4test'
const pkgs = []
const loopbacktoken = true

function validateRPMs() {
    fs.readdir(rpmdir, (err, files) => {
        if (err) {
            console.error(err)
        }
        files.forEach((file) => {
            exec(`file ${rpmdir}/${file}`, async (err, stdout, stderr) => {
                if (err) {
                    console.error(err)
                }
                if (stderr) {
                    console.error(stderr)
                }
                if (stdout.includes("RPM")) {
                    pkgs.push(stdout.split(':')[0])
                    console.log(pkgs)
                    // await testinstallRPM(pkg)
                } else {
                    console.error(`File "${file}" is not an RPM package`)
                }
            })
        })
    })
}
function testinstallRPM(rpm) {
    return new Promise(() => {
        infoDebug(`Validating Package ${rpm}`)
        exec(`sudo yum -y install ${rpm} --setopt=tsflags=test --setopt=keepcache=0 --disablerepo=*`, (error, stdout, stderr) => {
            if (error) {
                console.error('this is error', error)
            }
            if (stderr) {
                if (stderr.includes("Requires")) {
                    console.error(`Package ${rpm} has missing dependencies...`)
                    loopbacktoken = false
                }
                console.error(stderr)
            }
            superDebug(stdout)
            loopbacktoken = true
        })
    })
}
function getRPMs() {
    //axios download rpms
    while (loopbacktoken) {
        validateRPMs();
    }
}
getRPMs();