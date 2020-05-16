#!/usr/bin/env node

const isValidPath = require('is-valid-path');
const path = require('path');
const fs = require('fs');
require('colors');

function getFileName(filePath) {
  const extension = path.extname(filePath);
  const fileName = path.basename(filePath, extension);
  return fileName;
}

function pathExists(filePath) {
  return fs.existsSync(filePath);
}

function checkPath(path) {
  if (!isValidPath(path)) {
    console.log(`${path} path is invalid`.red);
    return false;
  } else {
    if (!pathExists(path)) {
      console.log(`${path}  does not exist`.red);
      return false;
    } else {
      return true;
    }
  }
}

module.exports = { getFileName, checkPath };
