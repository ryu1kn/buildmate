
const equal = require('deep-equal');
const ValueBag = require('./value-bag');

class TaskExecutor {

  constructor({execSync}) {
    this._execSync = execSync;
  }

  execute({tasks, filePaths}) {
    tasks.forEach(task => {
      if (!task.path) return this._execSync(task.command);
      const matches = this._matchPath(task.path, filePaths);
      if (matches instanceof ValueBag && matches.size > 0) {
        [...matches.values()].forEach(matches => {
          return this._execSync(task.command, {env: this._buildEnvVars(matches)});
        });
      } else if (matches) {
        this._execSync(task.command);
      }
    });
  }

  _matchPath(pathPattern, filePaths) {
    if (pathPattern instanceof RegExp) {
      return filePaths
        .map(filePath => filePath.match(pathPattern))
        .filter(match => match && match.length > 1)
        .map(match => match.slice(1, match.length))
        .reduce(
          (bag, pathComponents) => bag.add(pathComponents),
          new ValueBag(equal)
        );
    }
    return filePaths.includes(pathPattern);
  }

  _buildEnvVars(matches) {
    return matches.reduce((result, value, i) => {
      return Object.assign({}, result, {
        [`BM_PATH_VAR_${i + 1}`]: value
      });
    }, Object.create(null));
  }

}

module.exports = TaskExecutor;
