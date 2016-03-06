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
  compiler.resolvers.normal.plugin('directory', (request, cb) => {
    const {path} = request;
    if (request.request === '') {
      if (canUseAltMain({path})) {
        let newPath = denormPosixJoin(path, nodePath.posix.basename(path));
        if (compiler.options.resolve && Array.isArray(compiler.options.resolve.extensions)) {
          let {extensions} = compiler.options.resolve;
          for (let i of extensions)
            if (isFile(newPath + i)) newPath += i;
        }
        request.path = newPath;
        return cb(null, request);
      }
    }
    // it is important that for things that you don't handle,
    // require cb() to be called instead of
    // cb(null, request) -> because if you send the request to cb,
    // it is taken that the resolution has be done by you
    // but actually here you just pass it on.
    cb();
  });
  compiler.plugin('normal-module-factory', nmf => {
    nmf.plugin('before-resolve', (data, cb) => {
      const {context, request} = data;
      if (canUseAltMain({request, context}))
        data.request = denormPosixJoin(request, nodePath.posix.basename(request));
      cb(null, data);
    });
  });
};
