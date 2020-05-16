#!/usr/bin/env node

const path = require('path');

function getFileName(filePath) {
  const extension = path.extname(filePath);
  const fileName = path.basename(filePath, extension);
  return fileName;
}

module.exports = { getFileName };
