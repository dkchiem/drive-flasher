#!/usr/bin/env node

// drive-flasher
const drives = require('./lib/drives');
const shell = require('./lib/shell');
const files = require('./lib/files');
const { checkUpdate } = require('./lib/update');
// npm
const inquirer = require('inquirer');
const ora = require('ora');
require('colors');

main();

async function main() {
  const removableDrives = await drives.getExternalDrives();
  let driveQuestion = [];

  Object.keys(removableDrives).forEach((key, index) => {
    driveQuestion.push({
      name: removableDrives[0].name,
      value: index,
    });
  });

  const { driveIndex, imageFile, eraseConfirm } = await inquirer.prompt([
    {
      type: 'list',
      name: 'driveIndex',
      message: 'Which removable drive do you want to use',
      choices: driveQuestion,
    },
    {
      type: 'input',
      name: 'imageFile',
      message: "What's the path to your image file",
      validate(path) {
        if (!path) return 'Please enter the path to your image file';
        if (!files.checkPath(path.trim())) return `${path.trim()} path is invalid`;
        return true;
      },
    },
    {
      type: 'confirm',
      name: 'eraseConfirm',
      message: 'Are you sure you want to flash this drive? This wipe everything on the it.',
    },
  ]);

  if (!eraseConfirm) process.exit(0);
  const tempFilesPath = __dirname + '/temp';
  const dmgPartialPath = tempFilesPath + '/' + files.getFileName(imageFile);
  const dmgFullPath = dmgPartialPath + '.dmg';

  // Erase disk
  const spinner = ora(`Erasing "${removableDrives[driveIndex].name}" drive...`).start();
  spinner.color = 'green';
  await shell.execCommand(
    `diskutil eraseDisk JHFS+ DiskName ${removableDrives[driveIndex].device}`
  );
  // Convert temp folder
  spinner.text = 'Converting image to .dmg file...';
  if (files.pathExists(tempFilesPath)) {
    await shell.execCommand(`rm -r ${tempFilesPath}`);
  }
  await shell.execCommand(`mkdir -p ${tempFilesPath}`);
  // Convert image to .dmg file
  await shell.execCommand(`hdiutil convert -format UDRW -o ${dmgPartialPath} ${imageFile}`);
  // Unmount drive
  spinner.text = 'Unmounting drive...';
  await shell.execCommand(`diskutil unmountDisk ${removableDrives[driveIndex].device}`);
  // Flash drive
  spinner.text = 'Flashing drive... (This will take a few minutes)';
  await shell.execCommand(`sudo dd if=${dmgFullPath} of=${removableDrives[driveIndex].raw} bs=1m`);
  spinner.text = 'Ejecting drive...';
  // Eject drive
  await shell.execCommand(`diskutil eject ${removableDrives[driveIndex].device}`);
  // DONE!
  spinner.stop();
  console.log('Thank you for using drive-flasher!'.blue.bold);
  checkUpdate();
}
