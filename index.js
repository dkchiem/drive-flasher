#!/usr/bin/env node

// drive-flasher
const drives = require('./lib/drives');
const shell = require('./lib/shell');
const files = require('./lib/files');
const { checkUpdate } = require('./lib/update');
// npm
const inquirer = require('inquirer');
const exec = require('child_process').exec;
const ora = require('ora');
require('colors');

main();

function main() {
  drives.getExternalDrives((removableDrives) => {
    let driveQuestion = [];

    Object.keys(removableDrives).forEach((key, index) => {
      driveQuestion.push({
        name: removableDrives[0].name,
        value: index,
      });
    });

    // Question 1
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'driveIndex',
          message: 'Which removable drive do you want to use?',
          choices: driveQuestion,
        },
      ])
      .then(({ driveIndex }) => {
        // Question 2
        inquirer
          .prompt([
            {
              type: 'input',
              name: 'imageFile',
              message: "What's the path to your image file",
            },
          ])
          .then(({ imageFile }) => {
            const tempFilesPath = __dirname + '/temp';
            const dmgPartialPath = tempFilesPath + '/' + files.getFileName(imageFile);
            const dmgFullPath = dmgPartialPath + '.dmg';

            const spinner = ora(`Erasing "${removableDrives[driveIndex].name}" drive...`).start();
            spinner.color = 'green';

            // Erase disk
            shell
              .execCommand(
                `diskutil eraseDisk JHFS+ DiskName ${removableDrives[driveIndex].device}`
              )
              .then(() => {
                // Convert temp folder
                spinner.text = 'Converting image to .dmg file...';
                shell.execCommand(`mkdir -p ${tempFilesPath}`).then(() => {
                  // Convert image to .dmg file
                  shell
                    .execCommand(`hdiutil convert -format UDRW -o ${dmgPartialPath} ${imageFile}`)
                    .then(() => {
                      // Unmount drive
                      spinner.text = 'Unmounting drive...';
                      shell
                        .execCommand(`diskutil unmountDisk ${removableDrives[driveIndex].device}`)
                        .then(() => {
                          // Flash drive
                          spinner.text = 'Flashing drive... (This will take a few minutes)';
                          shell
                            .execCommand(
                              `sudo dd if=${dmgFullPath} of=${removableDrives[driveIndex].raw} bs=1m`
                            )
                            .then(() => {
                              // Clean up temp files created
                              spinner.text = 'Cleaning created temp files...';
                              shell.execCommand(`rm ${dmgFullPath}`).then(() => {
                                spinner.text = 'Ejecting drive...';
                                // Eject drive
                                shell
                                  .execCommand(
                                    `diskutil eject ${removableDrives[driveIndex].device}`
                                  )
                                  .then(() => {
                                    // DONE!
                                    spinner.text = 'Done!';
                                    setTimeout(() => {
                                      spinner.stop();
                                      console.log('Thank you for using drive-flasher!'.blue.bold);
                                      checkUpdate();
                                    }, 1000);
                                  });
                              });
                            });
                        });
                    });
                });
              });
          });
      });
  });
}
