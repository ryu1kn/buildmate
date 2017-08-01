
const NullPathVarSetCollector = require('./path-var-set-collectors/null');
const RegexPathVarSetCollector = require('./path-var-set-collectors/regex');
const StringPathVarSetCollector = require('./path-var-set-collectors/string');

class PathVarSetCollectorFactory {

  create(pathPattern) {
    if (!pathPattern) return new NullPathVarSetCollector();
    if (pathPattern instanceof RegExp) return new RegexPathVarSetCollector(pathPattern);
    if (typeof pathPattern === 'string') return new StringPathVarSetCollector(pathPattern);
    throw new Error(`No corresponding PathVarSetCollector for "${pathPattern}"`);
  }

}

module.exports = PathVarSetCollectorFactory;
