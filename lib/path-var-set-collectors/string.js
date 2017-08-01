
class StringPathVarSetCollector {

  constructor(string) {
    this._pattern = string;
  }

  collect(filePaths) {
    return filePaths.includes(this._pattern) ? [[]] : [];
  }

}

module.exports = StringPathVarSetCollector;
