
const equal = require('deep-equal');
const ValueBag = require('./value-bag');

class TaskListExecutor {

  constructor(params) {
    this._execSync = params.execSync;
    this._envVars = params.envVars;
    this._logger = params.logger;
  }

  execute({tasks, filePaths}) {
    tasks.map(task => {
      if (!task.path) return [{command: task.command}];
      const matches = this._matchPath(task.path, filePaths);
      if (matches instanceof ValueBag && matches.size > 0) {
        return [...matches.values()].map(matches => {
          return {
            command: task.command,
            envVars: this._buildEnvVars(matches)
          };
        });
      } else if (matches) {
        return [{command: task.command}];
      }
      return null;
    }).filter(executionPlan => executionPlan).reduce((result, executionPlans) => {
      return [...result, ...executionPlans];
    }, []).forEach(executionPlan => {
      this._execute(executionPlan.command, executionPlan.envVars);
    });
  }

  _execute(command, additionalEnvVars) {
    this._logger.log(command);
    this._execSync(command, {
      env: Object.assign({}, this._envVars, additionalEnvVars)
    });
  }

  _matchPath(pathPattern, filePaths) {
    if (pathPattern instanceof RegExp) {
      const matches = filePaths
        .map(filePath => filePath.match(pathPattern))
        .filter(match => match);
      if (matches.length < 1) return false;
      return matches
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

module.exports = TaskListExecutor;
