const fs = require('fs');
const path = require('path');

const rootPath = process.cwd().includes('webapp')
  ? process.cwd().substring(0, process.cwd().indexOf('webapp'))
  : `${process.cwd()}/`;
const seralizePath = fileName => fs.readFileSync(path.resolve(__dirname, fileName), 'utf8');

const flushTmpFolder = () => {
  return fs.promises.rmdir(`${rootPath}/webapp/certs/tmp`, { recursive: true }, (err) => {
    if (err) { throw err; }
  });
}

const makeTmpFolder = async () => {
  if (fs.existsSync(`${rootPath}/webapp/certs/tmp`)){
    await flushTmpFolder();
  }
  return fs.promises.mkdir(`${rootPath}/webapp/certs/tmp`, (err) => {
    if (err) { throw err; }
  });
};

module.exports = {
  flushTmpFolder,
  makeTmpFolder,
  seralizePath,
  rootPath,
};
