import nodePath from 'path';
import {
  isFile,
  isDir,
  denormPosixJoin,
  isModuleImport,
  canUseAltMain
} from 'alt-main-utils';

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
