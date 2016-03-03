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
      if (canUseAltMain({request, context}))
        data.request = denormPosixJoin(request, nodePath.posix.basename(request));
      cb(null, data);
    });
  });
};
