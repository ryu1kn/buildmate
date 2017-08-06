
const minimatch = require('minimatch');

class GlobPathVarSetCollector {

  constructor(string) {
    this._pattern = string;
  }

  collect(filePaths) {
    const hasMatch = filePaths.some(filePath => minimatch(filePath, this._pattern));
    return hasMatch ? [[]] : [];
  }

}

module.exports = GlobPathVarSetCollector;
