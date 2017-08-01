
const PathVarSetCollectorFactory = require('./path-var-set-collector-factory');
const pathVarSetCollectorFactory = new PathVarSetCollectorFactory();

class TaskListExecutor {

  constructor(params) {
    this._execSync = params.execSync;
    this._envVars = params.envVars;
    this._logger = params.logger;
  }

  execute({tasks, filePaths}) {
    tasks
      .map(task => {
        const collector = pathVarSetCollectorFactory.create(task.path);
        const pathVarSet = collector.collect(filePaths);
        return pathVarSet.map(pathVars => ({
          command: task.command,
          envVars: this._buildEnvVars(pathVars)
        }));
      })
      .reduce((result, executionPlans) => [...result, ...executionPlans], [])
      .forEach(executionPlan => {
        this._execute(executionPlan.command, executionPlan.envVars);
      });
  }

  _execute(command, additionalEnvVars) {
    this._logger.log(command);
    this._execSync(command, {
      env: Object.assign({}, this._envVars, additionalEnvVars)
    });
  }

  _buildEnvVars(pathVars) {
    return pathVars.reduce((result, value, i) => {
      return Object.assign({}, result, {
        [`BM_PATH_VAR_${i + 1}`]: value
      });
    }, Object.create(null));
  }

}

module.exports = TaskListExecutor;
