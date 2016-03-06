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

export const canUseAltMain = ({path, request, issuer, context}) => {
  let absReq;
  if (typeof path !== 'undefined') {
    absReq = path;
    // convert module request to relative request
    // with the context as dirname of path
    request = './' + nodePath.posix.basename(absReq);
  } else if (typeof context !== 'undefined') {
    absReq = nodePath.join(context, request);
  } else if (typeof issuer !== 'undefined') {
    absReq = nodePath.join(nodePath.dirname(issuer), request);
  } else {
    throw new Error('Issuer, Context, Path - At least one should be defined');
  }

  if (isModuleImport(request)) return false;
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
  return false;
}
