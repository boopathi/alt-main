import nodePath from 'path';

export default function({t: types}) {
  const requireVisitor = {
    CallExpression(path, plugin) {
      if (t.isIdentifier(path.node.callee, { name: 'require' }))
        path.traverse(modVisitor, { file: plugin.file });
    }
  };
  const modVisitor = {
    StringLiteral(path) {
      var req = path.node.arguments[0].value;
      var issuer = this.file.opts.filename;

      // we use posix because using windows style paths in requires
      // makes it a escape character and not a path delimiter
      var result = nodePath.posix.join(req, nodePath.posix.basename(req));

      // path.join function normalizes the path
      // As a result
      // ./A is converted to A/A instead of ./A/A
      // module require vs relative require
      if (req.indexOf('.') === 0 && req.indexOf('..') !== 0)
        result = './' + result;
      console.log(req, result);

      path.node.arguments[0].value = result;
    }
  };
  return {
    visitor: requireVisitor
  }
};
