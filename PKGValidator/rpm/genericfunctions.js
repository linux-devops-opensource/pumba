const axios = require('axios')
const fs = require('fs')

const functions = {
    getPackages,
    downloadPackages
}
module.exports = functions;

async function getPackages(dlUrl) {
    const res = await axios({
        url: dlUrl,
        method: 'GET'
    })
    return res.data
}

async function downloadPackages(packagelist, dlUrl, targetDir) {
    const amount = packagelist.length
    for ( i = 0; i < amount; i++) {
        const packageName = packagelist[i].split("\"")[1]
        await downloadPackage(`${dlUrl}${packageName}`, `${targetDir}/${packageName}`)
    }
}

function downloadPackage(fileUrl, outputLocationPath) {
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


function deletePackagefile(pkg) {
  return new Promise ((res, rej) => {
      try {
          fs.unlinkSync(pkg)
          console.log(`Deleted package file ${pkg} succesfully`)
          res(true)
      } catch (err) {
          console.log(`Error deleting file ${pkg} run debug to see error`)
          errDebug(err)
          rej(err)
      }
  })
}