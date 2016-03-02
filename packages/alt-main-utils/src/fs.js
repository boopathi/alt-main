import fs from 'fs';

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
