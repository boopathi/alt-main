import fs from 'fs';
import nodePath from 'path';

export const isFile = path => {
  try {
    return fs.lstatSync(path).isFile();
  } catch(e) {
    return false;
  }
};

export const isDir = path => {
  try {
    return fs.lstatSync(path).isDirectory()
  } catch(e) {
    return false;
  }
};

export const isModuleImport = req => {
  return req.indexOf('.') !== 0;
};

export const denormPosixJoin = (...args) => {
  // we use posix because using windows style paths in require
  // makes it an escape character and not a path delimiter
  let result = nodePath.posix.join(...args);

  // path.join function normalizes the path
  // As a result
  // ./A is converted to A/A instead of ./A/A
  // module require vs relative require
  if (args[0].indexOf('.') === 0 && args[0].indexOf('..') !== 0)
    result = './' + result;
  return result;
};

export const canUseAltMain = (req, issuer, opts) => {
  const absReq = nodePath.join(nodePath.dirname(issuer), req);

  if (isModuleImport(req)) return false;

  if (isFile(absReq)) return false;
  if (isDir(absReq)) {
    const packageJson = nodePath.join(absReq, 'package.json');
    const indexJs = nodePath.join(absReq, 'index.js');

    try {
      if (typeof require(packageJson).main !== 'undefined') return false;
    } catch(e) {
      if (e.code !== 'MODULE_NOT_FOUND') throw e;
    }
    if (isFile(indexJs)) return false;
    return true;
  }
}
