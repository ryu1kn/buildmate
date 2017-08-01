
const PATH_VAR_ENV_PREFIX = 'BM_PATH_VAR_';
const DESCRIPTION_LEADER = '===> ';

class TaskExecutor {

  constructor(params) {
    this._execSync = params.execSync;
    this._envVars = params.envVars;
    this._logger = params.logger;
  }

  execute({task, pathVarSet}) {
    const executionPlans = pathVarSet.map(pathVars => ({
      command: task.command,
      envVars: this._buildEnvVars(pathVars)
    }));
    this._logger.log(DESCRIPTION_LEADER + task.description);
    executionPlans.forEach(executionPlan => {
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
      const pathVarEnvName = PATH_VAR_ENV_PREFIX + (i + 1);
      return Object.assign({}, result, {[pathVarEnvName]: value});
    }, Object.create(null));
  }

}

module.exports = TaskExecutor;
