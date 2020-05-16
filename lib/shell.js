#!/usr/bin/env node

const { exec } = require('child_process');

function execCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      stderr ? reject() : resolve(stdout);
    });
  });
}

module.exports = {
  execCommand,
};
