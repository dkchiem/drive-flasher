#!/usr/bin/env node

const exec = require('child_process').exec;

function execCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

module.exports = {
  execCommand,
};
