import {
  isFile,
  isDir,
  denormPosixJoin,
  isModuleImport,
  canUseAltMain
} from 'alt-main-utils';

import nodePath from 'path';

export default function({types: t}) {
  const requireVisitor = {
    CallExpression(path, state) {
      if (t.isIdentifier(path.node.callee, { name: 'require' }))
        path.traverse(modVisitor, { file: state.file });
    }
  };
  const modVisitor = {
    StringLiteral(path) {
      const request = path.node.value;
      const issuer = this.file.opts.filename;

      // we use posix because using windows style paths in require
      // makes it an escape character and not a path delimiter
      if (canUseAltMain({request, issuer}))
        path.node.value = denormPosixJoin(request, nodePath.posix.basename(request));
    }
  };
  return {
    visitor: requireVisitor
  }
}
