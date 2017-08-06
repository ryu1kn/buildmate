
const NullPathVarSetCollector = require('./path-var-set-collectors/null');
const RegexPathVarSetCollector = require('./path-var-set-collectors/regex');
const GlobPathVarSetCollector = require('./path-var-set-collectors/glob');

class PathVarSetCollectorFactory {

  create(pathPattern) {
    if (!pathPattern) return new NullPathVarSetCollector();
    if (pathPattern instanceof RegExp) return new RegexPathVarSetCollector(pathPattern);
    if (typeof pathPattern === 'string') return new GlobPathVarSetCollector(pathPattern);
    throw new Error(`No corresponding PathVarSetCollector for "${pathPattern}"`);
  }

}

module.exports = PathVarSetCollectorFactory;
