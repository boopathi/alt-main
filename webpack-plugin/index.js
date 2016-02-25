import nodePath from 'path';
import fs from 'fs';

const isFile = path => {
  try {
    return fs.lstatSync(path).isFile();
  } catch(e) {
    return false;
  }
}
const isDir = path => {
  try {
    return fs.lstatSync(path).isDirectory();
  } catch(e) {
    return false;
  }
}
// we use posix because using windows style paths in require
// makes it an escape character and not a path delimiter
const denormPosixJoin = (...args) => {
  let result = nodePath.posix.join(...args);

  // path.join function normalizes the path
  // As a result
  // ./A is converted to A/A instead of ./A/A
  // module require vs relative require
  if (args[0].indexOf('.') === 0 && args[0].indexOf('..') !== 0)
    result = './' + result;
  return result;
}

module.exports = AltMainPlugin;
function AltMainPlugin() {}

AltMainPlugin.prototype.apply = function(compiler) {
  compiler.plugin('normal-module-factory', nmf => {
    nmf.plugin('before-resolve', (data, cb) => {

      const {context, request} = data;
      const absReq = nodePath.join(context, request);

      console.log(absReq);

      if (isFile(absReq)) return cb(null, data);

      if (isDir(absReq)) {
        const packageJson = nodePath.join(absReq, 'package.json');
        const indexJs = nodePath.join(absReq, 'index.js');

        try {
          if (typeof require(packageJson).main !== 'undefined') return cb(null, data);
        } catch(e) {
          if (e.code !== 'MODULE_NOT_FOUND') {
            cb(e);
            throw e;
          }
        }
        if (isFile(indexJs)) return cb(null, data);

        data.request = denormPosixJoin(request, nodePath.posix.basename(request));

        return cb(null, data);
      }
      cb(null, data);
    });
    // nmf.plugin('after-resolve', (data, cb) => {
    //   console.log("After", data);
    //   cb(null, data);
    // });
  });
  compiler.plugin('compilation', compilation => {
    compilation.plugin('normal-module-loader', (loaderContext, module) => {
      // console.log(module.userRequest);
    });
  });
};
