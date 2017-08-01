
const equal = require('deep-equal');
const ValueBag = require('../value-bag');

class RegexPathVarSetCollector {

  constructor(regexPattern) {
    this._pattern = regexPattern;
  }

  collect(filePaths) {
    const matches = filePaths
        .map(path => path.match(this._pattern))
        .filter(match => match);
    return matches.length > 0 ? this._uniquePathVarsSet(matches) : [];
  }

  _uniquePathVarsSet(matches) {
    const pathVarsBag = matches
        .map(match => match.slice(1))
        .reduce(
          (bag, pathVars) => bag.add(pathVars),
          new ValueBag(equal)
        );
    return [...pathVarsBag.values()];
  }

}

module.exports = RegexPathVarSetCollector;
