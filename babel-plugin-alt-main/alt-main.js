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

function denormPosixJoin(...args) {
  let result = nodePath.join(...args);
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
      var req = path.node.value;
      var issuer = this.file.opts.filename;

      if (canUseAltMain(req, issuer)) {
        // we use posix because using windows style paths in require
        // makes it an escape character and not a path delimiter
        var result = nodePath.posix.join(req, nodePath.posix.basename(req));

        // path.join function normalizes the path
        // As a result
        // ./A is converted to A/A instead of ./A/A
        // module require vs relative require
        if (req.indexOf('.') === 0 && req.indexOf('..') !== 0)
          result = './' + result;
        console.log(req, result);

        path.node.value = result;
      }
    }
  };
  return {
    visitor: requireVisitor
  }
};
