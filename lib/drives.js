#!/usr/bin/env node

const drivelist = require('drivelist');
require('colors');

async function getExternalDrives() {
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
  await checkDrives;
  if (removableDrives.length == 0) {
    console.log('\nPlease a insert removable drive before using drive-flasher.\n'.red);
    process.exit(1);
  }
  return removableDrives;
}

module.exports = { getExternalDrives };
