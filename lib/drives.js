// npm
const drivelist = require('drivelist');
require('colors');

async function getExternalDrives(callback) {
  let removableDrives = [];
  const allDrives = await drivelist.list();
  var checkDrives = new Promise((resolve, reject) => {
    Object.keys(allDrives).forEach((key, index) => {
      if (allDrives[index].isRemovable === true) {
        removableDrives.push({
          raw: allDrives[index].raw,
          name: allDrives[index].description,
          device: allDrives[index].device,
        });
      }
      if (index === Object.keys(allDrives).length - 1) resolve();
    });
  });
  checkDrives.then(() => {
    if (removableDrives.length == 0) {
      console.log('\nPlease a insert removable drive before using drive-flasher.\n'.red);
    } else {
      callback(removableDrives);
    }
  });
}

module.exports = { getExternalDrives };
