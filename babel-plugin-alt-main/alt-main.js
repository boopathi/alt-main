import nodePath from 'path';
import fs from 'fs';

function isFile(path) {
  try {
    return fs.lstatSync(path).isFile();
  } catch(e) {
    return false;
  }
}

function isDir(path) {
  try {
    return fs.lstatSync(path).isDirectory();
  } catch(e) {
    return false;
  }
}

// we use posix because using windows style paths in require
// makes it an escape character and not a path delimiter
function denormPosixJoin(...args) {
  let result = nodePath.posix.join(...args);

  // path.join function normalizes the path
  // As a result
  // ./A is converted to A/A instead of ./A/A
  // module require vs relative require
  if (args[0].indexOf('.') === 0 && args[0].indexOf('..') !== 0)
    result = './' + result;
  return result;
}

function canUseAltMain(req, issuer) {

  const issuerDir = nodePath.dirname(issuer);
  const absReq = nodePath.join(issuerDir, req);

  if (isFile(absReq)) return false;

  if (isDir(absReq)) {
    const packageJson = nodePath.join(absReq, 'package.json');
    const indexJs = nodePath.join(absReq, 'index.js');
    if (isFile(packageJson)) {
      let main = require(packageJson);
      if (typeof main !== 'undefined') return false;
    }
    if (isFile(indexJs)) return false;
    return true;
  }
}

export default function({types: t}) {
  const requireVisitor = {
    CallExpression(path, plugin) {
      if (t.isIdentifier(path.node.callee, { name: 'require' }))
        path.traverse(modVisitor, { file: plugin.file });
    }
  };
  const modVisitor = {
    StringLiteral(path) {
      const req = path.node.value;
      const issuer = this.file.opts.filename;

      // we use posix because using windows style paths in require
      // makes it an escape character and not a path delimiter
      if (canUseAltMain(req, issuer))
        path.node.value = denormPosixJoin(req, nodePath.posix.basename(req));
    }
  };
  return {
    visitor: requireVisitor
  }
};
