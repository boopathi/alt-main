import path from 'path';

export const isModuleImport = req => {
  return req.indexOf('.') !== 0;
};

export const denormPosixJoin = (...args) => {
  // we use posix because using windows style paths in require
  // makes it an escape character and not a path delimiter
  let result = path.posix.join(...args);

  // path.join function normalizes the path
  // As a result
  // ./A is converted to A/A instead of ./A/A
  // module require vs relative require
  if (args[0].indexOf('.') === 0 && args[0].indexOf('..') !== 0)
    result = './' + result;
  return result;
};
